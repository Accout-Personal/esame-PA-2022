import { proxyInterfaceVac } from "./ProxyInterface/proxyinterfaceVacc";

var { Sequelize, Model, DataTypes } = require('sequelize');
/**
 *  Classe model che rappresenta la tabella 'vaccino' nel database 
 */
export class Vaccini implements proxyInterfaceVac {

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
    // metodo per inserire un nuovo vaccino
    async insertNewVacc(nome:string, validita:number): Promise<Object>{
        try{
            await this.vaccino.create({nome: nome, validita: validita});
            return true;
        } catch{
            return false;
        }
      }

      // Metodo per ottenere il modello
      public getModel(): any {
        return this.vaccino;
      }
}