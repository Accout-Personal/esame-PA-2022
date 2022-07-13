import { Prenotazione } from "../prenotazione";
import { Vaccini } from "../vaccino";
import { Users } from "../users";
import { Centro_vaccinale } from "../centro_vaccinale";
import { DBConnection } from "../../config/sequelize"
import { DateTime } from "luxon";
import { stringSanitizer } from "../../util/stringsanitizer";
import * as qrCode from 'qrcode-reader';
import * as Jimp from 'jimp';
import { proxyInterfacePr } from "../ProxyInterface/proxyInterfacePr";

// Classe che implementa il proxy per la componente prenotazione nel model
export class proxyPr implements proxyInterfacePr {

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
    public async insertNewElement(Input: {data: string, slot: number, centro_vaccino: number, vaccino: number, user: number}): Promise<Object> {

        Input.data = stringSanitizer(Input.data);
        //controllo il tipo di dato sia valido
        this.TypeCheckData(Input.data);
        this.TypeCheckSlot(Input.slot);
        await this.TypeCheckCV(Input.centro_vaccino);
        await this.TypeCheckVaccino(Input.vaccino);
        await this.TypeCheckUser(Input.user);

        //fascia 1 da 1-16, fascia 2 da 17-27;
        var fascia: number;
        if (Input.slot > 16 && fascia == 1) {
            fascia = 2;
        } else {
            fascia = 1;
        }

        await this.checkAvailability(Input.data, Input.centro_vaccino, fascia);
        await this.checkSlot(Input.data, Input.centro_vaccino, Input.slot)
        await this.checkVaxValidity(Input.data, Input.vaccino, Input.user);
        return await this.model.insertNewElement({data: Input.data, fascia: fascia, slot: Input.slot, centro_vaccino: Input.centro_vaccino, vaccino: Input.vaccino, user: Input.user});
    }
    
    // Metodo usato per recuperare informazioni relative ad una prenotazione, utilizzando il codice uuid
    public async getPrInfo(req) {
        let uuid = await this.decodeUUID(req)
        this.makeRelationship();
        let result = await this.checkUUID(uuid);
        if (result === null) throw Error("codice sconosciuto");
        return result
    }
    // Metodo usato per confermare il codice uuid e lo stato della prenotazione
    public async confermatUUID(req) {

        let uuid = await this.decodeUUID(req);
        this.makeRelationship();
        let res = await this.checkUUID(uuid);
        if (res === null)
            throw Error("codice uuid non valido");
        if (res.stato == 1)
            throw Error("questo appuntamento e' gia confermato");

        let result = await this.model.confirmUUID(uuid);
    }
    // Metodo utilizzato per ottenere una lista di prenotazioni, passando come parametri, uno user id, un centro vaccinale, e una data.
    // I parametri sono opzionali, il risultato del metodo cambia a seconda dei parametri passati
    public async getListaPr(userid?: number, centro?: number, data?: string) {
        let datasanitized = stringSanitizer(data);
        if (typeof centro !== 'undefined' || typeof datasanitized !== 'undefined') {
            if (typeof (datasanitized) !== 'string' || !(DateTime.fromISO(datasanitized).isValid) || DateTime.now() > DateTime.fromISO(datasanitized))
                throw new Error('La data che hai inserito non è corretta');
            await this.TypeCheckCV(centro);
        }

        if (typeof userid === "undefined" && typeof centro === "undefined")
            throw Error("non hai inserito nessun paramentro");

        if (typeof userid === "undefined") {
            this.TypeCheckDataListaPrenotazione(datasanitized);
            this.makeRelationship();
            return await this.model.getPreCentro(centro, datasanitized);
        }

        this.TypeCheckUser(userid);
        return await this.model.getPreUser(userid);
    }

