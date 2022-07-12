import { proxyInterface } from "./proxyInterface";

export interface proxyInterfacePr extends proxyInterface {
    cancellaPre(id: number, user: number): Promise<Object> // Metodo per cancellare una prenotazione
    modifica(safeBody: Object): Promise<any> // Metodo per modificare una prenotazione
    setBadPrenotations(data:string): Promise<void> // Metodo per impostare le prenotazioni come 'non andate a buon fine'
    getBadPrenotation(data: string, option: Boolean, id?: number): Promise<Array<any>> // Metodo che restituisce tutte le prenotazioni che non sono andate a buon fine
    getStatisticPositive(order: Boolean): Promise<Array<Object>> // Metodo per ottenere le statistiche sui centri vaccinali e sulle prenotazioni che hanno avuto esito positivo
    takeNumberOfPrenotation(fascia: Boolean): Promise<Array<any>> //// Metodo che restituisce, per ogni centro vaccinale, per ogni fascia, e, per ogni data, il numero di prenotazioni, più gli altri attributi
    getSlotFull(id: number, data: Array<string>, fascia?: number): Promise<any> // Metodo che ritorna tutte le prenotazioni effettuate per una certa data, in un certo centro vaccinale e per una certa fascia
}