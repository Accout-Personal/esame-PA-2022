var { Sequelize, Model, DataTypes } = require('sequelize');
/**
 *  Classe model che rappresenta la tabella 'vaccino' nel database 
 */
class Vaccini {

    private vaccino: any;

    constructor(sequelize:any){
        
        //nel costruttore vado a definire la struttura della tabella usando sequelize,
        // questo model mi permette di compiere varie operazioni 

        this.vaccino = sequelize.define("vaccino", {
            id: {
                type: DataTypes.BIGINT(20),
                autoIncrement: true,
                primaryKey: true,
            }, 
            nome: {type:DataTypes.STRING},
            validita:{type:DataTypes.INTEGER,},
          }, {
            tableName: 'vaccino',
            timestamps: false
          } );
    }
    // metodo per inserire un nuovo vaccino
    async inserisciVaccino(nome:string, validita:Number): Promise<Boolean>{
        try{
            await this.vaccino.create({nome: nome, validita: validita});
            return true;
        } catch{
            return false;
        }
      }
}