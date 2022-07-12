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
exports.Prenotazione = void 0;
var _a = require('sequelize'), Sequelize = _a.Sequelize, Model = _a.Model, DataTypes = _a.DataTypes;
var centro_vaccinale_1 = require("./centro_vaccinale");
var users_1 = require("./users");
var vaccino_1 = require("./vaccino");
var luxon_1 = require("luxon");
/**
 *  Classe model che rappresenta la tabella 'prenotazione' nel database
 */
var Prenotazione = /** @class */ (function () {
    function Prenotazione(sequelize) {
        //nel costruttore vado a definire la struttura della tabella usando sequelize,
        // questo model mi permette di compiere varie operazioni 
        this.userModel = new users_1.Users(sequelize).getModel();
        this.centro_vaccinaleModel = new centro_vaccinale_1.Centro_vaccinale(sequelize).getModel();
        this.vaccinoModel = new vaccino_1.Vaccini(sequelize).getModel();
        this.prenotazione = sequelize.define("prenotazione", {
            id: {
                type: DataTypes.BIGINT(20),
                autoIncrement: true,
                primaryKey: true
            },
            data: { type: DataTypes.DATEONLY },
            fascia: { type: DataTypes.INTEGER },
            slot: { type: DataTypes.INTEGER },
            centro_vac_id: {
                type: DataTypes.BIGINT(20),
                references: {
                    model: this.centro_vaccinaleModel,
                    key: 'id'
                }
            },
            vaccinoid: {
                type: DataTypes.BIGINT(20),
                references: {
                    model: this.vaccinoModel,
                    key: 'id'
                }
            },
            userid: {
                type: DataTypes.BIGINT(20),
                references: {
                    model: this.userModel,
                    key: 'id'
                }
            },
            stato: { type: DataTypes.BIGINT(20), defaultValue: 0 },
            uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 }
        }, {
            tableName: 'prenotazione',
            timestamps: false
        });
    }
    // metodo per inserire una prenotazione
    Prenotazione.prototype.insertNewElement = function (Input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.create({
                            data: luxon_1.DateTime.fromISO(Input.data).toISODate(),
                            fascia: Input.fascia,
                            slot: Input.slot,
                            centro_vac_id: Input.centro_vaccino,
                            vaccinoid: Input.vaccino,
                            userid: Input.user
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo usato per cambiare lo stato della prenotazione in accettato
    Prenotazione.prototype.confirmUUID = function (uuid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.update({ stato: 1 }, {
                            where: {
                                uuid: uuid
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo usato per effettuare una modifica di una prenotazione
    Prenotazione.prototype.modifica = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.update(value.updatebody, {
                            where: {
                                id: value.id
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // metodo per inserire una prenotazione
    Prenotazione.prototype.cancellaPre = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.destroy({
                            where: {
                                id: id,
                                userid: user
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo usato per prendere tutte le prenotazioni di un utente
    Prenotazione.prototype.getPreUser = function (userid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.findAll({
                            where: {
                                userid: userid
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo per prendere tutte le prenotazioni di centro vaccinale per una certa data
    Prenotazione.prototype.getPreCentro = function (centro, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.findAll({
                            where: {
                                centro_vac_id: centro,
                                data: data
                            },
                            include: ["user", "vaccino"]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //metodo per restituire informazioni della prenotazione
    Prenotazione.prototype.getInfo = function (uuid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.findOne({
                            where: {
                                uuid: uuid
                            },
                            include: ['user', 'vaccino']
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo per ottenere il modello
    Prenotazione.prototype.getModel = function () {
        return this.prenotazione;
    };
    // Metodo per ottenere una prenotazione specifica
    Prenotazione.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.findOne({ where: { id: id } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo per impostare le prenotazioni come 'non andate a buon fine'
    Prenotazione.prototype.setBadPrenotations = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBadPrenotation(data)];
                    case 1:
                        list = _a.sent();
                        list = list.map(function (value) {
                            return value.dataValues.id;
                        });
                        return [4 /*yield*/, this.prenotazione.update({ stato: 2 }, {
                                where: {
                                    id: list
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Metodo che restituisce tutte le prenotazioni che non sono andate a buon fine, prende in input una data, un booleano, che modifica la query e un centro vaccinale.
    Prenotazione.prototype.getBadPrenotation = function (data, option, id) {
        if (option === void 0) { option = true; }
        return __awaiter(this, void 0, void 0, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!option) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prenotazione.findAll({
                                attributes: ['id', 'data'],
                                where: {
                                    data: data,
                                    stato: 0
                                }
                            })];
                    case 1:
                        list = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.prenotazione.findAndCountAll({
                            attributes: ['centro_vac_id', 'data'],
                            where: {
                                centro_vac_id: id,
                                data: data,
                                stato: 2
                            },
                            group: ['centro_vac_id', 'data']
                        })];
                    case 3:
                        list = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, list];
                }
            });
        });
    };
    // Metodo per ottenere le statistiche sui centri vaccinali e sulle prenotazioni che hanno avuto esito positivo
    Prenotazione.prototype.getStatisticPositive = function (asc) {
        return __awaiter(this, void 0, void 0, function () {
            var positiveResult, allResult, statistic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.findAndCountAll({
                            attributes: ['centro_vac_id', 'stato'],
                            where: { stato: 1 },
                            group: ['centro_vac_id', 'stato']
                        })];
                    case 1:
                        positiveResult = _a.sent();
                        return [4 /*yield*/, this.prenotazione.findAndCountAll({
                                attributes: ['centro_vac_id'],
                                group: ['centro_vac_id']
                            })];
                    case 2:
                        allResult = _a.sent();
                        statistic = positiveResult.count.map(function (value) {
                            allResult.count.map(function (val) {
                                if (value.centro_vac_id == val.centro_vac_id) {
                                    value.media = (value.count / val.count).toFixed(2);
                                }
                            });
                            return value;
                        });
                        // Qui andiamo ad effettuare l'ordinamento del risultato finale
                        if (asc)
                            statistic.sort(function (a, b) {
                                return a.media - b.media;
                            });
                        else
                            statistic.sort(function (a, b) {
                                return b.media - a.media;
                            });
                        return [2 /*return*/, statistic];
                }
            });
        });
    };
    // Metodo che restituisce, per ogni centro vaccinale, per ogni fascia, e, per ogni data, il numero di prenotazioni, più gli altri attributi
    Prenotazione.prototype.takeNumberOfPrenotation = function (fascia) {
        return __awaiter(this, void 0, void 0, function () {
            var result, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fascia) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prenotazione.findAndCountAll({
                                attributes: ['centro_vac_id', 'data', 'fascia'],
                                group: ['centro_vac_id', 'data', 'fascia']
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.count];
                    case 2: return [4 /*yield*/, this.prenotazione.findAndCountAll({
                            attributes: ['centro_vac_id', 'data'],
                            group: ['centro_vac_id', 'data']
                        })];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result.count];
                }
            });
        });
    };
    // Metodo che ritorna tutte le prenotazioni effettuate per una certa data, in un certo centro vaccinale e per una certa fascia
    Prenotazione.prototype.getSlotFull = function (id, data, fascia) {
        return __awaiter(this, void 0, void 0, function () {
            var query, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof fascia === 'undefined')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prenotazione.findAll({
                                attributes: ['data', 'slot'],
                                where: {
                                    centro_vac_id: id,
                                    data: data
                                }
                            })];
                    case 1:
                        query = _a.sent();
                        return [2 /*return*/, query];
                    case 2: return [4 /*yield*/, this.prenotazione.findAll({
                            attributes: ['data', 'slot'],
                            where: {
                                centro_vac_id: id,
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
    return Prenotazione;
}());
exports.Prenotazione = Prenotazione;
