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
exports.buildCV = void 0;
var haversine = require("haversine");
var proxyPR_1 = require("../../model/Proxymodel/proxyPR");
var luxon_1 = require("luxon");
var buildCV = /** @class */ (function () {
    function buildCV(proxy) {
        this.result = [];
        this.proxyPre = new proxyPR_1.proxyPr();
        this.proxy = proxy;
    }
    //In questo metodo viene utilizzata soltanto la funzione di filtraggio relativa alla distanza
    buildCV.prototype.producePartA = function (latitude, longitude, distanza, order) {
        if (order === void 0) { order = true; }
        return __awaiter(this, void 0, void 0, function () {
            var start, all;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start = {
                            latitude: latitude,
                            longitude: longitude
                        };
                        return [4 /*yield*/, this.proxy.getProxyModel().getModel().findAll({
                                attributes: ['id', 'lati', 'longi']
                            })];
                    case 1:
                        all = _a.sent();
                        all = all.map(function (val) {
                            var end = {
                                latitude: val.dataValues.lati,
                                longitude: val.dataValues.longi
                            };
                            val.dataValues.distanza = haversine(start, end, { unit: 'meter' });
                            return val.dataValues;
                            /*if(val.dataValues.distanza <= distanza)
                            this.result.push(val.dataValues)*/
                        });
                        //console.log(all)
                        this.result = all.filter(function (value) {
                            if (value.distanza <= distanza)
                                return true;
                            else
                                return false;
                        });
                        if (order)
                            this.result.sort(function (a, b) {
                                return a.distanza - b.distanza;
                            });
                        else {
                            this.result.sort(function (a, b) {
                                return b.distanza - a.distanza;
                            });
                        }
                        console.log(this.result);
                        return [2 /*return*/];
                }
            });
        });
    };
    //in questa funzione viene eseguita sia la funzione di filtraggio per la distanza che per la disponibilità
    buildCV.prototype.producePartB = function (latitude, longitude, distanza, data, order) {
        if (order === void 0) { order = true; }
        return __awaiter(this, void 0, void 0, function () {
            var prenotazioni, query, start, all, check;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!luxon_1.DateTime.fromISO(data).isValid) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.proxyPre.takeNumberOfPrenotation(false)];
                    case 1:
                        query = _a.sent();
                        //console.log(query)
                        prenotazioni = query.filter(function (val) { if (val.data == data)
                            return true; });
                        return [3 /*break*/, 3];
                    case 2: throw new Error("Hai inserito una data non corretta");
                    case 3:
                        start = {
                            latitude: latitude,
                            longitude: longitude
                        };
                        return [4 /*yield*/, this.proxy.getProxyModel().getModel().findAll({
                                attributes: ['id', 'lati', 'longi', 'maxf1', 'maxf2']
                            })];
                    case 4:
                        all = _a.sent();
                        check = true;
                        all = all.map(function (val) {
                            var end = {
                                latitude: val.dataValues.lati,
                                longitude: val.dataValues.longi
                            };
                            val.dataValues.distanza = haversine(start, end, { unit: 'meter' });
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
                        this.result = all.filter(function (val) {
                            if (val.distanza <= distanza) {
                                prenotazioni.map(function (pre) {
                                    if (val.id == pre.centro_vac && check) {
                                        val.residuo = (val.maxf1 + val.maxf2) - pre.count;
                                        check = false;
                                    }
                                    if (check)
                                        val.residuo = val.maxf1 + val.maxf2;
                                });
                                if (!check)
                                    check = true;
                                return true;
                            }
                            else
                                return false;
                        });
                        if (order)
                            this.result.sort(function (a, b) {
                                return a.distanza - b.distanza;
                            });
                        else {
                            this.result.sort(function (a, b) {
                                return b.distanza - a.distanza;
                            });
                        }
                        console.log(this.result);
                        return [2 /*return*/];
                }
            });
        });
    };
    // Metodo per ottenere gli slot temporali disponibili
    buildCV.prototype.getSlotFree = function (centroCV, date, fascia) {
        return __awaiter(this, void 0, void 0, function () {
            var cv, prenotazioni, range, free, _i, date_1, d, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (fascia <= 0 || isNaN(fascia) || fascia >= 3 || !isFinite(fascia))
                            throw new Error('la fascia inserita non è valida');
                        if (date.length > 5)
                            throw new Error('Hai inserito troppe date');
                        if (typeof centroCV !== 'number' || isNaN(centroCV))
                            throw new Error('Il centro vaccinale inserito non è corretto');
                        return [4 /*yield*/, this.proxy.getProxyModel().getSpecificCV(centroCV)];
                    case 1:
                        cv = _a.sent();
                        return [4 /*yield*/, this.proxyPre.getSlotFull(centroCV, date, fascia)];
                    case 2:
                        prenotazioni = _a.sent();
                        prenotazioni = prenotazioni.map(function (value) { return value.dataValues; });
                        console.log(prenotazioni);
                        range = 0;
                        if (typeof fascia === 'number' && fascia == 1)
                            range = cv[0].dataValues.maxf1;
                        if (typeof fascia === 'number' && fascia == 2)
                            range = cv[0].dataValues.maxf2;
                        if (typeof fascia === 'undefined')
                            range = cv[0].dataValues.maxf1 + cv[0].dataValues.maxf2;
                        free = [];
                        for (_i = 0, date_1 = date; _i < date_1.length; _i++) {
                            d = date_1[_i];
                            for (i = 1; i <= range; i++) {
                                free.push({
                                    data: d,
                                    slot: i
                                });
                            }
                        }
                        console.log(free);
                        return [2 /*return*/];
                }
            });
        });
    };
    //metodo per ottenere il risultato finale
    buildCV.prototype.getResult = function () {
        var finish = this.result;
        this.result = [];
        return finish;
    };
    return buildCV;
}());
exports.buildCV = buildCV;
