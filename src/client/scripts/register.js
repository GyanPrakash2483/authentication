import { post } from './post.js';

const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const register_btn = document.getElementById('register_btn');


register_btn.onclick = function() {
    post('/auth/register', {
        username: username.value,
        email: email.value,
        password: password.value
    },
    function(res) {
        //console.log(res);
        if(res.code == 1) {
            alert("Request rejected as Invalid by server.");
        } else if(res.code == 2) {
            alert("User already exists.");
        } else if(res.code == 3) {
            sessionStorage.setItem('email', email.value);
            window.location.href = './otpverify.html';
        }

    }
    );
}