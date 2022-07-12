import { Vaccini } from "../vaccino";
import { stringSanitizer } from "../../util/stringsanitizer";
import { DBConnection } from "../../config/sequelize"
import { proxyInterface } from "../ProxyInterface/proxyInterface";

// Questa classe rappresenta il proxy per la componente model del vaccino
export class proxyVC implements proxyInterface {

    public model: Vaccini;

    constructor() {
        this.model = new Vaccini(DBConnection.getInstance().getConnection())
    }
// Questo metodo serve per inserire un nuovo elemento
    public async insertNewElement(Input:{nome:string, validita:number}): Promise<Object> {
        let nomesanitized = stringSanitizer(Input.nome);
        this.TypeCheckNome(nomesanitized);
        this.TypeCheckValidita(Input.validita);
        return await this.model.insertNewElement({nome:nomesanitized, validita:Input.validita});
    }

    // Metodo per sanificare il nome del vaccino
    TypeCheckNome(nome: string): Boolean {
        if ((typeof nome !== 'string' || nome.length > 255)) throw new Error('Questo nome non è valido');
        return true;
    }
    // Metodo per sanificare la validità del vaccino
    TypeCheckValidita(validita: number): Boolean {
        if (typeof validita !== 'number' || isNaN(validita) || !isFinite(validita)) throw new Error('Questo valore di validità non è un numero');
        if (validita <= 0) throw new Error('Questo valore di validità non è valido');
        return true;
    }
    // Metodo che ritorna un vaccino specifico
    public async findOne(id: number): Promise<any> {
        return await this.model.findOne(id);
    }

    // Metodo che ritorna un riferimento al model
    public getModel() {
        return this.model;
    }
}