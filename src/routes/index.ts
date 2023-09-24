import { User } from '../User';
import * as express from 'express';
import * as bcrypt from 'bcrypt';

const userList : User[] = [];

export const setup = (app, router) => {
	app.use(express.static(__dirname + '/../../src/public'));

	router.get('/', (req, res) => {
		return req.session!.authorized ? res.render('main', { username: req.session!.username, title: 'Home page' })
			: res.redirect('/login');
	});

	router.get('/login', (req, res) => {
		return req.session!.authorized ? res.render('main', { username: req.session!.username, title: 'Welcome!' })
			: res.render('login', { title: 'Login' });
	});

	router.get('/register', (req, res) => {
		return res.render('register', { username: req.session!.username, title: 'Register' });
	});

	app.post('/login', (req, res) => {
		if (req.session!.authorized) {
			return res.redirect('/');
		}

		const user = userList.find(user => req.body.username === user.name);

		if (!user) {
			console.log('user not found');
			return res.render('login', { title: 'Login', message: 'User not found.' });
		}

		bcrypt.compare(req.body.password, user.hashedPassword, (e, data) => {
			if (e) {
				console.log(e);
			}

			if (data) {
				req.session!.username = user.name;
				req.session!.authorized = true;
				res.redirect('/');
			} else {
				return res.render('login', { title: 'Login', message: 'Wrong password.' });
			}
		});
	});

	router.post('/register', async (req, res, next) => {
		bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
			if (userList.find(user => req.body.username === user.name)) {
				return res.render('register', { title: 'Register', message: 'This username is taken.' });
			}

			userList.push(new User(
				req.body.username,
				hashedPassword,
			));

			res.redirect('/login');
			next();
		}).catch(() => res.redirect('/register'));
	});

	router.post('/logout', (req, res) => {
		req.session!.username = null;
		req.session!.authorized = false;

		req.session!.save(() => {
			req.session!.regenerate(() => {
				res.redirect('/login');
			});
		});
	});
};
