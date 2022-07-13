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
exports.proxyPr = void 0;
var prenotazione_1 = require("../prenotazione");
var vaccino_1 = require("../vaccino");
var users_1 = require("../users");
var centro_vaccinale_1 = require("../centro_vaccinale");
var sequelize_1 = require("../../config/sequelize");
var luxon_1 = require("luxon");
var stringsanitizer_1 = require("../../util/stringsanitizer");
var qrCode = require("qrcode-reader");
var Jimp = require("jimp");
// Classe che implementa il proxy per la componente prenotazione nel model
var proxyPr = /** @class */ (function () {
    // Nel costruttore andiamo a inizializzare tutti i model necessari per lavorare con le prenotazioni
    function proxyPr() {
        this.model = new prenotazione_1.Prenotazione(sequelize_1.DBConnection.getInstance().getConnection());
        this.modelV = new vaccino_1.Vaccini(sequelize_1.DBConnection.getInstance().getConnection());
        this.modelU = new users_1.Users(sequelize_1.DBConnection.getInstance().getConnection());
        this.modelCV = new centro_vaccinale_1.Centro_vaccinale(sequelize_1.DBConnection.getInstance().getConnection());
    }
    //Metodo per inserire una nuova prenotazione
    proxyPr.prototype.insertNewElement = function (Input) {
        return __awaiter(this, void 0, void 0, function () {
            var fascia;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Input.data = (0, stringsanitizer_1.stringSanitizer)(Input.data);
                        //controllo il tipo di dato sia valido
                        this.TypeCheckData(Input.data);
                        this.TypeCheckSlot(Input.slot);
                        return [4 /*yield*/, this.TypeCheckCV(Input.centro_vaccino)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.TypeCheckVaccino(Input.vaccino)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.TypeCheckUser(Input.user)];
                    case 3:
                        _a.sent();
                        if (Input.slot > 16 && fascia == 1) {
                            fascia = 2;
                        }
                        else {
                            fascia = 1;
                        }
                        return [4 /*yield*/, this.checkAvailability(Input.data, Input.centro_vaccino, fascia)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.checkSlot(Input.data, Input.centro_vaccino, Input.slot)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.checkVaxValidity(Input.data, Input.vaccino, Input.user)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.model.insertNewElement({ data: Input.data, fascia: fascia, slot: Input.slot, centro_vaccino: Input.centro_vaccino, vaccino: Input.vaccino, user: Input.user })];
                    case 7: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo usato per recuperare informazioni relative ad una prenotazione, utilizzando il codice uuid
    proxyPr.prototype.getPrInfo = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var uuid, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.decodeUUID(req)];
                    case 1:
                        uuid = _a.sent();
                        this.makeRelationship();
                        return [4 /*yield*/, this.checkUUID(uuid)];
                    case 2:
                        result = _a.sent();
                        if (result === null)
                            throw Error("codice sconosciuto");
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // Metodo usato per confermare il codice uuid e lo stato della prenotazione
    proxyPr.prototype.confermatUUID = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var uuid, res, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.decodeUUID(req)];
                    case 1:
                        uuid = _a.sent();
                        this.makeRelationship();
                        return [4 /*yield*/, this.checkUUID(uuid)];
                    case 2:
                        res = _a.sent();
                        if (res === null)
                            throw Error("codice uuid non valido");
                        if (res.stato == 1)
                            throw Error("questo appuntamento e' gia confermato");
                        return [4 /*yield*/, this.model.confirmUUID(uuid)];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Metodo utilizzato per ottenere una lista di prenotazioni, passando come parametri, uno user id, un centro vaccinale, e una data.
    // I parametri sono opzionali, il risultato del metodo cambia a seconda dei parametri passati
    proxyPr.prototype.getListaPr = function (userid, centro, data) {
        return __awaiter(this, void 0, void 0, function () {
            var datasanitized;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasanitized = (0, stringsanitizer_1.stringSanitizer)(data);
                        if (!(typeof centro !== 'undefined' || typeof datasanitized !== 'undefined')) return [3 /*break*/, 2];
                        if (typeof (datasanitized) !== 'string' || !(luxon_1.DateTime.fromISO(datasanitized).isValid) || luxon_1.DateTime.now() > luxon_1.DateTime.fromISO(datasanitized))
                            throw new Error('La data che hai inserito non è corretta');
                        return [4 /*yield*/, this.TypeCheckCV(centro)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (typeof userid === "undefined" && typeof centro === "undefined")
                            throw Error("non hai inserito nessun paramentro");
                        if (!(typeof userid === "undefined")) return [3 /*break*/, 4];
                        this.TypeCheckDataListaPrenotazione(datasanitized);
                        this.makeRelationship();
                        return [4 /*yield*/, this.model.getPreCentro(centro, datasanitized)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        this.TypeCheckUser(userid);
                        return [4 /*yield*/, this.model.getPreUser(userid)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //costruisce relazioni utilizzati tra le tabelle utilizzati
    proxyPr.prototype.makeRelationship = function () {
        this.modelU.getModel().hasMany(this.model.getModel(), { foreignKey: 'userid' });
        this.model.getModel().belongsTo(this.modelU.getModel(), { foreignKey: 'userid' });
        this.modelV.getModel().hasMany(this.model.getModel(), { foreignKey: 'vaccinoid' });
        this.model.getModel().belongsTo(this.modelV.getModel(), { foreignKey: 'vaccinoid' });
        this.modelCV.getModel().hasMany(this.model.getModel(), { foreignKey: 'centro_vac_id' });
        this.model.getModel().belongsTo(this.modelCV.getModel(), { foreignKey: 'centro_vac_id' });
    };
    // Metodo usato per cancellare una prenotazione
    proxyPr.prototype.cancellaPre = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkPreIDStato(id, user)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.model.cancellaPre(id, user)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo per effettuare una modifica ad una prenotazione
    proxyPr.prototype.modifica = function (updateBody) {
        return __awaiter(this, void 0, void 0, function () {
            var oldPr, safeBody, sanitizedData, data, centro, fascia;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.TypeCheckUser(updateBody.user)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.checkPreIDStato(updateBody.id, updateBody.user)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.findOne(updateBody.id)];
                    case 3:
                        oldPr = _a.sent();
                        if (typeof oldPr === "undefined" || oldPr === null) {
                            throw Error("Questo appuntamento e' inesistente");
                        }
                        safeBody = {};
                        if (typeof updateBody.data !== "undefined") {
                            sanitizedData = (0, stringsanitizer_1.stringSanitizer)(updateBody.data);
                            this.TypeCheckData(sanitizedData);
                            safeBody.data = sanitizedData;
                        }
                        if (typeof updateBody.slot !== "undefined") {
                            this.TypeCheckSlot(updateBody.slot);
                            safeBody.slot = updateBody.slot;
                            safeBody.fascia = safeBody.slot > 16 ? 2 : 1;
                        }
                        if (typeof updateBody.centro_vac !== "undefined") {
                            this.TypeCheckCV(updateBody.centro_vac);
                            safeBody.centro_vac_id = updateBody.centro_vac;
                        }
                        if (!(typeof updateBody.vaccino !== "undefined")) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.TypeCheckVaccino(updateBody.vaccino)];
                    case 4:
                        _a.sent();
                        safeBody.vaccinoid = updateBody.vaccino;
                        return [3 /*break*/, 6];
                    case 5:
                        safeBody.vaccinoid = oldPr.vaccinoid;
                        _a.label = 6;
                    case 6:
                        data = safeBody.data ? safeBody.data : oldPr.data;
                        centro = safeBody.centro_vac_id ? safeBody.centro_vac_id : oldPr.centro_vac_id;
                        fascia = safeBody.fascia ? safeBody.fascia : oldPr.fascia;
                        if (!((typeof updateBody.slot !== 'undefined' && updateBody.slot !== oldPr.slot) || (typeof updateBody.data !== 'undefined' && updateBody.data !== oldPr.data) || (typeof updateBody.centro_vac !== 'undefined' && updateBody.centro_vac !== oldPr.centro_vac_id))) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.checkSlot(data, centro, safeBody.slot ? safeBody.slot : oldPr.slot)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!(oldPr.data != safeBody.data || oldPr.fascia != safeBody.fascia || (typeof updateBody.centro_vac !== 'undefined' && updateBody.centro_vac !== oldPr.slot))) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.checkAvailability(data, centro, fascia)];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [4 /*yield*/, this.checkVaxValidity(data, safeBody.vaccinoid, updateBody.user, updateBody.id)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.model.modifica({ id: updateBody.id, updatebody: safeBody })];
                    case 12: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo usato per decodificare il codice uuid quando viene passato sotto forma di QRcode. Questo codice può essere inviato anche tramite json
    proxyPr.prototype.decodeUUID = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var uuid, img, image, qrcode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof req.file !== 'undefined')) return [3 /*break*/, 2];
                        img = req.file.buffer;
                        return [4 /*yield*/, Jimp.read(img)];
                    case 1:
                        image = _a.sent();
                        qrcode = new qrCode();
                        qrcode.callback = function (err, value) {
                            if (err) {
                                throw new Error("qr code sconosciuto");
                            }
                            uuid = value.result;
                        };
                        // Decoding the QR code
                        qrcode.decode(image.bitmap);
                        return [3 /*break*/, 3];
                    case 2:
                        //Legge dalla json
                        uuid = req.body.uuid;
                        _a.label = 3;
                    case 3: return [2 /*return*/, uuid];
                }
            });
        });
    };
    // Metodo usato per controllare l'appartenenza di una prenotazione
    proxyPr.prototype.checkPreIDStato = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof id !== 'number' || isNaN(id))
                            throw new Error('Id non è valido');
                        return [4 /*yield*/, this.model.getModel().count({
                                where: {
                                    id: id,
                                    userid: user,
                                    stato: 0
                                }
                            })];
                    case 1:
                        result = _a.sent();
                        if (result < 1)
                            throw Error("informazione non e' valido");
                        return [2 /*return*/];
                }
            });
        });
    };
    // Questo metodo serve per controllare se l'utente si sta prenotando per un vaccino che non gli è mai stato sommistrato.
    // Oppure, se si sta prenotando ad un vaccino già ricevuto, pero', dopo il relativo periodo di validità.
    proxyPr.prototype.checkVaxValidity = function (data, vaccino, user, excludeid) {
        return __awaiter(this, void 0, void 0, function () {
            var DataPre, queryBody, AllVax, Vaccino, LowerBound, UpperBound, InRangeVax;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        DataPre = luxon_1.DateTime.fromISO(data);
                        queryBody = {
                            userid: user,
                            vaccinoid: vaccino,
                            stato: [0, 1]
                        };
                        return [4 /*yield*/, this.model.getModel().findAll({
                                where: queryBody,
                                order: [['data', 'DESC']]
                            })];
                    case 1:
                        AllVax = _a.sent();
                        // Devo escludere la prenotazione attuale, durante la modifica, per escludere il controllo sul periodo di validità del vaccino
                        if (typeof excludeid !== 'undefined') {
                            AllVax = AllVax.filter(function (element) {
                                return element.id != excludeid;
                            });
                        }
                        //mai vaccinato
                        if (JSON.parse(JSON.stringify(AllVax)).length == 0) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.modelV.getModel().findOne({ where: { id: vaccino }, query: { raw: true } })];
                    case 2:
                        Vaccino = _a.sent();
                        LowerBound = DataPre.minus({ day: Vaccino.validita });
                        UpperBound = DataPre.plus({ day: Vaccino.validita });
                        InRangeVax = AllVax.filter(function (Prenotazione) {
                            var date = luxon_1.DateTime.fromISO(Prenotazione.data);
                            return LowerBound < date && date < UpperBound;
                        });
                        if (JSON.parse(JSON.stringify(InRangeVax)).length > 0) {
                            throw new Error("il vaccino è ancora effettivo");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Metodo per controllare se lo slot è occupato
    proxyPr.prototype.checkSlot = function (data, centro, slot) {
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.getModel().count({
                            where: {
                                data: data,
                                centro_vac_id: centro,
                                slot: slot
                            }
                        })];
                    case 1:
                        count = _a.sent();
                        if (count > 0) {
                            throw Error("slot e' gia occupato.");
                        }
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    // Metodo per controllare se una fascia ha ancora slot liberi
    proxyPr.prototype.checkAvailability = function (dataAppuntamento, centro, fasciaOraria) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPRCentroFascia(dataAppuntamento, centro, fasciaOraria)];
                    case 1:
                        res = _a.sent();
                        //se e' undefined implica che la data e la fascia selezionata non e' prenotata da nessuno
                        if (typeof res.count != "undefined") {
                            if (res.count >= res.centro["maxf" + fasciaOraria]) {
                                throw Error("la fascia oraria e' piena");
                            }
                        }
                        else {
                            if (res.centro["maxf" + fasciaOraria] < 1) {
                                throw Error("la fascia oraria e' piena");
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //Metodo che ritorna il numero di prenotazioni di un dato centro vaccinale in una certa data
    proxyPr.prototype.getPRCentroFascia = function (dataAppuntamento, centro, fasciaOraria) {
        return __awaiter(this, void 0, void 0, function () {
            var list, centro_vac, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.takeNumberOfPrenotation(true)];
                    case 1:
                        list = _a.sent();
                        centro_vac = this.modelCV.getModel().findOne({
                            where: {
                                id: centro
                            },
                            query: { raw: true }
                        });
                        res = list.find(function (_a) {
                            var data = _a.data, centro_vac = _a.centro_vac, fascia = _a.fascia;
                            data === dataAppuntamento && centro_vac === centro && fascia === fasciaOraria;
                        });
                        if (typeof res === 'undefined')
                            return [2 /*return*/, { count: undefined, centro: centro_vac }];
                        else
                            return [2 /*return*/, { count: res.length, centro: centro_vac }];
                        return [2 /*return*/];
                }
            });
        });
    };
    // Metodo usato per controllare un codice uuid
    proxyPr.prototype.checkUUID = function (uuid) {
        return __awaiter(this, void 0, void 0, function () {
            var sanitized;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sanitized = (0, stringsanitizer_1.stringSanitizer)(uuid);
                        if (typeof sanitized === 'undefined')
                            throw Error("codice sconosciuto");
                        if (sanitized.length != 36)
                            throw Error("codice sconosciuto");
                        return [4 /*yield*/, this.model.getModel().findOne({
                                where: {
                                    uuid: sanitized
                                },
                                include: ["user", "vaccino"]
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo per effettuare controlli sulla data
    proxyPr.prototype.TypeCheckDataListaPrenotazione = function (data) {
        var sanitizeddata = (0, stringsanitizer_1.stringSanitizer)(data);
        var dataIns = luxon_1.DateTime.fromISO(sanitizeddata);
        if ((typeof sanitizeddata !== 'string' || !dataIns.isValid))
            throw new Error('Questa data non è valida');
        return true;
    };
    // Metodo per effettuare controlli sulla data
    proxyPr.prototype.TypeCheckData = function (data) {
        var sanitizeddata = (0, stringsanitizer_1.stringSanitizer)(data);
        var dataIns = luxon_1.DateTime.fromISO(sanitizeddata);
        var dataNow = luxon_1.DateTime.now();
        if ((typeof sanitizeddata !== 'string' || !dataIns.isValid))
            throw new Error('Questa data non è valida');
        if ((dataIns < dataNow))
            throw new Error("Puoi prenotare solo in un dato futuro.");
        return true;
    };
    // Metodo usato per effettuare dei controlli sullo slot inserito dall'utente
    proxyPr.prototype.TypeCheckSlot = function (slot) {
        if (typeof slot !== 'number' || isNaN(slot))
            throw new Error('Questa slot non è valido');
        if (slot > 36 || slot < 1)
            throw new Error('Questa fascia non è valida');
        return true;
    };
    // Metodo usato per effettuare dei controlli sul centro vaccinale inserito dall'utente
    proxyPr.prototype.TypeCheckCV = function (Cv) {
        return __awaiter(this, void 0, void 0, function () {
            var test;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof Cv !== 'number' || isNaN(Cv))
                            throw new Error('Questo centro vaccino non è valido');
                        return [4 /*yield*/, this.modelCV.getModel().findAll({
                                where: {
                                    id: Cv
                                }
                            })];
                    case 1:
                        test = _a.sent();
                        if (Object.keys(test).length == 0)
                            throw new Error('Questo centro vaccino non esiste');
                        return [2 /*return*/, true];
                }
            });
        });
    };
    // Metodo usato per effettuare dei controlli sul vaccino inserito dall'utente
    proxyPr.prototype.TypeCheckVaccino = function (vaccino) {
        return __awaiter(this, void 0, void 0, function () {
            var test;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof vaccino !== 'number' || isNaN(vaccino))
                            throw new Error('Questo vaccino non è valido');
                        return [4 /*yield*/, this.modelV.getModel().findAll({
                                where: {
                                    id: vaccino
                                }
                            })];
                    case 1:
                        test = _a.sent();
                        if (Object.keys(test).length == 0)
                            throw new Error('Questo vaccino non esiste');
                        return [2 /*return*/, true];
                }
            });
        });
    };
    // Metodo usato per effettuare dei controlli sull'utente
    proxyPr.prototype.TypeCheckUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var test;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof user !== 'number' || isNaN(user))
                            throw new Error('Questo utente non è valido');
                        return [4 /*yield*/, this.modelU.getModel().findAll({
                                where: {
                                    id: user
                                }
                            })];
                    case 1:
                        test = _a.sent();
                        if (Object.keys(test).length == 0)
                            throw new Error('Questo utente non esiste');
                        return [2 /*return*/, true];
                }
            });
        });
    };
    // Metodo che restituisce, per ogni centro vaccinale, per ogni fascia, e, per ogni data, il numero di prenotazioni, più gli altri attributi
    proxyPr.prototype.takeNumberOfPrenotation = function (fascia) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof fascia !== 'boolean')
                            throw new Error('L\' opzione inserita non è valida');
                        return [4 /*yield*/, this.model.takeNumberOfPrenotation(fascia)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo che ritorna tutte le prenotazioni effettuate per una certa data, in un certo centro vaccinale e per una certa fascia
    proxyPr.prototype.getSlotFull = function (id, data, fascia) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.TypeCheckCV(id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.model.getSlotFull(id, data, fascia)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo per ottenere le statistiche sui centri vaccinali e sulle prenotazioni che hanno avuto esito positivo
    proxyPr.prototype.getStatisticPositive = function (order) {
        if (order === void 0) { order = true; }
        return __awaiter(this, void 0, void 0, function () {
            var asc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        asc = typeof order === 'undefined' ? true : order;
                        return [4 /*yield*/, this.model.getStatisticPositive(asc)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo per impostare le prenotazioni come 'non andate a buon fine'
    proxyPr.prototype.setBadPrenotations = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof (data) !== 'string' || !(luxon_1.DateTime.fromISO(data).isValid))
                            throw new Error('La data inserita non è valida');
                        return [4 /*yield*/, this.model.setBadPrenotations(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Questo metodo ritorna il numero di prenotazioni che non sono andate a buon fine
    proxyPr.prototype.getCountBadPrenotation = function (data, id) {
        return __awaiter(this, void 0, void 0, function () {
            var datasanitized, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasanitized = (0, stringsanitizer_1.stringSanitizer)(data);
                        if (isNaN(id) || !isFinite(id) || typeof (id) !== 'number')
                            throw new Error('il centro vaccinale che hai inserito non è corretto');
                        if (typeof (datasanitized) !== 'string' || !(luxon_1.DateTime.fromISO(datasanitized).isValid) || luxon_1.DateTime.now > luxon_1.DateTime.fromISO(datasanitized))
                            throw new Error('La data che hai inserito non è corretta');
                        return [4 /*yield*/, this.getBadPrenotation(datasanitized, false, id)];
                    case 1:
                        result = _a.sent();
                        if (typeof result['count'][0] === 'undefined')
                            throw new Error('La data inserita non ha prodotto risultati');
                        return [2 /*return*/, result['count'][0].count];
                }
            });
        });
    };
    // Metodo che restituisce tutte le prenotazioni che non sono andate a buon fine, prende in input una data, un booleano, che modifica la query e un centro vaccinale.
    proxyPr.prototype.getBadPrenotation = function (data, option, id) {
        if (option === void 0) { option = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!option) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.model.getBadPrenotation(data)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.TypeCheckCV(id)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.model.getBadPrenotation(data, option, id)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Metodo che ritorna un riferimento al model
    proxyPr.prototype.getModel = function () {
        return this.model;
    };
    // Metodo che ritorna una prenotazione specifica
    proxyPr.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.findOne(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return proxyPr;
}());
exports.proxyPr = proxyPr;
