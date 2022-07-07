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
      data: { type: DataTypes.DATEONLY },
      fascia: { type: DataTypes.INTEGER },
      slot: { type: DataTypes.INTEGER },
      centro_vac_id: {
        type: DataTypes.BIGINT(20),
        references: {
          model: this.centro_vaccinaleModel,
          key: 'id',
        }
      },
      vaccinoid: {
        type: DataTypes.BIGINT(20),
        references: {
          model: this.vaccinoModel,
          key: 'id'
        }
      },
      userid: {
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
  public async insertNewPr(data: string, fascia: number, slot: number, centro_vaccino: number, vaccino: number, user: number): Promise<Object> {
    return await this.prenotazione.create(
      {
        data: DateTime.fromISO(data).toISODate(),
        fascia: fascia,
        slot: slot,
        centro_vac_id: centro_vaccino,
        vaccinoid: vaccino,
        userid: user
      });
  }

  public async modifica(id: number, updatebody: any) {
    return await this.prenotazione.update(
      updatebody,
      {
        where: {
          id: id
        }
      }
    );
  }

  // metodo per inserire una prenotazione
  public async delete(id: number): Promise<Object> {
    return await this.prenotazione.destroy(
      {
        where: { id: id }
      });
  }

  public async getPreUser(userid: number) {
    return await this.prenotazione.findAll({
      where: {
        userid: userid
      }
    });
  }

  public async getPreCentro(centro: number, data: string) {
    return await this.prenotazione.findAll({
      where: {
        centro_vac_id: centro,
        data: data
      },
      include:'user1'
    });
  }

  // Metodo per ottenere il modello
  public getModel(): any {
    return this.prenotazione;
  }
}