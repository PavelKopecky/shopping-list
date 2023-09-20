import * as express from 'express';
import {User} from "./User.js";

const bcrypt = require('bcrypt');
const path = require('path');
const passport = require('passport');

const app = express();
const userList : User[] = [];

app.set('view engine', 'html');
//grants access to the forms in the html files through the req variables
app.use(express.urlencoded({extended: false}));
//replaces app.get, loads static pages from the directory automatically
app.use(express.static(__dirname + '/../views', {
    extensions: [ 'html' ]
}));

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        userList.push(new User(
            Date.now().toString(),
            req.body.name,
            hashedPassword
        ));
        console.log(userList + ' success');
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
})

app.listen(3000);