import { UserRoute } from "../Route";
import { AdminRoute } from "../Route";
import {app} from "../Route";
import * as adminAuth from "./adminAuth";
import * as auth from "./auth";
import * as error from "./errors";
import {unless} from 'express-unless';

export function initMiddleware(){
    app.use(auth.TestMiddle1);
    app.use(auth.TestMiddle.unless({
            path:{url:'/test1'}
        }
    ));
    
    UserRoute.use((req,res,next)=>{
        console.log('user middleware')
        next();
    });
    UserRoute.use(auth.ControllaToken);
    //UserRoute.use(auth.verificaEAutorizza);

    AdminRoute.use((req,res,next)=>{
        console.log('admin middleware')
        next();
    });

    //
    //AdminRoute.use(adminAuth.ControlloPrivilegio);

    UserRoute.use('*',error.errorHandler);
    
    console.log("mediator initialized..");

}


