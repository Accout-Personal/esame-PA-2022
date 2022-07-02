import { Prenotazione } from "../prenotazione";
import { proxyinterfacePR } from "../ProxyInterface/proxyinterfacePren";
import { Sequelize, Model, DataTypes } from 'sequelize';
import { Vaccini } from "../vaccino";
import { Users } from "../users";
import { Centro_vaccinale } from "../centro_vaccinale";

export class proxyPr implements proxyinterfacePR {

    private model:Prenotazione;
    private modelV:Vaccini;
    private modelU:Users;
    private modelCV:Centro_vaccinale;

    constructor(connessione:Sequelize){
        this.model = new Prenotazione(connessione);
        this.modelV = new Vaccini(connessione);
        this.modelU = new Users(connessione);
        this.modelCV = new Centro_vaccinale(connessione);
    }

    async insertNewPr(giorno:number, mese:number,anno:number , fascia: number, slot: number, centro_vaccino: number, vaccino: number, user: number, stato: number): Promise<Object> {  
        try {
        if(
            this.TypeCheckData(giorno,mese,anno) &&
            this.TypeCheckFascia(fascia) &&
            this.TypeCheckSlot(slot) &&
            this.TypeCheckCV(centro_vaccino) &&
            await this.TypeCheckVaccino(vaccino) &&
            this.TypeCheckUser(user) &&
            this.TypeCheckStato(stato)
        ) {
                return await this.model.insertNewPr(giorno, mese, anno, fascia, slot, centro_vaccino, vaccino, user, stato);  
            }     
        } catch(error) {return error;}
    }

    TypeCheckData(giorno:number, mese:number, anno:number): Boolean{
        if((typeof giorno !== 'number' || isNaN(giorno))) throw new Error('Questa giorno non è valido');
        if((typeof mese !== 'number' || isNaN(mese))) throw new Error('Questa mese non è valido');
        if((typeof anno !== 'number' || isNaN(anno))) throw new Error('Questa anno non è valido');
        return true;
    }

    TypeCheckFascia(fascia: number): Boolean{
        if(typeof fascia !== 'number' || isNaN(fascia)) throw new Error('Questa fascia non è valida');
        return true;
    }

    TypeCheckSlot(slot: number): Boolean{
        if(typeof slot !== 'number' || isNaN(slot)) throw new Error('Questa slot non è valido');
        return true;
    }

    TypeCheckCV(Cv: number): Boolean{
        if(typeof Cv !== 'number' || isNaN(Cv)) throw new Error('Questo centro vaccino non è valido');
        return true;
    }

    async TypeCheckVaccino(vaccino: number): Promise<Boolean>{
        if(typeof vaccino !== 'number' || isNaN(vaccino)) throw new Error('Questo vaccino non è valido');
        let test = await this.modelV.getModel().findAll({
            where: {
              id: vaccino
            }
          });
        if(Object.keys(test).length == 0) throw new Error('Questo vaccino non esiste');
        return true;
    }

    TypeCheckUser(user: number): Boolean{
        if(typeof user !== 'number' || isNaN(user)) throw new Error('Questo utente non è valido');
        return true;
    }

    TypeCheckStato(stato: number): Boolean{
        if(typeof stato !== 'number' || isNaN(stato)) throw new Error('Questo stato non è valido');
        return true;
    }
}