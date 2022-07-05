import * as dotenv from 'dotenv';
import { app } from './Route';

console.log("Initialization complete");
dotenv.config()

////sostituisce tutte i caratteri speciali che non contengono nel set lettere unicode,spazio,trattino (-) e slash(/) (per le date)
//function sanitizingString (text) {
//    return text.replace(/[^\p{L}\s 0-9-/]+/ug,"");
//};
//
//console.log(sanitizingString('abcd efg, hijklmn#\'12345àòùèùàè+ì'));

//function pippo(body:{
// a:number,
// b?:number
//}){
//    console.log(body.a);
//    console.log(body.b);
//    console.log(body.c);
//}
//pippo({a:1,b:2,c:3});

app.listen(3000);
