import {User} from "../User";
import * as express from "express";
const bcrypt = require('bcrypt');

let userList : User[] = [];

export const setup = (app, router) => {

    app.use(express.static(__dirname + '/../views', {
        extensions: [ 'hbs' ]
    }));

    router.get('/', (req, res, next) => {
        console.log('/');
        return req.session!.authorized ? res.render('main', {username: req.session!.username, title: 'Home page'}) : next();
    });

    router.get('/login', (req, res, next) => {
        console.log('/login');
        return req.session!.authorized ? res.render('main', {username: req.session!.username, title: 'Login'}) :
            res.render('login');
    });

    router.get('/register', (req, res, next) => {
        console.log('/register');
        return res.render('register', {username: req.session!.username, title: 'Register'});
    });

    app.post('/login', async (req, res, next) => {

        if (req.session!.authorized) {
            return res.redirect('/');
        }

        const user = userList.find((user) => req.body.username === user.name);

        if (!user) {
            console.log('user not found');
            res.redirect('/login');
        } else {
            bcrypt.compare(req.body.password, user.hashedPassword, (e, data) => {
                if (e){
                    console.log(e);
                }
                if (data) {
                    console.log('login successful');
                    req.session!.username = user.name;
                    req.session!.authorized = true;
                    res.redirect('/');
                    return;
                } else {
                    console.log('passwords do not match');
                    res.redirect('/login');
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
        } catch (e) {
            console.log(e);
            res.redirect('/register');
        }
    });

    app.post('/logout', function (req, res, next) {
        console.log('user logged out');
        req.session!.username = null;
        req.session!.authorized = false;
        req.session!.save(function () {
            req.session!.regenerate(function () {
                res.redirect('/login')
            })
        })
    })
}