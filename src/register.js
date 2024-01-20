const mongodb = require('mongodb');
require('dotenv').config();
const crypto = require('node:crypto');
const nodemailer = require('nodemailer');


const mongo_uri = process.env.MONGO_URI;
const mongo_client = new mongodb.MongoClient(mongo_uri);
const mongo_db = mongo_client.db('authentication');
const server_email = process.env.EMAIL;
const server_email_password = process.env.EMAIL_PASSWORD;

let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: server_email,
        pass: server_email_password
    }
});


const sendOTP = (email) => {
    let userregbuffer = mongo_db.collection('userregbuffer');
    userregbuffer.findOne({
        email: email
    }).then(res => {
        let OTP = res.OTP;
        transporter.sendMail({
            from: 'Noreply Auth <' + server_email + '>',
            to: email,
            subject: 'OTP for registration',
            text: 'Thankyou for signing up, your OTP is ' + OTP + '.\nRegards'
        }).then((msg) => {
            console.log(msg);
        })
    });
}


const handleRegistration = (req, response) => {
    let user = req.body;
    //console.log(user);
    if(!user.username || !user.email || !user.password) {
        response({
            success: false,
            code: 1
        });
    } else {
        //valid request
        //check if user exists
        let users = mongo_db.collection('users');
        users.findOne({
            email: user.email
        }).then((res) => {
            //console.log(res);
            if(res) {
                //user exists
                response({
                    success: false,
                    code: 2
                });
            } else {
                //user does not exist
                //verify user email
                let userregbuffer = mongo_db.collection('userregbuffer');
                let salt = crypto.randomBytes(16).toString('hex');
                let hashed_password = crypto.scryptSync(user.password, salt, 64).toString('hex');
                
                let OTP = '';
                for(let i = 0; i < 4; i++) {
                    let randomno = Math.floor(Math.random() * 10);
                    OTP += String(randomno);
                    
                }
                //console.log(OTP);
                userregbuffer.findOne({
                    email: user.email
                }).then((res) => {
                    //console.log(res)
                    if(res) {
                        //if user requests for second time, just update the OTP
                        userregbuffer.updateMany({
                            email: user.email
                        },
                        {
                            $set: {
                                OTP: OTP
                            }
                        }).then(res => {
                            sendOTP(user.email);
                            response({
                                success: true,
                                code: 3
                            });
                        });
                        //console.log('updating')
                    } else {
                        //if its first time, insert whole userinfo in the buffer
                        userregbuffer.insertOne({
                            username: user.username,
                            email: user.email,
                            password_hash: hashed_password,
                            salt: salt,
                            OTP: OTP
                        }).then(res => {
                            sendOTP(user.email);
                            response({
                                success: true,
                                code: 3
                            });
                        });
                        //console.log('Inserting')
                    }
                })
            }
        });
    }
}


const verifyOTP = (req, response) => {
    let user = {
        email: req.body.email,
        password: req.body.password,
        OTP: req.body.OTP
    }
    //console.log(user);
    let userregbuffer = mongo_db.collection('userregbuffer');
    userregbuffer.findOne({
        email: user.email
    }).then((res) => {
        //console.log(res)
        if(Number(res.OTP) != Number(user.OTP)) {
            response({
                success: false,
                code: 5
            });
        } else {
            //OTP matches, proceed for completion of registration.
            let email = user.email;
            let password_hash = res.password_hash;
            let salt = res.salt;
            let username = res.username;
            let secret = 'Not Set';

            let users = mongo_db.collection('users');
            users.insertOne({
                email: email,
                password_hash: password_hash,
                salt: salt
            }).then((res) => {
                let userdata = mongo_db.collection('userdata');
                userdata.insertOne({
                    email: email,
                    username: username,
                    secret: secret
                }).then((res) => {
                    response({
                        success: true,
                        code: 0
                    })
                });
            })
        }
    });
    
}

exports.handleRegistration = handleRegistration;
exports.verifyOTP = verifyOTP;