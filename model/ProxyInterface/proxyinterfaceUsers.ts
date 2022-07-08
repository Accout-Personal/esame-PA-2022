// Interfaccia usata per implementare il pattern proxy per la componente users
export interface proxyInterfaceUsers {
    insertNewUsers(cf: string, username: string,password: string, tipo:number):Promise<Object>
}