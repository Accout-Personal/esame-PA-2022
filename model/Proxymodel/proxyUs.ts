import { proxyInterfaceUsers } from "../ProxyInterface/proxyinterfaceUsers";
import { Users } from "../users";
import { and, Sequelize } from "../../node_modules/sequelize/types/index";

export class proxyUs implements proxyInterfaceUsers {

    private model:Users;

    constructor(connessione:Sequelize){
        this.model = new Users(connessione)
    }

    async insertNewUsers(cf: string, username: string,password: string, tipo:number): Promise<Object> {  
        try {
        if(
            this.TypeCheckCF(cf) &&
            this.TypeCheckUsername(username) &&
            this.TypeCheckPassword(password) &&
            this.TypeCheckTipo(tipo)
            ) {
                return await this.model.insertNewUsers(cf, username, password, tipo);  
            }     
        } catch(error) {return error;}
    }

    TypeCheckCF(cf: string): Boolean{
        if((typeof cf !== 'string' || cf.length > 255)) throw new Error('Questo codice fiscale non è valido');
        return true;
    }

    TypeCheckUsername(username: string): Boolean{
        if((typeof username !== 'string' || username.length > 255)) throw new Error('Questo username non è valido');
        return true;
    }

    TypeCheckPassword(password: string): Boolean{
        if((typeof password !== 'string' || password.length > 255)) throw new Error('Questa password non è corretta');
        return true;
    }

    TypeCheckTipo(tipo: number): Boolean{
        if(typeof tipo !== 'number' || isNaN(tipo)) throw new Error('Questo valore non è un numero');
        return true;
    }
}