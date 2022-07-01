import { Prenotazione } from "../prenotazione";
import { proxyinterfacePR } from "../ProxyInterface/proxyinterfacePren";
import { Sequelize, Model, DataTypes } from 'sequelize';

export class proxyPr implements proxyinterfacePR {

    private model:Prenotazione;

    constructor(connessione:Sequelize){
        this.model = new Prenotazione(connessione)
    }

    async insertNewPr(giorno:number, mese:number,anno:number , fascia: number, slot: number, centro_vaccino: number, vaccino: number, user: number, stato: number): Promise<Object> {  
        try {
        if(this.TypeCheckNome(nome) && this.TypeCheckValidita(validita)) {
                return await this.model.insertNewPr(nome, validita);  
            }     
        } catch(error) {return error;}
    }

    TypeCheckData(giorno:number, mese:number, anno:number): Boolean{
        if((typeof giorno !== 'number' || isNaN(giorno))) throw new Error('Questa giorno non è valido');
        return true;
    }

    TypeCheckValidita(validita: number): Boolean{
        if(typeof validita !== 'number' || isNaN(validita)) throw new Error('Questo valore di validità non è un numero');
        return true;
    }
}