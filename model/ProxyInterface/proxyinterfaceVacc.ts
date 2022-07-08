// Interfaccia usata per implementare il pattern proxy per la componente vaccino
export interface proxyInterfaceVac {
    insertNewVacc(nome:string, validita:number):Promise<Object>
}