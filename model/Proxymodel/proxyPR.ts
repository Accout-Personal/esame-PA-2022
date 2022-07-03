import { Prenotazione } from "../prenotazione";
import { proxyinterfacePR } from "../ProxyInterface/proxyinterfacePren";
import { Sequelize, Model, DataTypes } from 'sequelize';
import { Vaccini } from "../vaccino";
import { Users } from "../users";
import { Centro_vaccinale } from "../centro_vaccinale";
import {DBConnection} from "../../config/sequelize"
import { DateTime } from "luxon";
import { UUID } from "sequelize";
export class proxyPr implements proxyinterfacePR {

    private model:Prenotazione;
    private modelV:Vaccini;
    private modelU:Users;
    private modelCV:Centro_vaccinale;

    constructor(){
        this.model = new Prenotazione(DBConnection.getInstance().getConnection());
        this.modelV = new Vaccini(DBConnection.getInstance().getConnection());
        this.modelU = new Users(DBConnection.getInstance().getConnection());
        this.modelCV = new Centro_vaccinale(DBConnection.getInstance().getConnection());
    }

    async insertNewPr(data:string, fascia: number, slot: number, centro_vaccino: number, vaccino: number, user: number, stato: number): Promise<Object> {  
            this.TypeCheckData(data);
            this.TypeCheckFascia(fascia);
            this.TypeCheckSlot(slot);
            await this.TypeCheckCV(centro_vaccino);
            await this.TypeCheckVaccino(vaccino);
            await this.TypeCheckUser(user);
            this.TypeCheckStato(stato);
            
            return await this.model.insertNewPr(data, fascia, slot, centro_vaccino, vaccino, user, stato);
    }

    async getListaPr(userid?:number,centro?:number,data?:string){
        
        if(typeof userid === "undefined" && typeof centro === "undefined"){
            throw Error("non hai inserito nessun paramentro");
        }
        
        if(typeof userid === "undefined"){
            this.TypeCheckData(data);
            return await this.model.getPreCentro(centro,data);
        }

        this.TypeCheckUser(userid);
        return await this.model.getPreUser(userid);

            
    }

    private CheckSlot

    private TypeCheckData(data:string): Boolean{
        let dataIns = DateTime.fromISO(data)
        if((typeof data !== 'string' || !dataIns.isValid)) throw new Error('Questa data non è valida');
        return true;
    }

    private TypeCheckFascia(fascia: number): Boolean{
        if(typeof fascia !== 'number' || isNaN(fascia)) throw new Error('Questa fascia non è valida');
        if(fascia > 2) throw new Error('Questa fascia non è valida');
        return true;
    }

    private TypeCheckSlot(slot: number): Boolean{
        if(typeof slot !== 'number' || isNaN(slot)) throw new Error('Questa slot non è valido');
        if(slot > 37) throw new Error('Questa fascia non è valida');
        return true;
    }

    private async TypeCheckCV(Cv: number): Promise<Boolean>{
        if(typeof Cv !== 'number' || isNaN(Cv)) throw new Error('Questo centro vaccino non è valido');
        let test = await this.modelCV.getModel().findAll({
            where: {
              id: Cv
            }
          });
        if(Object.keys(test).length == 0) throw new Error('Questo centro vaccino non esiste');
        return true;
    }

    private async TypeCheckVaccino(vaccino: number): Promise<Boolean>{
        if(typeof vaccino !== 'number' || isNaN(vaccino)) throw new Error('Questo vaccino non è valido');
        let test = await this.modelV.getModel().findAll({
            where: {
              id: vaccino
            }
          });
        if(Object.keys(test).length == 0) throw new Error('Questo vaccino non esiste');
        return true;
    }

    private async TypeCheckUser(user: number): Promise<Boolean>{
        if(typeof user !== 'number' || isNaN(user)) throw new Error('Questo utente non è valido');
        let test = await this.modelU.getModel().findAll({
            where: {
              id: user
            }
          });
        if(Object.keys(test).length == 0) throw new Error('Questo utente non esiste');
        return true;
    }

    private TypeCheckStato(stato: number): Boolean{
        if(typeof stato !== 'number' || isNaN(stato)) throw new Error('Questo stato non è valido');
        return true;
    }

    async takeNumberOfPrenotation(): Promise<Array<any>>{
        let result = await this.model.getModel().findAndCountAll({
            attributes: ['centro_vac', 'data','fascia' ],
            group: ['centro_vac', 'data','fascia' ]
        })
        return result.count
    }

    async takeSumF1F2() {
        let complete = [];
        let result = await this.modelCV.getModel().findAll({
            attributes: ['id','maxf1','maxf2']
        })
        result.map(val => {
            val.dataValues.somma = val.dataValues.maxf1+val.dataValues.maxf1
            complete.push(val.dataValues)
        });
        return complete;
    }
}