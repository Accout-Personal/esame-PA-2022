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
exports.adminPresenter = void 0;
var proxyCV_1 = require("../model/Proxymodel/proxyCV");
var proxyVC_1 = require("../model/Proxymodel/proxyVC");
var proxyPR_1 = require("../model/Proxymodel/proxyPR");
var startPDF_1 = require("../util/startPDF");
var slotTotime_1 = require("../util/slotTotime");
// Questa classe implementa il presenter per l'amministratore
var adminPresenter = /** @class */ (function () {
    function adminPresenter() {
    }
    // Questo metodo permette di inserire un nuovo centro vaccinale
    adminPresenter.creaCentroVax = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var centrVax;
            return __generator(this, function (_a) {
                centrVax = new proxyCV_1.proxyCV();
                centrVax.insertNewCV(req.body.lati, req.body.longi, req.body.nome, req.body.maxf1, req.body.maxf2).then(function (value) {
                    if (value instanceof Error) {
                        res.status(401).send(value.message);
                    }
                    else {
                        res.send({ message: "inserimento andatato con successo." });
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    // Questo metodo permette di inserire un nuovo vaccino
    adminPresenter.creaVaccino = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var Vaccini;
            return __generator(this, function (_a) {
                Vaccini = new proxyVC_1.proxyVC();
                Vaccini.insertNewVacc(req.body.name, req.body.validita).then(function (value) {
                    if (value instanceof Error) {
                        res.status(401).send(value.message);
                    }
                    else {
                        res.send({ message: "inserimento andatato con successo." });
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    // Metodo che permette di ricevere un QRcode
    adminPresenter.riceveQRCode = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new proxyPR_1.proxyPr().getPrInfo(req)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, res.send({
                                CF: result.user.cf,
                                data: result.data,
                                ora: (0, slotTotime_1.slotToTime)(result.slot),
                                vaccino: result.vaccino.nome,
                                stato: result.stato
                            })];
                    case 2:
                        error_1 = _a.sent();
                        res.status(400).send({ "message": error_1.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Metodo usato per validare l’utente in fase di accettazione 
    adminPresenter.confermaUUID = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new proxyPR_1.proxyPr().confermatUUID(req)];
                    case 1:
                        _a.sent();
                        res.status(200).send({ message: "confermato con successo" });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        res.status(400).send({ "message": error_2.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Questo metodo ritorna la lista delle prenotazioni di un certo centro vaccinale e per una certa data.
    // Il risultato può essere restituito sotto forma di json o pdf.
    adminPresenter.getListaCentroData = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, proxy, result, centro, stream_1, doc_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = req.body;
                        proxy = new proxyPR_1.proxyPr();
                        if (typeof body.formato === 'undefined')
                            body.formato = 'json';
                        return [4 /*yield*/, proxy.getListaPr(undefined, body.centro, body.data)];
                    case 1:
                        result = _a.sent();
                        result = result.sort(function (a, b) {
                            return a.slot - b.slot;
                        }).map(function (value) {
                            return {
                                slot: (0, slotTotime_1.slotToTime)(value.slot),
                                CF: value.user.cf,
                                vaccino: value.vaccino.nome,
                                uuid: value.uuid
                            };
                        });
                        return [4 /*yield*/, new proxyCV_1.proxyCV().getCentro(body.centro)];
                    case 2:
                        centro = _a.sent();
                        switch (body.formato.toLowerCase()) {
                            case "pdf": {
                                stream_1 = res.writeHead(200, {
                                    'Content-type': 'application/pdf',
                                    'Content-Disittion': 'attachment;filename=invoice.pdf'
                                });
                                doc_1 = (0, startPDF_1.generatePDF)();
                                //Callback per stream di express
                                doc_1.on('data', function (chunk) { return stream_1.write(chunk); });
                                doc_1.on('end', function () { return stream_1.end(); });
                                //Scrittura del documento.
                                doc_1.font('OpenSans', 25).text('Appuntamenti del centro: ' + centro.nome, 50, 10);
                                doc_1.font('OpenSans', 20).text('Del giorno: ' + body.data);
                                doc_1.font('OpenSans', 10);
                                console.log(result);
                                result.forEach(function (element) {
                                    doc_1.text(element.slot + "-----" + element.CF + "-----" + element.vaccino + "-----" + element.uuid);
                                });
                                doc_1.end();
                                break;
                            }
                            case "json": {
                                res.send(result);
                                break;
                            }
                            default: {
                                res.status(401).send({ message: "il formato non e' valido: il formato puo' essere solo di json o pdf" });
                                break;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Metodo per ottenere le statistiche positive di tutti i centri vaccinali
    adminPresenter.getStatCentri = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        body = req.body;
                        return [4 /*yield*/, new proxyPR_1.proxyPr().getStatisticPositive(body.order)];
                    case 1:
                        result = _a.sent();
                        res.send(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(400).send({ message: error_3.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Metodo per ottenere le statistiche negative di un centro vaccinale per un dato giorno
    adminPresenter.getBadStat = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        body = req.body;
                        return [4 /*yield*/, new proxyPR_1.proxyPr().getCountBadPrenotation(body.data, body.id)];
                    case 1:
                        result = _a.sent();
                        res.send(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        res.status(400).send({ message: error_4.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return adminPresenter;
}());
exports.adminPresenter = adminPresenter;
