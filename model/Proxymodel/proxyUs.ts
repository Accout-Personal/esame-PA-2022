import { proxyInterfaceUsers } from "../ProxyInterface/proxyinterfaceUsers";
import { Users } from "../users";
import { stringSanitizer } from "../../util/stringsanitizer";
import * as crypto from 'node:crypto';
import { DBConnection } from "../../config/sequelize";

// Questo è il proxy per la componente nel model users
export class proxyUs implements proxyInterfaceUsers {

    private model: Users;

    constructor() {
        this.model = new Users(DBConnection.getInstance().getConnection())
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
// Questo metodo serve per inserire un nuovo utente
    public async insertNewUsers(cf: string, username: string, password: string, tipo: number): Promise<Object> {
        cf = stringSanitizer(cf);
        username = stringSanitizer(username);
        password = stringSanitizer(password);
        try {
            if (
            // Qui vengono sanificati i parametri di input inseriti dall'utente
                this.TypeCheckCF(cf) &&
                this.TypeCheckUsername(username) &&
                this.TypeCheckPassword(password) &&
                this.TypeCheckTipo(tipo)
            ) {
                return await this.model.insertNewUsers(cf, username, crypto.createHash('sha256').update(password).digest('hex'), tipo);
            }
        } catch (error) { return error; }
    }

    public async getPreUser(user:number){
        
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
}