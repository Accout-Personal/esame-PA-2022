"use strict";
// Qui abbiamo definito dei metodi usati per gestire gli errori in fase di autenticazione
exports.__esModule = true;
exports.errorHandler = exports.logErrors = void 0;
function logErrors(err, req, res, next) {
    next(err);
}
exports.logErrors = logErrors;
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(403).send({ "errore": err.message });
}
exports.errorHandler = errorHandler;
