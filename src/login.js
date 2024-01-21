const mongodb = require('mongodb');
const crypto = require('node:crypto');
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();


const mongo_uri = process.env.MONGO_URI;
const mongo_client = new mongodb.MongoClient(mongo_uri);
const mongo_db = mongo_client.db('authentication');


const handleLogin = (req, response) => {
    let email = req.body.email;
    let password = req.body.password;
    //check if user exists
    let users = mongo_db.collection('users');
    users.findOne({
        email: email
    }).then((res) => {
        //console.log(res);
        if(!res) {
            //user is not registered
            response({
                success: false,
                code: 1
            });
        } else {
            //user exists proceed to password verification
            let password_hash = res.password_hash;
            let salt = res.salt;
            let hashed_password = crypto.scryptSync(password, salt, 64).toString('hex');
            if(hashed_password != password_hash) {
                //wrong password
                response({
                    success: false,
                    code: 2
                });
            } else {
                //password matches generate JWT
                let jwt = jsonwebtoken.sign({
                    email: email
                }, process.env.JWT_SEC, {
                    expiresIn: '2h'
                });
                //console.log(jwt);
                response({
                    success: true,
                    code: 0,
                    token: jwt
                });
            }
        }
    });

}

exports.handleLogin = handleLogin;