import { proxyInterface } from "./ProxyInterface/proxyInterface";

var { Sequelize, Model, DataTypes } = require('sequelize');
/**
 *  Classe model che rappresenta la tabella 'vaccino' nel database 
 */
export class Vaccini implements proxyInterface {

    private vaccino: any;

    constructor(sequelize:any){
        
        //nel costruttore vado a definire la struttura della tabella usando sequelize,
        // questo model mi permette di compiere varie operazioni 

        this.vaccino = sequelize.define("vaccino", {
            id: {
                type: DataTypes.BIGINT(20),
                autoIncrement: true,
                primaryKey: true
            }, 
            nome: {type:DataTypes.STRING},
            validita:{type:DataTypes.INTEGER},
          }, {
            tableName: 'vaccino',
            timestamps: false
          } );
    }
  // Metodo per trovare un vaccino specifico
  public async findOne(id: number): Promise<any> {
    return await this.vaccino.findOne({
      where:{
        id:id
      }
    });
  }
  // Questo metodo serve per inserire un nuovo elemento
  public async insertNewElement(Input:{nome:string, validita:number}): Promise<Object> {
      try{
        await this.vaccino.create({nome: Input.nome, validita: Input.validita});
        return true;
    } catch{
        return false;
    }
  }

      // Metodo per ottenere il modello della tabella
      public getModel(): any {
        return this.vaccino;
      }
}