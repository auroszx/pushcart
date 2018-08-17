const express = require('express');
const jwt  = require('jsonwebtoken');
const auth = require('./../middlewares/isAuth');
let config = require('../helpers/config');
let db = require ('../helpers/db');
let md5 = require('md5');
let passport = require('passport');

let route = express.Router();


//////////////////////////////////////
//User and Session related endpoints
//////////////////////////////////////


route.get('/getUser/:param',(req,res) => {
    db.connect().then((obj) => {
        obj.one('SELECT * FROM users WHERE user_id = $1',
            [parseInt(req.params.param)]).then((data) => {
                res.send({user:user,
                            status:200});
                obj.done();                
        }).catch((error) => {
            console.log(error);
            res.send({error:error,
                msg:'This user does not exist',
                status:404});
            obj.done();    
        });
    }).catch((error) => {
        console.log(error);
        res.send({error:error,
            msg:'Could not connect to the DB',
            status:500});
    });   
});


route.post('/createUser', (req,res) => {
    db.connect().then((obj) => {
        if (req.body.user_username != "" && req.body.user_password != "") {
            obj.one('INSERT INTO users (user_username, user_password) VALUES ($1, $2) RETURNING user_username',
            [req.body.user_username.toLowerCase(),
            md5(req.body.user_password)]).then((user) => {
                res.send({user:user,
                        status:200});
                obj.done();                
            }).catch((error) => {
                console.log(error);
                res.send({error:error,
                            msg:'Could not create a new user',
                            status:500});
                obj.done();    
            });
        }
        else {
            res.send({error:error,
                    msg:'One or both fields are empty',
                status:406});
        }
    }).catch((error) => {
        console.log(error);
        res.send({error:error,
                    msg:'Could not connect to the DB',
                status:500});
    });  

    
});

route.post('/loginUser', (req, res, next) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send({
                status: 401,
                err: info
            });
        }
        req.logIn(user, {session: false}, (err) => {
            if (err) {
                return res.send({
                    status: 500,
                    msg: 'Could not log in user'
                });
            }

            let jsonWebToken = jwt.sign(user, config.secret);
            res.send({
                status: 200,
                message:'User login was successful',
                token:jsonWebToken
            });
        });
    })(req, res, next);
});

route.get('/logoutUser', (req, res) => {
    res.status(200).send({
        status: 'Bye!'
    });
});


//////////////////////////////////////
//Product CRUD related endpoints
//////////////////////////////////////


route.get('/getProducts/',(req,res) => {
    db.connect().then((obj) => {
        obj.any('SELECT * FROM products ORDER BY prod_id').then((products)=>{
            res.send({products:products,
                        status:200});
            obj.done();                
        }).catch((error) => {
            console.log(error);
            res.send({error:error,
                msg:'Could not get products',
                status:404});
            obj.done();    
        });
    }).catch((error) => {
        console.log(error);
        res.send({error:error,
            msg:'Could not connect to the DB',
            status:500});
    });   
});

route.post('/searchProducts',(req,res) => {
    db.connect().then((obj) => {
        obj.any("SELECT * FROM products WHERE LOWER(prod_name) LIKE LOWER('%' || $1 ||'%')", 
            [req.body.prod_name]).then((products) => {
                res.send({products:products,
                            status:200});
                obj.done();                
        }).catch((error) => {
            console.log(error);
            res.send({error:error,
                msg:'Could not get products by name: '+req.body.prod_name,
                status:404});
            obj.done();    
        });
    }).catch((error) => {
        console.log(error);
        res.send({error:error,
            msg:'Could not connect to the DB',
            status:500});
    });   
});


route.post('/addProduct',(req,res) => {
    db.connect().then((obj) => {
        obj.one('INSERT INTO products (prod_name, prod_quantity) VALUES ($1, $2) RETURNING *',
        [req.body.prod_name,
        req.body.prod_quantity]).then((product) => {
            res.send({product:product,
                    status:200});
            obj.done();                
        }).catch((error) => {
            console.log(error);
            res.send({error:error,
                        msg:'Could not create a new product',
                        status:500});
            obj.done();    
        });
    }).catch((error) => {
        console.log(error);
        res.send({error:error,
                    msg:'Could not connect to the DB',
                status:500});
    });   
});


