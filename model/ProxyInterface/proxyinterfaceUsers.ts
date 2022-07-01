export interface proxyInterfaceUsers {
    insertNewUsers(cf: string, username: string,password: string, tipo:number):Promise<Object>
}