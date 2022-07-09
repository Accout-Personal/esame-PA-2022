import * as schedule from 'node-schedule';
import {DateTime} from 'luxon';
import { proxyPr } from '../model/Proxymodel/proxyPR';

export function startJob(){
    const proxy = new proxyPr();
    const job = schedule.scheduleJob({hour:21,minutes:0,second:0}, function(){
        proxy.setBadPrenotations(DateTime.now().toISODate());
    });
}