const email = sessionStorage.getItem('email');
const password = sessionStorage.getItem('password');

sessionStorage.removeItem('email');
sessionStorage.removeItem('password');


import { post } from './post.js';


const OTP = document.getElementById('otp');
const verify_otp = document.getElementById('verify_otp');

verify_otp.onclick = function() {
    post('/auth/otpverify', {
        email: email,
        password: password,
        OTP: OTP.value
    },
    function(res) {
        //console.log(res);
        if(res.code == 5) {
            alert('OTP could not be verified');
        } else if(res.code == 0) {
            //verified
        }
    })
}