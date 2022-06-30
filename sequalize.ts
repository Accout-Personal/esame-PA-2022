import { json } from "./node_modules/sequelize/types/sequelize";

var { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  username:'centrovax',
  host:'37.187.126.183',
  //port:'888',
  //logging: console.log,
  database:'centrovax',
  password:'pa2022',
  dialect: 'mysql',
  //storage: 'http://37.187.126.183:888/phpmyadmin_c3c7c925004a60d5/index.php?route=/'
});

// Option 3: Passing parameters separately (other dialects)
/*const sequelize = new Sequelize('centrovax', 'root', '', {
    host:'localhost',
    dialect: 'mysql'
    //logging: false
  });*/

  var User = sequelize.define("user", {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
    }, 
    cf: {type:DataTypes.STRING},
    username: {type:DataTypes.STRING},
    password: {type:DataTypes.STRING},
    tipo:{
      type:DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: false
  } );

  var pren = sequelize.define("prenotazione", {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    }, 
    data: {type:DataTypes.DATE},
    fascia: {type:DataTypes.INTEGER},
    slot: {type:DataTypes.INTEGER},
    centro_vac:{type:DataTypes.BIGINT(20),},
    vaccino:{type:DataTypes.BIGINT(20),},
    user:{
      type:DataTypes.BIGINT(20)
  },
    stato:{type:DataTypes.BIGINT(20)}
  }, {
    tableName: 'prenotazione',
    timestamps: false
  } );
  
  async function prova(){
    console.log(typeof sequelize)
    console.log('il tipo sta sopra')
    let ok: Array<typeof pren>
    const users = await pren.findAll();
    console.log(typeof users)
    console.log(users.every(pre => pre instanceof pren)); // true
    console.log("All users:", JSON.stringify(users, null, 2));
    console.log(typeof users)
    let risultato = JSON.stringify(users, null, 2);
    console.log(typeof risultato)
    let parse = JSON.parse(risultato)
    console.log(typeof parse)
  }
  async function prova2(){
    const jane = await User.create({ id: "1",cf: "YCvNBF69P21D302R", username: "francesco",password: "francesco",tipo: "1" },
    { fields: ['cf','username','password','tipo'] });
    const pr = await pren.create({id:"0",data: '2022-07-06', fascia: 1, slot:14, centro_vac:8, vaccino:1, user:1, stato:0},
    {fields: ['data','fascia','slot','centro_vac','vaccino','user','stato']})
    console.log("Jane's auto-generated ID:", jane.id);
  }//1

  async function prova3(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        //prova2();
        //prova3();
        //sequelize.close();
        //console.log('Ho chiuso la connessione');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

async function prova4(){
  const users = await User.findAll();
  console.log(typeof users)
  //console.log(users.every(user => user instanceof User)); // true
  //console.log("All users:", JSON.stringify(users, null, 2));
  var resultArray: Array<typeof User> = Object.keys(users).map(function(personNamedIndex){
  let person = users[personNamedIndex];
  //console.log(person)
  return person
});
  console.log(users[1].id)
}

prova4();
//prova2();











//Metodo grezzo
/*

async function prova(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        prova2();
        prova3();
        //sequelize.close();
        //console.log('Ho chiuso la connessione');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

async function prova2(){
    try{
        const users = await sequelize.query("SELECT * FROM `users`", { type: Sequelize.SELECT });
        console.log(users)
    } catch(error){
        console.error('Abbiamo un problema:', error);
    }
}

async function prova3(){
    try{
        const users = await sequelize.query("INSERT INTO `users`(`cf`, `username`, `password`, `tipo`) VALUES ('LCULLL07B55F205T','luca','luca','0')", { type: Sequelize.INSERT });
        console.log(users);
        console.log("inserimento riuscito")
    } catch(error){
        console.error('Abbiamo un problema:', error);
    }
}

prova()*/