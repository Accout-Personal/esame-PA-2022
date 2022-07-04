import * as express from 'express';
import {initMiddleware,initErrorHandler} from './middleware/MiddlewareMediator';
import { userPresenter } from './presenter/userPresenter';
import * as bodyParser from 'body-parser';
export const app = express()
export const UserRoute = express.Router();
export const AdminRoute = express.Router();


//inizializza middleware prima della rotta;
initMiddleware();
app.use(bodyParser.json());
//montare i router;
app.use('/user',UserRoute);
app.use('/admin',AdminRoute);
//..//

//aggiunge handler di errore alla fine perche' i router sono considerati come middleware.
initErrorHandler();

app.get('/login',userPresenter.login);

UserRoute.get('/getCentro',(req,res,next)=>{
    res.send('rotta get centro');
});
UserRoute.get('/getSlotCentro',(req,res,next)=>{
    res.send('rotta get slot centro');
});
UserRoute.post('/prenota',userPresenter.prenota);
UserRoute.post('/cancella',userPresenter.cancellaPre);

UserRoute.post('/modifica',(req,res,next)=>{
    res.send('rotta modifica prenotazione');
});
UserRoute.get('/myListPrenota',(req,res,next)=>{
    res.send('rotta my lista prenota');
});

AdminRoute.post('/newCentro',(req,res,next)=>{
    res.send('nuovo centro');
});
AdminRoute.post('/newVaccino',(req,res,next)=>{
    res.send('rotta nuovo vaccino');
});
AdminRoute.get('/listPrenota')
AdminRoute.post('/verify',(req,res,next)=>{
    res.send('rotta lista prenotazione');
});
AdminRoute.get('/badPrenota',(req,res,next)=>{
    res.send('rotta cattiva prenotazione');
});
AdminRoute.get('/statCentro',(req,res,next)=>{
    res.send('rotta statistica centro');
});

console.log('routing initialized..');