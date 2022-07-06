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
exports.proxyPr = void 0;
var prenotazione_1 = require("../prenotazione");
var vaccino_1 = require("../vaccino");
var users_1 = require("../users");
var centro_vaccinale_1 = require("../centro_vaccinale");
var sequelize_1 = require("../../config/sequelize");
var luxon_1 = require("luxon");
var stringsanitizer_1 = require("../../util/stringsanitizer");
var proxyPr = /** @class */ (function () {
    function proxyPr() {
        this.model = new prenotazione_1.Prenotazione(sequelize_1.DBConnection.getInstance().getConnection());
        this.modelV = new vaccino_1.Vaccini(sequelize_1.DBConnection.getInstance().getConnection());
        this.modelU = new users_1.Users(sequelize_1.DBConnection.getInstance().getConnection());
        this.modelCV = new centro_vaccinale_1.Centro_vaccinale(sequelize_1.DBConnection.getInstance().getConnection());
    }
    proxyPr.prototype.insertNewPr = function (data, slot, centro_vaccino, vaccino, user) {
        return __awaiter(this, void 0, void 0, function () {
            var sanitizeddata, fascia;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sanitizeddata = (0, stringsanitizer_1.stringSanitizer)(data);
                        //controllo il tipo di dato sia valido
                        this.TypeCheckData(sanitizeddata);
                        this.TypeCheckSlot(slot);
                        return [4 /*yield*/, this.TypeCheckCV(centro_vaccino)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.TypeCheckVaccino(vaccino)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.TypeCheckUser(user)];
                    case 3:
                        _a.sent();
                        if (slot > 16 && fascia == 1) {
                            fascia = 2;
                        }
                        else {
                            fascia = 1;
                        }
                        console.log("checking validity");
                        return [4 /*yield*/, this.checkAvailability(sanitizeddata, centro_vaccino, fascia).then(function () { console.log("validity checking success.."); })];
                    case 4:
                        _a.sent();
                        console.log("checking slot");
                        return [4 /*yield*/, this.checkSlot(sanitizeddata, centro_vaccino, slot).then(function () { console.log("slot checking success.."); })];
                    case 5:
                        _a.sent();
                        console.log("checking vax validity");
                        return [4 /*yield*/, this.checkVaxValidity(sanitizeddata, vaccino, user).then(function () { console.log("vax validity checking success.."); })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.model.insertNewPr(sanitizeddata, fascia, slot, centro_vaccino, vaccino, user)];
                    case 7: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    proxyPr.prototype.getListaPr = function (userid, centro, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof userid === "undefined" && typeof centro === "undefined") {
                            throw Error("non hai inserito nessun paramentro");
                        }
                        if (!(typeof userid === "undefined")) return [3 /*break*/, 2];
                        this.TypeCheckData(data);
                        return [4 /*yield*/, this.model.getPreCentro(centro, data)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        this.TypeCheckUser(userid);
                        return [4 /*yield*/, this.model.getPreUser(userid)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    proxyPr.prototype.cancellaPre = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkPreID(id, user)];
                    case 1:
                        _a.sent();
                        console.log("cheking success");
                        return [4 /*yield*/, this.model["delete"](id)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    proxyPr.prototype.modifica = function (updateBody) {
        return __awaiter(this, void 0, void 0, function () {
            var oldPr, safeBody, sanitizedData, data, centro, fascia;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.TypeCheckUser(updateBody.user)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.checkPreID(updateBody.id, updateBody.user)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.model.getModel().findOne({ where: { id: updateBody.id } })];
                    case 3:
                        oldPr = _a.sent();
                        if (typeof oldPr === "undefined" || oldPr === null) {
                            throw Error("Questo appunto e' inesistente");
                        }
                        safeBody = {};
                        if (typeof updateBody.data !== "undefined") {
                            sanitizedData = (0, stringsanitizer_1.stringSanitizer)(updateBody.data);
                            this.TypeCheckData(sanitizedData);
                            safeBody.data = sanitizedData;
                        }
                        if (typeof updateBody.slot !== "undefined") {
                            this.TypeCheckSlot(updateBody.slot);
                            safeBody.slot = updateBody.slot;
                            safeBody.fascia = safeBody.slot > 16 ? 2 : 1;
                        }
                        if (typeof updateBody.centro_vac !== "undefined") {
                            this.TypeCheckCV(updateBody.centro_vac);
                            safeBody.centro_vac = updateBody.centro_vac;
                        }
                        if (!(typeof updateBody.vaccino !== "undefined")) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.TypeCheckVaccino(updateBody.vaccino)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        safeBody.vaccino = updateBody.vaccino;
                        console.log("basic control finished");
                        console.log(safeBody);
                        data = safeBody.data ? safeBody.data : oldPr.data;
                        centro = safeBody.centro_vac ? safeBody.centro_vac : oldPr.centro_vac;
                        fascia = safeBody.fascia ? safeBody.fascia : oldPr.fascia;
                        console.log("data: " + data + " centro: " + centro + " fascia: " + fascia);
                        console.log(oldPr);
                        if (!(oldPr.data != safeBody.data || oldPr.fascia != safeBody.fascia)) return [3 /*break*/, 7];
                        //this.checkAvailability(safeBody.data ? safeBody.data : oldPr.data, safeBody.centro ? safeBody.centro : oldPr.centro_vac, safeBody.fascia ? safeBody.fascia : oldPr.fascia);
                        console.log("controllo disponibilita'");
                        return [4 /*yield*/, this.checkAvailability(data, centro, fascia)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        console.log("check slot");
                        return [4 /*yield*/, this.checkSlot(data, centro, safeBody.slot ? safeBody.slot : oldPr.slot)];
                    case 8:
                        _a.sent();
                        //controllo vaccino
                        console.log("check vaccino");
                        console.log("user " + updateBody.user);
                        return [4 /*yield*/, this.checkVaxValidity(data, safeBody.vaccino, updateBody.user, updateBody.id)];
                    case 9:
                        _a.sent();
                        console.log("aggiornamento delle informazioni");
                        return [4 /*yield*/, this.model.modifica(updateBody.id, safeBody)];
                    case 10: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    proxyPr.prototype.checkPreID = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                if (typeof id !== 'number' || isNaN(id))
                    throw new Error('Id non è valido');
                result = this.model.getModel().count({
                    where: {
                        id: id,
                        user: user
                    }
                });
                if (result < 1)
                    throw Error("informazione non e' valido");
                return [2 /*return*/];
            });
        });
    };
    proxyPr.prototype.checkVaxValidity = function (data, vaccino, user, excludeid) {
        return __awaiter(this, void 0, void 0, function () {
            var DataPre, queryBody, LastVax, LastVaxTime, Vaccino;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        DataPre = luxon_1.DateTime.fromISO(data);
                        queryBody = {
                            user: user,
                            vaccino: vaccino,
                            stato: [0, 1]
                        };
                        return [4 /*yield*/, this.model.getModel().findAll({
                                where: queryBody,
                                order: [['data', 'DESC']]
                            })];
                    case 1:
                        LastVax = _a.sent();
                        if (typeof excludeid !== 'undefined') {
                            LastVax = LastVax.filter(function (element) {
                                return element.id != excludeid;
                            });
                        }
                        //mai vaccinato
                        if (JSON.parse(JSON.stringify(LastVax)).length == 0) {
                            console.log("questo user non ha mai vaccinato.");
                            return [2 /*return*/];
                        }
                        LastVaxTime = luxon_1.DateTime.fromISO(LastVax[0].data);
                        return [4 /*yield*/, this.modelV.getModel().findOne({ where: { id: vaccino }, query: { raw: true } })];
                    case 2:
                        Vaccino = _a.sent();
                        //il vaccino e' ancora effettivo.
                        if (DataPre < LastVaxTime.plus({ day: Vaccino.validita }))
                            throw Error("il vaccino ancora e' effettivo");
                        return [2 /*return*/];
                }
            });
        });
    };
    proxyPr.prototype.checkSlot = function (data, centro, slot) {
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.getModel().count({
                            where: {
                                data: data,
                                centro_vac: centro,
                                slot: slot
                            }
                        })];
                    case 1:
                        count = _a.sent();
                        if (count > 0) {
                            throw Error("slot e' gia occupato.");
                        }
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    proxyPr.prototype.checkAvailability = function (dataAppuntamento, centro, fasciaOraria) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPRCentroFascia(dataAppuntamento, centro, fasciaOraria)];
                    case 1:
                        res = _a.sent();
                        //se e' undefined implica che la data e la fascia selezionata non e' prenotata da nessuno
                        if (typeof res.count != "undefined") {
                            if (res.count >= res.centro["maxf" + fasciaOraria]) {
                                throw Error("la fascia oraria e' piena");
                            }
                        }
                        else {
                            if (res.centro["maxf" + fasciaOraria] < 1) {
                                throw Error("la fascia oraria e' piena");
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    proxyPr.prototype.getPRCentroFascia = function (dataAppuntamento, centro, fasciaOraria) {
        return __awaiter(this, void 0, void 0, function () {
            var list, centro_vac, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.takeNumberOfPrenotation(true)];
                    case 1:
                        list = _a.sent();
                        centro_vac = this.modelCV.getModel().findOne({
                            where: {
                                id: centro
                            },
                            query: { raw: true }
                        });
                        res = list.find(function (_a) {
                            var data = _a.data, centro_vac = _a.centro_vac, fascia = _a.fascia;
                            data === dataAppuntamento && centro_vac === centro && fascia === fasciaOraria;
                        });
                        if (typeof res === 'undefined')
                            return [2 /*return*/, { count: undefined, centro: centro_vac }];
                        else
                            return [2 /*return*/, { count: res.length, centro: centro_vac }];
                        return [2 /*return*/];
                }
            });
        });
    };
    proxyPr.prototype.TypeCheckData = function (data) {
        var sanitizeddata = (0, stringsanitizer_1.stringSanitizer)(data);
        var dataIns = luxon_1.DateTime.fromISO(sanitizeddata);
        var dataNow = luxon_1.DateTime.now();
        if ((typeof sanitizeddata !== 'string' || !dataIns.isValid))
            throw new Error('Questa data non è valida');
        if ((dataIns < dataNow))
            throw new Error("Puoi prenotare solo in un dato futuro.");
        return true;
    };
    proxyPr.prototype.TypeCheckSlot = function (slot) {
        if (typeof slot !== 'number' || isNaN(slot))
            throw new Error('Questa slot non è valido');
        if (slot > 36 || slot < 1)
            throw new Error('Questa fascia non è valida');
        return true;
    };
    proxyPr.prototype.TypeCheckCV = function (Cv) {
        return __awaiter(this, void 0, void 0, function () {
            var test;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof Cv !== 'number' || isNaN(Cv))
                            throw new Error('Questo centro vaccino non è valido');
                        return [4 /*yield*/, this.modelCV.getModel().findAll({
                                where: {
                                    id: Cv
                                }
                            })];
                    case 1:
                        test = _a.sent();
                        if (Object.keys(test).length == 0)
                            throw new Error('Questo centro vaccino non esiste');
                        return [2 /*return*/, true];
                }
            });
        });
    };
    proxyPr.prototype.TypeCheckVaccino = function (vaccino) {
        return __awaiter(this, void 0, void 0, function () {
            var test;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof vaccino !== 'number' || isNaN(vaccino))
                            throw new Error('Questo vaccino non è valido');
                        return [4 /*yield*/, this.modelV.getModel().findAll({
                                where: {
                                    id: vaccino
                                }
                            })];
                    case 1:
                        test = _a.sent();
                        if (Object.keys(test).length == 0)
                            throw new Error('Questo vaccino non esiste');
                        return [2 /*return*/, true];
                }
            });
        });
    };
    proxyPr.prototype.TypeCheckUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var test;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(user);
                        if (typeof user !== 'number' || isNaN(user))
                            throw new Error('Questo utente non è valido');
                        return [4 /*yield*/, this.modelU.getModel().findAll({
                                where: {
                                    id: user
                                }
                            })];
                    case 1:
                        test = _a.sent();
                        console.log(test);
                        if (Object.keys(test).length == 0)
                            throw new Error('Questo utente non esiste');
                        return [2 /*return*/, true];
                }
            });
        });
    };
    proxyPr.prototype.TypeCheckStato = function (stato) {
        if (typeof stato !== 'number' || isNaN(stato))
            throw new Error('Questo stato non è valido');
        return true;
    };
    proxyPr.prototype.takeNumberOfPrenotation = function (fascia) {
        return __awaiter(this, void 0, void 0, function () {
            var result, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fascia) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.model.getModel().findAndCountAll({
                                attributes: ['centro_vac', 'data', 'fascia'],
                                group: ['centro_vac', 'data', 'fascia']
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.count];
                    case 2: return [4 /*yield*/, this.model.getModel().findAndCountAll({
                            attributes: ['centro_vac', 'data'],
                            group: ['centro_vac', 'data']
                        })];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result.count];
                }
            });
        });
    };
    proxyPr.prototype.takeSumF1F2 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var complete, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        complete = [];
                        return [4 /*yield*/, this.modelCV.getModel().findAll({
                                attributes: ['id', 'maxf1', 'maxf2']
                            })];
                    case 1:
                        result = _a.sent();
                        result.map(function (val) {
                            val.dataValues.somma = val.dataValues.maxf1 + val.dataValues.maxf1;
                            complete.push(val.dataValues);
                        });
                        return [2 /*return*/, complete];
                }
            });
        });
    };
    proxyPr.prototype.getSlotFull = function (id, data, fascia) {
        return __awaiter(this, void 0, void 0, function () {
            var query, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof fascia === 'undefined')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.model.getModel().findAll({
                                attributes: ['data', 'slot'],
                                where: {
                                    centro_vac: id,
                                    data: data
                                }
                            })];
                    case 1:
                        query = _a.sent();
                        return [2 /*return*/, query];
                    case 2: return [4 /*yield*/, this.model.getModel().findAll({
                            attributes: ['data', 'slot'],
                            where: {
                                centro_vac: id,
                                data: data,
                                fascia: fascia
                            }
                        })];
                    case 3:
                        query = _a.sent();
                        return [2 /*return*/, query];
                }
            });
        });
    };
    // Metodo per ottenere le statistiche sui centri vaccinali e sulle prenotazioni che hanno avuto esito positivo
    proxyPr.prototype.getStatisticPositive = function (order) {
        if (order === void 0) { order = true; }
        return __awaiter(this, void 0, void 0, function () {
            var positiveResult, allResult, statistic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.getModel().findAndCountAll({
                            attributes: ['centro_vac', 'stato'],
                            where: { stato: 1 },
                            group: ['centro_vac', 'stato']
                        })];
                    case 1:
                        positiveResult = _a.sent();
                        return [4 /*yield*/, this.model.getModel().findAndCountAll({
                                attributes: ['centro_vac'],
                                group: ['centro_vac']
                            })];
                    case 2:
                        allResult = _a.sent();
                        statistic = positiveResult.count.map(function (value) {
                            allResult.count.map(function (val) {
                                if (value.centro_vac == val.centro_vac) {
                                    value.media = (value.count / val.count).toFixed(2);
                                }
                            });
                            return value;
                        });
                        if (order)
                            statistic.sort(function (a, b) {
                                return a.media - b.media;
                            });
                        else
                            statistic.sort(function (a, b) {
                                return b.media - a.media;
                            });
                        console.log(statistic);
                        return [2 /*return*/];
                }
            });
        });
    };
    return proxyPr;
}());
exports.proxyPr = proxyPr;
