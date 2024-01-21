const path = require('node:path');
require('dotenv').config();

const express = require('express');

const register = require('./register.js');
const login = require('./login.js');

const PORT = process.env.PORT;


const app = express();

app.use(express.json());


app.use('/', express.static(path.join(__dirname, 'client')));


app.post('/auth/register', (req, res) => {
    register.handleRegistration(req, function(response){
        res.send(response);
    });
});

app.post('/auth/otpverify', (req, res) => {
    register.verifyOTP(req, function(response){
        res.send(response);
    });
});

app.post('/auth/login', (req, res) => {
    login.handleLogin(req, function(response){
        res.send(response);
    });
});




app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})