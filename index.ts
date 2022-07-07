import * as dotenv from 'dotenv';
import { app } from './Route';
import { mediate } from './middleware/middlewareMediator'
import * as schedule from 'node-schedule'
import {DateTime} from 'luxon';

dotenv.config()
mediate();
const job = schedule.scheduleJob({hour:21,minutes:0,second:30}, function(){
    console.log(DateTime.now().toISO());
    console.log('timer run');
  });
console.log("Initialization complete");