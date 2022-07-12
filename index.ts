import * as dotenv from 'dotenv';
import { mediate } from './middleware/middlewareMediator';
import {startJob} from './job/dailyjob';
import { DBConnection } from './config/sequelize';

dotenv.config();
console.log("enviroment variable:");
console.log(process.env);
DBConnection.getInstance().getConnection();
mediate();
startJob();
console.log("Initialization complete");