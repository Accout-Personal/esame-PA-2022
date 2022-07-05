import { and, Sequelize } from "../../node_modules/sequelize/types/index";
import { Centro_vaccinale } from "../centro_vaccinale";
import { proxyInterfaceCV } from "../ProxyInterface/proxyinterfaceCV";
import {DBConnection} from "../../config/sequelize";
import { stringSanitizer } from "../../util/stringsanitizer";
// Nel proxy andiamo a implementare tutti i controlli e le sanificazioni sui dati di input per evitare problemi e crash del sistema

export class proxyCV implements proxyInterfaceCV{

    private model:Centro_vaccinale;

    constructor(){
        this.model = new Centro_vaccinale(DBConnection.getInstance().getConnection())
    }

    async insertNewCV(lati: number, longi: number, nome: string, maxf1: number, maxf2: number): Promise<Object> {
        let sanitizednome = stringSanitizer(nome);  
        try {
        if(
            this.TypeCheckLati(lati) &&
            this.TypeCheckLati(longi) &&
            this.TypeCheckNome(sanitizednome) &&
            this.TypeCheckMaxf1(maxf1) &&
            this.TypeCheckMaxf2(maxf2)
            ) {
                let result = await this.model.insertNewCV(lati, longi, sanitizednome, maxf1, maxf2)
                if(result && !(result instanceof Error)){
                    return true;
                }else{
                    if(result instanceof Error)
                        return new Error(result.message);
                    else
                        return new Error("errore inserimento nel database");
                };  
                 
            }     
        } catch(error) {error.message("validazione fallita");return error;}
    }

    public async getCentro(id:number){
        return await this.model.findOne(id);
    }

    TypeCheckLati(lati: number): Boolean{
        if(typeof lati !== 'number' || isNaN(lati)) throw new Error('Questo valore di latitudine non è un numero');
        return true;
    }

    TypeCheckLongi(longi: number): Boolean{
        if(typeof longi !== 'number' || isNaN(longi)) throw new Error('Questo valore di longitudine non è un numero');
        return true;
    }

    TypeCheckNome(nome: string): Boolean{
        if(typeof nome !== 'string' || nome.length > 255) throw new Error('Questo nome non è composto da lettere');
        return true;
    }

    TypeCheckMaxf1(maxf1: number): Boolean{
        if(typeof maxf1 !== 'number' || isNaN(maxf1)) throw new Error('Questo valore non è un numero');
        return true;
    }

    TypeCheckMaxf2(maxf2: number): Boolean{
        if(typeof maxf2 !== 'number' || isNaN(maxf2)) throw new Error('Questo valore non è un numero');
        return true;
    }

    // Metodo per ottenere il riferimento al model
    public getProxyModel(){
        return this.model;
    }

}