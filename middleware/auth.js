"use strict";
exports.__esModule = true;
exports.verificaEAutorizza = exports.ControllaToken = void 0;
var jwt = require("jsonwebtoken");
var express_unless_1 = require("express-unless");
// Questo metodo serve per controllare se il token è stato inviato oppure no
var ControllaToken = function (req, res, next) {
    var bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        //0 = 'Bearer' 1 = c'e' il token proprio 
        var bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    }
    else {
        var Err = new Error('Autenticazione fallita');
        next(Err);
    }
};
exports.ControllaToken = ControllaToken;
exports.ControllaToken.unless = express_unless_1.unless;
// Questo metodo serve per controllare se il token inviato è valido oppure no
var verificaEAutorizza = function (req, res, next) {
    try {
        var decoded = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
        if (decoded !== null) {
            req.user = decoded;
            console.log("veryfied: " + JSON.stringify(decoded));
            console.log("user is: " + JSON.stringify(decoded.user));
            next();
        }
        else {
            var Err = new Error('Autenticazione fallita');
            next(Err);
        }
    }
    catch (err) {
        var Errore;
        if (err instanceof jwt.TokenExpiredError) {
            Errore = new Error('Il token e\' scaduto');
        }
        else {
            Errore = new Error('Autenticazione fallita');
        }
        next(Errore);
    }
};
exports.verificaEAutorizza = verificaEAutorizza;
exports.verificaEAutorizza.unless = express_unless_1.unless;
