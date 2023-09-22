import * as express from 'express';
import { setup } from './routes';
import * as path from 'path';
import * as session from 'express-session';
import { engine } from 'express-handlebars';


const app = express();
const router = express.Router();

app.use(session({
	secret: 'thisSecretIsEnoughForThisApp',
	resave: true,
	saveUninitialized: false,
}));

// grants access to the forms in the html files through the req variables
app.use(express.urlencoded({ extended: false }));

app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'index', layoutsDir: __dirname + '/../views/layouts' }));
// replaces app.get, loads static pages from the directory automatically
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/../views'));
app.use('/', router);

setup(app, router);

module.exports = router;

app.listen(3000);
