import { proxyInterfaceCV } from "../../model/ProxyInterface/proxyinterfaceCV";
import { builderInterfaceCV } from "./builderInterface/builderInterfaceCV";
import * as haversine from 'haversine'
import { proxyPr } from "../../model/Proxymodel/proxyPR";
import { DateTime } from "luxon";

export class buildCV implements builderInterfaceCV {

    private result = [];
    private proxy;
    private proxyPre;

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
        
        all.map( val => {
            let end = {
                latitude: val.dataValues.lati,
                longitude: val.dataValues.longi
            }
            val.dataValues.distanza = haversine(start, end, {unit: 'meter'})
            if(val.dataValues.distanza <= distanza)
            this.result.push(val.dataValues)
        });
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

        this.proxyPre = new proxyPr()
        let prenotazioni;
        if(DateTime.fromISO(data).isValid){
            let query = await this.proxyPre.takeNumberOfPrenotation(false);
            console.log(query)
            prenotazioni= query.filter((val) => {if(val.data == data) return true})
        }
        else throw new Error("Hai inserito una data non corretta");
        
        console.log(prenotazioni)
        let start = {
            latitude: latitude,
            longitude: longitude
          }
        
          let all = await this.proxy.getProxyModel().getModel().findAll({
            attributes: ['id', 'lati', 'longi','maxf1','maxf2']
          });
          let check = true;
        all.map( val => {
            let end = {
                latitude: val.dataValues.lati,
                longitude: val.dataValues.longi
            }
            val.dataValues.distanza = haversine(start, end, {unit: 'meter'})
            if(val.dataValues.distanza <= distanza){
            prenotazioni.map(pre => {
                if(val.dataValues.id == pre.centro_vac && check){
                    val.dataValues.residuo = (val.dataValues.maxf1+val.dataValues.maxf2) - pre.count;
                    check = false ;
                }
                if(check)val.dataValues.residuo = val.dataValues.maxf1+val.dataValues.maxf2
            });
            if(!check)check = true;
            this.result.push(val.dataValues)
            }
        });
        if(order)this.result.sort( (a, b) => {
            return a.distanza - b.distanza
        })
        else { this.result.sort( (a, b) => {
            return b.distanza - a.distanza })
        }
        console.log(this.result)
    }


    getResult(): Array<any>{
        let finish = this.result;
        this.result = [];
        return finish;
    }
}
