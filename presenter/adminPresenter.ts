import { proxyUs } from "../model/Proxymodel/proxyUs";
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import { proxyCV } from "../model/Proxymodel/proxyCV";
import { proxyVC } from "../model/Proxymodel/proxyVC";
import { proxyPr } from "../model/Proxymodel/proxyPR";
import { generatePDF } from "../util/startPDF";
import { slotToTime } from "../util/slotTotime";
// Questa classe implementa il presenter per l'amministratore
export class adminPresenter {
    // Questo metodo permette di inserire un nuovo centro vaccinale
    public static async creaCentroVax(req, res) {

        const centrVax = new proxyCV();
        try {
            await centrVax.insertNewCV(req.body.lati, req.body.longi, req.body.nome, req.body.maxf1, req.body.maxf2);
            res.send({ message: "inserimento andatato con successo." });
        } catch (error) {
            console.log(error);
            res.status(400).send({ "message": error.message });
        }

    }
    // Questo metodo permette di inserire un nuovo vaccino
    public static async creaVaccino(req, res) {
        const Vaccini = new proxyVC();
        try {
            await Vaccini.insertNewVacc(req.body.nome, req.body.validita)
            res.send({ message: "inserimento andatato con successo." });
        } catch (error) {
            console.log(error);
            res.status(400).send({ "message": error.message });
        }
    }
    // Metodo che permette di ricevere un QRcode
    public static async riceveQRCode(req, res) {
        try {
            let result = await new proxyPr().getPrInfo(req);
            return res.send({
                CF: result.user.cf,
                data: result.data,
                ora: slotToTime(result.slot),
                vaccino: result.vaccino.nome,
                stato: result.stato,
                uuid: result.uuid
            });
        } catch (error) {
            res.status(400).send({ "message": error.message });
        }

    }
    // Metodo usato per validare l’utente in fase di accettazione 
    public static async confermaUUID(req, res) {
        try {
            await new proxyPr().confermatUUID(req);
            res.status(200).send({ message: "confermato con successo" });
        } catch (error) {
            res.status(400).send({ "message": error.message });
        }
    }
    // Questo metodo ritorna la lista delle prenotazioni di un certo centro vaccinale e per una certa data.
    // Il risultato può essere restituito sotto forma di json o pdf.
    public static async getListaCentroData(req, res) {
        try {
            let body = req.body;
            let proxy = new proxyPr();
            if (typeof body.formato === 'undefined') body.formato = 'json';
            let result = await proxy.getListaPr(undefined, body.centro, body.data);
            result = result.sort((a, b) => {
                return a.slot - b.slot;
            }).map(value => {
                return {
                    slot: slotToTime(value.slot),
                    CF: value.user.cf,
                    vaccino: value.vaccino.nome,
                    uuid: value.uuid
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
                    doc.font('OpenSans', 25).text('Appuntamenti del centro: ' + centro.nome, 50, 10);
                    doc.font('OpenSans', 20).text('Del giorno: ' + body.data);
                    doc.font('OpenSans', 10);
                    result.forEach(element => {
                        doc.text(element.slot + "-----" + element.CF + "-----" + element.vaccino + "-----" + element.uuid);
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
        } catch (error) {
            console.log(error)
            return res.status(401).send({ message: error.message });
        }

    }
    // Metodo per ottenere le statistiche positive di tutti i centri vaccinali
    public static async getStatCentri(req, res) {
        try {
            let body = req.body;
            let result = await new proxyPr().getStatisticPositive(body.order);
            res.send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    }
    // Metodo per ottenere le statistiche negative di un centro vaccinale per un dato giorno
    public static async getBadStat(req, res) {
        try {
            let body = req.body;
            let result = await new proxyPr().getCountBadPrenotation(body.data, body.id);
            res.send({"assenze":result});
        } catch (error) {
            console.log(error);
            res.status(400).send({ message: error.message });
        }
    }
}