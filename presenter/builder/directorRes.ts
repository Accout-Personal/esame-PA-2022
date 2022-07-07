import { buildRes } from "./buildRes";
import { PassThrough } from 'stream';

export class directorRes {


    public static async respose(res, value, tipo: string = 'json') {
        let Prenotazione: any = value;
        let Response = new buildRes();

        //default json
        switch (tipo) {
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
                    'Content-Disittion': 'attachment;filename=invoice.pdf'
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