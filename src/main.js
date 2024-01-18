const path = require('node:path');
const crypto = require('node:crypto');
require('dotenv').config()

const express = require('express');
const mongo = require('mongodb');

const PORT = process.env.PORT;
const mongo_uri = process.env.MONGO_URI;
const mongo_client = new mongo.MongoClient(mongo_uri);
const mongo_db = mongo_client.db('authentication');

const app = express();

app.use(express.json());


app.use('/', express.static(path.join(__dirname, 'client')));


app.post('/auth/register', (req, res) => {
    let data = req.body;
    let user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    if(user == null || user.username == null || user.email == null || user.password == null) {
        res.send({
            success: false,
            reason: 'Some part of credentials are missing'
        });
    } else {
        //valid request
        //check if user exists
        let collection = mongo_db.collection('users');
        collection.findOne(
            {
                email: user.email
            }
        ).then((user_in_db) => {
            if(user_in_db != null) {
                res.send({
                    success: false,
                    reason: 'Account Already Exists'
                });
            } else {
                //user does not exist proceed to create account
                
                //hash the password
                let salt = crypto.randomBytes(16).toString('hex');
                let password_hash = crypto.scryptSync(user.password, salt, 64).toString('hex');

                let user_to_reg = {
                    email: user.email,
                    password_hash: password_hash,
                    salt: salt,
                    verified: false
                }
                
                collection.insertOne(user_to_reg).then(() => {
                    res.send(
                        {
                            success: true
                        }
                    )
                });

                //set userdata

                let userdata = {
                    email: user.email,
                    username: user.username,
                    secret: 'Not Set'
                }

                collection = mongo_db.collection('userdata');
                collection.insertOne(userdata);
            }
        });
    }
});






app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})