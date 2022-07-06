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
            centro_vac: {
                type: DataTypes.BIGINT(20),
                references: {
                    model: this.centro_vaccinaleModel,
                    key: 'id'
                }
            },
            vaccino: {
                type: DataTypes.BIGINT(20),
                references: {
                    model: this.vaccinoModel,
                    key: 'id'
                }
            },
            user: {
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
    Prenotazione.prototype.insertNewPr = function (data, fascia, slot, centro_vaccino, vaccino, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.create({
                            data: luxon_1.DateTime.fromISO(data).toISODate(),
                            fascia: fascia,
                            slot: slot,
                            centro_vac: centro_vaccino,
                            vaccino: vaccino,
                            user: user
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Prenotazione.prototype.modifica = function (id, updatebody) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.update(updatebody, {
                            where: {
                                id: id
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // metodo per inserire una prenotazione
    Prenotazione.prototype["delete"] = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.destroy({
                            where: { id: id }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Prenotazione.prototype.getPreUser = function (userid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.findAll({
                            where: {
                                user: userid
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Prenotazione.prototype.getPreCentro = function (centro, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prenotazione.findAll({
                            where: {
                                centro_vac: centro,
                                data: data
                            }
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
    return Prenotazione;
}());
exports.Prenotazione = Prenotazione;
