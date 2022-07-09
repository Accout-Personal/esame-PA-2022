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
exports.directorRes = void 0;
var buildRes_1 = require("./buildRes");
// Questa classe permette di restituire le informazioni relative ad una prenotazione.
//Basato sul tipo richiesto dall'utente che ha fatto la prenotazione
var directorRes = /** @class */ (function () {
    function directorRes() {
    }
    // Metodo che costruisce la risposta
    directorRes.respose = function (res, value, tipo) {
        if (tipo === void 0) { tipo = 'json'; }
        return __awaiter(this, void 0, void 0, function () {
            var Prenotazione, Response, _a, Stream, stream_1, Result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Prenotazione = value;
                        Response = new buildRes_1.buildRes();
                        _a = tipo.toLowerCase();
                        switch (_a) {
                            case 'qrcode': return [3 /*break*/, 1];
                            case 'pdf': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 6];
                    case 1: return [4 /*yield*/, Response.ProduceInfo(value)];
                    case 2:
                        _b.sent();
                        Stream = Response.ProduceQRCodeImmagine(value.uuid);
                        res.set('content-type', "image/png");
                        Stream.pipe(res);
                        return [3 /*break*/, 8];
                    case 3:
                        stream_1 = res.writeHead(200, {
                            'Content-type': 'application/pdf',
                            'Content-Disittion': 'attachment;filename=infoAppuntamento.pdf'
                        });
                        return [4 /*yield*/, Response.ProduceInfo(value)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, Response.ProduceQRCodeBuffer(value.uuid)];
                    case 5:
                        _b.sent();
                        Response.ProducePDFeStream(function (chunk) { return stream_1.write(chunk); }, function () { return stream_1.end(); });
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, Response.ProduceInfo(value)];
                    case 7:
                        _b.sent();
                        Result = Response.getResult();
                        console.log(Result);
                        res.status(200).send({ "message": "prenotato con successo", "info": Result });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return directorRes;
}());
exports.directorRes = directorRes;
