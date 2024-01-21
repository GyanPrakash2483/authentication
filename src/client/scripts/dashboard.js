import { post } from './post.js';

const username = document.getElementById('username');
const email = document.getElementById('email');
const secret = document.getElementById('secret');
const change_secret = document.getElementById('change_secret');
const logout = document.getElementById('logout');

const custom_input = document.getElementById('custom_input');
const custom_input_close = document.getElementById('custom_input_close');
const custom_input_title = document.getElementById('custom_input_title');
const custom_input_text = document.getElementById('custom_input_text');
const new_secret = document.getElementById('newsecret');
const change = document.getElementById('change');

const container = document.getElementById('container');


const jwt = localStorage.getItem('login_token');

if(!jwt) {
    //not logged in
    window.location.href = './login.html';
} else {
    //user logged in, proceed
    post('/user/userinfo', {
        JWT: jwt,
        code: 0
    }, function(res){
        //console.log(res);
        if(res.code == 1) {
            //jwt didnt verify
            localStorage.clear('login_token');
            window.location.href = './login.html';
        } else if (res.code == 2) {
            alert('Could not obtain user data');
        } else if(res.code == 0) {
            username.innerText = res.username;
            email.innerText = res.email;
            secret.innerText = res.secret;
        }
    });
}

change_secret.onclick = function() {
    custom_input_title.innerText = 'Change Secret';
    custom_input_text.innerText = 'Enter new secret';
    custom_input.style.display = 'block';
    container.style.display = 'none';
}

custom_input_close.onclick = function() {
    custom_input.style.display = 'none';
    container.style.display = 'block';
}

change.onclick = function() {
    let newsecret = new_secret.value;
    custom_input.display = 'none';
    if(!newsecret) {
        alert('No valid secret provided');
    } else {
        //console.log(newsecret)
        post('user/userinfo', {
            JWT: jwt,
            code: 1,
            newsecret: newsecret
        }, function(res) {
            //console.log(res);
            if(res.code == 1) {
                alert('Login token could not be verified.');
            } else if(res.code == 2) {
                alert('Database could not be upgraded.');
            } else if (res.code == 0) {
                window.location.href = './dashboard.html';
            }
        });
    }
}

logout.onclick = function() {
    localStorage.clear('login_token');
    window.location.href = './';
}