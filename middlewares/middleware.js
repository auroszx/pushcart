function middleware (req,res,next){
    req.params.greeting = `Hello ${req.params.name}!`;
    next();
}
module.exports = middleware;