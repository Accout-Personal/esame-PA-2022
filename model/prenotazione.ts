var { Sequelize, Model, DataTypes } = require('sequelize');
import { Centro_vaccinale } from "./centro_vaccinale";
import { proxyinterfacePR } from "./ProxyInterface/proxyinterfacePren";
import { Users } from "./users";
import { Vaccini } from "./vaccino";
/**
 *  Classe model che rappresenta la tabella 'prenotazione' nel database 
 */
export class Prenotazione implements proxyinterfacePR{
  // I model delle altre classi servono per definire i vincoli d'integrità referenziale
    private prenotazione:any;
    private centro_vaccinaleModel:any;
    private userModel:any;
    private vaccinoModel:any;

    constructor(sequelize:any){

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
            data: {type:DataTypes.DATE},
            fascia: {type:DataTypes.INTEGER},
            slot: {type:DataTypes.INTEGER},
            centro_vac:{
              type:DataTypes.BIGINT(20),
              references: {
                model: this.centro_vaccinaleModel,
                key: 'id',
            }
          },
            vaccino:{
              type:DataTypes.BIGINT(20),
              references: {
                model: this.vaccinoModel,
                key: 'id'
              }
            },
            user:{
              type:DataTypes.BIGINT(20),
              references: {
                model: this.userModel,
                key: 'id'
              }
            },
            stato:{type:DataTypes.BIGINT(20)}
          }, {
            tableName: 'prenotazione',
            timestamps: false
          } );
    }

    // metodo per inserire una prenotazione
    async insertNewPr(giorno:number, mese:number,anno:number , fascia: number, slot: number, centro_vaccino: number, vaccino: number, user: number, stato: number):Promise<Object> {
      try{
        let data = giorno.toString()+'/'+mese.toString()+'/'+anno.toString()
        await this.prenotazione.create({data: data, fascia: fascia, slot: slot, centro_vaccino: centro_vaccino, vaccino: vaccino, user: user, stato: stato});
        return true;
    } catch{
        return false;
    }
    }
}