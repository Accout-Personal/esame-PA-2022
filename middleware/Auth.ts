import * as jwt from 'jsonwebtoken';
import {unless} from 'express-unless';

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
ControllaToken.unless = unless;

export const verificaEAutorizza = (req,res,next) =>{
    try {
        let decoded = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
        if(decoded !== null){
            req.user = decoded;
            console.log("veryfied: "+ JSON.stringify(decoded));
            console.log("user is: "+ JSON.stringify(decoded.user));
            next();
        }
        else{
            const Err = new Error('Autenticazione fallita');
            next(Err);
        }

    } catch (err) {
        var Errore:Error;
        if(err.message == 'TokenExpiredError') {
            Errore = new Error('Il token e\' scaduto');
         }
         else{
            Errore = new Error('Autenticazione fallita');
         }
         next(Errore);
    }

    }
verificaEAutorizza.unless = unless;



