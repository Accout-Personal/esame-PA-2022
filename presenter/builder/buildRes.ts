import { builderInterfaceRes } from "./builderInterface/builderInterfaceRes";
import { proxyUs } from "../../model/Proxymodel/proxyUs";
import { proxyCV } from "../../model/Proxymodel/proxyCV";
import { slotToTime } from "../../util/slotTotime";
import { PassThrough } from 'stream';
import * as QRCode from 'qrcode';
import {generatePDF} from '../../util/startPDF'

export class buildRes implements builderInterfaceRes {

    private Info: { uuid: string, data: string, ora: string, presso: string, cf: string };
    private QrImage: Buffer;


    public async ProduceInfo(Values: any): Promise<void> {

        let user: any = await new proxyUs().getUserByID(Values.userid);
        let centro: any = await new proxyCV().getCentro(Values.centro_vac_id);
        this.Info = { uuid: Values.uuid, data: Values.data, ora: slotToTime(Values.slot), presso: centro.nome, cf: user.cf }
    };

    public ProduceQRCodeImmagine(uuid: string): PassThrough {
        const qrStream = new PassThrough();
        QRCode.toFileStream(qrStream, uuid,
            {
                type: 'png',
                width: 500,
                errorCorrectionLevel: 'H'
            }
        );
        return qrStream;

    };

    public async ProduceQRCodeBuffer(uuid: string) {
        this.QrImage = await QRCode.toBuffer(uuid,
            {
                type: 'png',
                width: 500,
                errorCorrectionLevel: 'H'
            }
        );
    }

    public ProducePDFeStream(dataCallback, endCallBack): void {

        const doc = generatePDF();
        //Callback per stream di express
        doc.on('data', dataCallback);
        doc.on('end', endCallBack);
        //Scrittura del documento.
        doc.font('OpenSans', 25).text('Informazione della prenotazione vaccino', 50, 10);
        doc.image(this.QrImage, {
            align: 'left',
            valign: 'top'
        });
        doc.font('OpenSans', 16)
        doc.text('data : ' + this.Info.data + ' alle ore: ' + this.Info.ora);
        doc.text('presso: ' + this.Info.presso);
        doc.text('C.F.: ' + this.Info.cf);
        doc.text('uuid: ' + this.Info.uuid);
        //doc.addPage().fontSize(30).text('Titolo della pagina 2', 175, 50);


        doc.end();
    };

    getResult(): any {
        return { info: this.Info, QRCode: this.QrImage }
    };


}