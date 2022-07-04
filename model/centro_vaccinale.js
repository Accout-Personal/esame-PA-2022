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
exports.Centro_vaccinale = void 0;
var _a = require('sequelize'), Sequelize = _a.Sequelize, Model = _a.Model, DataTypes = _a.DataTypes;
/**
 *  Classe model che rappresenta la tabella 'centro_vaccinale' nel database
 */
var Centro_vaccinale = /** @class */ (function () {
    function Centro_vaccinale(sequelize) {
        //nel costruttore vado a definire la struttura della tabella usando sequelize,
        // questo model mi permette di compiere varie operazioni 
        this.centro_vaccinale = sequelize.define("centro_vaccinale", {
            id: {
                type: DataTypes.BIGINT(20),
                autoIncrement: true,
                primaryKey: true
            },
            lati: { type: DataTypes.DOUBLE },
            longi: { type: DataTypes.DOUBLE },
            nome: { type: DataTypes.STRING },
            maxf1: { type: DataTypes.INTEGER },
            maxf2: { type: DataTypes.INTEGER }
        }, {
            tableName: 'centro_vaccinale',
            timestamps: false
        });
    }
    Centro_vaccinale.prototype.getProxyModel = function () {
        return this;
    };
    // Metodo per inserire un nuovo centro centro vaccinale
    Centro_vaccinale.prototype.insertNewCV = function (lati, longi, nome, maxf1, maxf2) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.centro_vaccinale.create({ lati: lati, longi: longi, nome: nome, maxf1: maxf1, maxf2: maxf2 })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, error_1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Metodo per ottenere il modello
    Centro_vaccinale.prototype.getModel = function () {
        return this.centro_vaccinale;
    };
    // Metodo per ottenere tutti i centri vaccinali
    /*  async getAll():Promise<any>{
        try {
          let result = await this.centro_vaccinale.findAll()
          return result;
        } catch (error) {
          return error;
        }
      }*/
    //Metodo per ottenere determinati centri vaccinali 
    Centro_vaccinale.prototype.getSpecificCV = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                query = this.centro_vaccinale.findAll({
                    attributes: ['id', 'maxf1', 'maxf2'],
                    where: {
                        id: id
                    }
                });
                return [2 /*return*/, query];
            });
        });
    };
    return Centro_vaccinale;
}());
exports.Centro_vaccinale = Centro_vaccinale;
