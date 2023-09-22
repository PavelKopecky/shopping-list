"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const User_1 = require("../User");
const express = require("express");
const bcrypt = require("bcrypt");
const userList = [];
const setup = (app, router) => {
    app.use(express.static(__dirname + '/../../src/public'));
    router.get('/', (req, res) => {
        console.log('/', req.session.authorized);
        return req.session.authorized ? res.render('main', { username: req.session.username, title: 'Home page' })
            : res.render('login');
    });
    router.get('/login', (req, res) => {
        console.log('/login');
        return req.session.authorized ? res.render('main', { username: req.session.username, title: 'Login' })
            : res.render('login');
    });
    router.get('/register', (req, res) => {
        console.log('/register');
        return res.render('register', { username: req.session.username, title: 'Register' });
    });
    app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.session.authorized) {
            return res.redirect('/');
        }
        const user = userList.find(user => req.body.username === user.name);
        if (!user) {
            console.log('user not found');
            res.redirect('/login');
        }
        else {
            bcrypt.compare(req.body.password, user.hashedPassword, (e, data) => {
                if (e) {
                    console.log(e);
                }
                if (data) {
                    console.log('login successful');
                    req.session.username = user.name;
                    req.session.authorized = true;
                    res.redirect('/');
                }
                else {
                    console.log('passwords do not match');
                    res.redirect('/login');
                }
            });
        }
    }));
    app.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hashedPassword = yield bcrypt.hash(req.body.password, 10);
            userList.push(new User_1.User(req.body.username, hashedPassword));
            res.redirect('/login');
            next();
        }
        catch (e) {
            console.log(e);
            res.redirect('/register');
        }
    }));
    app.post('/logout', (req, res) => {
        console.log('user logged out');
        req.session.username = null;
        req.session.authorized = false;
        req.session.save(() => {
            req.session.regenerate(() => {
                res.redirect('/login');
            });
        });
    });
};
exports.setup = setup;
