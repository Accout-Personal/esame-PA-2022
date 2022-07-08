/**
 * Questa è l'interfaccia utilizzata per implementare il builder nel presenter
 */

export interface builderInterfaceCV {
    queryAlDB(disp: boolean);
    ordinamento(desc: boolean);
    getResult(): Array<any>
}