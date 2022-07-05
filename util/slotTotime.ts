import {DateTime} from 'luxon';
//converte slot 1-36 al tempistica (ora e minuti)
export function slotToTime(slot:number) {
    if(slot >=1 && slot <=36){
        if(slot <= 16){
            return DateTime.fromObject({hour:9}).plus({Minutes :(slot-1)*15}).toFormat("HH:mm").toString();
        }else{
            return DateTime.fromObject({hour:14}).plus({Minutes :(slot-17)*15}).toFormat("HH:mm").toString();
        }
    }else{
        throw Error("not valid timeslot");
    } 
};