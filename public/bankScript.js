const depositBtn = document.getElementById('depositBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const depositAmt = document.getElementById('deposit');
const withdrawAmt = document.getElementById('withdraw');
const savingsLabel = document.getElementById('savingsLabel');

const getSessionURL = 'http://localhost:8080/getSession';
const updateSessionURL = 'http://localhost:8080/updateSession';
var session;
var currentAmount;

getSession();

document.addEventListener('DOMContentLoaded', () => {

    depositBtn.addEventListener('click', deposit);
    withdrawBtn.addEventListener('click', withdraw);
    
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
    session = await res.json();
    currentAmount = session.savings;
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

    currentAmount += amount;
    console.log('New amount: ' + currentAmount);

    savingsLabel.innerHTML = 'Savings: $ ' + currentAmount;

    depositAmt.value = '';
    session.savings = currentAmount;

    const result = await fetch(updateSessionURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            currentAmount: currentAmount
        })
    });


    return;

}

async function withdraw(e) {
    e.preventDefault();
    
    if (withdrawAmt.value == '') return;

    var amount = parseFloat(withdrawAmt.value);
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

    currentAmount -= amount;
    console.log('New amount: ' + currentAmount);

    savingsLabel.innerHTML = 'Savings: $ ' + currentAmount;

    withdrawAmt.value = '';
    session.savings = currentAmount;

    
    const result = await fetch(updateSessionURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            currentAmount: currentAmount
        })
    });


    return;

}