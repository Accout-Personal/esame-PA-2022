import { proxyInterfaceCV } from "../../model/ProxyInterface/proxyinterfaceCV";
import { builderInterfaceCV } from "./builderInterface/builderInterfaceCV";
import * as haversine from 'haversine'
import { proxyPr } from "../../model/Proxymodel/proxyPR";
import { DateTime } from "luxon";
import { mapValueFieldNames } from "sequelize/types/utils";
// Questa è la classe builder con la quale andremo a costruire il nostro risultato che verrà restituito all'utente
export class buildCV implements builderInterfaceCV {

    private result = [];
    private proxy;
    private proxyPre = new proxyPr();

    private fasciaSlot: Array<number>;
    private prenotazioni

    constructor(proxy: proxyInterfaceCV) {
        this.proxy = proxy;
    }

    //CASO A: filtro solo per la distanza
    //CASO B: filtro per la distanza e la disponibilita
    //CASO C: restituisce lo slot libero di un centro dando max 5 giorni


    public async queryAlDB(disp: boolean) {
        //Qui andiamo a prendere tutti i dati di interesse dal DB
        this.proxy.makeRelationship();
        if (disp) {
            this.result = await this.proxy.getProxyModel().getModel().findAll({
                attributes: ['id', 'lati', 'longi']
            });
        }
        else {
            this.result = await this.proxy.getProxyModel().getModel().findAll({
                attributes: ['id', 'lati', 'longi', 'maxf1', 'maxf2'],
                include: 'prenotaziones'
            });
        }
    }
    //ordinamento in base alla distanza, true ordine decrescente, false crescente
    public ordinamento(desc: boolean = true) {
        // Qui avviene l'ordinamento
        let order = desc || typeof desc === "undefined" ? 1 : -1;
        this.result.sort((a, b) => {
            return order * (a.distanza - b.distanza)
        });
    }

    //Qui viene filtrato la data della prenotazione di centri vaccinali
    public filtraPrenData(data: string) {
        let data1 = DateTime.fromISO(data).isValid ? data : DateTime.now().toISODate();
        console.log(data1);
        this.result = this.result.map(value => {
            let val = value;
            val.prenotaziones = val.prenotaziones.filter(prenotazione => {
                return prenotazione.data == data1;
            });
            return val;
        })
    }

    //qui viene filtrato per la disponibilita
    public filtraDisponibilita() {
        this.result = this.result.filter(val => {
            return (val.maxf1 + val.maxf2) > val.prenotaziones.length
        });
    }

    //qui vengono tagliati i dati non interessati
    public trimdata() {
        this.result = this.result.map(val => {
            delete val.prenotaziones;
            return val;
        });
    }

    //qui viene filtrato per la distanza
    public filtraPerDistanza(latitude: number, longitude: number, distanza: number) {
        this.proxy.TypeCheckLati(latitude);
        this.proxy.TypeCheckLongi(longitude);
        if (typeof distanza !== 'number' || isNaN(distanza) || !isFinite(distanza))
            throw new Error('La distanza inserita non è corretta')
        let start = {
            latitude: latitude,
            longitude: longitude
        }
        //Qui ad ogni centro vaccinale viene calcolata la distanza
        this.result = this.result.map(val => {
            let end = {
                latitude: val.dataValues.lati,
                longitude: val.dataValues.longi
            }
            val.dataValues.distanza = parseFloat(haversine(start, end, { unit: 'km' }).toFixed(2));
            return val.dataValues;

        }).filter(value => {
            // I vari centri vaccinali vengono filtrati sulla base della distanza
            return value.distanza <= distanza;
        });
    }

    public async getSlotFull(centroCV: number, date: Array<string>, fascia?: number) {
        // Qui vengono a effettuati dei controlli sui dati di inpit inseriti dall'utente
        if (typeof fascia !== 'undefined') //in caso fascia sia non definita, vengono considerati intera giornata
            if (fascia <= 0 || isNaN(fascia) || fascia >= 3 || !isFinite(fascia)) throw new Error('la fascia inserita non è valida');
        if (date.length > 5) throw new Error('Hai inserito troppe date');
        let datesanitized = date.filter(value => { return DateTime.fromISO(value).isValid && DateTime.now() < DateTime.fromISO(value) })
        if (typeof centroCV !== 'number' || isNaN(centroCV) || !isFinite(centroCV)) throw new Error('Il centro vaccinale inserito non è corretto');
        // Qui vengono ottenuti i dati di interesse dalla tabella prenotazione
        let prenotazioni = await this.proxyPre.getSlotFull(centroCV, datesanitized, fascia);
        this.prenotazioni = prenotazioni.map(value => { return value.dataValues });
    }

    //qui viene ricavato timeslot dipende dalla fascia oraria scelta
    public setFascia(fascia?: number) {
        //let freeSlots = [1,...36];
        let freeSlot = Array.from(Array(36).keys()).map(v => v + 1);
        switch (fascia) {
            case 1: {
                this.fasciaSlot = freeSlot.filter(slot => slot < 17); //da 1 a 16
                break;
            }
            case 2: {
                this.fasciaSlot = freeSlot.filter(slot => slot > 16); //da 1 a 16
                break;
            }
            default: {
                this.fasciaSlot = freeSlot;
            }
        }
    }

    public filtroFascia(date: Array<string>) {
        let datesanitized = date.filter(value => { return (DateTime.fromISO(value).isValid && DateTime.now() < DateTime.fromISO(value)) });
        //metodo 1 per filtro della fascia
        this.result = datesanitized.map(d => {
            //ottengo slot occupati in una fascia
            let occupiedSlots = this.prenotazioni.filter(value => {
                return d == value.data
            }).map(v => {
                return v.slot;
            });
            //ottengo differenza fra gli slot della fascia e slot occupati (slot possibili - slot occupati = slot liberi)
            let freeSlots = this.fasciaSlot.filter(s => !occupiedSlots.includes(s));
            //ottengo il risultato
            return { date: d, slotLiberi: freeSlots }
        });
        /*
        //metodo 2 (forse meno leggibile) per filtro della fascia
        this.result = date.map(d => {
            //differenza fra gli slot della fascia e slot occupati
            let freeSlots = this.fasciaSlot.filter(s => !this.prenotazioni.filter(value => {
                return d == value.data
            }).map(v => {
                return v.slot;
            }).includes(s));
        
            //ottengo il risultato
            return { date: d, slotLiberi: freeSlots }
        });     
        */
    }

    //metodo per ottenere il risultato finale
    getResult(): Array<any> {
        let finish = this.result;
        this.result = [];
        return finish;
    }
}
