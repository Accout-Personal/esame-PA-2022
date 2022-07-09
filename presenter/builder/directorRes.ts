import { buildRes } from "./buildRes";
import { PassThrough } from 'stream';
// Questa classe permette di restituire le informazioni relative ad una prenotazione.
//Basato sul tipo richiesto dall'utente che ha fatto la prenotazione
export class directorRes {

// Metodo che costruisce la risposta
    public static async respose(res, value, tipo: string = 'json') {
        let Prenotazione: any = value;
        let Response = new buildRes();
        //default json
        switch (tipo.toLowerCase()) {
            case 'qrcode': {
                await Response.ProduceInfo(value);
                let Stream: PassThrough = Response.ProduceQRCodeImmagine(value.uuid);
                res.set('content-type', "image/png");
                Stream.pipe(res);
                break;
            }
            case 'pdf': {
                const stream = res.writeHead(200, {
                    'Content-type': 'application/pdf',
                    'Content-Disittion': 'attachment;filename=infoAppuntamento.pdf'
                });
                await Response.ProduceInfo(value);
                await Response.ProduceQRCodeBuffer(value.uuid);
                Response.ProducePDFeStream(
                    (chunk) => stream.write(chunk),
                    () => stream.end()
                );
                break;
            }
            default:{
                await Response.ProduceInfo(value);
                let Result = Response.getResult();
                console.log(Result);
                res.status(200).send({ "message": "prenotato con successo", "info": Result });
                break;
            }
        }
    }
}