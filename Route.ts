import {express} from 'express';
const app = express()
const UserRoute = app.Route();
const AdminRoute = app.Route();

app.Route('/login');

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


app.listening(3000);