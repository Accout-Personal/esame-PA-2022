import * as dotenv from 'dotenv';
import { app } from './Route';

console.log("Initialization complete");
dotenv.config()
app.listen(3000);
