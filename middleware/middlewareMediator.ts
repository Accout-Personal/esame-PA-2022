import { UserRoute } from "../Route";
import { AdminRoute } from "../Route";
import { app, createRouting } from "../Route";
import * as adminAuth from "./adminAuth";
import * as auth from "./auth";
import * as error from "./errors";
import { unless } from 'express-unless';

export function mediate() {

    console.log("initialize routing mediator...");
    app.use(auth.ControllaToken.unless({
        path: [{ url: '/login' }]
    }
    ));
    app.use(auth.verificaEAutorizza.unless({
        path: [{ url: '/login' }]
    }
    ));
    AdminRoute.use(adminAuth.ControlloPrivilegio);
    createRouting();
    app.use(error.logErrors);
    app.use(error.errorHandler);
    console.log("routing mediator initialized..");
    app.listen(3000);

}


