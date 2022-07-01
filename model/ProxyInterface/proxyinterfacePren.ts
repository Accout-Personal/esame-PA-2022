export interface proxyinterfacePR {
    insertNewPr(giorno:number, mese:number,anno:number , fascia: number, slot: number, centro_vaccino: number, vaccino: number, user: number, stato: number):Promise<Object>
}