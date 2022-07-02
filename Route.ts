import * as express from 'express';
import {initMiddleware} from './middleware/MiddlewareMediator';
import { userPresenter } from './presenter/userPresenter';
import * as bodyParser from 'body-parser';
export const app = express()
export const UserRoute = express.Router();
export const AdminRoute = express.Router();
export const globalRouter = express.Router();
//inizializza middleware prima della rotta;
initMiddleware();
app.use(bodyParser.json());
app.get('/test1',(req,res,next)=>{
    console.log('test1');
});
app.get('/test2',(req,res,next)=>{
    console.log('test2');
});

app.get('/login',userPresenter.login);

UserRoute.get('/getCentro',(req,res,next)=>{
    console.log('rotta get centro');
});
UserRoute.get('/getSlotCentro',(req,res,next)=>{
    console.log('rotta get slot centro');
});
UserRoute.post('/prenota',(req,res,next)=>{
    console.log('rotta prenota');
});
UserRoute.post('/modifica',(req,res,next)=>{
    console.log('rotta modifica prenotazione');
});
UserRoute.get('/myListPrenota',(req,res,next)=>{
    console.log('rotta my lista prenota');
});

app.use('/user',UserRoute);


AdminRoute.post('/newCentro',(req,res,next)=>{
    console.log('nuovo centro');
});
AdminRoute.post('/newVaccino',(req,res,next)=>{
    console.log('rotta nuovo vaccino');
});
AdminRoute.get('/listPrenota')
AdminRoute.post('/verify',(req,res,next)=>{
    console.log('rotta lista prenotazione');
});
AdminRoute.get('/badPrenota',(req,res,next)=>{
    console.log('rotta cattiva prenotazione');
});
AdminRoute.get('/statCentro',(req,res,next)=>{
    console.log('rotta statistica centro');
});
app.use('/admin',AdminRoute);

console.log('routing initialized..');