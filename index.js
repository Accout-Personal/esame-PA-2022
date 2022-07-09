"use strict";
exports.__esModule = true;
var dotenv = require("dotenv");
var middlewareMediator_1 = require("./middleware/middlewareMediator");
var schedule = require("node-schedule");
var luxon_1 = require("luxon");
dotenv.config();
(0, middlewareMediator_1.mediate)();
var job = schedule.scheduleJob({ hour: 21, minutes: 0, second: 30 }, function () {
    console.log(luxon_1.DateTime.now().toISO());
    console.log('timer run');
});
console.log("Initialization complete");
