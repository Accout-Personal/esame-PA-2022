import { Users } from "../users";
import { stringSanitizer } from "../../util/stringsanitizer";
import * as crypto from 'node:crypto';
import { DBConnection } from "../../config/sequelize";
import { proxyInterface } from "../ProxyInterface/proxyInterface";

// Questo è il proxy per la componente nel model users
export class proxyUs implements proxyInterface {

    private model: Users;

    constructor() {
        this.model = new Users(DBConnection.getInstance().getConnection())
    }

// Questo metodo serve per inserire un nuovo utente
    public async insertNewElement(Input:{cf: string, username: string, password: string, tipo: number}): Promise<Object> {
        Input.cf = stringSanitizer(Input.cf);
        Input.username = stringSanitizer(Input.username);
        Input.password = stringSanitizer(Input.password);
        try {
            if (
            // Qui vengono sanificati i parametri di input inseriti dall'utente
                this.TypeCheckCF(Input.cf) &&
                this.TypeCheckUsername(Input.username) &&
                this.TypeCheckPassword(Input.password) &&
                this.TypeCheckTipo(Input.tipo)
            ) {
                return await this.model.insertNewElement({cf: Input.cf, username: Input.username,password: crypto.createHash('sha256').update(Input.password).digest('hex'), tipo: Input.tipo});
            }
        } catch (error) { return error; }
    }
// Questo metodo fa una query sulla tabella users del DB, passando come parametro uno username che è chiave
    public async getUser(username: string) {
        username = stringSanitizer(username)
        if (this.TypeCheckUsername(username))
            return await this.model.getModel().findOne({
                where: {
                    username: username
                }
            });
    }
// Questo metodo fa una query sulla tabella users del DB, passando come parametro un id che è chiave primaria
    public async getUserByID(id: number) {
        return await this.model.getModel().findOne({
            where: {
                id: id
            }
        });
    }
// Metodo che ritorna un riferimento al modello
    public getModel() {
        return this.model;
    }
// Questo metodo fa un controllo sul codice fiscale inserito dall'utente
    TypeCheckCF(cf: string): Boolean {
        if ((typeof cf !== 'string' || cf.length > 255)) throw new Error('Questo codice fiscale non è valido');
        return true;
    }
// Questo metodo fa un controllo sullo username inserito dall'utente
    TypeCheckUsername(username: string): Boolean {
        if ((typeof username !== 'string' || username.length > 255)) throw new Error('Questo username non è valido');
        return true;
    }
// Questo metodo fa un controllo sulla password inserita dall'utente
    TypeCheckPassword(password: string): Boolean {
        if ((typeof password !== 'string' || password.length > 255)) throw new Error('Questa password non è corretta');
        return true;
    }
// Questo metodo fa un controllo sul tipo inserito dall'utente
    TypeCheckTipo(tipo: number): Boolean {
        if (typeof tipo !== 'number' || isNaN(tipo) || !isFinite(tipo)) throw new Error('Questo valore non è un numero');
        return true;
    }

// Questo metodo serve ottenere uno users specifico
public async findOne(id: number): Promise<any> {
    return await this.model.findOne(id);
}
}