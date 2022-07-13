"use strict";
exports.__esModule = true;
exports.mediate = void 0;
var Route_1 = require("../Route");
var Route_2 = require("../Route");
var adminAuth = require("./adminAuth");
var auth = require("./auth");
var error = require("./errors");
var bodyParser = require("body-parser");
// Qui abbiamo definito un mediator, dove viene specoficato l'ordine di esecuzione dei controlli.
// Abbiamo specificato quali sono le rotte escluse dai controlli, e quali sono esclusivi per certe rotte.
function mediate() {
    console.log("initialize routing mediator...");
    Route_2.app.use(auth.ControllaToken.unless({
        path: [{ url: '/login' }]
    }));
    Route_2.app.use(auth.verificaEAutorizza.unless({
        path: [{ url: '/login' }]
    }));
    Route_1.AdminRoute.use(adminAuth.ControlloPrivilegio);
    Route_2.app.use(bodyParser.json());
    (0, Route_2.createRouting)();
    Route_2.app.use(error.logErrors);
    Route_2.app.use(error.errorHandler);
    console.log("routing mediator initialized..");
    Route_2.app.listen(3000);
}
exports.mediate = mediate;
