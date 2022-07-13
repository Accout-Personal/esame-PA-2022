import { proxyUs } from "../model/Proxymodel/proxyUs";
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import { proxyPr } from "../model/Proxymodel/proxyPR";
import { directorRes } from "./builder/directorRes";

import { buildCV } from "./builder/buildCV";
import { proxyCV } from "../model/Proxymodel/proxyCV";
import { DateTime } from 'luxon';
import { slotToTime } from "../util/slotTotime";
// Qui abbiamo il presenter per lo User
export class userPresenter {
    // Metodo per effettuare il login 
    public static async login(req, res, next) {
        const proxy = new proxyUs();
        proxy.getUser(req.body.username).then((value) => {
            if (value !== null && value.password === crypto.createHash('sha256').update(req.body.password).digest('hex')) {
                res.send({ token: jwt.sign({ user: { "username": value.username, "tipo": value.tipo, "id": value.id } }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE_TIME }) });
            }
            else
                next(new Error("credenziale invalido"));
            return;
        }).catch(error => {
            console.log(error);
            next(new Error("credenziale invalido"));
        });
    };

    // Metodo per registrare un nuovo utente
    public static async register(req, res, next) {
        const proxy = new proxyUs();
        proxy.insertNewElement({
            cf: req.body.cf,
            username: req.body.username,
            password: req.body.password,
            tipo: 0
        }).then((value) => {
            if (value) {
                res.send({ message: "successo." });
            }
            else {
                res.send({ message: "fallito." });
            }

        }).catch(error => {
            next(error);
        });
    };
    // Metodo per inserire una nuova prenotazione
    public static async prenota(req, res, next) {
        const Proxy = new proxyPr();
        const body = req.body;
        try {
            let value = await Proxy.insertNewElement({ data: body.data, slot: body.slot, centro_vaccino: body.centro_vac, vaccino: body.vaccino, user: req.user.user.id });
            await directorRes.respose(res, value, body.formato).catch(err => {
                next(err);
            });
        } catch (error) {
            next(error);
        };
    }
    // Questo metodo serve per modificare una prenotazione
    public static async modificaPre(req, res, next) {
        const Proxy = new proxyPr();
        const body = req.body;
        body.user = req.user.user.id;
        try {
            await Proxy.modifica(body);
            res.status(200).send({ "message": "modificato con successo" });
        }
        catch (error) {
            next(error);
        }
    }
    // Questo metodo serve per eliminare una prenotazione
    public static cancellaPre(req, res, next) {
        const Proxy = new proxyPr();
        const body = req.body;
        Proxy.cancellaPre(body.id, req.user.user.id).then(value => {
            res.status(200).send({ "message": "cancellato con successo" });
        }).catch(error => {
            next(error);
        });

    }

    //filtro centro per la distanza e disponibilita'
    public static async getCentro(req, res, next) {
        //{lat:number,long:number,dist:number,disp:boolean,filtro:boolean}
        let body = req.body;
        let user = req.user.user.id;
        let proxy = new proxyCV();
        let builder = new buildCV(proxy);
        try {
            //disponibilita' falsa, solo distanza
            if (typeof body.disp !== 'undefined' && typeof body.disp !== 'boolean')
                throw new Error("il valore della diponibilità non è corretta");

            if (typeof body.order !== 'undefined' && typeof body.order !== 'boolean')
                throw new Error("il valore di ordinamento non è corretto");

            if (typeof body.disp === 'undefined' || !body.disp) {
                // await builder.producePartA(body.lat, body.long, body.dist, body.order);
                await builder.queryAlDB(false);
                builder.filtraPerDistanza(body.lat, body.long, body.dist);
                builder.trimdata();
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
            next(error);
        };
    }

    //filtro centro per i max 5 giorni
    public static async getSlotsCentro(req, res, next) {
        try {
            let body = req.body;
            let user = req.user.user.id;
            // Metodo per ottenere gli slot temporali disponibili
            let proxy = new proxyCV();
            let builder = new buildCV(proxy);
            await builder.getSlotFull(body.centro, body.date, body.fascia);
            builder.setFascia(body.fascia);
            builder.filtroFascia(body.date);
            var result = builder.getResult();
            if (body.formato === "ora") {
                result = result.map(v => {
                    v.slotLiberi = v.slotLiberi.map(slot => {
                        return slotToTime(slot);
                    })
                    return v;
                });
            }
            res.send(result);
        } catch (error) {
            next(error);
        };
    }
    // Questo metodo restituisce le prenotazioni effettuate da un utente
    public static async getMyPre(req, res,next) {
        try {
            let proxy = new proxyPr()
            let list = await proxy.getListaPr(req.user.user.id);
            return res.send(list);
        }
        catch (error) {
            next(error);
        }
    }

}