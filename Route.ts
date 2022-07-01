import * as express from 'express';
import {initMiddleware} from './middleware/MiddlewareMediator';
export const app = express()
export const UserRoute = express.Router();
export const AdminRoute = express.Router();
export const globalRouter = express.Router();
//inizializza middleware prima della rotta;
initMiddleware();

app.get('/test1',(req,res,next)=>{
    console.log('test1');
    next();
});
app.get('/test2',(req,res,next)=>{
    console.log('test2');
    next();
});

app.route('/login');

UserRoute.get('/getCentro',(req,res,next)=>{
    console.log('rotta get centro');
    next();
});
UserRoute.get('/getSlotCentro',(req,res,next)=>{
    console.log('rotta get slot centro');
    next();
});
UserRoute.post('/prenota',(req,res,next)=>{
    console.log('rotta prenota');
    next();
});
UserRoute.post('/modifica',(req,res,next)=>{
    console.log('rotta modifica prenotazione');
    next();
});
UserRoute.get('/myListPrenota',(req,res,next)=>{
    console.log('rotta my lista prenota');
    next();
});

app.use('/user',UserRoute);


AdminRoute.post('/newCentro',(req,res,next)=>{
    console.log('nuovo centro');
    next();
});
AdminRoute.post('/newVaccino',(req,res,next)=>{
    console.log('rotta nuovo vaccino');
    next();
});
AdminRoute.get('/listPrenota')
AdminRoute.post('/verify',(req,res,next)=>{
    console.log('rotta lista prenotazione');
    next();
});
AdminRoute.get('/badPrenota',(req,res,next)=>{
    console.log('rotta cattiva prenotazione');
    next();
});
AdminRoute.get('/statCentro',(req,res,next)=>{
    console.log('rotta statistica centro');
    next();
});
app.use('/admin',AdminRoute);

console.log('routing initialized..');