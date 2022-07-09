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
    exports.app.get('/login', userPresenter_1.userPresenter.login); //tested
    exports.UserRoute.get('/getCentro', userPresenter_1.userPresenter.getCentro); //tested
    exports.UserRoute.get('/getSlotCentro', userPresenter_1.userPresenter.getSlotsCentro); //tested
    exports.UserRoute.post('/prenota', userPresenter_1.userPresenter.prenota); // tested
    exports.UserRoute.post('/cancella', userPresenter_1.userPresenter.cancellaPre); //tested
    exports.UserRoute.post('/modifica', userPresenter_1.userPresenter.modificaPre); //tested
    exports.UserRoute.get('/myListPrenota', userPresenter_1.userPresenter.getMyPre); //tested
    //rotte di amministratore
    exports.AdminRoute.post('/newCentro', adminPresenter_1.adminPresenter.creaCentroVax); //tested
    exports.AdminRoute.post('/newVaccino', adminPresenter_1.adminPresenter.creaVaccino); //tested
    exports.AdminRoute.get('/listPrenota', adminPresenter_1.adminPresenter.getListaCentroData); //tested
    exports.AdminRoute.post('/verify', upload.single('qrcode_img'), adminPresenter_1.adminPresenter.riceveQRCode); //tested
    exports.AdminRoute.post('/confirmVax', upload.single('qrcode_img'), adminPresenter_1.adminPresenter.confermaUUID); //tested
    exports.AdminRoute.get('/statCentro', adminPresenter_1.adminPresenter.getStatCentri); //tested
    exports.AdminRoute.get('/getassenze', adminPresenter_1.adminPresenter.getBadStat); //tested
    console.log('routing initialized..');
}
exports.createRouting = createRouting;
