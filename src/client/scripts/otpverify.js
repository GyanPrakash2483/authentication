const email = sessionStorage.getItem('email');

sessionStorage.removeItem('email');

import { post } from './post.js';


const OTP = document.getElementById('otp');
const verify_otp = document.getElementById('verify_otp');

verify_otp.onclick = function() {
    post('/auth/otpverify', {
        email: email,
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