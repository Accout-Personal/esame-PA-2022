export const ControlloPrivilegio = function(req,res,next){
        const User = req.user;
        if(User.tipo == 1){
            next();
        }else{
            const err = new Error('Non hai privilegio per effetuare questa operazione');
            next(err);
        }
    }
