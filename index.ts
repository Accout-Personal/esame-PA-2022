import { DBConnection } from './config/sequelize';
import { Users } from './model/users';
import * as dotenv from 'dotenv';
import { app } from './Route';


console.log("Initialization complete");
dotenv.config()


app.listen(3000);
