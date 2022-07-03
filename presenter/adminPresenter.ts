import { proxyUs } from "../model/Proxymodel/proxyUs";
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import { proxyCV } from "../model/Proxymodel/proxyCV";
import { proxyVC } from "../model/Proxymodel/proxyVC";

export class adminPresenter {

   public static creaCentroVax(req,res) {
    
    const centrVax = new proxyCV();
    centrVax.insertNewCV(req.body.lati,req.body.longi,req.body.nome,req.body.maxf1,req.body.maxf2).then(value=>{
        if(value instanceof Error){
            res.status(401).send(value.message);
        }
        else{
            res.send({message:"inserimento andatato con successo."});
        }
    });
   }

   public static creaVaccino(req,res){
        const Vaccini = new proxyVC();
        Vaccini.insertNewVacc(req.body.name,req.body.validita).then(value=>{
            if(value instanceof Error){
                res.status(401).send(value.message);
            }
            else{
                res.send({message:"inserimento andatato con successo."});
            }
        });
   }
   

}