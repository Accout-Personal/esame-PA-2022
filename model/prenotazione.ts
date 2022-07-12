var { Sequelize, Model, DataTypes } = require('sequelize');
import { Centro_vaccinale } from "./centro_vaccinale";
import { Users } from "./users";
import { Vaccini } from "./vaccino";
import { DateTime } from "luxon";
import { proxyInterfacePr } from "./ProxyInterface/proxyInterfacePr";
/**
 *  Classe model che rappresenta la tabella 'prenotazione' nel database 
 */
export class Prenotazione implements proxyInterfacePr {
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
  public async insertNewElement(Input: {data: string, fascia: number, slot: number, centro_vaccino: number, vaccino: number, user: number}): Promise<Object> {
    return await this.prenotazione.create(
      {
        data: DateTime.fromISO(Input.data).toISODate(),
        fascia: Input.fascia,
        slot: Input.slot,
        centro_vac_id: Input.centro_vaccino,
        vaccinoid: Input.vaccino,
        userid: Input.user
      });
  }
// Metodo usato per cambiare lo stato della prenotazione in accettato
  public async confirmUUID(uuid: string) {
    return await this.prenotazione.update(
      { stato: 1 },
      {
        where: {
          uuid: uuid
        }
      }
    );
  }

  // Metodo usato per effettuare una modifica di una prenotazione
  public async modifica(value: {id: number, updatebody: any}) {
    return await this.prenotazione.update(
      value.updatebody,
      {
        where: {
          id: value.id
        }
      }
    );
  }

  // metodo per inserire una prenotazione
  public async cancellaPre(id: number,user:number): Promise<Object> {
    return await this.prenotazione.destroy(
      {
        where: { 
          id: id,
          userid:user
        }
      });
  }
  // Metodo usato per prendere tutte le prenotazioni di un utente
  public async getPreUser(userid: number) {
    return await this.prenotazione.findAll({
      where: {
        userid: userid
      }
    });
  }
  // Metodo per prendere tutte le prenotazioni di centro vaccinale per una certa data
  public async getPreCentro(centro: number, data: string) {
    return await this.prenotazione.findAll({
      where: {
        centro_vac_id: centro,
        data: data
      },
      include: ["user", "vaccino"]
    });
  }

  //metodo per restituire informazioni della prenotazione
  public async getInfo(uuid: number) {
    return await this.prenotazione.findOne({
      where: {
        uuid: uuid
      },
      include: ['user', 'vaccino']
    });
  }

  // Metodo per ottenere il modello
  public getModel(): any {
    return this.prenotazione;
  }

  // Metodo per ottenere una prenotazione specifica
  public async findOne(id: number): Promise<any> {
    return await this.prenotazione.findOne({ where: { id: id } });
  }

  // Metodo per impostare le prenotazioni come 'non andate a buon fine'
  public async setBadPrenotations(data: string): Promise<void> {
    let list = await this.getBadPrenotation(data);
    list = list.map((value) => {
        return value.dataValues.id
    })
    await this.prenotazione.update({ stato: 2 }, {
        where: {
            id: list
        }
    })
}

  // Metodo che restituisce tutte le prenotazioni che non sono andate a buon fine, prende in input una data, un booleano, che modifica la query e un centro vaccinale.
    public async getBadPrenotation(data: string, option: Boolean = true, id?: number): Promise<Array<any>> {
      let list;
      if (option) {
          list = await this.prenotazione.findAll({
              attributes: ['id', 'data'],
              where: {
                  data: data,
                  stato: 0
              }
          });
      }
      else {
          list = await this.prenotazione.findAndCountAll({
              attributes: ['centro_vac_id', 'data'],
              where: {
                  centro_vac_id: id,
                  data: data,
                  stato: 2
              },
              group: ['centro_vac_id', 'data']
          });
      }
      return list;
  }

  // Metodo per ottenere le statistiche sui centri vaccinali e sulle prenotazioni che hanno avuto esito positivo
  public async getStatisticPositive(asc: Boolean): Promise<Array<Object>> {

    let positiveResult = await this.prenotazione.findAndCountAll({
        attributes: ['centro_vac_id', 'stato'],
        where: { stato: 1 },
        group: ['centro_vac_id', 'stato']
    });
    let allResult = await this.prenotazione.findAndCountAll({
        attributes: ['centro_vac_id'],
        group: ['centro_vac_id']
    });
    let statistic = positiveResult.count.map((value) => {
        allResult.count.map((val) => {
            if (value.centro_vac_id == val.centro_vac_id) {
                value.media = (value.count / val.count).toFixed(2);
            }
        });
        return value;
    });
    // Qui andiamo ad effettuare l'ordinamento del risultato finale
    if (asc) statistic.sort((a, b) => {
        return a.media - b.media;
    });
    else statistic.sort((a, b) => {
        return b.media - a.media;
    });
    return statistic;
}

// Metodo che restituisce, per ogni centro vaccinale, per ogni fascia, e, per ogni data, il numero di prenotazioni, più gli altri attributi
public async takeNumberOfPrenotation(fascia: Boolean): Promise<Array<any>> {
  if (fascia) {
      let result = await this.prenotazione.findAndCountAll({
          attributes: ['centro_vac_id', 'data', 'fascia'],
          group: ['centro_vac_id', 'data', 'fascia']
      })
      return result.count
  }
  else {
      let result = await this.prenotazione.findAndCountAll({
          attributes: ['centro_vac_id', 'data'],
          group: ['centro_vac_id', 'data']
      })
      return result.count
  }
}

// Metodo che ritorna tutte le prenotazioni effettuate per una certa data, in un certo centro vaccinale e per una certa fascia
async getSlotFull(id: number, data: Array<string>, fascia?: number): Promise<any> {
  if (typeof fascia === 'undefined') {
      let query = await this.prenotazione.findAll({
          attributes: ['data', 'slot'],
          where: {
              centro_vac_id: id,
              data: data
          }
      });
      return query;
  }
  else {
      let query = await this.prenotazione.findAll({
          attributes: ['data', 'slot'],
          where: {
              centro_vac_id: id,
              data: data,
              fascia: fascia
          }
      });
      return query;
  }
}
}