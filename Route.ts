import * as express from 'express';
import { initMiddleware, initErrorHandler } from './middleware/MiddlewareMediator';
import { userPresenter } from './presenter/userPresenter';
import * as bodyParser from 'body-parser';

import * as QRCode from 'qrcode';
import { PassThrough } from 'stream';
import * as imageDataURI from "image-data-uri";
import { adminPresenter } from './presenter/adminPresenter';

export const app = express()
export const UserRoute = express.Router();
export const AdminRoute = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })


//inizializza middleware prima della rotta;
initMiddleware();
app.use(bodyParser.json());
//montare i router;
app.use('/user', UserRoute);
app.use('/admin', AdminRoute);
//..//

//aggiunge handler di errore alla fine perche' i router sono considerati come middleware.
initErrorHandler();



app.get('/qrcode/qrcodeEncode', async (req, res, next) => {
    const qrStream = new PassThrough();
    const result = await QRCode.toFileStream(qrStream, "hello world QR Code",
        {
            type: 'png',
            width: 200,
            errorCorrectionLevel: 'H'
        }
    );
    res.setHeader('Content-type', 'image/png');
    qrStream.pipe(res);
});


app.post('/qrcode/qrcodeDecode', upload.single('qrcode_img'),adminPresenter.riceveQRCode);

app.get('/login', userPresenter.login);

UserRoute.get('/getCentro', (req, res, next) => {
    res.send('rotta get centro');
});
UserRoute.get('/getSlotCentro', (req, res, next) => {
    res.send('rotta get slot centro');
});
UserRoute.post('/prenota', userPresenter.prenota);
UserRoute.post('/cancella', userPresenter.cancellaPre);

UserRoute.post('/modifica', userPresenter.modificaPre);
UserRoute.get('/myListPrenota', (req, res, next) => {
    res.send('rotta my lista prenota');
});

AdminRoute.post('/newCentro', (req, res, next) => {
    res.send('nuovo centro');
});
AdminRoute.post('/newVaccino', (req, res, next) => {
    res.send('rotta nuovo vaccino');
});
AdminRoute.get('/listPrenota')
AdminRoute.post('/verify', (req, res, next) => {
    res.send('rotta lista prenotazione');
});
AdminRoute.get('/badPrenota', (req, res, next) => {
    res.send('rotta cattiva prenotazione');
});
AdminRoute.get('/statCentro', (req, res, next) => {
    res.send('rotta statistica centro');
});

console.log('routing initialized..');