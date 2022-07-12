"use strict";
exports.__esModule = true;
exports.createRouting = exports.AdminRoute = exports.UserRoute = exports.app = void 0;
var express = require("express");
var userPresenter_1 = require("./presenter/userPresenter");
var bodyParser = require("body-parser");
var adminPresenter_1 = require("./presenter/adminPresenter");
exports.app = express();
exports.UserRoute = express.Router();
exports.AdminRoute = express.Router();
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
function createRouting() {
    exports.app.use(bodyParser.json());
    exports.app.use('/user', exports.UserRoute);
    exports.app.use('/admin', exports.AdminRoute);
    //rotte pubbliche
    exports.app.get('/login', userPresenter_1.userPresenter.login);
    //rotte di utente
    exports.UserRoute.get('/getCentro', userPresenter_1.userPresenter.getCentro);
    exports.UserRoute.get('/getSlotCentro', userPresenter_1.userPresenter.getSlotsCentro);
    exports.UserRoute.post('/prenota', userPresenter_1.userPresenter.prenota);
    exports.UserRoute.post('/cancella', userPresenter_1.userPresenter.cancellaPre);
    exports.UserRoute.post('/modifica', userPresenter_1.userPresenter.modificaPre);
    exports.UserRoute.get('/myListPrenota', userPresenter_1.userPresenter.getMyPre);
    //rotte di amministratore
    exports.AdminRoute.post('/newCentro', adminPresenter_1.adminPresenter.creaCentroVax);
    exports.AdminRoute.post('/newVaccino', adminPresenter_1.adminPresenter.creaVaccino);
    exports.AdminRoute.get('/listPrenota', adminPresenter_1.adminPresenter.getListaCentroData);
    exports.AdminRoute.post('/verify', upload.single('qrcode_img'), adminPresenter_1.adminPresenter.riceveQRCode);
    exports.AdminRoute.post('/confirmVax', upload.single('qrcode_img'), adminPresenter_1.adminPresenter.confermaUUID);
    exports.AdminRoute.get('/statCentro', adminPresenter_1.adminPresenter.getStatCentri);
    exports.AdminRoute.get('/getassenze', adminPresenter_1.adminPresenter.getBadStat);
    console.log('routing initialized..');
}
exports.createRouting = createRouting;
