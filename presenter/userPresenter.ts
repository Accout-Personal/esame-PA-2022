import { proxyUs } from "../model/Proxymodel/proxyUs";
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import { proxyPr } from "../model/Proxymodel/proxyPR";
import { directorRes } from "./builder/directorRes";

import { buildCV } from "./builder/buildCV";
import { proxyCV } from "../model/Proxymodel/proxyCV";
import { DateTime } from 'luxon';

export class userPresenter {

    public static async login(req, res) {
        const proxy = new proxyUs();
        proxy.getUser(req.body.username).then((value) => {
            console.log(value);
            if (value !== null && value.password === crypto.createHash('sha256').update(req.body.password).digest('hex')) {
                res.send({ token: jwt.sign({ user: { "username": value.username, "tipo": value.tipo, "id": value.id } }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE_TIME }) });
            }
            else
                res.status(401).send({ message: "credenziale invalido" });
            return;
        });
    };

    //
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
            let value = await Proxy.insertNewPr(body.data, body.slot, body.centro_vac, body.vaccino, req.user.user.id);
            await directorRes.respose(res, value, body.tipo).catch(err => {
                console.log(err);
                res.status(400).send({ "errore": err.message });
            });
        } catch (error) {
            console.log(error);
            res.status(400).send({ "errore": error.message });
        };
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

    //filtro centro per la distanza e disponibilita'
    public static async getCentro(req, res) {
        //{lat:number,long:number,dist:number,disp:boolean,filtro:boolean}
        let body = req.body;
        let user = req.user.user.id;
        let proxy = new proxyCV();
        let builder = new buildCV(proxy);
        try {
            //disponibilita' falsa, solo distanza
            if (typeof body.disp === 'undefined' || !body.disp) {
                // await builder.producePartA(body.lat, body.long, body.dist, body.order);
                await builder.queryAlDB(false);
                builder.filtraPerDistanza(body.lat, body.long, body.dist);
                builder.ordinamento(body.order)
                let result = builder.getResult();

                res.send(result);
            } else {
                //disponibilita'distanza e disponibilita
                if (typeof body.data === 'undefined') body.data = DateTime.now().toISODate();
                //await builder.producePartB(body.lat, body.long, body.dist, body.data, body.order);
                await builder.queryAlDB(true);
                builder.filtraPerDistanza(body.lat, body.long, body.dist);
                builder.filtraPrenData(body.data);
                builder.filtraDisponibilita();
                builder.trimdata();
                builder.ordinamento(body.order);

                let result = builder.getResult();
                res.send(result);
            }
        } catch (error) {
            return res.status(400).send({ "errore": error.message });
        };
    }

    //filtro centro per i max 5 giorni
    public static async getSlotsCentro(req, res) {
        //{centro:number,data:[...],fascie:number}
        try {

            let body = req.body;
            let user = req.user.user.id;
            // Metodo per ottenere gli slot temporali disponibili
            let proxy = new proxyCV();
            let builder = new buildCV(proxy);
            await builder.getSlotFree(body.centro, body.data, body.fascie);
            let result = builder.getResult();
            res.send(result);
        } catch (error) {
            return res.status(400).send({ "errore": error.message });
        };
    }

    public static async getMyPre(req, res) {
        let proxy = new proxyPr()
        let list = await proxy.getListaPr(req.user.user.id);
        return res.send(list);
    }

}