export interface proxyInterface {
    insertNewElement(Input:Object):Promise<Object> // Metodo per inserire un nuovo elemento
    findOne(id:number):Promise<any> // Metodo per cercare un elemento specifico
    getModel():any; // metodo per ottenere un riferimento al model, nel model è un riferimento alla tabella del DB
}