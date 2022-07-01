import { UserRoute } from "../Route";
import { AdminRoute } from "../Route";
import { app} from "../Route";
import * as adminAuth from "./adminAuth";
import * as auth from "./auth";
import * as error from "./errors";
import {unless} from 'express-unless';

app.use(auth.TestMiddle1);
auth.TestMiddle1.unless = unless;

app.use(auth.TestMiddle.unless({
        path:{url:'/test1'}
    }
));

//UserRoute.use(auth.ControllaToken);
//UserRoute.use(auth.verificaEAutorizza);
//
//AdminRoute.use(adminAuth.ControlloPrivilegio);
//
//UserRoute.use(error.errorHandler);
//

console.log("mediator initialized..");