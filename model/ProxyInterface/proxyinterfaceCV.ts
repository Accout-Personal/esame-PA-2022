// Interfaccia usata per implementare il pattern proxy per la componente centro vaccinale
export interface proxyInterfaceCV {
    insertNewCV(lati: number, longi: number, nome: string, maxf1: number, maxf2: number):Promise<Object>;
}