"use strict";
exports.__esModule = true;
exports.connection = void 0;
var _a = require('sequelize'), Sequelize = _a.Sequelize, Model = _a.Model, DataTypes = _a.DataTypes;
exports.connection = new Sequelize('centrovax', 'centrovax', 'pa2022', {
    dialect: 'mysql',
    host: 'localhost'
});
