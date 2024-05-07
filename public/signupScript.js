
const username = document.getElementById('username');
const password = document.getElementById('password');
const signupBtn = document.getElementById('signupBtn');
const statusReport = document.getElementById('msg');

const signupURL = '/signupUser';

document.addEventListener('DOMContentLoaded', () => {

    signupBtn.addEventListener('click', signup);
});


// signup function
// function to send stuff from front to back
async function signup(e) {
    e.preventDefault();
    if (username.value == '' || password.value == '') return;

    // fetch resources from url using method 'post.'
    // send extracted username.
    const res = await fetch(signupURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    });

    // report
    // signup success
    if (res.status == 300){
        username.value = '';
        password.value = '';

        alert('Signup success!');
        statusReport.innerHTML = 'Signup success!';
        statusReport.style.color = 'green';
    }
    // if username already exists in the db
    else if (res.status == 404){
        username.value = '';
        password.value = '';
        
        alert('User already exists!');
        statusReport.innerHTML = 'User already exists';
        statusReport.style.color = 'red';
    }

}