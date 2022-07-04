import { Prenotazione } from "../prenotazione";
import { proxyinterfacePR } from "../ProxyInterface/proxyinterfacePren";
import { Sequelize, Model, DataTypes, Op } from 'sequelize';
import { Vaccini } from "../vaccino";
import { Users } from "../users";
import { Centro_vaccinale } from "../centro_vaccinale";
import { DBConnection } from "../../config/sequelize"
import { DateTime } from "luxon";
import { UUID } from "sequelize";
import { stringSanitizer } from "../../util/stringsanitizer";

export class proxyPr implements proxyinterfacePR {

    private model: Prenotazione;
    private modelV: Vaccini;
    private modelU: Users;
    private modelCV: Centro_vaccinale;

    constructor() {
        this.model = new Prenotazione(DBConnection.getInstance().getConnection());
        this.modelV = new Vaccini(DBConnection.getInstance().getConnection());
        this.modelU = new Users(DBConnection.getInstance().getConnection());
        this.modelCV = new Centro_vaccinale(DBConnection.getInstance().getConnection());
    }

    public async insertNewPr(data: string, slot: number, centro_vaccino: number, vaccino: number, user: number): Promise<Object> {
        let sanitizeddata = stringSanitizer(data);
        //controllo il tipo di dato sia valido
        this.TypeCheckData(sanitizeddata);
        this.TypeCheckSlot(slot);
        await this.TypeCheckCV(centro_vaccino);
        await this.TypeCheckVaccino(vaccino);
        await this.TypeCheckUser(user);
        //this.TypeCheckStato(stato);

        //fascia 1 da 1-16, fascia 2 da 17-27;
        var fascia: number;
        if (slot > 16 && fascia == 1) {
            fascia = 2;
        } else {
            fascia = 1;
        }

        console.log("checking validity")
        await this.checkAvailability(sanitizeddata, centro_vaccino, fascia).then(() => { console.log("validity checking success..") });
        console.log("checking slot")
        await this.checkSlot(sanitizeddata, centro_vaccino, slot).then(() => { console.log("slot checking success..") });

        console.log("checking vax validity")
        await this.checkVaxValidity(sanitizeddata, vaccino, user).then(() => { console.log("vax validity checking success..") });

        return await this.model.insertNewPr(sanitizeddata, fascia, slot, centro_vaccino, vaccino, user);
    }

    public async getListaPr(userid?: number, centro?: number, data?: string) {

        if (typeof userid === "undefined" && typeof centro === "undefined") {
            throw Error("non hai inserito nessun paramentro");
        }

        if (typeof userid === "undefined") {
            this.TypeCheckData(data);
            return await this.model.getPreCentro(centro, data);
        }

        this.TypeCheckUser(userid);
        return await this.model.getPreUser(userid);
    }

    public async cancellaPre(id: number, user: number) {
        await this.checkPreID(id, user);
        console.log("cheking success");
        return await this.model.delete(id);
    }

    public async modifica(updateBody: { id: number, user: number, data?: string, slot?: number, centro_vaccino?: number, vaccino?: number }) {


        await this.TypeCheckUser(updateBody.user);
        await this.checkPreID(updateBody.id, updateBody.user);

        let oldPr = this.model.getModel().findOne({ where: { id: updateBody.id } });

        var safeBody: any = {};
        if (typeof updateBody.data !== "undefined") {
            let sanitizedData = stringSanitizer(updateBody.data);
            this.TypeCheckData(sanitizedData);
            safeBody.data = sanitizedData;
        }

        if (typeof updateBody.slot !== "undefined") {
            this.TypeCheckSlot(updateBody.slot);
            safeBody.slot = updateBody.slot;
        }

        if (typeof updateBody.centro_vaccino !== "undefined") {
            this.TypeCheckCV(updateBody.centro_vaccino);
            safeBody.centro_vaccino = updateBody.centro_vaccino;
        }

        if (typeof updateBody.vaccino !== "undefined")
            this.TypeCheckVaccino(updateBody.vaccino);
        safeBody.vaccino = updateBody.vaccino;

        let data = safeBody.data ? safeBody.data : oldPr.data;
        let centro = safeBody.centro ? safeBody.centro : oldPr.centro_vac;
        let fascia = safeBody.fascia ? safeBody.fascia : oldPr.fascia;

        //devo controllare la disponibilita' solo se cambio la fascia o data.
        if (oldPr.data != safeBody.data || oldPr.fascia != safeBody.fascia) {
            //this.checkAvailability(safeBody.data ? safeBody.data : oldPr.data, safeBody.centro ? safeBody.centro : oldPr.centro_vac, safeBody.fascia ? safeBody.fascia : oldPr.fascia);
            await this.checkAvailability(data, centro, fascia);
        }

        await this.checkSlot(data,centro,safeBody.slot?safeBody.slot:oldPr.slot);

        return await this.model.modifica(updateBody.id,safeBody);
    }

    private async checkPreID(id: number, user: number) {
        if (typeof id !== 'number' || isNaN(id)) throw new Error('Id non è valido');

        //un utente non puo' cancellare le prenotazione degli altri.
        let result = this.model.getModel().count({
            where: {
                id: id,
                user: user
            }
        });

        if (result < 1) throw Error("informazione non e' valido");

    }

