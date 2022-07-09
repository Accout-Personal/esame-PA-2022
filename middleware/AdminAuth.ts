// Qui abbiamo definito una funzione che serve per controllare i privilegi dell'utente
export const ControlloPrivilegio = function(req,res,next){
    console.log("admin check in: ");
    console.log(req.user);
        if(req.user.user.tipo == 1){
            console.log("admin logged in...");
            next();
        }else{
            const err = new Error('Non hai il privilegio per effetuare questa operazione');
            next(err);
        }
    }
