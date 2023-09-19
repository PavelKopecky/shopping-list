import * as express from 'express';
const path = require('path');
const app = express();

app.set('view engine', 'html');

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.listen(3000);