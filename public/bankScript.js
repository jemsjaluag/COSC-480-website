const depositBtn = document.getElementById('depositBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const depositAmt = document.getElementById('deposit');
const withdrawAmt = document.getElementById('withdraw');

const getSessionURL = 'http://localhost:8080/getSession'
var session;
var accountAmount;

getSession();

document.addEventListener('DOMContentLoaded', () => {

    depositBtn.addEventListener('click', deposit);
  //  withdrawBtn.addEventListener('click', signup);
    
    // get session
   // getSession();


});


async function getSession() {
  //  e.preventDefault();

    // fetch session from backend using method 'get'
    const res = await fetch(getSessionURL, {
        method: 'GET'
    });

    console.log(res);
    const session = await res.json();
    accountAmount = session
    console.log(session.userid);
}

async function deposit(e) {
    e.preventDefault();
    
    if (depositAmt.value == '') return;

    var amount = parseFloat(depositAmt.value);
    console.log(typeof amount);

    // check if not number
    if (isNaN(amount)) {
        console.log(amount);
        alert('Invalid amount input!');
        depositAmt.value = '';
        return;
    }

    // check if amount is too much
    if (amount > 10000) {
        alert('Amount entered is too much. ($10,000 Limit per Transaction)');
        depositAmt.value = '';
        return;
    }

    console.log(amount);

    depositAmt.value = '';

}