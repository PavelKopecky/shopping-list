import * as express from 'express';
import {User} from "./User.js";
import {setup} from './routes/index.js';

const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');
const { engine } = require('express-handlebars');


const app = express();
const router = express.Router();
const userList : User[] = [];

app.use(session({
    secret: 'thisSecretIsEnoughForThisApp',
    resave: true,
    saveUninitialized: false,
    user: ''
}))

//grants access to the forms in the html files through the req variables
app.use(express.urlencoded({extended: false}));

app.engine('hbs', engine({extname: 'hbs', defaultLayout: 'index', layoutsDir: __dirname + '/../views/layouts'}));
//replaces app.get, loads static pages from the directory automatically
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/../views'));
app.use('/', router);
setup(app, router);

module.exports = router;

app.listen(3000);