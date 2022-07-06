/**
 * Questa è l'interfaccia utilizzata per implementare il builder nel presenter
 */
 import { PassThrough } from 'stream';
export interface builderInterfaceRes {
    ProduceInfo(Values:any): void;
    ProduceQRCodeImmagine(uuid: string):PassThrough
    ProduceQRCodeBuffer(uuid: string): void
    ProducePDFeStream(dataCallback, endCallBack): void
    getResult():any;
}