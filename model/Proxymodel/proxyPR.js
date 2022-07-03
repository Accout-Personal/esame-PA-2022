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
var proxyPr = /** @class */ (function () {
    function proxyPr() {
        this.model = new prenotazione_1.Prenotazione(sequelize_1.DBConnection.getInstance().getConnection());
        this.modelV = new vaccino_1.Vaccini(sequelize_1.DBConnection.getInstance().getConnection());
        this.modelU = new users_1.Users(sequelize_1.DBConnection.getInstance().getConnection());
        this.modelCV = new centro_vaccinale_1.Centro_vaccinale(sequelize_1.DBConnection.getInstance().getConnection());
    }
    proxyPr.prototype.insertNewPr = function (data, fascia, slot, centro_vaccino, vaccino, user, stato) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.TypeCheckData(data);
                        this.TypeCheckFascia(fascia);
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
                        this.TypeCheckStato(stato);
                        return [4 /*yield*/, this.model.insertNewPr(data, fascia, slot, centro_vaccino, vaccino, user, stato)];
                    case 4: return [2 /*return*/, _a.sent()];
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
    proxyPr.prototype.TypeCheckData = function (data) {
        var dataIns = luxon_1.DateTime.fromISO(data);
        if ((typeof data !== 'string' || !dataIns.isValid))
            throw new Error('Questa data non è valida');
        return true;
    };
    proxyPr.prototype.TypeCheckFascia = function (fascia) {
        if (typeof fascia !== 'number' || isNaN(fascia))
            throw new Error('Questa fascia non è valida');
        if (fascia > 2)
            throw new Error('Questa fascia non è valida');
        return true;
    };
    proxyPr.prototype.TypeCheckSlot = function (slot) {
        if (typeof slot !== 'number' || isNaN(slot))
            throw new Error('Questa slot non è valido');
        if (slot > 37)
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
                        if (typeof user !== 'number' || isNaN(user))
                            throw new Error('Questo utente non è valido');
                        return [4 /*yield*/, this.modelU.getModel().findAll({
                                where: {
                                    id: user
                                }
                            })];
                    case 1:
                        test = _a.sent();
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
    proxyPr.prototype.takeNumberOfPrenotation = function (check) {
        return __awaiter(this, void 0, void 0, function () {
            var result, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!check) return [3 /*break*/, 2];
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
    return proxyPr;
}());
exports.proxyPr = proxyPr;
