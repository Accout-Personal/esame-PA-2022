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
exports.userPresenter = void 0;
var proxyUs_1 = require("../model/Proxymodel/proxyUs");
var crypto = require("node:crypto");
var jwt = require("jsonwebtoken");
var proxyPR_1 = require("../model/Proxymodel/proxyPR");
var directorRes_1 = require("./builder/directorRes");
var buildCV_1 = require("./builder/buildCV");
var proxyCV_1 = require("../model/Proxymodel/proxyCV");
var luxon_1 = require("luxon");
var slotTotime_1 = require("../util/slotTotime");
// Qui abbiamo il presenter per lo User
var userPresenter = /** @class */ (function () {
    function userPresenter() {
    }
    // Metodo per effettuare il login 
    userPresenter.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var proxy;
            return __generator(this, function (_a) {
                proxy = new proxyUs_1.proxyUs();
                proxy.getUser(req.body.username).then(function (value) {
                    if (value !== null && value.password === crypto.createHash('sha256').update(req.body.password).digest('hex')) {
                        res.send({ token: jwt.sign({ user: { "username": value.username, "tipo": value.tipo, "id": value.id } }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE_TIME }) });
                    }
                    else
                        res.status(401).send({ message: "credenziale invalido" });
                    return;
                })["catch"](function (error) {
                    console.log(error);
                    res.status(401).send({ message: "credenziale invalido" });
                });
                return [2 /*return*/];
            });
        });
    };
    ;
    // Metodo per registrare un nuovo utente
    userPresenter.register = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var proxy;
            return __generator(this, function (_a) {
                proxy = new proxyUs_1.proxyUs();
                proxy.insertNewElement({ cf: req.body.cf,
                    username: req.body.username,
                    password: req.body.password,
                    tipo: 0 }).then(function (value) {
                    if (value) {
                        res.send({ message: "successo." });
                    }
                    else {
                        res.send({ message: "fallito." });
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    ;
    // Metodo per inserire una nuova prenotazione
    userPresenter.prenota = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var Proxy, body, value, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Proxy = new proxyPR_1.proxyPr();
                        body = req.body;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, Proxy.insertNewElement({ data: body.data, slot: body.slot, centro_vaccino: body.centro_vac, vaccino: body.vaccino, user: req.user.user.id })];
                    case 2:
                        value = _a.sent();
                        return [4 /*yield*/, directorRes_1.directorRes.respose(res, value, body.formato)["catch"](function (err) {
                                console.log(err);
                                res.status(400).send({ "errore": err.message });
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log(error_1);
                        res.status(400).send({ "errore": error_1.message });
                        return [3 /*break*/, 5];
                    case 5:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    // Questo metodo serve per modificare una prenotazione
    userPresenter.modificaPre = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var Proxy, body, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Proxy = new proxyPR_1.proxyPr();
                        body = req.body;
                        body.user = req.user.user.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Proxy.modifica(body)];
                    case 2:
                        _a.sent();
                        res.status(200).send({ "message": "modificato con successo" });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.log(error_2);
                        res.status(401).send({ "errore": error_2.message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Questo metodo serve per eliminare una prenotazione
    userPresenter.cancellaPre = function (req, res) {
        var Proxy = new proxyPR_1.proxyPr();
        var body = req.body;
        Proxy.cancellaPre(body.id, req.user.user.id).then(function (value) {
            res.status(200).send({ "message": "cancellato con successo" });
        })["catch"](function (error) {
            console.log(error);
            res.status(401).send({ "errore": error.message });
        });
    };
    //filtro centro per la distanza e disponibilita'
    userPresenter.getCentro = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, user, proxy, builder, result, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = req.body;
                        user = req.user.user.id;
                        proxy = new proxyCV_1.proxyCV();
                        builder = new buildCV_1.buildCV(proxy);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        //disponibilita' falsa, solo distanza
                        if (typeof body.disp !== 'undefined' && typeof body.disp !== 'boolean')
                            throw new Error("il valore della diponibilità non è corretta");
                        if (typeof body.order !== 'undefined' && typeof body.order !== 'boolean')
                            throw new Error("il valore di ordinamento non è corretto");
                        if (!(typeof body.disp === 'undefined' || !body.disp)) return [3 /*break*/, 3];
                        // await builder.producePartA(body.lat, body.long, body.dist, body.order);
                        return [4 /*yield*/, builder.queryAlDB(false)];
                    case 2:
                        // await builder.producePartA(body.lat, body.long, body.dist, body.order);
                        _a.sent();
                        builder.filtraPerDistanza(body.lat, body.long, body.dist);
                        builder.trimdata();
                        builder.ordinamento(body.order);
                        result = builder.getResult();
                        res.send(result);
                        return [3 /*break*/, 5];
                    case 3:
                        //disponibilita'distanza e disponibilita
                        if (typeof body.data === 'undefined')
                            body.data = luxon_1.DateTime.now().toISODate();
                        //await builder.producePartB(body.lat, body.long, body.dist, body.data, body.order);
                        return [4 /*yield*/, builder.queryAlDB(true)];
                    case 4:
                        //await builder.producePartB(body.lat, body.long, body.dist, body.data, body.order);
                        _a.sent();
                        builder.filtraPerDistanza(body.lat, body.long, body.dist);
                        builder.filtraPrenData(body.data);
                        builder.filtraDisponibilita();
                        builder.trimdata();
                        builder.ordinamento(body.order);
                        result = builder.getResult();
                        res.send(result);
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [2 /*return*/, res.status(400).send({ "errore": error_3.message })];
                    case 7:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    //filtro centro per i max 5 giorni
    userPresenter.getSlotsCentro = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, user, proxy, builder, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        body = req.body;
                        user = req.user.user.id;
                        proxy = new proxyCV_1.proxyCV();
                        builder = new buildCV_1.buildCV(proxy);
                        return [4 /*yield*/, builder.getSlotFull(body.centro, body.date, body.fascia)];
                    case 1:
                        _a.sent();
                        builder.setFascia(body.fascia);
                        builder.filtroFascia(body.date);
                        result = builder.getResult();
                        if (body.formato === "ora") {
                            result = result.map(function (v) {
                                v.slotLiberi = v.slotLiberi.map(function (slot) {
                                    return (0, slotTotime_1.slotToTime)(slot);
                                });
                                return v;
                            });
                        }
                        res.send(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        return [2 /*return*/, res.status(400).send({ "errore": error_4.message })];
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    // Questo metodo restituisce le prenotazioni effettuate da un utente
    userPresenter.getMyPre = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var proxy, list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proxy = new proxyPR_1.proxyPr();
                        return [4 /*yield*/, proxy.getListaPr(req.user.user.id)];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, res.send(list)];
                }
            });
        });
    };
    return userPresenter;
}());
exports.userPresenter = userPresenter;
