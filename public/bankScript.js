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

// deposit function
async function deposit(e) {
    e.preventDefault();
    
    ///// input checking
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

    // add deposited amount to the current amount
    currentAmount += amount;
    console.log('New amount: ' + currentAmount);

    // then change label
    savingsLabel.innerHTML = 'Savings: $ ' + currentAmount;
    depositAmt.value = '';

    // add new amount to the session
    session.savings = currentAmount;

    // pass the new current amount to the backend for saving (db)
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

// withdraw function
async function withdraw(e) {
    e.preventDefault();
    
    ///// input checking
    if (withdrawAmt.value == '') return;

    var amount = parseFloat(withdrawAmt.value);
    console.log(typeof amount);

    // check if not number
    if (isNaN(amount)) {
        console.log(amount);
        alert('Invalid amount input!');
        withdrawAmt.value = '';
        return;
    }

    // check if amount is too much
    if (amount > 10000) {
        alert('Amount entered is too much. ($10,000 Limit per Transaction)');
        withdrawAmt.value = '';
        return;
    }

    console.log(amount);

    // modify new amount
    currentAmount -= amount;
    console.log('New amount: ' + currentAmount);

    // change label to reflect new current amount
    savingsLabel.innerHTML = 'Savings: $ ' + currentAmount;

    withdrawAmt.value = '';
    // save in session
    session.savings = currentAmount;

    // send the new amount to the backend for saving (db)
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