import { proxyUs } from "../model/Proxymodel/proxyUs";
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';

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

    };


}