import * as express from 'express';
import {User} from "./User.js";
const path = require('path');
const app = express();

const userList : User[] = [];

app.set('view engine', 'html');
//grants access to the forms in the html files through the req variables
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.get('/register', (req, res, next) => {
    res.sendFile(__dirname + '/views/register.html');
})

app.get('/login', (req, res, next) => {
    res.sendFile(__dirname + '/views/login.html');
})

app.listen(3000);