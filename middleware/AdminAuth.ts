export const ControlloPrivilegio = function(req,res,next){
    console.log("admin middleware: "+ req.user);
        if(req.user.tipo == 1){
            console.log("admin logged in...");
            next();
        }else{
            const err = new Error('Non hai il privilegio per effetuare questa operazione');
            next(err);
        }
    }
