import {DBConnection} from './config/sequelize';
import { Users } from './model/users';
import * as dotenv from 'dotenv';
import { proxyCV } from './model/Proxymodel/proxyCV';

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

async function stampa(prova:proxyCV){
    
    let result = await prova.insertNewCV(10,5,'ll',10,2);
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

var prova = new proxyCV(connection);
stampa(prova);
//console.log(isNaN(5))

