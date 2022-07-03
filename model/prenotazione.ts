var { Sequelize, Model, DataTypes } = require('sequelize');
import { Centro_vaccinale } from "./centro_vaccinale";
import { proxyinterfacePR } from "./ProxyInterface/proxyinterfacePren";
import { Users } from "./users";
import { Vaccini } from "./vaccino";
import { DateTime } from "luxon";
/**
 *  Classe model che rappresenta la tabella 'prenotazione' nel database 
 */
export class Prenotazione implements proxyinterfacePR {
  // I model delle altre classi servono per definire i vincoli d'integrità referenziale
  private prenotazione: any;
  private centro_vaccinaleModel: any;
  private userModel: any;
  private vaccinoModel: any;

  constructor(sequelize: any) {

    //nel costruttore vado a definire la struttura della tabella usando sequelize,
    // questo model mi permette di compiere varie operazioni 

    this.userModel = new Users(sequelize).getModel();
    this.centro_vaccinaleModel = new Centro_vaccinale(sequelize).getModel();
    this.vaccinoModel = new Vaccini(sequelize).getModel();
    this.prenotazione = sequelize.define("prenotazione", {
      id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
      },
      data: { type: DataTypes.DATE },
      fascia: { type: DataTypes.INTEGER },
      slot: { type: DataTypes.INTEGER },
      centro_vac: {
        type: DataTypes.BIGINT(20),
        references: {
          model: this.centro_vaccinaleModel,
          key: 'id',
        }
      },
      vaccino: {
        type: DataTypes.BIGINT(20),
        references: {
          model: this.vaccinoModel,
          key: 'id'
        }
      },
      user: {
        type: DataTypes.BIGINT(20),
        references: {
          model: this.userModel,
          key: 'id'
        }
      },
      stato: { type: DataTypes.BIGINT(20), defaultValue: 0 },
      uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 }
    }, {
      tableName: 'prenotazione',
      timestamps: false
    });
  }

  // metodo per inserire una prenotazione
  async insertNewPr(data: string, fascia: number, slot: number, centro_vaccino: number, vaccino: number, user: number): Promise<Object> {
    try {
      let dataIns = DateTime.fromISO(data)
      await this.prenotazione.create({ data: dataIns.toISODate(), fascia: fascia, slot: slot, centro_vac: centro_vaccino, vaccino: vaccino, user: user });
      return this.prenotazione;
    } catch {
      return false;
    }
  }

  async getPreUser(userid: number) {
    return await this.prenotazione.findAll({
      where: {
        user: userid
      }
    });
  }

  async getPreCentro(centro: number, data: string) {
    return await this.prenotazione.findAll({
      where: {
        centro_vac: centro,
        data: data
      }
    });
  }

  // Metodo per ottenere il modello
  public getModel(): any {
    return this.prenotazione;
  }
}