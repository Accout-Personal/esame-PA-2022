var { Sequelize, Model, DataTypes } = require('sequelize');
/**
 *  Classe model che rappresenta la tabella 'centro_vaccinale' nel database 
 */
class Centro_vaccinale {

    private centro_vaccinale:any;

    constructor(sequelize: any){

        //nel costruttore vado a definire la struttura della tabella usando sequelize,
        // questo model mi permette di compiere varie operazioni 

        this.centro_vaccinale = sequelize.define("centro_vaccinale", {
            id: {
                type: DataTypes.BIGINT(20),
                autoIncrement: true,
                primaryKey: true
            }, 
            lati: {type:DataTypes.DOUBLE},
            longi: {type:DataTypes.DOUBLE},
            nome: {type:DataTypes.STRING},
            maxf1:{type:DataTypes.INTEGER},
            maxf2:{type:DataTypes.INTEGER}
          }, {
            tableName: 'centro_vaccinale',
            timestamps: false
          } );
    }
     
// Metodo per inserire un nuovo centro centro vaccinale
      public async inserisciCentro(lati: Number, longi: number, nome: string, maxf1:number, maxf2:number): Promise<Boolean>{
        try{
            await this.centro_vaccinale.create({lati: lati, longi: longi, nome: nome, maxf1: maxf1, maxf2: maxf2 });
            return true;
        } catch{
            return false;}
      }

}