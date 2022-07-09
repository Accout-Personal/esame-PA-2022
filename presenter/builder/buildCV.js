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
// Questa è la classe builder con la quale andremo a costruire il nostro risultato che verrà restituito all'utente
var buildCV = /** @class */ (function () {
    function buildCV(proxy) {
        this.result = [];
        this.proxyPre = new proxyPR_1.proxyPr();
        this.proxy = proxy;
    }
    //CASO A: filtro solo per la distanza
    //CASO B: filtro per la distanza e la disponibilita
    //CASO C: restituisce lo slot libero di un centro dando max 5 giorni
    buildCV.prototype.queryAlDB = function (disp) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        //Qui andiamo a prendere tutti i dati di interesse dal DB
                        this.proxy.makeRelationship();
                        if (!!disp) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.proxy.getProxyModel().getModel().findAll({
                                attributes: ['id', 'lati', 'longi']
                            })];
                    case 1:
                        _a.result = _c.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        _b = this;
                        return [4 /*yield*/, this.proxy.getProxyModel().getModel().findAll({
                                attributes: ['id', 'lati', 'longi', 'maxf1', 'maxf2'],
                                include: 'prenotaziones'
                            })];
                    case 3:
                        _b.result = _c.sent();
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //ordinamento in base alla distanza, true ordine decrescente, false crescente
    buildCV.prototype.ordinamento = function (desc) {
        if (desc === void 0) { desc = true; }
        // Qui avviene l'ordinamento
        var order = desc || typeof desc === "undefined" ? 1 : -1;
        this.result.sort(function (a, b) {
            return order * (a.distanza - b.distanza);
        });
    };
    //Qui viene filtrato la data della prenotazione di centri vaccinali
    buildCV.prototype.filtraPrenData = function (data) {
        if (typeof data !== 'string')
            throw new Error("la data inserita non e' corretta");
        var data1 = luxon_1.DateTime.fromISO(data).isValid ? data : luxon_1.DateTime.now().toISODate();
        this.result = this.result.map(function (value) {
            var val = value;
            val.prenotaziones = val.prenotaziones.filter(function (prenotazione) {
                return prenotazione.data == data1;
            });
            return val;
        });
    };
    //qui viene filtrato per la disponibilita
    buildCV.prototype.filtraDisponibilita = function () {
        this.result = this.result.filter(function (val) {
            return (val.maxf1 + val.maxf2) > val.prenotaziones.length;
        });
    };
    //qui vengono tagliati i dati non interessati
    buildCV.prototype.trimdata = function () {
        this.result = this.result.map(function (val) {
            delete val.prenotaziones;
            return val;
        });
    };
    //qui viene filtrato per la distanza
    buildCV.prototype.filtraPerDistanza = function (latitude, longitude, distanza) {
        this.proxy.TypeCheckLati(latitude);
        this.proxy.TypeCheckLongi(longitude);
        if (typeof distanza !== 'number' || isNaN(distanza) || !isFinite(distanza) || distanza <= 0)
            throw new Error('La distanza inserita non è corretta');
        var start = {
            latitude: latitude,
            longitude: longitude
        };
        //Qui ad ogni centro vaccinale viene calcolata la distanza
        this.result = this.result.map(function (val) {
            var end = {
                latitude: val.dataValues.lati,
                longitude: val.dataValues.longi
            };
            val.dataValues.distanza = parseFloat(haversine(start, end, { unit: 'km' }).toFixed(2));
            return val.dataValues;
        }).filter(function (value) {
            // I vari centri vaccinali vengono filtrati sulla base della distanza
            return value.distanza <= distanza;
        });
    };
    buildCV.prototype.getSlotFull = function (centroCV, date, fascia) {
        return __awaiter(this, void 0, void 0, function () {
            var datesanitized, prenotazioni;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Qui vengono a effettuati dei controlli sui dati di inpit inseriti dall'utente
                        if (typeof fascia !== 'undefined') //in caso fascia sia non definita, vengono considerati intera giornata
                            if (fascia <= 0 || isNaN(fascia) || fascia >= 3 || !isFinite(fascia))
                                throw new Error('la fascia inserita non è valida');
                        if (date.length > 5)
                            throw new Error('Hai inserito troppe date');
                        datesanitized = date.filter(function (value) { return luxon_1.DateTime.fromISO(value).isValid && luxon_1.DateTime.now() < luxon_1.DateTime.fromISO(value); });
                        if (typeof centroCV !== 'number' || isNaN(centroCV) || !isFinite(centroCV))
                            throw new Error('Il centro vaccinale inserito non è corretto');
                        return [4 /*yield*/, this.proxyPre.getSlotFull(centroCV, datesanitized, fascia)];
                    case 1:
                        prenotazioni = _a.sent();
                        this.prenotazioni = prenotazioni.map(function (value) { return value.dataValues; });
                        return [2 /*return*/];
                }
            });
        });
    };
    //qui viene ricavato timeslot dipende dalla fascia oraria scelta
    buildCV.prototype.setFascia = function (fascia) {
        //let freeSlots = [1,...36];
        var freeSlot = Array.from(Array(36).keys()).map(function (v) { return v + 1; });
        switch (fascia) {
            case 1: {
                this.fasciaSlot = freeSlot.filter(function (slot) { return slot < 17; }); //da 1 a 16
                break;
            }
            case 2: {
                this.fasciaSlot = freeSlot.filter(function (slot) { return slot > 16; }); //da 1 a 16
                break;
            }
            default: {
                this.fasciaSlot = freeSlot;
            }
        }
    };
    buildCV.prototype.filtroFascia = function (date) {
        var _this = this;
        var datesanitized = date.filter(function (value) { return (luxon_1.DateTime.fromISO(value).isValid && luxon_1.DateTime.now() < luxon_1.DateTime.fromISO(value)); });
        //metodo 1 per filtro della fascia
        this.result = datesanitized.map(function (d) {
            //ottengo slot occupati in una fascia
            var occupiedSlots = _this.prenotazioni.filter(function (value) {
                return d == value.data;
            }).map(function (v) {
                return v.slot;
            });
            //ottengo differenza fra gli slot della fascia e slot occupati (slot possibili - slot occupati = slot liberi)
            var freeSlots = _this.fasciaSlot.filter(function (s) { return !occupiedSlots.includes(s); });
            //ottengo il risultato
            return { date: d, slotLiberi: freeSlots };
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
