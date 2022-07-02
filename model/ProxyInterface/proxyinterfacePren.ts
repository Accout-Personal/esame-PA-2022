export interface proxyinterfacePR {
    insertNewPr(data:string, fascia: number, slot: number, centro_vaccino: number, vaccino: number, user: number, stato: number):Promise<Object>
}