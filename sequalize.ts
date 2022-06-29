var { Sequelize, Model, DataTypes } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('centrovax', 'root', '', {
    user:'localhost',
    dialect: 'mysql',
    logging: false
  });

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
  
  async function prova(){
    console.log(typeof sequelize)
    console.log('il tipo sta sopra')
    const users = await User.findAll();
    console.log(users.every(user => user instanceof User)); // true
    console.log("All users:", JSON.stringify(users, null, 2));
  }
  async function prova2(){
    const jane = await User.create({ id: "0",cf: "YCPNBF97P21D302R", username: "francesco",password: "francesco",tipo: "1" },
    { fields: ['cf','username','password','tipo'] });
    console.log("Jane's auto-generated ID:", jane.id);
  }

prova();
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