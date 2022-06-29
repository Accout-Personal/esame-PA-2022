

const {connection} = require('./config/sequelize');

async function querySemplice(connection){
    let { Users } = require('./model/users.ts');
    users = new Users(connection);
    console.log(users);
    return await users.trovaTutto(connection);
}
//dotenv = require('dotenv');
//dotenv.config();

console.log("hello world");
querySemplice(connection).then(value=>{
    console.log(JSON.stringify(value));
});
