import { Prenotazione } from "../prenotazione";
import { proxyinterfacePR } from "../ProxyInterface/proxyinterfacePren";
import { Sequelize, Model, DataTypes, Op } from 'sequelize';
import { Vaccini } from "../vaccino";
import { Users } from "../users";
import { Centro_vaccinale } from "../centro_vaccinale";
import { DBConnection } from "../../config/sequelize"
import { DateTime } from "luxon";
import { UUID } from "sequelize";

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

    async insertNewPr(data: string, slot: number, centro_vaccino: number, vaccino: number, user: number): Promise<Object> {
        //controllo il tipo di dato sia valido
        this.TypeCheckData(data);
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
        await this.checkAvailability(data, centro_vaccino, fascia).then(() => { console.log("validity checking success..") });
        console.log("checking slot")
        await this.checkSlot(data, centro_vaccino, slot).then(() => { console.log("slot checking success..") });

        console.log("checking vax validity")
        await this.checkVaxValidity(data, vaccino, user).then(() => { console.log("vax validity checking success..") });

        return await this.model.insertNewPr(data, fascia, slot, centro_vaccino, vaccino, user);
    }

    async getListaPr(userid?: number, centro?: number, data?: string) {

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
        console.log("count result: " + count);
        if (count > 0) { throw Error("slot e' gia occupato.") };

    }

    private async checkAvailability(dataAppuntamento: string, centro: number, fasciaOraria: number) {
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

        //se e' undefined implica che la data e la fascia selezionata non e' prenotata da nessuno
        if (typeof res != "undefined") {
            if (res.count >= centro_vac["maxf" + fasciaOraria]) {
                throw Error("la fascia oraria e' piena");
            }
        } else {
            if (centro_vac["maxf" + fasciaOraria] < 1) {
                throw Error("la fascia oraria e' piena");
            }
        }

    }

    private TypeCheckData(data: string): Boolean {
        let dataIns = DateTime.fromISO(data);
        let dataNow = DateTime.now();
        if ((typeof data !== 'string' || !dataIns.isValid)) throw new Error('Questa data non è valida');
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

    async getSlotFull(id:number,data: Array<string>, fascia?: number): Promise<void> {
        if(typeof fascia === 'undefined')
        {
        let query = await this.model.getModel().findAll({
            where: {
                    centro_vac: id,
                    data: data 
              }
        });
        return query;
        }
        else {
            let query = await this.model.getModel().findAll({
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