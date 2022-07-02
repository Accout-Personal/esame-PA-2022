import { UserRoute } from "../Route";
import { AdminRoute } from "../Route";
import {app} from "../Route";
import * as adminAuth from "./adminAuth";
import * as auth from "./auth";
import * as error from "./errors";
import {unless} from 'express-unless';

export function initMiddleware(){
    
    app.use(auth.ControllaToken.unless({
            path:{url:'/login'}
        }
    ));

    app.use(auth.verificaEAutorizza.unless({
            path:{url:'/login'}
        }
    ));
    

    AdminRoute.use(adminAuth.ControlloPrivilegio);
    
    
    console.log("mediator initialized..");

}

export function initErrorHandler(){
    app.use(error.logErrors);
    app.use(error.errorHandler);
}


