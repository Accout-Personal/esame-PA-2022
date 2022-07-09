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
exports.buildRes = void 0;
var proxyUs_1 = require("../../model/Proxymodel/proxyUs");
var proxyCV_1 = require("../../model/Proxymodel/proxyCV");
var slotTotime_1 = require("../../util/slotTotime");
var stream_1 = require("stream");
var QRCode = require("qrcode");
var startPDF_1 = require("../../util/startPDF");
// Questa è la classe di builder usata per costruire la risposta ad una prenotazione
var buildRes = /** @class */ (function () {
    function buildRes() {
    }
    // Questo metodo prende le informazioni di interesse
    buildRes.prototype.ProduceInfo = function (Values) {
        return __awaiter(this, void 0, void 0, function () {
            var user, centro;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new proxyUs_1.proxyUs().getUserByID(Values.userid)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, new proxyCV_1.proxyCV().getCentro(Values.centro_vac_id)];
                    case 2:
                        centro = _a.sent();
                        this.Info = { uuid: Values.uuid, data: Values.data, ora: (0, slotTotime_1.slotToTime)(Values.slot), presso: centro.nome, cf: user.cf };
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    // Questo metodo produce il QRcode che viene restituito all'utente
    buildRes.prototype.ProduceQRCodeImmagine = function (uuid) {
        var qrStream = new stream_1.PassThrough();
        QRCode.toFileStream(qrStream, uuid, {
            type: 'png',
            width: 500,
            errorCorrectionLevel: 'H'
        });
        return qrStream;
    };
    ;
    // Questo metodo restituisce il QRcode che viene successivamente inserito all'interno del PDF
    buildRes.prototype.ProduceQRCodeBuffer = function (uuid) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, QRCode.toBuffer(uuid, {
                                type: 'png',
                                width: 500,
                                errorCorrectionLevel: 'H'
                            })];
                    case 1:
                        _a.QrImage = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Questo metodo restituisce il pdf completo di una prenotazione, al suo interno contiene il QRcode, più altre informazioni
    buildRes.prototype.ProducePDFeStream = function (dataCallback, endCallBack) {
        var doc = (0, startPDF_1.generatePDF)();
        //Callback per stream di express
        doc.on('data', dataCallback);
        doc.on('end', endCallBack);
        //Scrittura del documento.
        doc.font('OpenSans', 25).text('Informazione della prenotazione vaccino', 50, 10);
        doc.image(this.QrImage, {
            align: 'left',
            valign: 'top'
        });
        doc.font('OpenSans', 16);
        doc.text('data : ' + this.Info.data + ' alle ore: ' + this.Info.ora);
        doc.text('presso: ' + this.Info.presso);
        doc.text('C.F.: ' + this.Info.cf);
        doc.text('uuid: ' + this.Info.uuid);
        //doc.addPage().fontSize(30).text('Titolo della pagina 2', 175, 50);
        doc.end();
    };
    ;
    // Metodo che restituisce il risultato
    buildRes.prototype.getResult = function () {
        return { info: this.Info, QRCode: this.QrImage };
    };
    ;
    return buildRes;
}());
exports.buildRes = buildRes;
