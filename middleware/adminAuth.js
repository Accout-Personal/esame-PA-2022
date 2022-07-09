"use strict";
exports.__esModule = true;
exports.ControlloPrivilegio = void 0;
// Qui abbiamo definito una funzione che serve per controllare i privilegi dell'utente
var ControlloPrivilegio = function (req, res, next) {
    console.log("admin middleware: " + req.user);
    if (req.user.user.tipo == 1) {
        console.log("admin logged in...");
        next();
    }
    else {
        var err = new Error('Non hai il privilegio per effetuare questa operazione');
        next(err);
    }
};
exports.ControlloPrivilegio = ControlloPrivilegio;
