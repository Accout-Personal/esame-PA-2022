import { Centro_vaccinale } from "../model/centro_vaccinale"
var { Sequelize, Model, DataTypes } = require('sequelize');
import {DBConnection} from '../config/sequelize'
import {builder} from './builderInterface'
import * as dotenv from 'dotenv';
/*
* Utilizziamo il pattern builder per implementare questa classe, in quanto abbiamo che il contenuto restituito all'utente può variare a seconda delle richieste
*/

class PresentCV implements builder {

    model;

    constructor(){
        
        this.model = new Centro_vaccinale(DBConnection.getInstance().getConnection());
    }

    //istanza di 
    

    //In questo metodo viene utilizzata soltanto la funzione di filtraggio relativa alla distanza
    producePartA(): void {
        throw new Error("Method not implemented.");
    }
    //in questa funzione viene eseguita sia la funzione di filtraggio per la distanza che per la disponibilità
    producePartB(): void {
        throw new Error("Method not implemented.");
    }

    async mioGetAll(){
        let res = await this.model.getModel().findAll()
}
}
dotenv.config();
console.log(process.env);
//var prova = new PresentCV();
//console.log(prova.mioGetAll())
console.log(DBConnection.getInstance().getConnection())