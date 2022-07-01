import * as jwt from 'jsonwebtoken';
import {unless} from 'express-unless';

export const TestMiddle1 = (req,res,next) => {
    console.log("test middleware1");
    next();
};
TestMiddle1.unless = unless;

export const TestMiddle = (req,res,next) => {
        console.log("test middleware");
        next();
    }
TestMiddle.unless = unless;

export const ControllaToken = (req,res,next) => {
        const bearerHeader = req.headers.authorization;
        if(typeof bearerHeader!=='undefined'){
            //0 = 'Bearer' 1 = c'e' il token proprio 
            const bearerToken = bearerHeader.split(' ')[1];
            req.token=bearerToken;
            next();
        }else{
            var Err = new Error('Autenticazione fallita');
            next(Err);
        }
    }
TestMiddle.unless = unless;

export const verificaEAutorizza = (req,res,next) =>{
        let decoded = jwt.verify(req.token, 'mysupersecretkey');
        if(decoded !== null){
            req.user = decoded;
            next();
        }
        else{
            const Err = new Error('Autenticazione fallita');
            next(Err);
        }
    }
TestMiddle.unless = unless;



