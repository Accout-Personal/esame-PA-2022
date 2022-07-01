import { and, Sequelize } from "../../node_modules/sequelize/types/index";
import { Centro_vaccinale } from "../centro_vaccinale";
import { proxyInterfaceCV } from "../ProxyInterface/proxyinterfaceCV";

// Nel proxy andiamo a implementare tutti i controlli e le sanificazioni sui dati di input per evitare problemi e crash del sistema

export class proxyCV implements proxyInterfaceCV{

    private model:Centro_vaccinale;

    constructor(connessione:Sequelize){
        this.model = new Centro_vaccinale(connessione)
    }

    async insertNewCV(lati: number, longi: number, nome: string, maxf1: number, maxf2: number): Promise<Object> {  
        try {
        if(
            this.TypeCheckLati(lati) &&
            this.TypeCheckLati(longi) &&
            this.TypeCheckNome(nome) &&
            this.TypeCheckMaxf1(maxf1) &&
            this.TypeCheckMaxf2(maxf2)
            ) {
                return await this.model.insertNewCV(lati, longi, nome, maxf1, maxf2);  
            }     
        } catch(error) {return error;}
    }

    TypeCheckLati(lati: number): Boolean{
        if((typeof lati !== 'number' || isNaN(lati))) throw new Error('Questo valore di latitudine non è un numero');
        return true;
    }

    TypeCheckLongi(longi: number): Boolean{
        if(!(typeof longi !== 'number' || isNaN(longi))) throw new Error('Questo valore di longitudine non è un numero');
        return true;
    }

    TypeCheckNome(nome: string): Boolean{
        if(!(typeof nome === 'string' && nome.length < 255)) throw new Error('Questo nome non è composto da lettere');
        return true;
    }

    TypeCheckMaxf1(maxf1: number): Boolean{
        if(!(typeof maxf1 === 'number' || isNaN(maxf1))) throw new Error('Questo valore non è un numero');
        return true;
    }

    TypeCheckMaxf2(maxf2: number): Boolean{
        if(!(typeof maxf2 === 'number' || isNaN(maxf2))) throw new Error('Questo valore non è un numero');
        return true;
    }

}