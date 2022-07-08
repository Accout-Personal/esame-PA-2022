import { proxyInterfaceCV } from "../../model/ProxyInterface/proxyinterfaceCV";
import { builderInterfaceCV } from "./builderInterface/builderInterfaceCV";
import * as haversine from 'haversine'
import { proxyPr } from "../../model/Proxymodel/proxyPR";
import { DateTime } from "luxon";
import { Prenotazione } from "../../model/prenotazione";

export class buildCV implements builderInterfaceCV {

    private result = [];
    private proxy;
    private proxyPre = new proxyPr();

    constructor(proxy: proxyInterfaceCV) {
        this.proxy = proxy;
    }

    //In questo metodo viene utilizzata soltanto la funzione di filtraggio relativa alla distanza
    async producePartA(latitude: number, longitude: number, distanza: number, order: Boolean = true): Promise<void> {

        // Qui andiamo ad eseguire tutta una serie di controlli sui valori di input inseriti dall'utente

        this.proxy.TypeCheckLati(latitude);
        this.proxy.TypeCheckLongi(longitude);
        if (typeof distanza !== 'number' || isNaN(distanza) || !isFinite(distanza)) throw new Error('La distanza inserita non è corretta')

        let start = {
            latitude: latitude,
            longitude: longitude
        }
        //Qui andiamo a prendere tutti i dati di interesse dal DB
        
        let all = await this.proxy.getProxyModel().getModel().findAll({
            attributes: ['id', 'lati', 'longi']
        });
        //Qui ad ogni centro vaccinale viene aggiunta la distanza
        all = all.map(val => {
            let end = {
                latitude: val.dataValues.lati,
                longitude: val.dataValues.longi
            }
            val.dataValues.distanza = parseFloat(haversine(start, end, { unit: 'km' }).toFixed(2));
            return val.dataValues;

        });
        // I vari centri vaccinali vengono filtrati sulla base della distanza
        this.result = all.filter(value => {
            return value.distanza <= distanza;

        });
        // Qui avviene l'ordinamento
        if (order) this.result.sort((a, b) => {
            return a.distanza - b.distanza
        });
        else {
            this.result.sort((a, b) => {
                return b.distanza - a.distanza
            });
        }
    }

    //in questa funzione viene eseguita sia la funzione di filtraggio per la distanza che per la disponibilità
    async producePartB(latitude: number, longitude: number, distanza: number, data: string, order: Boolean = true): Promise<void> {

        // Qui andiamo a effettuare tutta una serie di controlli che vengono 

        this.proxy.TypeCheckLati(latitude)
        this.proxy.TypeCheckLongi(longitude)
        if (typeof distanza !== 'number' || isNaN(distanza) || !isFinite(distanza)) throw new Error('La distanza inserita non è corretta')
        // Qui prendiamo tutti i dati d'interesse dalla tabella prenotazione
        let prenotazioni;
        if (DateTime.fromISO(data).isValid) {
            let query = await this.proxyPre.takeNumberOfPrenotation(false);
            prenotazioni = query.filter((val) => { if (val.data == data) return true })
        }
        else throw new Error("Hai inserito una data non corretta");

        let start = {
            latitude: latitude,
            longitude: longitude
        }

        this.proxy.makeRelationship();

        //Qui andiamo a prendere tutti i dati di interesse dal DB
        let all = await this.proxy.getProxyModel().getModel().findAll({
            attributes: ['id', 'lati', 'longi', 'maxf1', 'maxf2'],
            include:'prenotaziones'
        });
        
        //Qui andiamo ad aggiungere la distanza ad ogni centro vaccinale
        all = all.map(val => {
            let end = {
                latitude: val.dataValues.lati,
                longitude: val.dataValues.longi
            }
            val.dataValues.distanza = parseFloat(haversine(start, end, { unit: 'km' }).toFixed(2));
            return val.dataValues;
        });


        //filtro per distanza
        this.result = all.filter(val => {
            return val.distanza <= distanza;
        });

        
        //filtro per la disponibilita
        this.result = this.result.filter(val=>{
            return (val.maxf1 + val.maxf2) > val.prenotaziones.length
        });

        // Qui viene effettuato l'ordinamento del risultato finale
        if (order) this.result.sort((a, b) => {
            return a.distanza - b.distanza
        });
        else {
            this.result.sort((a, b) => {
                return b.distanza - a.distanza
            });
        }

        this.result = this.result.map(val=>{
            delete val.prenotaziones;
            return val;
        });
    }

    // Metodo per ottenere gli slot temporali disponibili
    async getSlotFree(centroCV: number, date: Array<string>, fascia?: number): Promise<void> {

        // Qui andiamo a effettuare dei controlli sui dati di inpit inseriti dall'utente
        if (fascia <= 0 || isNaN(fascia) || fascia >= 3 || !isFinite(fascia)) throw new Error('la fascia inserita non è valida');
        if (date.length > 5) throw new Error('Hai inserito troppe date');
        if (typeof centroCV !== 'number' || isNaN(centroCV)) throw new Error('Il centro vaccinale inserito non è corretto');

        // Qui andiamo a prendere i dati di interesse dalla tabella prenotazione
        let prenotazioni = await this.proxyPre.getSlotFull(centroCV, date, fascia);
        prenotazioni = prenotazioni.map(value => { return value.dataValues });
        // Caso in cui la fascia inserita sia uguale a 1
        if (typeof fascia === 'number' && fascia == 1) {
            for (let d of date) {
                let freeSlotF1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
                prenotazioni.map(value => {
                    if (d == value.data) {
                        // Qui vado a rimuovere gli slot che sono già occupati
                        freeSlotF1 = freeSlotF1.filter(val => {
                            if (val == value.slot) return false;
                            else return true;
                        });
                    };
                });
                // Inserisco il risultato finale nella variabile result
                this.result.push({
                    date: d,
                    slotLiberi: freeSlotF1
                });
            }
        };
        // Caso in cui la fascia è uguale a 2, analogo al caso precedente
        if (typeof fascia === 'number' && fascia == 2) {
            for (let d of date) {
                let freeSlotF2 = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
                prenotazioni.map(value => {
                    if (d == value.data) {
                        freeSlotF2 = freeSlotF2.filter(val => {
                            if (val == value.slot) return false;
                            else return true;
                        });
                    };
                });
                this.result.push({
                    date: d,
                    slotLiberi: freeSlotF2
                });
            }
        };
        // Caso in cui la fascia non è stata definita, analogo al caso precedente, solo che in questo caso consideriamo tutti gli slot
        if (typeof fascia === 'undefined') {
            for (let d of date) {
                let freeSlot = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
                prenotazioni.map(value => {
                    if (d == value.data) {
                        freeSlot = freeSlot.filter(val => {
                            if (val == value.slot) return false;
                            else return true;
                        });
                    };
                });
                this.result.push({
                    date: d,
                    slotLiberi: freeSlot
                });
            }
        };
        console.log(this.result)
    }

    //metodo per ottenere il risultato finale
    getResult(): Array<any> {
        let finish = this.result;
        this.result = [];
        return finish;
    }
}
