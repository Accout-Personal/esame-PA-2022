var { Sequelize, Model, DataTypes } = require('sequelize');
/**
 *  Classe model che rappresenta la tabella 'prenotazione' nel database 
 */
class prenotazione {
    private prenotazione:any;

    constructor(sequelize:any){
        this.prenotazione = sequelize.define("prenotazione", {
            id: {
                type: DataTypes.BIGINT(20),
                autoIncrement: true,
                primaryKey: true
            }, 
            data: {type:DataTypes.DATE},
            fascia: {type:DataTypes.INTEGER},
            slot: {type:DataTypes.INTEGER},
            centro_vac:{
              type:DataTypes.BIGINT(20),
              references: {
                model: user,
                key: 'id',
            },
            vaccino:{type:DataTypes.BIGINT(20),},
            user:{type:DataTypes.BIGINT(20)},
            stato:{type:DataTypes.BIGINT(20)}
          }, {
            tableName: 'prenotazione',
            timestamps: false
          } );
    }
}