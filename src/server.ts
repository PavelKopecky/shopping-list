import * as express from 'express';
import {User} from "./User.js";

const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');

const app = express();
const userList : User[] = [];

app.use(session({
    secret: 'thisSecretIsEnoughForThisApp',
    resave: true,
    saveUninitialized: false,
    user: ''
}))

app.set('view engine', 'html');
//grants access to the forms in the html files through the req variables
app.use(express.urlencoded({extended: false}));
app.use('/', (req, res, next) => {
    if (req.path !== '/') {
        return req.path === '/login' && req.session!.authorized ?
            res.redirect('/') : next();
    } else {
        if (req.session!.authorized) {
            return next();
        } else {
            console.log('not verified');
            res.redirect('/register');
        }
    }
});

//replaces app.get, loads static pages from the directory automatically
app.use(express.static(__dirname + '/../views', {
    extensions: [ 'html' ]
}));

app.post('/login', async (req, res, next) => {

    if (req.session!.authorized) {
        return res.redirect('/');
    }

    const user = userList.find((user) => req.body.username === user.name);

    if (!user) {
        console.log('user not found');
        res.redirect('/login');
    } else {
        bcrypt.compare(req.body.password, user.hashedPassword, (err, data) => {
            if (err){
                console.log('err');
            }
            if (data) {
                console.log('login successful');
                req.session!.name = user.name;
                req.session!.authorized = true;
                res.redirect('/');
                return;
            } else {
                console.log('passwords do not match');
                res.status(302).redirect('/login');
                return;
            }
        });
    }
});

app.post('/register', async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        userList.push(new User(
            req.body.username,
            hashedPassword
        ));
        res.redirect('/login');
        next();
    } catch {
        console.log('reg err');
        res.redirect('/register');
    }
});

app.post('/logout', function (req, res, next) {
    console.log('user logged out');
    req.session!.user = null;
    req.session!.authorized = false;
    req.session!.save(function () {
        req.session!.regenerate(function () {
            res.redirect('/login')
        })
    })
})

app.listen(3000);