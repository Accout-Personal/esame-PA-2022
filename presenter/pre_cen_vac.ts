import { Centro_vaccinale } from "../model/centro_vaccinale"
var { Sequelize, Model, DataTypes } = require('sequelize');
import {DBConnection} from '../config/sequelize'
import {builder} from './builderInterface'
import * as dotenv from 'dotenv';
import { proxyInterfaceCV } from "../model/ProxyInterface/proxyinterfaceCV";
import { proxyCV } from "../model/Proxymodel/proxyCV";
import * as haversine from 'haversine'
/*
* Utilizziamo il pattern builder per implementare questa classe, in quanto abbiamo che il contenuto restituito all'utente può variare a seconda delle richieste
*/

export class PresentCV implements builder {

    private proxyInterfaceCV:proxyInterfaceCV;

    constructor(){
        
        this.proxyInterfaceCV = new proxyCV();
    }

    //istanza di 
    

    //In questo metodo viene utilizzata soltanto la funzione di filtraggio relativa alla distanza
    async producePartA(): Promise<void> {

        const start = {
            latitude: 30.849635,
            longitude: -83.24559
          }

        let result = await this.proxyInterfaceCV.getProxyModel().getModel().findAll({
            attributes: ['id', 'lati', 'longi']
          });
        //console.log(JSON.stringify(result))
        let complete = [];
        result.map( val => {
            let end = {
                latitude: val.dataValues.lati,
                longitude: val.dataValues.longi
            }
            val.dataValues.distanza = haversine(start, end, {unit: 'meter'})
            complete.push(val.dataValues)
        })
        console.log(complete)
        let ok = complete.filter(value => value.distanza >= 9273708.961528707 )
        console.log(' risultato finale \n');
        console.log(ok);
    }
    //in questa funzione viene eseguita sia la funzione di filtraggio per la distanza che per la disponibilità
    producePartB(): void {
        throw new Error("Method not implemented.");
    }

    /*async mioGetAll(){
        let res = await this.model.getModel().findAll()
}*/
}