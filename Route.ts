import * as express from 'express';
import { userPresenter } from './presenter/userPresenter';

import { adminPresenter } from './presenter/adminPresenter';

export const app = express()
export const UserRoute = express.Router();
export const AdminRoute = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

export function createRouting() {
    
    app.use('/user', UserRoute);
    app.use('/admin', AdminRoute);

    //rotte pubbliche
    app.get('/login', userPresenter.login);

    //rotte di utente
    UserRoute.get('/getCentro', userPresenter.getCentro);
    UserRoute.get('/getSlotCentro', userPresenter.getSlotsCentro);
    UserRoute.post('/prenota', userPresenter.prenota);
    UserRoute.post('/cancella', userPresenter.cancellaPre);
    UserRoute.post('/modifica', userPresenter.modificaPre);
    UserRoute.get('/myListPrenota', userPresenter.getMyPre);

    //rotte di amministratore
    AdminRoute.post('/newCentro', adminPresenter.creaCentroVax);
    AdminRoute.post('/newVaccino', adminPresenter.creaVaccino);
    AdminRoute.get('/listPrenota', adminPresenter.getListaCentroData);
    AdminRoute.post('/verify', upload.single('qrcode_img'), adminPresenter.riceveQRCode);
    AdminRoute.post('/confirmVax', upload.single('qrcode_img'), adminPresenter.confermaUUID);
    AdminRoute.get('/statCentro', adminPresenter.getStatCentri);
    AdminRoute.get('/getassenze', adminPresenter.getBadStat);

    console.log('routing initialized..');
}