    private async checkVaxValidity(data: string, vaccino: number, user: number) {

        let DataPre = DateTime.fromISO(data);
        let LastVax = await this.model.getModel().findAll({
            where: {
                user: user,
                vaccino: vaccino,
                stato: [0, 1],

            },
            order: [['data', 'DESC']]
        });
        //mai vaccinato
        if (JSON.parse(JSON.stringify(LastVax)).length == 0) {
            console.log("questo user non ha mai vaccinato.")
            return;
        }
        let LastVaxTime = DateTime.fromISO(LastVax[0].data);
        let Vaccino = await this.modelV.getModel().findOne({ where: { id: vaccino }, query: { raw: true } });

        //il vaccino e' ancora effettivo.
        if (DataPre < LastVaxTime.plus({ day: Vaccino.validita })) throw Error("il vaccino ancora e' effettivo");

    }

    private async checkSlot(data: string, centro: number, slot: number) {
        let count = await this.model.getModel().count({
            where: {
                data: data,
                centro_vac: centro,
                slot: slot
            }
        });
        if (count > 0) { throw Error("slot e' gia occupato.") };

    }

    private async checkAvailability(dataAppuntamento: string, centro: number, fasciaOraria: number) {

        let res = await this.getPRCentroFascia(dataAppuntamento, centro, fasciaOraria);
        //se e' undefined implica che la data e la fascia selezionata non e' prenotata da nessuno
        if (typeof res.count != "undefined") {
            if (res.count >= res.centro["maxf" + fasciaOraria]) {
                throw Error("la fascia oraria e' piena");
            }
        } else {
            if (res.centro["maxf" + fasciaOraria] < 1) {
                throw Error("la fascia oraria e' piena");
            }
        }

    }

    private async getPRCentroFascia(dataAppuntamento: string, centro: number, fasciaOraria: number) {
        let list = await this.takeNumberOfPrenotation(true)
        let centro_vac = this.modelCV.getModel().findOne({
            where: {
                id: centro
            },
            query: { raw: true }
        });

        let res = list.find(({ data, centro_vac, fascia }) => {
            data === dataAppuntamento && centro_vac === centro && fascia === fasciaOraria
        });

        if (typeof res === 'undefined')
            return { count: undefined, centro: centro_vac };
        else
            return { count: res.length, centro: centro_vac };
    }

    private TypeCheckData(data: string): Boolean {
        let sanitizeddata = stringSanitizer(data);
        let dataIns = DateTime.fromISO(sanitizeddata);
        let dataNow = DateTime.now();
        if ((typeof sanitizeddata !== 'string' || !dataIns.isValid)) throw new Error('Questa data non è valida');
        if ((dataIns < dataNow)) throw new Error("Puoi prenotare solo in un dato futuro.");
        return true;
    }

    private TypeCheckSlot(slot: number): Boolean {
        if (typeof slot !== 'number' || isNaN(slot)) throw new Error('Questa slot non è valido');
        if (slot > 37 || slot < 1) throw new Error('Questa fascia non è valida');
        return true;
    }

    private async TypeCheckCV(Cv: number): Promise<Boolean> {
        if (typeof Cv !== 'number' || isNaN(Cv)) throw new Error('Questo centro vaccino non è valido');
        let test = await this.modelCV.getModel().findAll({
            where: {
                id: Cv
            }
        });
        if (Object.keys(test).length == 0) throw new Error('Questo centro vaccino non esiste');
        return true;
    }

    private async TypeCheckVaccino(vaccino: number): Promise<Boolean> {
        if (typeof vaccino !== 'number' || isNaN(vaccino)) throw new Error('Questo vaccino non è valido');
        let test = await this.modelV.getModel().findAll({
            where: {
                id: vaccino
            }
        });
        if (Object.keys(test).length == 0) throw new Error('Questo vaccino non esiste');
        return true;
    }

    private async TypeCheckUser(user: number): Promise<Boolean> {
        console.log(user);
        if (typeof user !== 'number' || isNaN(user)) throw new Error('Questo utente non è valido');
        let test = await this.modelU.getModel().findAll({
            where: {
                id: user
            }
        });
        console.log(test);
        if (Object.keys(test).length == 0) throw new Error('Questo utente non esiste');
        return true;
    }

    private TypeCheckStato(stato: number): Boolean {
        if (typeof stato !== 'number' || isNaN(stato)) throw new Error('Questo stato non è valido');
        return true;
    }


    async takeNumberOfPrenotation(fascia: Boolean): Promise<Array<any>> {
        if (fascia) {
            let result = await this.model.getModel().findAndCountAll({
                attributes: ['centro_vac', 'data', 'fascia'],
                group: ['centro_vac', 'data', 'fascia']
            })
            return result.count
        }
        else {
            let result = await this.model.getModel().findAndCountAll({
                attributes: ['centro_vac', 'data'],
                group: ['centro_vac', 'data']
            })
            return result.count
        }
    }

    async takeSumF1F2() {
        let complete = [];
        let result = await this.modelCV.getModel().findAll({
            attributes: ['id', 'maxf1', 'maxf2']
        })
        result.map(val => {
            val.dataValues.somma = val.dataValues.maxf1 + val.dataValues.maxf1
            complete.push(val.dataValues)
        });
        return complete;
    }

    async getSlotFull(id:number,data: Array<string>, fascia?: number): Promise<any> {
        if(typeof fascia === 'undefined')
        {
        let query = await this.model.getModel().findAll({
            attributes: ['data','slot'],
            where: {
                    centro_vac: id,
                    data: data
                }
            });
            return query;
        }
        else {
            let query = await this.model.getModel().findAll({
                attributes: ['data','slot'],
                where: {
                    centro_vac: id,
                    data: data,
                    fascia: fascia
                }
            });
            return query;
        }
    }
}