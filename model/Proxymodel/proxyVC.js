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
exports.proxyVC = void 0;
var vaccino_1 = require("../vaccino");
var stringsanitizer_1 = require("../../util/stringsanitizer");
var sequelize_1 = require("../../config/sequelize");
// Questa classe rappresenta il proxy per la componente model del vaccino
var proxyVC = /** @class */ (function () {
    function proxyVC() {
        this.model = new vaccino_1.Vaccini(sequelize_1.DBConnection.getInstance().getConnection());
    }
    // Questo metodo serve per inserire un nuovo elemento
    proxyVC.prototype.insertNewElement = function (Input) {
        return __awaiter(this, void 0, void 0, function () {
            var nomesanitized;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nomesanitized = (0, stringsanitizer_1.stringSanitizer)(Input.nome);
                        this.TypeCheckNome(nomesanitized);
                        this.TypeCheckValidita(Input.validita);
                        return [4 /*yield*/, this.model.insertNewElement({ nome: nomesanitized, validita: Input.validita })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo per sanificare il nome del vaccino
    proxyVC.prototype.TypeCheckNome = function (nome) {
        if ((typeof nome !== 'string' || nome.length > 255))
            throw new Error('Questo nome non è valido');
        return true;
    };
    // Metodo per sanificare la validità del vaccino
    proxyVC.prototype.TypeCheckValidita = function (validita) {
        if (typeof validita !== 'number' || isNaN(validita) || !isFinite(validita))
            throw new Error('Questo valore di validità non è un numero');
        if (validita <= 0)
            throw new Error('Questo valore di validità non è valido');
        return true;
    };
    // Metodo che ritorna un vaccino specifico
    proxyVC.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.findOne(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo che ritorna un riferimento al model
    proxyVC.prototype.getModel = function () {
        return this.model;
    };
    return proxyVC;
}());
exports.proxyVC = proxyVC;
