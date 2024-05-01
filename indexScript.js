const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const username = document.getElementById('username');
const password = document.getElementById('password');
const label = document.getElementById('msg');

const homeURL = 'http://localhost:8080/';
const postURL = 'http://localhost:8080/post';
const loginURL = 'http://localhost:8080/loginUser';
const bankURL = 'http://localhost:8080/bank';



document.addEventListener('DOMContentLoaded', () => {

    loginBtn.addEventListener('click', loginUser);
    signupBtn.addEventListener('click', postInfo);

});


// function to request stuff from back to end
async function getInfo(e) {
    e.preventDefault();

    // fetch resources from url using method 'get'
    const res = await fetch(baseURL, {
        method: 'GET'
    });
    console.log(res);
    const data = await res.json();
    // put received data to the input bar
    username.value = data.info;
}


// login function
// function to check if user's credentials is in the db
async function loginUser(e){
    e.preventDefault();
    if (username.value == '' || password.value == '') return;

    const res = await fetch(loginURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })

    // if user is detected/retrieved
    if (res.status == 300){
        console.log(res.status);
        //alert(`User ${username.value} is logged in!`);
        username.value = '';
        password.value = '';
        label.innerHTML = 'Login sucessful!';
        label.style.color = 'green';
        //alert(`User ${username.value} is logged in!`);

        ////// send to bank page
        

    }
    else {
      //  alert('User does not exist!');
        username.value = '';
        password.value = '';
        label.innerHTML = 'Login failed.';
        label.style.color = 'red';
        alert('User does not exist!');
    }
}


// signup function
// function to send stuff from front to back
async function postInfo(e) {
    e.preventDefault();
    if (username.value == '' || password.value == '') return;


    // fetch resources from url using method 'post'
    const res = await fetch(postURL, {
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
    if (res.status == 300){
        username.value = '';
        password.value = '';

        alert('Signup success!');
        label.innerHTML = 'Signup success!';
        label.style.color = 'green';
    }
    else if (res.status == 404){
        username.value = '';
        password.value = '';
        
        alert('User already exists!');
        label.innerHTML = 'User already exists';
        label.style.color = 'red';
    }

}

function toHome() {
    fetch(homeURL, {
        method: 'GET'
    });
}
