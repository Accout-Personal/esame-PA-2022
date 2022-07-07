import * as dotenv from 'dotenv';
import { app } from './Route';
import { mediate } from './middleware/middlewareMediator'


dotenv.config()
mediate()
console.log("Initialization complete");