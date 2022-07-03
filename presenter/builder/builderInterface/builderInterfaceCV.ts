/**
 * Questa è l'interfaccia utilizzata per implementare il builder nel presenter
 */

export interface builderInterfaceCV {
    producePartA(latitude:number, longitude: number,distanza:number, order?: Boolean): void;
    producePartB(latitude:number, longitude: number,distanza:number,data:string, order?: Boolean): Promise<void>;
    getResult(): Array<any>
}