route.put('/editProduct',(req,res) => {
    db.connect().then((obj) => {
        obj.any('UPDATE products SET prod_name = $2, prod_quantity = $3 WHERE prod_id = $1',
        [req.body.prod_id,
        req.body.prod_name,
        req.body.prod_quantity]).then((product) => {
            res.send({product:product,
                    status:200});
            obj.done();                
        }).catch((error) => {
            console.log(error);
            res.send({error:error,
                        msg:'Could modify a product',
                        status:500});
            obj.done();    
        });
    }).catch((error) => {
        console.log(error);
        res.send({error:error,
                    msg:'Could not connect to the DB',
                status:500});
    });   
});


route.delete('/removeProduct/:param',(req,res) => {
    db.connect().then((obj) => {
        obj.none('DELETE FROM products WHERE prod_id = $1',[parseInt(req.params.param)]).then(() => {
            res.send({msg: "Product deleted successfully",
                        status:200});
            obj.done();                
        }).catch((error) => {
            console.log(error);
            res.send({error:error,
                msg: "Could not delete product",
                status:404});
            obj.done();    
        });
    }).catch((error) => {
        console.log(error);
        res.send({error:error,
            msg:'Could not connect to the DB',
            status:500});
    });   
});

//////////////////////////////////////
//Cart related endpoints
//////////////////////////////////////


route.get('/getCart/:param',(req,res) => {
    db.connect().then((obj) => {
        obj.any('SELECT user_products.user_prod_id, products.prod_name, user_products.user_prod_quantity FROM user_products INNER JOIN products ON user_products.prod_id = products.prod_id WHERE user_id = $1', [parseInt(req.params.param)]).then((products) => {
            res.send({products:products,
                        status:200});
            obj.done();                
        }).catch((error) => {
            console.log(error);
            res.send({error:error,
                msg:'Could not get user cart',
                status:404});
            obj.done();    
        });
    }).catch((error) => {
        console.log(error);
        res.send({error:error,
            msg:'Could not connect to the DB',
            status:500});
    });   
});


route.post('/addToCart',(req,res) => {
    db.connect().then((obj) => {
        obj.any('INSERT INTO user_products (prod_id, user_id, user_prod_id, user_prod_quantity) VALUES ($1, $2, $3, $4)',
        [req.body.prod_id,
        req.body.user_id,
        req.body.user_prod_id,
        req.body.user_prod_quantity]).then((product) => {
            res.send({product:product,
                    status:200});
            obj.done();                
        }).catch((error) => {
            console.log(error);
            res.send({error:error,
                        msg:'Could not create a new product',
                        status:500});
            obj.done();    
        });
    }).catch((error) => {
        console.log(error);
        res.send({error:error,
                    msg:'Could not connect to the DB',
                status:500});
    });   
});

route.delete('/removeFromCart/:param',(req,res) => { 
    db.connect().then((obj) => {
        obj.none('DELETE FROM user_products WHERE user_prod_id = $1',[parseInt(req.params.param)]).then(() => {
            res.send({msg: "Product removed successfully from the cart",
                        status:200});
            obj.done();                
        }).catch((error) => {
            console.log(error);
            res.send({error:error,
                msg: "Could not remove product from cart",
                status:404});
            obj.done();    
        });
    }).catch((error) => {
        console.log(error);
        res.send({error:error,
            msg:'Could not connect to the DB',
            status:500});
    });   
});

route.delete('/clearCart/:param',(req,res) => { 
    db.connect().then((obj) => {
        obj.none('DELETE FROM user_products WHERE user_id = $1',[parseInt(req.params.param)]).then(() => {
            res.send({msg: "User cart cleared successfully",
                        status:200});
            obj.done();                
        }).catch((error) => {
            console.log(error);
            res.send({error:error,
                msg: "Could not clear user cart",
                status:404});
            obj.done();    
        });
    }).catch((error) => {
        console.log(error);
        res.send({error:error,
            msg:'Could not connect to the DB',
            status:500});
    });   
});


module.exports = route;