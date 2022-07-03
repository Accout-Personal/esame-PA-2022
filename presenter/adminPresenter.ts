import { proxyUs } from "../model/Proxymodel/proxyUs";
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import { proxyCV } from "../model/Proxymodel/proxyCV";

export class adminPresenter {

   public static creaCentroVax(req,res) {
    
    const centrVax = new proxyCV();
    centrVax.insertNewCV(req.body.lati,req.body.longi,req.body.nome,req.body.maxf1,req.body.maxf2).then(value=>{
        if(value instanceof Error){
            res.status(401).send(value.message)
        }
        else{
            res.send(value);
        }
        
    });
   }

}