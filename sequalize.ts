const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('centrovax', 'root', '', {
  user:'localhost',
  dialect: 'mysql'
});

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

prova()