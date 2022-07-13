"use strict";
exports.__esModule = true;
exports.DBConnection = void 0;
var sequelize_1 = require("sequelize");
//Connessione al dabatase in Singleton
var DBConnection = /** @class */ (function () {
    function DBConnection() {
        this.connection = new sequelize_1.Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
            dialect: 'mysql',
            host: process.env.MYSQL_HOST,
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
    DBConnection.getInstance = function () {
        if (!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }
        return DBConnection.instance;
    };
    DBConnection.prototype.getConnection = function () {
        return this.connection;
    };
    return DBConnection;
}());
exports.DBConnection = DBConnection;
