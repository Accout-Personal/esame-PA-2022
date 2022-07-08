import { proxyInterfaceCV } from "../../model/ProxyInterface/proxyinterfaceCV";
import { builderInterfaceCV } from "./builderInterface/builderInterfaceCV";
import * as haversine from 'haversine'
import { proxyPr } from "../../model/Proxymodel/proxyPR";
import { DateTime } from "luxon";
// Questa è la classe builder con la quale andremo a costruire il nostro risultato che verrà restituito all'utente
export class buildCV implements builderInterfaceCV {

    private result = [];
    private proxy;
    private proxyPre = new proxyPr();

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

    // Metodo per ottenere gli slot temporali disponibili
    async getSlotFree(centroCV: number, date: Array<string>, fascia?: number): Promise<void> {

        // Qui andiamo a effettuare dei controlli sui dati di inpit inseriti dall'utente
        if (fascia <= 0 || isNaN(fascia) || fascia >= 3 || !isFinite(fascia)) throw new Error('la fascia inserita non è valida');
        if (date.length > 5) throw new Error('Hai inserito troppe date');
        date.filter(value => {return DateTime.fromISO(value).isValid && DateTime.now < DateTime.fromISO(value)})
        if (typeof centroCV !== 'number' || isNaN(centroCV) || !isFinite(centroCV)) throw new Error('Il centro vaccinale inserito non è corretto');
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
