import { Middleware } from "./middleware";
export const ControlloPrivilegio = function(req,res,next){
        const User = req.user;
        if(User.tipo == 1){
            next();
        }else{
            const Err = new Error('Non hai privilegio per effetuare questa operazione');
            next(Err);
        }
    }
