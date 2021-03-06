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
exports.proxyCV = void 0;
var centro_vaccinale_1 = require("../centro_vaccinale");
var sequelize_1 = require("../../config/sequelize");
var stringsanitizer_1 = require("../../util/stringsanitizer");
var prenotazione_1 = require("../prenotazione");
// Nel proxy andiamo a implementare tutti i controlli e le sanificazioni sui dati di input per evitare problemi e crash del sistema
var proxyCV = /** @class */ (function () {
    function proxyCV() {
        this.model = new centro_vaccinale_1.Centro_vaccinale(sequelize_1.DBConnection.getInstance().getConnection());
        this.modelPR = new prenotazione_1.Prenotazione(sequelize_1.DBConnection.getInstance().getConnection());
    }
    // Metodo per inserire un nuovo centro vaccinale
    proxyCV.prototype.insertNewElement = function (Input) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Input.nome = (0, stringsanitizer_1.stringSanitizer)(Input.nome);
                        //Qui andiamo a sanificare i dati inseriti dall'utente
                        this.TypeCheckLati(Input.lati);
                        this.TypeCheckLongi(Input.longi);
                        this.TypeCheckNome(Input.nome);
                        this.TypeCheckMaxf1(Input.maxf1);
                        this.TypeCheckMaxf2(Input.maxf2);
                        return [4 /*yield*/, this.model.insertNewElement({ lati: Input.lati, longi: Input.longi, nome: Input.nome, maxf1: Input.maxf1, maxf2: Input.maxf2 })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // Metodo per ottenere un centro vaccinale passando l'id
    proxyCV.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.findOne(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo per sanificare la latitudine e longitudine
    proxyCV.prototype.TypeCheckLati = function (lati) {
        if (typeof lati !== 'number' || isNaN(lati) || !isFinite(lati))
            throw new Error('Questo valore di latitudine non ?? un numero');
        if (lati > 90 || lati < -90)
            throw new Error('Questo valore di latitudine non ?? valido');
        return true;
    };
    // Metodo per sanificare la latitudine e longitudine
    proxyCV.prototype.TypeCheckLongi = function (lati) {
        if (typeof lati !== 'number' || isNaN(lati) || !isFinite(lati))
            throw new Error('Questo valore di longitudine non ?? un numero');
        if (lati > 180 || lati < -180)
            throw new Error('Questo valore di longitudine non ?? valido');
        return true;
    };
    // Metodo per sanificare il nome del centro vaccinale
    proxyCV.prototype.TypeCheckNome = function (nome) {
        if (typeof nome !== 'string' || nome.length > 255)
            throw new Error('Questo nome non ?? composto da lettere');
        return true;
    };
    // Metodo per sanificare il numero massimo di vaccinazioni che il centro puo' fare durante la prima fascia oraria
    proxyCV.prototype.TypeCheckMaxf1 = function (maxf1) {
        if (typeof maxf1 !== 'number' || isNaN(maxf1) || !isFinite(maxf1))
            throw new Error('Il valore usato per maxf1 non ?? corretto');
        if (maxf1 < 0)
            throw new Error('Questo valore di maxf1 non ?? valido');
        return true;
    };
    // Metodo per sanificare il numero massimo di vaccinazioni che il centro puo' fare durante la seconda fascia oraria
    proxyCV.prototype.TypeCheckMaxf2 = function (maxf2) {
        if (typeof maxf2 !== 'number' || isNaN(maxf2) || !isFinite(maxf2))
            throw new Error('Il valore usato per maxf2 non ?? corretto');
        if (maxf2 < 0)
            throw new Error('Questo valore di maxf2 non ?? valido');
        return true;
    };
    proxyCV.prototype.makeRelationship = function () {
        this.model.getModel().hasMany(this.modelPR.getModel(), { foreignKey: 'centro_vac_id' });
        this.modelPR.getModel().belongsTo(this.model.getModel(), { foreignKey: 'centro_vac_id' });
    };
    // Metodo per ottenere il riferimento al model
    proxyCV.prototype.getModel = function () {
        return this.model;
    };
    return proxyCV;
}());
exports.proxyCV = proxyCV;
