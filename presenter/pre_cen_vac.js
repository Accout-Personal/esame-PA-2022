"use strict";
exports.__esModule = true;
var centro_vaccinale_1 = require("../model/centro_vaccinale");
var _a = require('sequelize'), Sequelize = _a.Sequelize, Model = _a.Model, DataTypes = _a.DataTypes;
var sequelize_1 = require("../config/sequelize");
/*
* Utilizziamo il pattern builder per implementare questa classe, in quanto abbiamo che il contenuto restituito all'utente può variare a seconda delle richieste
*/
var PresentCV = /** @class */ (function () {
    function PresentCV() {
        // Da eliminare
        this.connection = new Sequelize('centrovax', 'centrovax', 'pa2022', {
            dialect: 'mysql',
            host: 'localhost'
        });
        this.model = new centro_vaccinale_1.Centro_vaccinale(sequelize_1.connection);
    }
    return PresentCV;
}());
var prova = new PresentCV();
console.log(prova.model.getAll().then());
console.log(sequelize_1.connection);
