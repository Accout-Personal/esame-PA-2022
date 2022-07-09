"use strict";
exports.__esModule = true;
var dotenv = require("dotenv");
var middlewareMediator_1 = require("./middleware/middlewareMediator");
var dailyjob_1 = require("./job/dailyjob");
dotenv.config();
(0, middlewareMediator_1.mediate)();
(0, dailyjob_1.startJob)();
console.log("Initialization complete");
