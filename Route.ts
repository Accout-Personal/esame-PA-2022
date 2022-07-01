import * as express from 'express';
export const app = express()
export const UserRoute = express.Router();
export const AdminRoute = express.Router();
export const globalRouter = express.Router();

app.get('/test1',(req,res,next)=>{
    console.log('test1');
    next();
});
app.get('/test2',(req,res,next)=>{
    console.log('test2');
    next();
});

app.route('/login');

UserRoute.get('/getCentro');
UserRoute.get('/getSlotCentro')
UserRoute.post('/prenota');
UserRoute.post('/modifica');
UserRoute.get('/myListPrenota');

AdminRoute.post('/newCentro');
AdminRoute.post('/newVaccino');
AdminRoute.get('/listPrenota')
AdminRoute.post('/verify');
AdminRoute.get('/badPrenota');
AdminRoute.get('/statCentro');

console.log('routing initialized..');