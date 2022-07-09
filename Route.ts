import * as express from 'express';
import { userPresenter } from './presenter/userPresenter';
import * as bodyParser from 'body-parser';
import { adminPresenter } from './presenter/adminPresenter';

export const app = express()
export const UserRoute = express.Router();
export const AdminRoute = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

export function createRouting() {
    app.use(bodyParser.json());
    app.use('/user', UserRoute);
    app.use('/admin', AdminRoute);

    app.get('/login', userPresenter.login); //tested

    UserRoute.get('/getCentro', userPresenter.getCentro); //tested
    UserRoute.get('/getSlotCentro', userPresenter.getSlotsCentro); //tested
    
    UserRoute.post('/prenota', userPresenter.prenota); // tested
    UserRoute.post('/cancella', userPresenter.cancellaPre);

    UserRoute.post('/modifica', userPresenter.modificaPre);
    UserRoute.get('/myListPrenota', userPresenter.getMyPre);

    AdminRoute.post('/newCentro', adminPresenter.creaCentroVax);
    AdminRoute.post('/newVaccino', adminPresenter.creaVaccino);

    AdminRoute.get('/listPrenota',adminPresenter.getListaCentroData);

    AdminRoute.post('/confirmVax', adminPresenter.confermaUUID);
    AdminRoute.post('/verify', upload.single('qrcode_img'), adminPresenter.riceveQRCode);

    AdminRoute.get('/statCentro', adminPresenter.getStatCentri);

    AdminRoute.get('/getassenze', adminPresenter.getBadStat);

    console.log('routing initialized..');
}


