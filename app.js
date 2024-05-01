const http = require('http')
const fs = require('fs')

const port = 3000
const express = require('express');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const Database = require('./login.contr');

const app = express();

//app.use(express.static('public'));
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
         //       <a href=\'/logout'>Logout</a>`);
        res.redirect('/bank');

        //res.sendFile('public/user.html', {root:__dirname});
    }
    else {
        // homepage
        //res.sendFile('public/index.html', {root:__dirname});
        res.render('index');
    }
});


// send login page
app.get('/login', (req, res) => {
   // res.sendFile('public/login.html', {root:__dirname});
    res.render('login2');
});


// receive user credentials from front to back.
// authenticates users
app.post('/loginUser', async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    //// debug
    console.log(`username: ${username} and ${password}`);

    const cred = await database.select(username, password);

    // if user's creds was not detected
    if (!cred.detected) {
        res.status(404);
        console.log('Did not find user');
        res.status(404).send('User not found');
    }
    // if found
    else {
        console.log('User found');

        // save session
        session = req.session;
        session.userid = username;
        console.log(req.session);
        console.log('bank html');

        res.status(300);
        res.redirect('/bank');
    }
});


// post stuff from front to end
// add user to db
app.post('/post', async (req, res) => {

    const parcel = req.body;
    console.log(`User: ${parcel.username}\nPass: ${parcel.password}`);

    const cred = await database.select(parcel.username, parcel.password);

    // if user is already in the db
    if (cred.detected) {
        console.log('User already in the db');
        res.status(404).send();
    }
    else {
        console.log('User not in db');
        database.insert(parcel.username, parcel.password);
        res.status(300).send();
    }

});


// logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

app.get('/bank', (req, res) => {
    res.render('bank', {name: session.userid, savings: 0});
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