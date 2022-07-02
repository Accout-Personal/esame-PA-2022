import { proxyInterfaceVac } from "../ProxyInterface/proxyinterfaceVacc";
import { Vaccini } from "../vaccino";
import { Sequelize, Model, DataTypes } from 'sequelize';
import {DBConnection} from "../../config/sequelize"

export class proxyVC implements proxyInterfaceVac {

    public model:Vaccini;

    constructor(){
        this.model = new Vaccini(DBConnection.getInstance().getConnection())
    }

    async insertNewVacc(nome:string, validita:number): Promise<Object> {  
        try {
        if(this.TypeCheckNome(nome) && this.TypeCheckValidita(validita)) {
                return await this.model.insertNewVacc(nome, validita);  
            }     
        } catch(error) {return error;}
    }

    TypeCheckNome(nome: string): Boolean{
        if((typeof nome !== 'string' || nome.length > 255)) throw new Error('Questo nome non è valido');
        return true;
    }

    TypeCheckValidita(validita: number): Boolean{
        if(typeof validita !== 'number' || isNaN(validita)) throw new Error('Questo valore di validità non è un numero');
        return true;
    }
}