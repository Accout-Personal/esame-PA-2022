import { Centro_vaccinale } from "../centro_vaccinale"

export interface proxyInterfaceCV {
    insertNewCV(lati: number, longi: number, nome: string, maxf1: number, maxf2: number):Promise<Object>;

    getProxyModel():Centro_vaccinale;
}