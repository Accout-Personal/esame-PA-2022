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
// Nel costruttore andiamo a inizializzare tutti i model necessari per lavorare con le prenotazioni
    constructor() {
        this.model = new Prenotazione(DBConnection.getInstance().getConnection());
        this.modelV = new Vaccini(DBConnection.getInstance().getConnection());
        this.modelU = new Users(DBConnection.getInstance().getConnection());
        this.modelCV = new Centro_vaccinale(DBConnection.getInstance().getConnection());
    }
//Metodo per inserire una nuova prenotazione
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

    public async getPrInfo(uuid:string){
        let sanitized = stringSanitizer(uuid);
        this.makeRelationship();
        console.log(sanitized);
        if(typeof sanitized === 'undefined') throw Error("codice sconosciuto");
        let result = await this.model.getInfo(sanitized);
        if (result === null) throw Error("codice sconosciuto");
        return result
    }


    public async getListaPr(userid?: number, centro?: number, data?: string) {

        if (typeof (data) !== 'string' || !(DateTime.fromISO(data).isValid) || DateTime.now > DateTime.fromISO(data))
            throw new Error('La data che hai inserito non è corretta');
        if (typeof centro !== 'number' || isNaN(centro) || !isFinite(centro))
            throw new Error('il centro vaccinale che hai inserito non è corretto');

        if (typeof userid === "undefined" && typeof centro === "undefined")
            throw Error("non hai inserito nessun paramentro");

        if (typeof userid === "undefined") {
            this.TypeCheckData(data);
            this.makeRelationship();
            return await this.model.getPreCentro(centro, data);
        }

        this.TypeCheckUser(userid);
        console.log("get user list");
        return await this.model.getPreUser(userid);
    }

    //costruisce relazioni utilizzati tra le tabelle utilizzati
    public makeRelationship() {

        this.modelU.getModel().hasMany(this.model.getModel(), { foreignKey: 'userid' });
        this.model.getModel().belongsTo(this.modelU.getModel(),{ foreignKey: 'userid' });

        this.modelV.getModel().hasMany(this.model.getModel(), { foreignKey: 'vaccinoid' });
        this.model.getModel().belongsTo(this.modelV.getModel(),{ foreignKey: 'vaccinoid' });

        this.modelCV.getModel().hasMany(this.model.getModel(), { foreignKey: 'centro_vac_id' });
        this.model.getModel().belongsTo(this.modelCV.getModel(), { foreignKey: 'centro_vac_id' });
    }

    public async cancellaPre(id: number, user: number) {
        await this.checkPreID(id, user);
        console.log("cheking success");
        return await this.model.delete(id);
    }
// Metodo per effettuare una modifica ad una prenotazione
    public async modifica(updateBody: { id: number, user: number, data?: string, slot?: number, centro_vac?: number, vaccino?: number }) {


        await this.TypeCheckUser(updateBody.user);
        await this.checkPreID(updateBody.id, updateBody.user);
    // Qui vengono effettuate tutta una serie di operazioni di sanificazione degli input inseriti dall'utente
        let oldPr = await this.model.getModel().findOne({ where: { id: updateBody.id } });
        if (typeof oldPr === "undefined" || oldPr === null) {
            throw Error("Questo appunto e' inesistente");
        }
        var safeBody: any = {};
        if (typeof updateBody.data !== "undefined") {
            let sanitizedData = stringSanitizer(updateBody.data);
            this.TypeCheckData(sanitizedData);
            safeBody.data = sanitizedData;
        }

        if (typeof updateBody.slot !== "undefined") {
            this.TypeCheckSlot(updateBody.slot);
            safeBody.slot = updateBody.slot;
            safeBody.fascia = safeBody.slot > 16 ? 2 : 1;
        }

        if (typeof updateBody.centro_vac !== "undefined") {
            this.TypeCheckCV(updateBody.centro_vac);
            safeBody.centro_vac_id = updateBody.centro_vac;
        }

        if (typeof updateBody.vaccino !== "undefined")
            await this.TypeCheckVaccino(updateBody.vaccino);
        safeBody.vaccinoid = updateBody.vaccino;

        let data = safeBody.data ? safeBody.data : oldPr.data;
        let centro = safeBody.centro_vac ? safeBody.centro_vac : oldPr.centro_vac;
        let fascia = safeBody.fascia ? safeBody.fascia : oldPr.fascia;
        
        //devo controllare la disponibilita' solo se cambio la fascia o data.
        if (oldPr.data != safeBody.data || oldPr.fascia != safeBody.fascia)
            await this.checkAvailability(data, centro, fascia);
        await this.checkSlot(data, centro, safeBody.slot ? safeBody.slot : oldPr.slot);
        await this.checkVaxValidity(data, safeBody.vaccino, updateBody.user, updateBody.id);
        return await this.model.modifica(updateBody.id, safeBody);
    }

    private async checkPreID(id: number, user: number) {
        if (typeof id !== 'number' || isNaN(id)) throw new Error('Id non è valido');

        //un utente non puo' cancellare o modificare le prenotazione degli altri.
        let result = this.model.getModel().count({
            where: {
                id: id,
                userid: user
            }
        });

        if (result < 1) throw Error("informazione non e' valido");

    }
