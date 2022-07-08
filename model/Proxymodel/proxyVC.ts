import { proxyInterfaceVac } from "../ProxyInterface/proxyinterfaceVacc";
import { Vaccini } from "../vaccino";
import { Sequelize, Model, DataTypes } from 'sequelize';
import {DBConnection} from "../../config/sequelize"
// Questa classe rappresenta il proxy per la componente model del vaccino
export class proxyVC implements proxyInterfaceVac {

    public model:Vaccini;

    constructor(){
        this.model = new Vaccini(DBConnection.getInstance().getConnection())
    }
// Metodo per inserire un nuovo vaccino
    async insertNewVacc(nome:string, validita:number): Promise<Object> {  
        try {
        if(this.TypeCheckNome(nome) && this.TypeCheckValidita(validita)) {
                return await this.model.insertNewVacc(nome, validita);  
            }     
        } catch(error) {return error;}
    }
// Metodo per sanificare il nome del vaccino
    TypeCheckNome(nome: string): Boolean{
        if((typeof nome !== 'string' || nome.length > 255)) throw new Error('Questo nome non è valido');
        return true;
    }
// Metodo per sanificare la validità del vaccino
    TypeCheckValidita(validita: number): Boolean{
        if(typeof validita !== 'number' || isNaN(validita) || !isFinite(validita)) throw new Error('Questo valore di validità non è un numero');
        return true;
    }
}