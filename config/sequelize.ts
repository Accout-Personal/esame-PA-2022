var { Sequelize, Model, DataTypes } = require('sequelize');
export const connection = new Sequelize('centrovax','centrovax','pa2022',{
    dialect:'mysql',
    host:'localhost'    
});