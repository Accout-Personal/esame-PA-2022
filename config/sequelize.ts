import { Sequelize, Model, DataTypes } from 'sequelize';
//Connessione al dabatase in Singleton
export class DBConnection {
    private static instance: DBConnection;
    private connection;

    private constructor() {
        this.connection = new Sequelize(process.env.DATABASE_NAME as string, process.env.DATABASE_USER as string, process.env.DATABASE_PASSWORD as string, {
            dialect: 'mysql',
            host: process.env.MYSQL_HOST as string,
            pool: {
                max: 1000,
                min: 0,
                idle: 10000,
                acquire: 60000,
                evict: 1000
            },
            logging: false
        });
    }

    public static getInstance(): DBConnection {
        if (!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }

        return DBConnection.instance;
    }

    public getConnection() {
        return this.connection;
    }
}