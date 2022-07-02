import { proxyUs} from "../model/Proxymodel/proxyUs";
import * as crypto from 'node:crypto';

export class userPresenter {
    
    public static login(req,res) {
        console.log("hello userPreseter.")
        res.send("you are at login");
        console.log(req.body);
        console.log(crypto.createHash('sha256').update(req.body.password).digest('hex'));
        const proxy = new proxyUs();
        proxy.getUser(req.body.username).then((value)=>{
            console.log(JSON.stringify(value));
            if(value[0].password === crypto.createHash('sha256').update(req.body.password).digest('hex'))
                console.log("password: correct");
            else
                console.log("password incorrect");
        });
        console.log("adminadmin "+ crypto.createHash('sha256').update("adminadmin").digest('hex'));
        console.log("admin2admin2 "+crypto.createHash('sha256').update("admin2admin2").digest('hex'));
        console.log("password "+crypto.createHash('sha256').update("password").digest('hex'));
        console.log("francesco "+crypto.createHash('sha256').update("francesco").digest('hex'));
        console.log("scatto "+crypto.createHash('sha256').update("scatto").digest('hex'));
    };

    public static register(req,res){
        
    };

    
}