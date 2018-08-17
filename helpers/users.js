const db = require('./db');
const md5 = require('md5');

module.exports.getUserByUsername = (username) => {
    return new Promise((res, rej) => { 
        db.connect().then((obj) => {
            obj.one("SELECT * FROM users WHERE LOWER(user_username) = LOWER($1)", [username]).then((data) => {
                res(data);
                obj.done();                
            }).catch((error) => {
                console.log(error);
                rej(error);
                obj.done();    
            });
        }).catch((error) => {
            console.log(error);
            rej(error);
        });
    //});
    }).catch((error) => {
        console.log(error);
    });
}

module.exports.comparePassword = (candidatePassword, data) => {
    return new Promise((res, rej) => {
        console.log(candidatePassword);
        console.log(data);
        
        if (candidatePassword = md5(data)) {
            res(true);
        }
        else {
            rej(false);
        }


    }).catch((error) => {
        console.log(error);
    });
};
