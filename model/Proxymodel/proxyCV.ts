import { Centro_vaccinale } from "../centro_vaccinale";
import { DBConnection } from "../../config/sequelize";
import { stringSanitizer } from "../../util/stringsanitizer";
import { Prenotazione } from "../prenotazione";
import { proxyInterface } from "../ProxyInterface/proxyInterface";
// Nel proxy andiamo a implementare tutti i controlli e le sanificazioni sui dati di input per evitare problemi e crash del sistema

export class proxyCV implements proxyInterface {
    // Definiamo diversi model utili per implementare le varie funzionalità
    private model: Centro_vaccinale;
    private modelPR: Prenotazione;
    constructor() {
        this.model = new Centro_vaccinale(DBConnection.getInstance().getConnection())
        this.modelPR = new Prenotazione(DBConnection.getInstance().getConnection());
    }

    // Metodo per inserire un nuovo centro vaccinale
    public async insertNewElement(Input:{lati: number, longi: number, nome: string, maxf1: number, maxf2: number}): Promise<Object> {
        Input.nome = stringSanitizer(Input.nome);
        //Qui andiamo a sanificare i dati inseriti dall'utente
        this.TypeCheckLati(Input.lati);
        this.TypeCheckLongi(Input.longi);
        this.TypeCheckNome(Input.nome);
        this.TypeCheckMaxf1(Input.maxf1);
        this.TypeCheckMaxf2(Input.maxf2);
        let result = await this.model.insertNewElement({lati: Input.lati, longi: Input.longi, nome: Input.nome, maxf1: Input.maxf1, maxf2: Input.maxf2});
        return result;
    }
    
    // Metodo per ottenere un centro vaccinale passando l'id
    public async findOne(id: number): Promise<any> {
        return await this.model.findOne(id);
    }
    // Metodo per sanificare la latitudine e longitudine
    private TypeCheckLati(lati: number): Boolean {
        if (typeof lati !== 'number' || isNaN(lati) || !isFinite(lati)) throw new Error('Questo valore di latitudine non è un numero');
        if (lati > 90 || lati<-90) throw new Error('Questo valore di latitudine non è valido');
        return true;
    }

    // Metodo per sanificare la latitudine e longitudine
    private TypeCheckLongi(lati: number): Boolean {
        if (typeof lati !== 'number' || isNaN(lati) || !isFinite(lati)) throw new Error('Questo valore di longitudine non è un numero');
        if (lati > 180 || lati<-180) throw new Error('Questo valore di longitudine non è valido');
        return true;
    }

    // Metodo per sanificare il nome del centro vaccinale
    private TypeCheckNome(nome: string): Boolean {
        if (typeof nome !== 'string' || nome.length > 255) throw new Error('Questo nome non è composto da lettere');
        return true;
    }
    // Metodo per sanificare il numero massimo di vaccinazioni che il centro puo' fare durante la prima fascia oraria
    private TypeCheckMaxf1(maxf1: number): Boolean {
        if (typeof maxf1 !== 'number' || isNaN(maxf1) || !isFinite(maxf1)) throw new Error('Il valore usato per maxf1 non è corretto');
        if (maxf1 < 0 ) throw new Error('Questo valore di maxf1 non è valido');
        return true;
    }
    // Metodo per sanificare il numero massimo di vaccinazioni che il centro puo' fare durante la seconda fascia oraria
    private TypeCheckMaxf2(maxf2: number): Boolean {
        if (typeof maxf2 !== 'number' || isNaN(maxf2) || !isFinite(maxf2)) throw new Error('Il valore usato per maxf2 non è corretto');
        if (maxf2 < 0 ) throw new Error('Questo valore di maxf2 non è valido');
        return true;
    }

    public makeRelationship() {
        this.model.getModel().hasMany(this.modelPR.getModel(), { foreignKey: 'centro_vac_id' });
        this.modelPR.getModel().belongsTo(this.model.getModel(), { foreignKey: 'centro_vac_id' });
    }

    // Metodo per ottenere il riferimento al model
    public getModel() {
        return this.model;
    }

}