    //costruisce relazioni utilizzati tra le tabelle utilizzati
    public makeRelationship() {

        this.modelU.getModel().hasMany(this.model.getModel(), { foreignKey: 'userid' });
        this.model.getModel().belongsTo(this.modelU.getModel(), { foreignKey: 'userid' });

        this.modelV.getModel().hasMany(this.model.getModel(), { foreignKey: 'vaccinoid' });
        this.model.getModel().belongsTo(this.modelV.getModel(), { foreignKey: 'vaccinoid' });

        this.modelCV.getModel().hasMany(this.model.getModel(), { foreignKey: 'centro_vac_id' });
        this.model.getModel().belongsTo(this.modelCV.getModel(), { foreignKey: 'centro_vac_id' });
    }
    // Metodo usato per cancellare una prenotazione
    public async cancellaPre(id: number, user: number) {
        await this.checkPreIDStato(id, user);
        return await this.model.cancellaPre(id, user);
    }
    // Metodo per effettuare una modifica ad una prenotazione
    public async modifica(updateBody: { id: number, user: number, data?: string, slot?: number, centro_vac?: number, vaccino?: number }) {


        await this.TypeCheckUser(updateBody.user);
        await this.checkPreIDStato(updateBody.id, updateBody.user);

        // Qui vengono effettuate tutta una serie di operazioni di sanificazione degli input inseriti dall'utente
        let oldPr = await this.findOne(updateBody.id);
        if (typeof oldPr === "undefined" || oldPr === null) {
            throw Error("Questo appuntamento e' inesistente");
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

        if (typeof updateBody.vaccino !== "undefined") {
            await this.TypeCheckVaccino(updateBody.vaccino);
            safeBody.vaccinoid = updateBody.vaccino;
        }
        else {
            safeBody.vaccinoid = oldPr.vaccinoid;
        }

        let data = safeBody.data ? safeBody.data : oldPr.data;
        let centro = safeBody.centro_vac_id ? safeBody.centro_vac_id : oldPr.centro_vac_id;
        let fascia = safeBody.fascia ? safeBody.fascia : oldPr.fascia;
        if ((typeof updateBody.slot !== 'undefined' && updateBody.slot !== oldPr.slot) || (typeof updateBody.data !== 'undefined' && updateBody.data !== oldPr.data) || (typeof updateBody.centro_vac !== 'undefined' && updateBody.centro_vac !== oldPr.centro_vac_id)) {
            await this.checkSlot(data, centro, safeBody.slot ? safeBody.slot : oldPr.slot);

        }
        //devo controllare la disponibilita' solo se cambio la fascia o data.
        if (oldPr.data != safeBody.data || oldPr.fascia != safeBody.fascia || (typeof updateBody.centro_vac !== 'undefined' && updateBody.centro_vac !== oldPr.slot))
            await this.checkAvailability(data, centro, fascia);

        await this.checkVaxValidity(data, safeBody.vaccinoid, updateBody.user, updateBody.id);
        return await this.model.modifica({id: updateBody.id, updatebody:safeBody});
    }
    // Metodo usato per decodificare il codice uuid quando viene passato sotto forma di QRcode. Questo codice può essere inviato anche tramite json
    private async decodeUUID(req) {
        var uuid: string;
        if (typeof req.file !== 'undefined') {
            let img: Buffer = req.file.buffer;

            let image = await Jimp.read(img);
            let qrcode = new qrCode();
            qrcode.callback = function (err, value) {
                if (err) {
                    throw new Error("qr code sconosciuto");
                }
                uuid = value.result;
            };
            // Decoding the QR code
            qrcode.decode(image.bitmap);
        }
        else {
            //Legge dalla json
            uuid = req.body.uuid;
        }
        return uuid;
    }

    // Metodo usato per controllare l'appartenenza di una prenotazione
    private async checkPreIDStato(id: number, user: number) {
        if (typeof id !== 'number' || isNaN(id)) throw new Error('Id non è valido');

        //un utente non puo' cancellare o modificare le prenotazione degli altri.
        let result = await this.model.getModel().count({
            where: {
                id: id,
                userid: user,
                stato: 0
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
            stato: [0, 1],
            
        };
        var AllVax = await this.model.getModel().findAll({
            where: queryBody,
            order: [['data', 'DESC']]
        });
        // Devo escludere la prenotazione attuale, durante la modifica, per escludere il controllo sul periodo di validità del vaccino
        if (typeof excludeid !== 'undefined') {
            AllVax = AllVax.filter((element) => {
                return element.id != excludeid;
            });
        }

        //mai vaccinato
        if (JSON.parse(JSON.stringify(AllVax)).length == 0) {
            return;
        }

        let Vaccino = await this.modelV.getModel().findOne({ where: { id: vaccino }, query: { raw: true } });
        let LowerBound = DataPre.minus({ day: Vaccino.validita });
        let UpperBound = DataPre.plus({ day: Vaccino.validita });

        //controlla se prima e dopo la validita esiste un altro vaccinazione.
        let InRangeVax = AllVax.filter(Prenotazione=>{
            let date = DateTime.fromISO(Prenotazione.data);
            return LowerBound < date && date < UpperBound;
        });
        
        if (JSON.parse(JSON.stringify(InRangeVax)).length > 0) {
            throw new Error("il vaccino è ancora effettivo");
        }

        

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
    // Metodo usato per controllare un codice uuid
    private async checkUUID(uuid: string) {
        let sanitized = stringSanitizer(uuid);
        if (typeof sanitized === 'undefined') throw Error("codice sconosciuto");
        if (sanitized.length != 36) throw Error("codice sconosciuto");
        return await this.model.getModel().findOne({
            where: {
                uuid: sanitized
            },
            include: ["user","vaccino"]
        });
    }

    // Metodo per effettuare controlli sulla data
    private TypeCheckDataListaPrenotazione(data: string): Boolean {
        let sanitizeddata = stringSanitizer(data);
        let dataIns = DateTime.fromISO(sanitizeddata);
        if ((typeof sanitizeddata !== 'string' || !dataIns.isValid)) throw new Error('Questa data non è valida');
        return true;
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
        if (typeof user !== 'number' || isNaN(user)) throw new Error('Questo utente non è valido');
        let test = await this.modelU.getModel().findAll({
            where: {
                id: user
            }
        });
        if (Object.keys(test).length == 0) throw new Error('Questo utente non esiste');
        return true;
    }
    // Metodo che restituisce, per ogni centro vaccinale, per ogni fascia, e, per ogni data, il numero di prenotazioni, più gli altri attributi
    public async takeNumberOfPrenotation(fascia: Boolean): Promise<Array<any>> {
        if (typeof fascia !== 'boolean') throw new Error('L\' opzione inserita non è valida')
        return await this.model.takeNumberOfPrenotation(fascia);
        }

    // Metodo che ritorna tutte le prenotazioni effettuate per una certa data, in un certo centro vaccinale e per una certa fascia
    async getSlotFull(id: number, data: Array<string>, fascia?: number): Promise<any> {
        await this.TypeCheckCV(id);
        return await this.model.getSlotFull(id,data,fascia);
    }

    // Metodo per ottenere le statistiche sui centri vaccinali e sulle prenotazioni che hanno avuto esito positivo
    public async getStatisticPositive(order: Boolean = true): Promise<Array<Object>> {

        let asc = typeof order === 'undefined' ? true : order;
        return await this.model.getStatisticPositive(asc);
    }

    // Metodo per impostare le prenotazioni come 'non andate a buon fine'
    public async setBadPrenotations(data: string): Promise<void> {
        if (typeof (data) !== 'string' || !(DateTime.fromISO(data).isValid)) throw new Error('La data inserita non è valida')
        await this.model.setBadPrenotations(data);
    }

    // Questo metodo ritorna il numero di prenotazioni che non sono andate a buon fine

    public async getCountBadPrenotation(data: string, id: number): Promise<number> {
        let datasanitized = stringSanitizer(data);
        if (isNaN(id) || !isFinite(id) || typeof (id) !== 'number') throw new Error('il centro vaccinale che hai inserito non è corretto')
        if (typeof (datasanitized) !== 'string' || !(DateTime.fromISO(datasanitized).isValid) || DateTime.now > DateTime.fromISO(datasanitized)) throw new Error('La data che hai inserito non è corretta')
        let result = await this.getBadPrenotation(datasanitized, false, id);
        if (typeof result['count'][0] === 'undefined') throw new Error('La data inserita non ha prodotto risultati')
        return result['count'][0].count
    }
    // Metodo che restituisce tutte le prenotazioni che non sono andate a buon fine, prende in input una data, un booleano, che modifica la query e un centro vaccinale.
    public async getBadPrenotation(data: string, option: Boolean = true, id?: number): Promise<Array<any>> {
        if(option) return await this.model.getBadPrenotation(data);
        else {
            await this.TypeCheckCV(id);
            return await this.model.getBadPrenotation(data,option,id);
        }
    }
    // Metodo che ritorna un riferimento al model
    public getModel() {
        return this.model;
    }

    // Metodo che ritorna una prenotazione specifica
    public async findOne(id: number): Promise<any> {
        return await this.model.findOne(id);
    }
}