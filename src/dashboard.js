const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();
const mongodb = require('mongodb');



const mongo_uri = process.env.MONGO_URI;
const mongo_client = new mongodb.MongoClient(mongo_uri);
const mongo_db = mongo_client.db('authentication');


const getUserInfo = (req, response) => {
    //console.log(req.body)
    let jwt = req.body.JWT;
    let jwt_secret = process.env.JWT_SEC;
    jsonwebtoken.verify(jwt, jwt_secret, (err, decode) => {
        if(err || !decode) {
            response({
                success: false,
                code: 1
            });
        } else {
            //JWT verified
            let email = decode.email;
            //console.log(email);

            // get userdata from database
            let userdata = mongo_db.collection('userdata');
            userdata.findOne({
                email: email
            }).then((res) => {
                if(!res) {
                    //error
                    response({
                        success: false,
                        code: 2
                    });
                } else {
                    let username = res.username;
                    let secret = res.secret;
                    response({
                        success: true,
                        code: 0,
                        username: username,
                        email: email,
                        secret: secret
                    });
                }
            });
        }
    });
    

}


const updateSecret = (req, response) => {
    //console.log(req.body);
    let newsecret = req.body.newsecret;
    jsonwebtoken.verify(req.body.JWT, process.env.JWT_SEC, (err, decode) => {
        if(err || !decode) {
            // could not decode
            response({
                success: false,
                code: 1
            });
        } else {
            //console.log(decode);
            //jwt verified, look for entry in database
            let email = decode.email;
            let userdata = mongo_db.collection('userdata');
            userdata.updateOne({
                email: email
            }, {
                $set: {
                    secret: newsecret
                }
            }).then(res => {
                if(!res.acknowledged) {
                    response({
                        success: false,
                        code: 2
                    });
                } else {
                    response({
                        success: true,
                        code: 0
                    });
                }
            });
        }
    });
}






exports.getUserInfo = getUserInfo;
exports.updateSecret = updateSecret;