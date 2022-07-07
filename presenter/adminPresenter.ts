import { proxyUs } from "../model/Proxymodel/proxyUs";
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import { proxyCV } from "../model/Proxymodel/proxyCV";
import { proxyVC } from "../model/Proxymodel/proxyVC";
import { proxyPr } from "../model/Proxymodel/proxyPR";
import { generatePDF } from "../util/startPDF";

export class adminPresenter {

    public static async creaCentroVax(req, res) {

        const centrVax = new proxyCV();
        centrVax.insertNewCV(req.body.lati, req.body.longi, req.body.nome, req.body.maxf1, req.body.maxf2).then(value => {
            if (value instanceof Error) {
                res.status(401).send(value.message);
            }
            else {
                res.send({ message: "inserimento andatato con successo." });
            }
        });
    }

    public static async creaVaccino(req, res) {
        const Vaccini = new proxyVC();
        Vaccini.insertNewVacc(req.body.name, req.body.validita).then(value => {
            if (value instanceof Error) {
                res.status(401).send(value.message);
            }
            else {
                res.send({ message: "inserimento andatato con successo." });
            }
        });
    }

    public static async riceveQRCode(req, res) {
        if (typeof req.file !== 'undefined') {
            let img: Buffer = req.file.buffer;
            //Importing jimp module
            var Jimp = require("jimp");
            // Importing qrcode-reader module
            var qrCode = require('qrcode-reader');

            // Read the image and create a buffer
            // Parse the image using Jimp.read() method
            Jimp.read(img, function (err, image) {
                if (err) {
                    console.error(err);
                }
                // Creating an instance of qrcode-reader module
                let qrcode = new qrCode();
                qrcode.callback = function (err, value) {
                    if (err) {
                        console.error(err);
                    }
                    // Printing the decrypted value
                    console.log(value.result);
                };
                // Decoding the QR code
                qrcode.decode(image.bitmap);
            });
        }
        else {
            //Legge dalla stringa
            let uuid = req.body.uuid;
        }
        return res.send("decode completed");
    }

    public static async getListaCentroData(req, res) {
        //req:{centro,data,formato}
        let body = req.body;
        let proxy = new proxyPr();
        if (typeof body.formato === 'undefined') body.formato = 'json';
        let result = await proxy.getListaPr(undefined, body.centro, body.data);
        switch (body.formato.toLowerCase()) {
            case "pdf": {
                const stream = res.writeHead(200, {
                    'Content-type': 'application/pdf',
                    'Content-Disittion': 'attachment;filename=invoice.pdf'
                });
                const doc = generatePDF();
                //Callback per stream di express
                doc.on('data', (chunk) => stream.write(chunk),);
                doc.on('end', () => stream.end());
                //Scrittura del documento.
                doc.font('OpenSans', 25).text('Informazione della prenotazione del centro', 50, 10);
                doc.font('OpenSans', 10);
                result = result.sort((a,b)=>{
                    return a.slot - b.slot;
                });

                result.forEach(element => {
                    doc.text(element.slot+" "+element.user+" "+element.vaccino);
                });

                break;
            }
            case "json": {
                res.send(result);
                break;
            }
            default: {
                res.status(401).send({ message: "il formato non e' valido: il formato puo' essere solo di json o pdf" });
                break;
            }
        }
    }
}