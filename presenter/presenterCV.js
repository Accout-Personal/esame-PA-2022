"use strict";
exports.__esModule = true;
exports.PresentCV = void 0;
var _a = require('sequelize'), Sequelize = _a.Sequelize, Model = _a.Model, DataTypes = _a.DataTypes;
var proxyCV_1 = require("../model/Proxymodel/proxyCV");
/*
* Utilizziamo il pattern builder per implementare questa classe, in quanto abbiamo che il contenuto restituito all'utente può variare a seconda delle richieste
*/
var PresentCV = /** @class */ (function () {
    function PresentCV() {
        this.proxyInterfaceCV = new proxyCV_1.proxyCV();
    }
    PresentCV.prototype.haversineFunctionNoFilter = function (scelta) {
        if (scelta) //fai qualcosa
            ;
        else
            ; //fai altro
    };
    return PresentCV;
}());
exports.PresentCV = PresentCV;
