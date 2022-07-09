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
exports.proxyUs = void 0;
var users_1 = require("../users");
var stringsanitizer_1 = require("../../util/stringsanitizer");
var crypto = require("node:crypto");
var sequelize_1 = require("../../config/sequelize");
// Questo è il proxy per la componente nel model users
var proxyUs = /** @class */ (function () {
    function proxyUs() {
        this.model = new users_1.Users(sequelize_1.DBConnection.getInstance().getConnection());
    }
    // Questo metodo fa una query sulla tabella users del DB, passando come parametro uno username che è chiave
    proxyUs.prototype.getUser = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        username = (0, stringsanitizer_1.stringSanitizer)(username);
                        if (!this.TypeCheckUsername(username)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.model.getModel().findOne({
                                where: {
                                    username: username
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // Questo metodo fa una query sulla tabella users del DB, passando come parametro un id che è chiave primaria
    proxyUs.prototype.getUserByID = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.getModel().findOne({
                            where: {
                                id: id
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Questo metodo serve per inserire un nuovo utente
    proxyUs.prototype.insertNewUsers = function (cf, username, password, tipo) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cf = (0, stringsanitizer_1.stringSanitizer)(cf);
                        username = (0, stringsanitizer_1.stringSanitizer)(username);
                        password = (0, stringsanitizer_1.stringSanitizer)(password);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!
                        // Qui vengono sanificati i parametri di input inseriti dall'utente
                        (this.TypeCheckCF(cf) &&
                            this.TypeCheckUsername(username) &&
                            this.TypeCheckPassword(password) &&
                            this.TypeCheckTipo(tipo))) 
                        // Qui vengono sanificati i parametri di input inseriti dall'utente
                        return [3 /*break*/, 3];
                        return [4 /*yield*/, this.model.insertNewUsers(cf, username, crypto.createHash('sha256').update(password).digest('hex'), tipo)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, error_1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    proxyUs.prototype.getPreUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    // Questo metodo fa un controllo sul codice fiscale inserito dall'utente
    proxyUs.prototype.TypeCheckCF = function (cf) {
        if ((typeof cf !== 'string' || cf.length > 255))
            throw new Error('Questo codice fiscale non è valido');
        return true;
    };
    // Questo metodo fa un controllo sullo username inserito dall'utente
    proxyUs.prototype.TypeCheckUsername = function (username) {
        if ((typeof username !== 'string' || username.length > 255))
            throw new Error('Questo username non è valido');
        return true;
    };
    // Questo metodo fa un controllo sulla password inserita dall'utente
    proxyUs.prototype.TypeCheckPassword = function (password) {
        if ((typeof password !== 'string' || password.length > 255))
            throw new Error('Questa password non è corretta');
        return true;
    };
    // Questo metodo fa un controllo sul tipo inserito dall'utente
    proxyUs.prototype.TypeCheckTipo = function (tipo) {
        if (typeof tipo !== 'number' || isNaN(tipo) || !isFinite(tipo))
            throw new Error('Questo valore non è un numero');
        return true;
    };
    return proxyUs;
}());
exports.proxyUs = proxyUs;
