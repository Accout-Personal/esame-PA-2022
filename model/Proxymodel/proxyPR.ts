import { Prenotazione } from "../prenotazione";
import { proxyinterfacePR } from "../ProxyInterface/proxyinterfacePren";
import { Sequelize, Model, DataTypes } from 'sequelize';
import { Vaccini } from "../vaccino";
import { Users } from "../users";
import { Centro_vaccinale } from "../centro_vaccinale";
import {DBConnection} from "../../config/sequelize"
import { DateTime } from "luxon";

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
        try {
        if(
            this.TypeCheckData(data) &&
            this.TypeCheckFascia(fascia) &&
            this.TypeCheckSlot(slot) &&
            await this.TypeCheckCV(centro_vaccino) &&
            await this.TypeCheckVaccino(vaccino) &&
            await this.TypeCheckUser(user) &&
            this.TypeCheckStato(stato)
        ) {
                return await this.model.insertNewPr(data, fascia, slot, centro_vaccino, vaccino, user, stato);  
            }     
        } catch(error) {return error;}
    }

    private TypeCheckData(data:string): Boolean{
        let dataIns = DateTime.fromISO(data)
        if((typeof data !== 'string' || !dataIns.isValid)) throw new Error('Questa data non è valida');
        return true;
    }

    private TypeCheckFascia(fascia: number): Boolean{
        if(typeof fascia !== 'number' || isNaN(fascia)) throw new Error('Questa fascia non è valida');
        return true;
    }

    private TypeCheckSlot(slot: number): Boolean{
        if(typeof slot !== 'number' || isNaN(slot)) throw new Error('Questa slot non è valido');
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
}