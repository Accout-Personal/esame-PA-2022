import * as dotenv from 'dotenv';
import { mediate } from './middleware/middlewareMediator';
import {startJob} from './job/dailyjob';
import { DBConnection } from './config/sequelize';

dotenv.config();
mediate();
startJob();
console.log("Initialization complete");