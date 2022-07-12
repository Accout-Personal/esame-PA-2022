import { Sequelize, Model, DataTypes } from 'sequelize';
import { Prenotazione } from './prenotazione';
import { proxyInterface } from './ProxyInterface/proxyInterface';
/**
 *  Classe model che rappresenta la tabella 'users' nel database 
 */
export class Users implements proxyInterface {
  private user: any;
  private prenotazione:any
  constructor(sequelize: any) {

    //nel costruttore vado a definire la struttura della tabella usando sequelize,
    // questo model mi permette di compiere varie operazioni 
    //this.prenotazione = new Prenotazione(sequelize).getModel();

    this.user = sequelize.define("user", {
      id: {
        type: DataTypes.BIGINT(),
        autoIncrement: true,
        primaryKey: true
      },
      cf: { type: DataTypes.STRING },
      username: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      tipo: { type: DataTypes.INTEGER }
    }, {
      tableName: 'users',
      timestamps: false
    });
    
  }
// Questo metodo serve per inserire un nuovo elemento
  public async insertNewElement(Input: {cf: string, username: string, password: string, tipo: number}): Promise<Object> {
    try {
      await this.user.create({ cf: Input.cf, username: Input.username, password: Input.password, tipo: Input.tipo.toString() });
      return true;
    } catch {
      return false;
    }
  }

// Metodo per prendere tutti gli elementi della tabella
  public async trovaTutto(connessione: object) {
    return await this.user.findAll();
  }
// Metodo per prendere solo un risultato, infatti l'id è la Primary key della tabella
  public async findOne(id: number) {
    return await this.user.findOne({ where: { id: id } });
  }

  // Metodo per ottenere il modello della tabella
  public getModel(): any {
    return this.user;
  }
  
}