import { Centro_vaccinale } from "../model/centro_vaccinale"
var { Sequelize, Model, DataTypes } = require('sequelize');
import {connection} from '../config/sequelize'
/*
* Utilizziamo il pattern builder per implementare questa classe, in quanto abbiamo che il contenuto restituito all'utente può variare a seconda delle richieste
*/

class PresentCV {

    // Da eliminare
    connection = new Sequelize('centrovax','centrovax','pa2022',{
        dialect:'mysql',
        host:'localhost'    
    });

    model = new Centro_vaccinale(connection);
}

var prova = new PresentCV();
console.log(prova.model.getAll().then())
console.log(connection)