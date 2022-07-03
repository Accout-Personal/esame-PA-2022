import { Prenotazione } from "../prenotazione";
import { proxyinterfacePR } from "../ProxyInterface/proxyinterfacePren";
import { Sequelize, Model, DataTypes } from 'sequelize';
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

    async insertNewPr(data: string, slot: number, centro_vaccino: number, vaccino: number, user: number, stato: number): Promise<Object> {
        //controllo il tipo di dato sia valido
        this.TypeCheckData(data);
        this.TypeCheckSlot(slot);
        await this.TypeCheckCV(centro_vaccino);
        await this.TypeCheckVaccino(vaccino);
        await this.TypeCheckUser(user);
        this.TypeCheckStato(stato);

        //fascia 1 da 1-16, fascia 2 da 17-27;
        var fascia: number;
        if (slot > 16 && fascia == 1) {
            fascia = 2;
        } else {
            fascia = 1;
        }

        await this.checkAvailability(data, centro_vaccino, fascia);
        await this.checkSlot(data, centro_vaccino, slot);

        await this.checkVaxValidity(data, vaccino, user);

        return await this.model.insertNewPr(data, fascia, slot, centro_vaccino, vaccino, user, stato);
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
        let DataVaxExpire;
        let LastVax = await this.model.getModel().findAll({
            where: {
                user: user,
                vaccino: vaccino,
                status: 1
            },
            order: [['data', 'DESC']],
            query: { raw: true }
        });
        //mai vaccinato
        if (LastVax.count == 0) {
            return;
        }
        let LastVaxTime = DateTime.fromISO(LastVax.data);
        let Vaccino = await this.modelV.getModel().findOne({ where: { id: vaccino }, query: { raw: true } });
        //vaccino e' ancora effettivo.
        if (LastVaxTime.plus({ day: Vaccino.validita }).isBefore(DataPre)) throw Error("il vaccino ancora e' effettivo");

    }

    private async checkSlot(data: string, centro: number, slot: number) {
        let result = await this.model.getModel().count({
            where: {
                data: data,
                centro_vac: centro,
                slot: slot
            }
        });
        if (result > 0) { throw Error("slot e' gia occupato.") };

    }

    private async checkAvailability(dataAppuntamento: string, centro: number, fasciaOraria: number) {
        let list = await this.takeNumberOfPrenotation()
        let centro_vac = this.modelCV.getModel().findOne({
            where: {
                id: centro
            },
            query: { raw: true }
        });

        let res = list.find(({ data, centro_vac, fascia }) => {
            data === dataAppuntamento && centro_vac === centro && fascia === fasciaOraria
        });

        if (res.count >= centro_vac["maxf" + fasciaOraria]) {
            throw Error("la fascia oraria e' piena");
        }
    }

    private TypeCheckData(data: string): Boolean {
        let dataIns = DateTime.fromISO(data)
        let dataNow = DateTime.now();
        if ((typeof data !== 'string' || !dataIns.isValid)) throw new Error('Questa data non è valida');
        if ((dataIns.isBefore(dataNow))) throw new Error("Puoi prenotare solo in un dato futuro.");
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
        if (typeof user !== 'number' || isNaN(user)) throw new Error('Questo utente non è valido');
        let test = await this.modelU.getModel().findAll({
            where: {
                id: user
            }
        });
        if (Object.keys(test).length == 0) throw new Error('Questo utente non esiste');
        return true;
    }

    private TypeCheckStato(stato: number): Boolean {
        if (typeof stato !== 'number' || isNaN(stato)) throw new Error('Questo stato non è valido');
        return true;
    }

    async takeNumberOfPrenotation(): Promise<Array<any>> {
        let result = await this.model.getModel().findAndCountAll({
            attributes: ['centro_vac', 'data', 'fascia'],
            group: ['centro_vac', 'data', 'fascia']
        });

        return result.count
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
}