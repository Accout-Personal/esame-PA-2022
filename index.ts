import {DBConnection} from './config/sequelize';
import { Users } from './model/users';
import * as dotenv from 'dotenv';
import * as mediator from './middleware/MiddlewareMediator';
import {app} from './Route'; 


async function querySemplice(connection){
    var users = new Users(connection);
    console.log(users);
    return await users.trovaTutto(connection);
}


console.log("hello world");
dotenv.config()
const connection = DBConnection.getInstance().getConnection();
querySemplice(connection).then(value=>{
    console.log(JSON.stringify(value));
});
mediator;
app.listen(3000);
