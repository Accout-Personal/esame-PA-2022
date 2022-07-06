import { proxyUs } from "../model/Proxymodel/proxyUs";
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import { proxyPr } from "../model/Proxymodel/proxyPR";
import { slotToTime } from "../util/slotTotime";
import { proxyCV } from "../model/Proxymodel/proxyCV";

export class userPresenter {

    public static async login(req, res) {
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

    public static async register(req, res) {
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

    public static async prenota(req, res) {
        const Proxy = new proxyPr();
        const body = req.body;
        try {
            let value = await Proxy.insertNewPr(body.data, body.slot, body.centro_vac, body.vaccino, req.user.user.id)
            //costruisce l'informazione da restituire
            let returnBody: any = {};
            let Prenotazione: any = value;
            new proxyUs().getUserByID(Prenotazione.user).then(user => {
                returnBody.cf = user.cf;
            });
            await new proxyCV().getCentro(Prenotazione.centro_vac).then(res => {
                console.log(res);
                returnBody.presso = res.nome;
            });
            returnBody.codicePrenotazione = Prenotazione.uuid;
            returnBody.data = Prenotazione.data;
            returnBody.ora = slotToTime(Prenotazione.slot);
            console.log(returnBody);
            res.status(200).send({ "message": "prenotato con successo", "info": returnBody });
        } catch (error) {
            console.log(error);
            res.status(400).send({ "errore": error.message });
        };
        //TODO:QRcode,PDF...

    }

    public static async modificaPre(req, res) {
        const Proxy = new proxyPr();
        const body = req.body;
        body.user = req.user.user.id;
        try {
            await Proxy.modifica(body);
            res.status(200).send({ "message": "modificato con successo" });
        }
        catch (error) {
            res.status(401).send({ "errore": error.message });
        }

        //TODO:QRcode,PDF...



    }

    public static cancellaPre(req, res) {
        const Proxy = new proxyPr();
        const body = req.body;
        Proxy.cancellaPre(body.id, req.user.user.id).then(value => {
            res.status(200).send({ "message": "cancellato con successo" });
        }).catch(error => {
            res.status(401).send({ "errore": error.message });
        });

    }

}