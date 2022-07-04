import { proxyUs } from "../model/Proxymodel/proxyUs";
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import { proxyPr } from "../model/Proxymodel/proxyPR";

export class userPresenter {

    public static login(req, res) {
        const proxy = new proxyUs();
        proxy.getUser(req.body.username).then((value) => {
            console.log(value);
            if (value !== undefined && value.password === crypto.createHash('sha256').update(req.body.password).digest('hex')) {
                res.send({ token: jwt.sign({ user: { "username": value.username, "tipo": value.tipo, "id": value.id } }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE_TIME }) });
            }
            else
                res.status(401).send({ message: "credenziale invalido" });
        });
    };

    public static register(req, res) {
        const proxy = new proxyUs();
        proxy.insertNewUsers(req.body.cf,
            req.body.username,
            req.body.password,
            0).then((value) => {
                if (value) {
                    res.send({ message: "successo." });
                }
                else {
                    res.send({ message: "fallito." });
                }

            });
    };

    public static prenota(req, res) {
            const Proxy = new proxyPr();
            const body = req.body;
            Proxy.insertNewPr(body.data, body.slot, body.centro_vac, body.vaccino, req.user.user.id).then(value => {
                res.status(200).send({"message":"prenotazione successo","uuid":value["uuid"]});
            });
        //TODO:QRcode,PDF...
    }

    public static modificaPre(req,res){
        const Proxy = new proxyPr();
        const body = req.body;
        Proxy.insertNewPr(body.data, body.slot, body.centro_vac, body.vaccino, req.user.user.id).then(value => {
            res.status(200).send({"message":"prenotazione successo","uuid":value["uuid"]});
        });
    }

    public static cancellaPre(req,res){
        const Proxy = new proxyPr();
    }

}