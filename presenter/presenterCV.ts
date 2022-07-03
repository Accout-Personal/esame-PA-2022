var { Sequelize, Model, DataTypes } = require('sequelize');
import { proxyInterfaceCV } from "../model/ProxyInterface/proxyinterfaceCV";
import { proxyCV } from "../model/Proxymodel/proxyCV";
import * as haversine from 'haversine'
import { builderInterfaceCV } from "./builder/builderInterface/builderInterfaceCV";
/*
* Utilizziamo il pattern builder per implementare questa classe, in quanto abbiamo che il contenuto restituito all'utente può variare a seconda delle richieste
*/

export class PresentCV {

    private proxyInterfaceCV:proxyInterfaceCV;
    private buildCV:builderInterfaceCV;

    constructor(){ 
        this.proxyInterfaceCV = new proxyCV();
    }

    haversineFunctionNoFilter(scelta:Boolean){
        if(scelta) //fai qualcosa
        else //fai altro
    }

}