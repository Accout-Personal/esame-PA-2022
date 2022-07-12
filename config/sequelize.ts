import { Sequelize, Model, DataTypes } from 'sequelize';
//Connessione al dabatase in Singleton
export class DBConnection{
    private static instance: DBConnection;
    private connection;
    
    private constructor(){
        console.log("database name: " +process.env.DATABASE_NAME);
        console.log("database user: " +process.env.DATABASE_USER);
        console.log("database password: " +process.env.DATABASE_PASSWORD);
        console.log("databse host: "+process.env.MYSQL_HOST);

        this.connection = new Sequelize(process.env.DATABASE_NAME as string,process.env.DATABASE_USER as string,process.env.DATABASE_PASSWORD as string,{
            dialect:'mysql',
            host:process.env.MYSQL_HOST as string,
            logging: true
        });
    }

    public static getInstance(): DBConnection {
        if (!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }

        return DBConnection.instance;
    }

    public getConnection(){
        return this.connection;
    }
}