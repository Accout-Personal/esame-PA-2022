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

    constructor(proxy:proxyInterfaceCV){
        this.proxy = proxy;
    }        

    //In questo metodo viene utilizzata soltanto la funzione di filtraggio relativa alla distanza
    async producePartA(latitude:number, longitude: number,distanza:number, order: Boolean = true): Promise<void> {

        let start = {
            latitude: latitude,
            longitude: longitude
          }
        
          let all = await this.proxy.getProxyModel().getModel().findAll({
            attributes: ['id', 'lati', 'longi']
          });
        
        all = all.map( val => {
            let end = {
                latitude: val.dataValues.lati,
                longitude: val.dataValues.longi
            }
            val.dataValues.distanza = haversine(start, end, {unit: 'meter'})
            return val.dataValues;
            /*if(val.dataValues.distanza <= distanza)
            this.result.push(val.dataValues)*/
        });
        //console.log(all)
        this.result = all.filter(value => {
            if(value.distanza <= distanza) return true;
            else return false;
        })
        if(order)this.result.sort( (a, b) => {
            return a.distanza - b.distanza
        })
        else { this.result.sort( (a, b) => {
            return b.distanza - a.distanza })
        }
        console.log(this.result)
    }

    //in questa funzione viene eseguita sia la funzione di filtraggio per la distanza che per la disponibilità
    async producePartB(latitude:number, longitude: number,distanza:number, data:string, order: Boolean = true): Promise<void> {

        let prenotazioni;
        if(DateTime.fromISO(data).isValid){
            let query = await this.proxyPre.takeNumberOfPrenotation(false);
            //console.log(query)
            prenotazioni= query.filter((val) => {if(val.data == data) return true})
        }
        else throw new Error("Hai inserito una data non corretta");
        
        //console.log(prenotazioni)
        let start = {
            latitude: latitude,
            longitude: longitude
          }
        
          let all = await this.proxy.getProxyModel().getModel().findAll({
            attributes: ['id', 'lati', 'longi','maxf1','maxf2']
          });
          let check = true;
        all = all.map( val => {
            let end = {
                latitude: val.dataValues.lati,
                longitude: val.dataValues.longi
            }
            val.dataValues.distanza = haversine(start, end, {unit: 'meter'});
            return val.dataValues;
            /*if(val.dataValues.distanza <= distanza){
            prenotazioni.map(pre => {
                if(val.dataValues.id == pre.centro_vac && check){
                    val.dataValues.residuo = (val.dataValues.maxf1+val.dataValues.maxf2) - pre.count;
                    check = false ;
                }
                if(check)val.dataValues.residuo = val.dataValues.maxf1+val.dataValues.maxf2
            });
            if(!check)check = true;
            this.result.push(val.dataValues)
            }*/
        });
        this.result = all.filter(val => {
            if(val.distanza <= distanza){
                prenotazioni.map(pre => {
                    if(val.id == pre.centro_vac && check){
                        val.residuo = (val.maxf1+val.maxf2) - pre.count;
                        check = false ;
                    }
                    if(check)val.residuo = val.maxf1+val.maxf2
                });
                if(!check)check = true;
                return true;
            }
            else return false;
        });
        this.result = this.result.filter(value => {
            if(value.residuo == 0)return false;
            else return true;
        })
        if(order)this.result.sort( (a, b) => {
            return a.distanza - b.distanza
        })
        else { this.result.sort( (a, b) => {
            return b.distanza - a.distanza })
        }
        console.log(this.result)
    }

    // Metodo per ottenere gli slot temporali disponibili
    async getSlotFree(centroCV:number,date:Array<string>,fascia?: number): Promise<void> {
        //let freeSlotF1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        //let freeSlotF2 = [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];
        //let freeSlot = freeSlotF1.concat(freeSlotF2);
        if(fascia <= 0 || isNaN(fascia) || fascia >= 3 || !isFinite(fascia)) throw new Error('la fascia inserita non è valida');
        if(date.length > 5) throw new Error('Hai inserito troppe date');
        if(typeof centroCV !== 'number' || isNaN(centroCV)) throw new Error('Il centro vaccinale inserito non è corretto');
        let cv = await this.proxy.getProxyModel().getSpecificCV(centroCV);
        let prenotazioni = await this.proxyPre.getSlotFull(centroCV,date,fascia)
        prenotazioni = prenotazioni.map(value => {return value.dataValues} )
        //console.log(prenotazioni)
        if(typeof fascia === 'number' && fascia == 1){
            for(let d of date){
                let freeSlotF1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
                prenotazioni.map(value => {
                    if(d == value.data){
                        freeSlotF1 = freeSlotF1.filter(val => {
                            if(val == value.slot)return false;
                            else return true;
                        });
                    };
                });
                this.result.push({
                    date: d,
                    slotLiberi: freeSlotF1
                });
            }
        };
        if(typeof fascia === 'number' && fascia == 2){
            for(let d of date){
                let freeSlotF2 = [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];
                prenotazioni.map(value => {
                    if(d == value.data){
                        freeSlotF2 = freeSlotF2.filter(val => {
                            if(val == value.slot)return false;
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
        if(typeof fascia === 'undefined'){
            for(let d of date){
                let freeSlot = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];
                prenotazioni.map(value => {
                    if(d == value.data){
                        freeSlot = freeSlot.filter(val => {
                            if(val == value.slot)return false;
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
        /*if(typeof fascia === 'number' && fascia == 2) range = cv[0].dataValues.maxf2;
        if(typeof fascia === 'undefined') range = cv[0].dataValues.maxf1+cv[0].dataValues.maxf2;
        let free = [];
        for(let d of date){
            for(let i = 1; i<= range ;i++){
                free.push({
                    data: d,
                    slot: i
                });
            } 
        }*/
        
        console.log(this.result)
    }

    //metodo per ottenere il risultato finale
    getResult(): Array<any>{
        let finish = this.result;
        this.result = [];
        return finish;
    }
}
