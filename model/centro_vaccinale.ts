import { proxyInterfaceCV } from "./ProxyInterface/proxyinterfaceCV";

var { Sequelize, Model, DataTypes } = require('sequelize');
/**
 *  Classe model che rappresenta la tabella 'centro_vaccinale' nel database 
 */
export class Centro_vaccinale implements proxyInterfaceCV {

  private centro_vaccinale: any;

  constructor(sequelize: any) {

    //nel costruttore vado a definire la struttura della tabella usando sequelize,
    // questo model mi permette di compiere varie operazioni 

    this.centro_vaccinale = sequelize.define("centro_vaccinale", {
      id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
      },
      lati: { type: DataTypes.DOUBLE },
      longi: { type: DataTypes.DOUBLE },
      nome: { type: DataTypes.STRING },
      maxf1: { type: DataTypes.INTEGER },
      maxf2: { type: DataTypes.INTEGER }
    }, {
      tableName: 'centro_vaccinale',
      timestamps: false
    });
  }

  // Metodo per inserire un nuovo centro centro vaccinale
  public async insertNewCV(lati: number, longi: number, nome: string, maxf1: number, maxf2: number): Promise<Object> {
    try {
      await this.centro_vaccinale.create({ lati: lati, longi: longi, nome: nome, maxf1: maxf1, maxf2: maxf2 });
      return true;
    } catch (error) {
      return error
    }
  }

  // Metodo per ottenere il modello della tabella
  public getModel(): any {
    return this.centro_vaccinale;
  }

  //Metodo per ottenere determinati centri vaccinali 
  async getSpecificCV(id: number): Promise<Object> {
    let query = this.centro_vaccinale.findAll({
      attributes: ['id', 'maxf1', 'maxf2'],
      where: {
        id: id
      }
    });
    return query;
  }
// Metodo per eseguire una query sulla tabella passando l'id del centro vaccinale
  public async findOne(id:number){
    return await this.centro_vaccinale.findOne({
      where:{
        id:id
      }
    })
  }
}