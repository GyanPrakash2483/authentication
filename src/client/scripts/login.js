import { post } from './post.js';

const email = document.getElementById('email');
const password = document.getElementById('password');
const login_btn = document.getElementById('login_btn');


login_btn.onclick = function() {
    post('/auth/login', {
        email: email.value,
        password: password.value
    },
    function(res) {
        if(res.code == 1) {
            alert('This email is not associated with any account.');
        } else if (res.code == 2) {
            alert('Wron credentials');
        } else if(res.code == 0) {
            let jwt = res.token;
            localStorage.setItem('login_token', jwt);
        }
    });
}