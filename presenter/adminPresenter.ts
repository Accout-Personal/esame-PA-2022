import { proxyUs } from "../model/Proxymodel/proxyUs";
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import { proxyCV } from "../model/Proxymodel/proxyCV";
import { proxyVC } from "../model/Proxymodel/proxyVC";
import { proxyPr } from "../model/Proxymodel/proxyPR";
import { generatePDF } from "../util/startPDF";
import * as qrCode from 'qrcode-reader';
import * as Jimp from 'jimp';
import { slotToTime } from "../util/slotTotime";
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
        var uuid = await this.decodeUUID(req);
        let result = await new proxyPr().getPrInfo(uuid);
        return res.send({CF:result.user.cf,
            data:result.data,
            ora:slotToTime(result.slot),
            vaccino:result.vaccino.nome});
    }

    private static async decodeUUID(req){
        var uuid: string;
        if (typeof req.file !== 'undefined') {
            let img: Buffer = req.file.buffer;
            
            let image = await Jimp.read(img);
            let qrcode = new qrCode();
            qrcode.callback = function (err, value) {
                if (err) {
                    console.error(err);
                }
                uuid = value.result;
            };
            // Decoding the QR code
            qrcode.decode(image.bitmap);
        }
        else {
            //Legge dalla json
            uuid = req.body.uuid;
        }
        return uuid;
    }



    public static async getListaCentroData(req, res) {
        //req:{centro,data,formato}
        let body = req.body;
        let proxy = new proxyPr();
        if (typeof body.formato === 'undefined') body.formato = 'json';
        let result = await proxy.getListaPr(undefined, body.centro, body.data);
        result = result.sort((a,b)=>{
            return a.slot - b.slot;
        }).map(value=>{
            return {
                slot:slotToTime(value.slot),
                CF:value.user.cf,
                vaccino:value.vaccino.nome,
                uuid:value.uuid
            }
        });
        let centro = await new proxyCV().getCentro(body.centro);

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
                doc.font('OpenSans', 25).text('Appuntamenti del centro: '+ centro.nome, 50, 10);
                doc.font('OpenSans', 20).text('Del giorno: '+ body.data);
                doc.font('OpenSans', 10);
                console.log(result);
                result.forEach(element => {
                    doc.text(element.slot + "-----" + element.CF + "-----" + element.vaccino+"-----"+element.uuid);
                });
                doc.end();

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