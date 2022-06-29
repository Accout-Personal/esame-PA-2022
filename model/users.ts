var { Sequelize, Model, DataTypes } = require('sequelize');

class users {

    private user: any;
    constructor(sequelize:any){
        this.user = sequelize.define("user", {
            id: {
                type: DataTypes.BIGINT(20),
                autoIncrement: true,
                primaryKey: true,
            }, 
            cf: {type:DataTypes.STRING},
            username: {type:DataTypes.STRING},
            password: {type:DataTypes.STRING},
            tipo:{type:DataTypes.INTEGER,}
          }, {
            tableName: 'users',
            timestamps: false
          } );
    }

      public async inserisciUser(connessione: object, cf: string, username: string,password: string, tipo:number): Promise<Boolean>{
        try{
            await this.user.create({cf: cf, username: username,password: password,tipo: tipo.toString() });
            return true;
        } catch{
            return false;}
      }
}