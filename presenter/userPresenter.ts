import { proxyUs } from "../model/Proxymodel/proxyUs";
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import { proxyPr } from "../model/Proxymodel/proxyPR";

export class userPresenter {

    public static login(req, res) {
        const proxy = new proxyUs();
        proxy.getUser(req.body.username).then((value) => {
            console.log(value[0]);
            if (value[0] !== undefined && value[0].password === crypto.createHash('sha256').update(req.body.password).digest('hex')) {
                res.send({ token: jwt.sign({ user: { "username": value[0].username, "tipo": value[0].tipo } }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE_TIME}) });
            }
            else
                res.status(401).send({message:"credenziale invalido"});
        });
    };

    public static register(req, res) {
        const proxy = new proxyUs();
        proxy.insertNewUsers(req.body.cf,
                             req.body.username,
                             req.body.password,
                             0).then((value) => {
            if (value) {
                res.send({message:"successo."});
            }
            else{
                res.send({message:"fallito."});
            }
                
        });
    };

    public static Prenota(req,res){
        try{
            const Proxy = new proxyPr();
            
            Proxy.insertNewPr();
        }catch(err){
            return 
        }
    }

}