// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config();
// }

import * as express from 'express';
import {User} from "./User.js";

const bcrypt = require('bcrypt');
const path = require('path');
// const passport = require('passport');
// const session = require('express-session');
//
// import {initialize as initializePassport} from './passport-config.js';
// initializePassport(passport, (username : string) => {
//     userList.find((user) => username === user.name);
// });

const app = express();
const userList : User[] = [];
const inSession : boolean = false;

app.set('view engine', 'html');
//grants access to the forms in the html files through the req variables
app.use(express.urlencoded({extended: false}));
//replaces app.get, loads static pages from the directory automatically
app.use(express.static(__dirname + '/../views', {
    extensions: [ 'html' ]
}));
// app.use(session({
//     secret: process.env.PROCESS_SECRET,
//     resave: false,
//     save: false
// }))
// app.use(passport.initialize());
// app.use(passport.session());

app.get('/', (req, res, next) => {
    inSession ? next() : res.redirect('/login');
})


app.post('/register', async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        userList.push(new User(
            req.body.username,
            hashedPassword
        ));
        console.log(userList);
        userList.length ? res.redirect('/login') : res.redirect('/register');

    } catch {
        res.redirect('/register');
    }
    next();
});

app.post('/login', async (req, res, next) => {
    const user = userList.find((user) => req.body.username === user.name);

    if (!user) {
        console.log('user not found');
        res.redirect('/login');
    } else {
        bcrypt.compare(req.body.password, user.hashedPassword, (err, res) => {
            if (err){
                console.log('err');
            }
            if (res) {
                console.log('login successful');
            } else {
                console.log('passwords do not match');
            }
        });
    }

    next();
});

app.listen(3000);