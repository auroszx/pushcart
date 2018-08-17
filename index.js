const express = require('express');
const config = require('./helpers/config');
const app = express();
const jwt = require('express-jwt');
let passport = require('passport');
let strategies = require('./helpers/localStrategy.js')

app.use('/views', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get('/',  (req, res) => {
  res.redirect('views/index.html');
});

app.use(express.json());
app.use(express.urlencoded({
  	extended: false
}));


//CORS Headers
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, authorization, Authorization, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});


app.use(jwt({
  	secret: config.secret
}).unless({
  	path: ['/data/loginUser', '/', '/data/createUser', '/data/getProducts']
}));;

app.use(function (err, req, res, next) {
  	if (err.name === 'UnauthorizedError') {
    	res.status(401).send({
      		message: 'Invalid token',
      		status:401
    	});
  	}
});

passport.use(strategies.localStrategy);
passport.serializeUser(function (user, done) {
  	done(null, user);
});

passport.deserializeUser(function (user, done) {
  	done(null, user);
});


app.use(passport.initialize());
app.use(passport.session());

app.use('/',require('./controllers'));

app.listen(config.port, ()=> {
  console.log('PushCart server running on port 3000...');
});