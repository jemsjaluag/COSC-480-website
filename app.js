const http = require('http')
const fs = require('fs')
const bcrypt = require('bcrypt');

const port = 3000
const express = require('express');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const Database = require('./login.contr');

const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


// creating 24 hrs from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

// sessions middleware
app.use(sessions({
    secret: 'thisismysecretkey123',
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}));

// parse the incoming data
app.use(express.urlencoded({ extended: true}));

// serving public file
//app.use(express.static(__dirname + '/public'));

//app.set('views', __dirname + '/public');
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// cookie parser middleware
app.use(cookieParser());

///////////////////////////////////////////////////////



const database = new Database();
const port2 = 8080;
var session;


// home
app.get('/', (req, res) => {

    // check if a session exists
    session = req.session;
    console.log(session.userid);
    if (session.userid) {
        
       // res.send(`<h1>Welcome, ${session.userid}!<h1>\n
        res.redirect('/bank');

    }
    else {
        // homepage
        //res.sendFile('public/index.html', {root:__dirname});
        res.render('index');
    }
});


// send login page
app.get('/login', (req, res) => {
    res.render('login2');
});

// send signup page
app.get('/signup', (req, res) => {
    res.render('signup2');
})


// receive user credentials from front to back.
// authenticates users
app.post('/loginUser', async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    //// debug
    console.log(`username: ${username} and ${password}`);

    const user = await database.findUser(username);

    // if user's creds was not detected
    if (!user.detected) {
        console.log('Did not find user');
        res.status(404).send('User not found');
        return;
    }
    // if username exists
    else {
        console.log('User found');

        const creds = await database.select(username);
        const hashedPassword = creds.password;

        // compare/check encrypted password
        if (await bcrypt.compare(password, hashedPassword)) {
            
            // get account info
            const account = await database.getAccount(creds.userid);
            const accountSavings = account.savings;

            // save session
            session = req.session;
            session.userid = creds.userid;
            session.username = creds.username;
            session.savings = accountSavings;
            console.log(req.session);

           res.status(300).send();
           // no redirect
           // res.redirect('/bank');
        }
        else {
            console.log('Invalid password');
            res.status(403).send('Invalid password');
            return;
        }

    }
});


// post stuff from front to end
// add user to db
app.post('/signupUser', async (req, res) => {

    const parcel = req.body;
    console.log(`User: ${parcel.username}\nPass: ${parcel.password}`);

    // check db if username already exists
    const cred = await database.findUser(parcel.username);

    // if user is already in the db
    if (cred.detected) {
        console.log('User already in the db');
        // send error status
        res.status(404).send('User already exists');
    }
    else {
        console.log('User not in db');

        // encrypt password before storing to db
        bcrypt.hash(parcel.password, 10)
            .then((hash) => {
                database.insert(parcel.username, hash);
            }).catch((error) => {
                console.log('Could not store credentials', error);
                res.status(404).send();
                return;
            });

        //database.insert(parcel.username, parcel.password);
        // send OK status
        res.status(300).send();
    }

});

// logout
// update new account value before exiting
app.get('/logout', async (req, res) => {

    console.log('Current amount before logout: ' + session.savings)
    const result = await database.updateAccount(session.userid, session.savings)

    req.session.destroy();
    res.redirect('/');
})

// send bank page
app.get('/bank', (req, res) => {
    res.render('bank', {session: session});
})

// get current session
app.get('/getSession', (req, res) => {
    const userCred = {
        username: session.username, 
        userid: session.userid,
        savings: session.savings
    }
    res.json(userCred);
})

// update amount in the account table
app.post('/updateSession', (req, res) => {
    
    session.savings = req.body.currentAmount;
    console.log('NEW UPDATED AMOUNT: ' + session.savings);
    res.status(300).send('New amount transmitted');
})


// run server
app.listen(port2, function(error) {
    if (error) {
        console.log('Error: ', error);
    }
    else {
        console.log('Listening to port: ' + port2);
    }
})