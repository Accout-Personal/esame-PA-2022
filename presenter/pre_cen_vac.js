"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PresentCV = void 0;
var _a = require('sequelize'), Sequelize = _a.Sequelize, Model = _a.Model, DataTypes = _a.DataTypes;
var proxyCV_1 = require("../model/Proxymodel/proxyCV");
var haversine = require("haversine");
/*
* Utilizziamo il pattern builder per implementare questa classe, in quanto abbiamo che il contenuto restituito all'utente può variare a seconda delle richieste
*/
var PresentCV = /** @class */ (function () {
    function PresentCV() {
        this.proxyInterfaceCV = new proxyCV_1.proxyCV();
    }
    //istanza di 
    //In questo metodo viene utilizzata soltanto la funzione di filtraggio relativa alla distanza
    PresentCV.prototype.producePartA = function () {
        return __awaiter(this, void 0, void 0, function () {
            var start, result, complete, ok;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start = {
                            latitude: 30.849635,
                            longitude: -83.24559
                        };
                        return [4 /*yield*/, this.proxyInterfaceCV.getProxyModel().getModel().findAll({
                                attributes: ['id', 'lati', 'longi']
                            })];
                    case 1:
                        result = _a.sent();
                        complete = [];
                        result.map(function (val) {
                            var end = {
                                latitude: val.dataValues.lati,
                                longitude: val.dataValues.longi
                            };
                            val.dataValues.distanza = haversine(start, end, { unit: 'meter' });
                            complete.push(val.dataValues);
                        });
                        console.log(complete);
                        ok = complete.filter(function (value) { return value.distanza >= 9273708.961528707; });
                        console.log(' risultato finale \n');
                        console.log(ok);
                        return [2 /*return*/];
                }
            });
        });
    };
    //in questa funzione viene eseguita sia la funzione di filtraggio per la distanza che per la disponibilità
    PresentCV.prototype.producePartB = function () {
        throw new Error("Method not implemented.");
    };
    return PresentCV;
}());
exports.PresentCV = PresentCV;
