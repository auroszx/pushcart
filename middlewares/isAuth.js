module.exports.isAuth = (req,res,next)=>{
    if (req.isAuthenticated()) {
        next();
    }else{     
        res.send({
            status: 400,
            response: 'You need to log in to perform this action'
        });
    }
}
module.exports.isLogged=(req,res,next)=>{
    if (req.isAuthenticated()) {
        res.send({
            status: 304,
            response: 'You already have a session'
        });
    }
    else{
        next();
    }
}