const express = require('express');
let db = require ('../helpers/db');
let md5 = require('md5');
let route = express.Router();


//////////////////////////////////////
//User and Session related endpoints
//////////////////////////////////////


route.get('/getUser/:param',(req,res)=>{
    db.connect().then((obj)=>{
        obj.one('SELECT * FROM users WHERE user_id = $1',
            [parseInt(req.params.param)]).then((data)=>{
                console.log(user);
                res.send({user:user,
                            status:200});
                obj.done();                
        }).catch((error)=>{
            console.log(error);
            res.send({error:error,
                msg:'This user does not exist',
                status:404});
            obj.done();    
        });
    }).catch((error)=>{
        console.log(error);
        res.send({error:error,
            msg:'Could not connect to the DB',
            status:500});
    });   
});


route.post('/createUser',(req,res)=>{
    db.connect().then((obj)=>{
        obj.one('INSERT INTO users (user_username, user_password) VALUES ($1, $2) RETURNING user_username',
        [req.body.user_username.toLowerCase(),
        md5(req.body.user_password)]).then((user)=>{
            console.log(user);
            res.send({user:user,
                    status:200});
            obj.done();                
        }).catch((error)=>{
            console.log(error);
            res.send({error:error,
                        msg:'Could not create a new user',
                        status:500});
            obj.done();    
        });
    }).catch((error)=>{
        console.log(error);
        res.send({error:error,
                    msg:'Could not connect to the DB',
                status:500});
    });   
});

//Need a logout endpoint here.


//////////////////////////////////////
//Product CRUD related endpoints
//////////////////////////////////////


route.get('/getProducts/',(req,res)=>{
    db.connect().then((obj)=>{
        obj.many('SELECT * FROM products ORDER BY prod_id').then((products)=>{
            console.log(products);
            res.send({products:products,
                        status:200});
            obj.done();                
        }).catch((error)=>{
            console.log(error);
            res.send({error:error,
                msg:'Could not get products',
                status:404});
            obj.done();    
        });
    }).catch((error)=>{
        console.log(error);
        res.send({error:error,
            msg:'Could not connect to the DB',
            status:500});
    });   
});

route.post('/searchProducts',(req,res)=>{
    db.connect().then((obj)=>{
        obj.any("SELECT * FROM products WHERE LOWER(prod_name) LIKE LOWER('%' || $1 ||'%')", 
            [req.body.prod_name]).then((products)=>{
                console.log(products);
                res.send({products:products,
                            status:200});
                obj.done();                
        }).catch((error)=>{
            console.log(error);
            res.send({error:error,
                msg:'Could not get products by name: '+req.body.prod_name,
                status:404});
            obj.done();    
        });
    }).catch((error)=>{
        console.log(error);
        res.send({error:error,
            msg:'Could not connect to the DB',
            status:500});
    });   
});


route.post('/createProduct',(req,res)=>{
    db.connect().then((obj)=>{
        obj.one('INSERT INTO products (prod_name, prod_quantity) VALUES ($1, $2) RETURNING *',
        [req.body.prod_name,
        req.body.prod_quantity]).then((product)=>{
            console.log(product);
            res.send({product:product,
                    status:200});
            obj.done();                
        }).catch((error)=>{
            console.log(error);
            res.send({error:error,
                        msg:'Could not create a new product',
                        status:500});
            obj.done();    
        });
    }).catch((error)=>{
        console.log(error);
        res.send({error:error,
                    msg:'Could not connect to the DB',
                status:500});
    });   
});


route.put('/modifyProduct',(req,res)=>{
    db.connect().then((obj)=>{
        obj.any('UPDATE products SET prod_name = $2, prod_quantity = $3 WHERE prod_id = $1',
        [req.body.prod_id,
        req.body.prod_name,
        req.body.prod_quantity]).then((product)=>{
            console.log(product);
            res.send({product:product,
                    status:200});
            obj.done();                
        }).catch((error)=>{
            console.log(error);
            res.send({error:error,
                        msg:'Could modify a product',
                        status:500});
            obj.done();    
        });
    }).catch((error)=>{
        console.log(error);
        res.send({error:error,
                    msg:'Could not connect to the DB',
                status:500});
    });   
});


route.delete('/deleteProduct/:param',(req,res)=>{
    db.connect().then((obj)=>{
        obj.any('DELETE FROM products WHERE prod_id = $1',[req.params.param]).then(() => {
            res.send({msg: "Product deleted successfully",
                        status:200});
            obj.done();                
        }).catch((error)=>{
            console.log(error);
            res.send({error:error,
                msg: "Could not delete product",
                status:404});
            obj.done();    
        });
    }).catch((error)=>{
        console.log(error);
        res.send({error:error,
            msg:'Could not connect to the DB',
            status:500});
    });   
});

//////////////////////////////////////
//Cart related endpoints
//////////////////////////////////////


route.get('/getCart/:param',(req,res)=>{
    db.connect().then((obj)=>{
        obj.one('SELECT products.prod_name, user_products.user_prod_quantity FROM user_products WHERE user_id = $1 INNER JOIN products ON user_products.prod_id = products.prod_id', [req.params.param]).then((products)=>{
            console.log(products);
            res.send({products:products,
                        status:200});
            obj.done();                
        }).catch((error)=>{
            console.log(error);
            res.send({error:error,
                msg:'Could not get user cart',
                status:404});
            obj.done();    
        });
    }).catch((error)=>{
        console.log(error);
        res.send({error:error,
            msg:'Could not connect to the DB',
            status:500});
    });   
});




module.exports = route;