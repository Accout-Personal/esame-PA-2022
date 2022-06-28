const { Sequelize, Model, DataTypes } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('centrovax', 'root', '', {
    user:'localhost',
    dialect: 'mysql'
  });

  const User = sequelize.define("user", {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    }, 
    cf: {type:DataTypes.STRING},
    username: {type:DataTypes.STRING},
    password: {type:DataTypes.STRING},
    tipo:{type:DataTypes.INTEGER}
  }, {
    tableName: 'users',
    timestamps: false
  } );
  
  async function prova(){
    const users = await User.findAll();
    console.log(users.every(user => user instanceof User)); // true
    console.log("All users:", JSON.stringify(users, null, 2));
  }

prova();











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