// Questo metodo serve per controllare se l'utente si sta prenotando per un vaccino che non gli è mai stato sommistrato.
// Oppure, se si sta prenotando ad un vaccino già ricevuto, pero', dopo il relativo periodo di validità.
    private async checkVaxValidity(data: string, vaccino: number, user: number, excludeid?: number) {

        let DataPre = DateTime.fromISO(data);
        let queryBody = {
            userid: user,
            vaccinoid: vaccino,
            stato: [0, 1]
        };
        var LastVax = await this.model.getModel().findAll({
            where: queryBody,
            order: [['data', 'DESC']]
        });
    // Devo escludere la prenotazione attuale, durante la modifica, per escludere il controllo sul periodo di validità del vaccino
        if (typeof excludeid !== 'undefined') {
            LastVax = LastVax.filter((element) => {
                return element.id != excludeid;
            })
        }

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
// Metodo per controllare se lo slot è occupato
    private async checkSlot(data: string, centro: number, slot: number) {
        let count = await this.model.getModel().count({
            where: {
                data: data,
                centro_vac_id: centro,
                slot: slot
            }
        });
        if (count > 0) { throw Error("slot e' gia occupato.") };

    }
// Metodo per controllare se una fascia ha ancora slot liberi
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
//Metodo che ritorna il numero di prenotazioni di un dato centro vaccinale in una certa data
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
// Metodo per effettuare controlli sulla data
    private TypeCheckData(data: string): Boolean {
        let sanitizeddata = stringSanitizer(data);
        let dataIns = DateTime.fromISO(sanitizeddata);
        let dataNow = DateTime.now();
        if ((typeof sanitizeddata !== 'string' || !dataIns.isValid)) throw new Error('Questa data non è valida');
        if ((dataIns < dataNow)) throw new Error("Puoi prenotare solo in un dato futuro.");
        return true;
    }
// Metodo usato per effettuare dei controlli sullo slot inserito dall'utente
    private TypeCheckSlot(slot: number): Boolean {
        if (typeof slot !== 'number' || isNaN(slot)) throw new Error('Questa slot non è valido');
        if (slot > 36 || slot < 1) throw new Error('Questa fascia non è valida');
        return true;
    }
// Metodo usato per effettuare dei controlli sul centro vaccinale inserito dall'utente
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
// Metodo usato per effettuare dei controlli sul vaccino inserito dall'utente
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
// Metodo usato per effettuare dei controlli sull'utente
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
// Metodo che restituisce, per ogni centro vaccinale, per ogni fascia, e, per ogni data, il numero di prenotazioni, più gli altri attributi
    async takeNumberOfPrenotation(fascia: Boolean): Promise<Array<any>> {
        if (fascia) {
            let result = await this.model.getModel().findAndCountAll({
                attributes: ['centro_vac_id', 'data', 'fascia'],
                group: ['centro_vac_id', 'data', 'fascia']
            })
            return result.count
        }
        else {
            let result = await this.model.getModel().findAndCountAll({
                attributes: ['centro_vac_id', 'data'],
                group: ['centro_vac_id', 'data']
            })
            return result.count
        }
    }
/* Verificare se utilizzato
    async takeSumF1F2() {
        let result = await this.modelCV.getModel().findAll({
            attributes: ['id', 'maxf1', 'maxf2']
        })
        result = result.map(val => {
            val.dataValues.somma = val.dataValues.maxf1 + val.dataValues.maxf1
            return val.dataValues;
        });
        return result;
    }
*/
// Metodo che ritorna tutte le prenotazioni effettuate per una certa data, in un certo centro vaccinale e per una certa fascia
    async getSlotFull(id: number, data: Array<string>, fascia?: number): Promise<any> {
        if (typeof fascia === 'undefined') {
            let query = await this.model.getModel().findAll({
                attributes: ['data', 'slot'],
                where: {
                    centro_vac_id: id,
                    data: data
                }
            });
            return query;
        }
        else {
            let query = await this.model.getModel().findAll({
                attributes: ['data', 'slot'],
                where: {
                    centro_vac_id: id,
                    data: data,
                    fascia: fascia
                }
            });
            return query;
        }
    }

    // Metodo per ottenere le statistiche sui centri vaccinali e sulle prenotazioni che hanno avuto esito positivo
    async getStatisticPositive(order: Boolean = true): Promise<Array<Object>> {
        let positiveResult = await this.model.getModel().findAndCountAll({
            attributes: ['centro_vac_id', 'stato'],
            where: { stato: 1 },
            group: ['centro_vac_id', 'stato']
        });
        let allResult = await this.model.getModel().findAndCountAll({
            attributes: ['centro_vac_id'],
            group: ['centro_vac_id']
        });
        let statistic = positiveResult.count.map((value) => {
                allResult.count.map((val) => {
                    if(value.centro_vac_id == val.centro_vac_id){
                        value.media = (value.count/val.count).toFixed(2);
                    }
                });
                return value;
            });
        // Qui andiamo ad effettuare l'ordinamento del risultato finale
        if (order) statistic.sort((a, b) => {
            return a.media - b.media;
        });
        else statistic.sort((a, b) => {
            return b.media - a.media;
        });
        return statistic;
    }

    // Metodo per impostare le prenotazioni come 'non andate a buon fine'
    async setBadPrenotations(data: string): Promise<void> {
        let list = await this.getBadPrenotation(data);
        list = list.map((value) => {
            return value.dataValues.id
        })
        await this.model.getModel().update({ stato: 2 }, {
            where: {
                id: list
            }
        })
    }

    // Questo metodo ritorna il numero di prenotazioni che non sono andate a buon fine

    async getCountBadPrenotation(data: string, id: number): Promise<number> {
        if (isNaN(id) || !isFinite(id) || typeof (id) !== 'number') throw new Error('il centro vaccinale che hai inserito non è corretto')
        if (typeof (data) !== 'string' || !(DateTime.fromISO(data).isValid) || DateTime.now > DateTime.fromISO(data)) throw new Error('La data che hai inserito non è corretta')
        let result = await this.getBadPrenotation(data, false, id);
        return result['count'][0].count
    }
// Metodo che restituisce tutte le prenotazioni che non sono andate a buon fine, prende in input una data, un booleano, che modifica la query.
// Infine, viene passato un centro vaccinale.
    async getBadPrenotation(data:string,option:Boolean = true, id?:number): Promise<Array<any>>{
        let list;
        if (option) {
            list = await this.model.getModel().findAll({
                attributes: ['id', 'data'],
                where: {
                    data: data,
                    stato: 0
                }
            });
        }
        else {
                await this.TypeCheckCV(id);
                list = await this.model.getModel().findAndCountAll({
                attributes:['centro_vac_id','data'],
                where: {
                    centro_vac_id: id,
                    data: data,
                    stato: 2
                },
                group: ['centro_vac_id', 'data']
            });
        }
        return list;
    }
}