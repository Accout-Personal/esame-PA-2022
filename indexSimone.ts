import {DBConnection} from './config/sequelize';
import { Users } from './model/users';
import * as dotenv from 'dotenv';
import { proxyCV } from './model/Proxymodel/proxyCV';
import { proxyUs } from './model/Proxymodel/proxyUs';
import { proxyVC } from './model/Proxymodel/proxyVC';
import { proxyPr } from './model/Proxymodel/proxyPR';
import { Prenotazione } from './model/prenotazione';
import { buildCV } from './presenter/builder/buildCV';

async function querySemplice(connection){
    var users = new Users(connection);
    console.log(users);
    return await users.trovaTutto(connection);
}


console.log("hello world");
dotenv.config()
const connection = DBConnection.getInstance().getConnection();
/*querySemplice(connection).then(value=>{
    console.log(JSON.stringify(value));
});*/

/*async function stampa(prova:proxyPr){
    
    let result = await prova.insertNewPr('2020-02-02', 1, 14, 8, 1, 1, 0);
    switch(typeof result){
    case 'boolean': {
        console.log('è booleano');
        console.log(result);
        break;
    }
    case 'object': {
        console.log('non è bool');
        console.log(result)
        break;
}
    }
    
    console.log('mi dispiace, hai generato questa eccezione');
    //catch(error){console.log('mi dispiace, hai generato questa eccezione: ',error)}
    
}*/

async function stampaAgain(){
    let prova = new proxyPr();
    console.log(await prova.takeNumberOfPrenotation(true))
}




//stampaAgain()
let prova = new proxyCV();
let pluto = new buildCV(prova)
//pluto.producePartB(30.849635,-83.24559,8996783.546569308,'2022-07-01') prova haversine
//pluto.producePartA(30.849635,-83.24559,8196783.546569308)

pluto.getSlotFree()

//console.log(pippo.insertNewPr(20, 2,2000 , 1, 14, 8, 1, 1, 0));
//stampa(prova);
//console.log(isNaN(5))
/*prova.model.getModel().findAll()
console.log(prova.model.getModel().findAll({
    where: {
      id: 200
    }
  }).then( value =>{
    if(Object.keys(value).length != 0)console.log('è pieno')
    else console.log('è vuoto')
    console.log(JSON.stringify(value));
}));*/

