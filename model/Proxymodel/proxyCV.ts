import { and, Sequelize } from "../../node_modules/sequelize/types/index";
import { Centro_vaccinale } from "../centro_vaccinale";
import { proxyInterfaceCV } from "../ProxyInterface/proxyinterfaceCV";
import {DBConnection} from "../../config/sequelize";
import { stringSanitizer } from "../../util/stringsanitizer";
import { Prenotazione } from "../prenotazione";
// Nel proxy andiamo a implementare tutti i controlli e le sanificazioni sui dati di input per evitare problemi e crash del sistema

export class proxyCV implements proxyInterfaceCV{
// Definiamo diversi model utili per implementare le varie funzionalità
    private model:Centro_vaccinale;
    private modelPR:Prenotazione;
    constructor(){
        this.model = new Centro_vaccinale(DBConnection.getInstance().getConnection())
        this.modelPR = new Prenotazione(DBConnection.getInstance().getConnection());
    }
// Metodo per inserire un nuovo centro vaccinale
    async insertNewCV(lati: number, longi: number, nome: string, maxf1: number, maxf2: number): Promise<Object> {
        let sanitizednome = stringSanitizer(nome);  
        try {
        if(
        //Qui andiamo a sanificare i dati inseriti dall'utente
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
// Metodo per ottenere un centro vaccinale passando l'id
    public async getCentro(id:number){
        return await this.model.findOne(id);
    }
// Metodo per sanificare la latitudine
    TypeCheckLati(lati: number): Boolean{
        if(typeof lati !== 'number' || isNaN(lati) || !isFinite(lati)) throw new Error('Questo valore di latitudine non è un numero');
        return true;
    }
// Metodo per sanificare la longitudine
    TypeCheckLongi(longi: number): Boolean{
        if(typeof longi !== 'number' || isNaN(longi) || !isFinite(longi)) throw new Error('Questo valore di longitudine non è un numero');
        return true;
    }
// Metodo per sanificare il nome del centro vaccinale
    TypeCheckNome(nome: string): Boolean{
        if(typeof nome !== 'string' || nome.length > 255) throw new Error('Questo nome non è composto da lettere');
        return true;
    }
// Metodo per sanificare il numero massimo di vaccinazioni che il centro puo' fare durante la prima fascia oraria
    TypeCheckMaxf1(maxf1: number): Boolean{
        if(typeof maxf1 !== 'number' || isNaN(maxf1) || !isFinite(maxf1)) throw new Error('Il valore usato per maxf1 non è corretto');
        return true;
    }
// Metodo per sanificare il numero massimo di vaccinazioni che il centro puo' fare durante la seconda fascia oraria
    TypeCheckMaxf2(maxf2: number): Boolean{
        if(typeof maxf2 !== 'number' || isNaN(maxf2) || !isFinite(maxf2)) throw new Error('Il valore usato per maxf2 non è corretto');
        return true;
    }

    public makeRelationship(){
        console.log("making relationship on proxyCV");
        this.model.getModel().hasMany(this.modelPR.getModel(),{foreignKey: 'centro_vac_id'});
        this.modelPR.getModel().belongsTo(this.model.getModel(),{foreignKey: 'centro_vac_id'});
    }

    // Metodo per ottenere il riferimento al model
    public getProxyModel(){
        return this.model;
    }



}