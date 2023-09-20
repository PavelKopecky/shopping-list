import * as express from 'express';
import {User} from "./User.js";
const path = require('path');

const app = express();
const userList : User[] = [];

app.set('view engine', 'html');
//grants access to the forms in the html files through the req variables
app.use(express.urlencoded({extended: false}));

app.use(express.static(__dirname + '/../views', {
    extensions: [ 'html' ]
}));

app.listen(3000);