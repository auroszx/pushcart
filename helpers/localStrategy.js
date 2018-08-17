let User = require('./users');
let localStrategy = require('passport-local').Strategy;
let JWTStrategy = require('passport-jwt').Strategy;
let ExtractJWT = require('passport-jwt').ExtractJwt;
let config = require('./config');

module.exports.localStrategy = new localStrategy({
    usernameField: 'user_username',
    passwordField: 'user_password'
}, function (username, password, done) {

    User.getUserByUsername(username).then((user) => {
        if (user == undefined) {
            return done(null, false, { message: "User not found in the database"});
        }
        User.comparePassword(password, user.user_password).then((isMatch) => {
            if (isMatch)
                return done(null, user);
            else
                return done(null, false, { message: "Wrong password"});
        }).catch((err) => {
            throw err;
        });
    }).catch((err) => {
        throw err;
    });
});