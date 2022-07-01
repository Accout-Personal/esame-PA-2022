import {DBConnection} from './config/sequelize';
import { Users } from './model/users';
import * as dotenv from 'dotenv';
import { proxyCV } from './model/Proxymodel/proxyCV';
import { proxyUs } from './model/Proxymodel/proxyUs';
import { proxyVC } from './model/Proxymodel/proxyVC';

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

async function stampa(prova:proxyVC){
    
    let result = await prova.insertNewVacc('simone',30);
    switch(typeof result){
    case 'boolean': {
        console.log('è booleano');
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
    
}

var prova = new proxyVC(connection);
//stampa(prova);
//console.log(isNaN(5))
prova.model.getModel().findAll()
console.log(prova.model.getModel().findAll({
    where: {
      id: 200
    }
  }).then( value =>{
    if(Object.keys(value).length != 0)console.log('è pieno')
    else console.log('è vuoto')
    console.log(JSON.stringify(value));
}));

