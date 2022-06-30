import { Sequelize, Model, DataTypes } from 'sequelize';
/**
 *  Classe model che rappresenta la tabella 'users' nel database 
 */
export class Users {
    private user: any;
    constructor(sequelize:any){

        //nel costruttore vado a definire la struttura della tabella usando sequelize,
        // questo model mi permette di compiere varie operazioni 

        this.user = sequelize.define("user", {
            id: {
                type:DataTypes.BIGINT(),
                autoIncrement: true,
                primaryKey: true
            }, 
            cf: {type:DataTypes.STRING},
            username: {type:DataTypes.STRING},
            password: {type:DataTypes.STRING},
            tipo:{type:DataTypes.INTEGER}
          }, {
            tableName: 'users',
            timestamps: false
          } );
    }

    // Metodo per inserire un nuovo user
      public async inserisciUser(connessione: object, cf: string, username: string,password: string, tipo:number): Promise<Boolean>{
        try{
            await this.user.create({cf: cf, username: username,password: password,tipo: tipo.toString() });
            return true;
        } catch{
            return false;}
      }
    
    public async trovaTutto(connessione: object){
        return await this.user.findAll();
    }

    // Metodo per ottenere il modello
    public getModel():any{
      return this.user;
    }
}