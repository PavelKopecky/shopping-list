import { User } from '../User';
import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { ShoppingListEntry } from '../ShoppingListEntry';

const userList : User[] = [];

export const setup = (app, router) => {
	app.use(express.static(__dirname + '/../../src/public'));

	router.get('/', (req, res) => {
		return req.session!.authorized ? res.render('main', { user: userList.find(user => user.name === req.session!.username), title: 'Home page' })
			: res.redirect('/login');
	});

	router.get('/login', (req, res) => {
		return req.session!.authorized ? res.render('main', { user: userList.find(user => user.name === req.session!.username), title: 'Home page' })
			: res.render('login', { title: 'Login' });
	});

	router.get('/register', (req, res) => {
		return res.render('register', { username: req.session!.username, title: 'Register' });
	});

	router.get('/add-entry', (req, res) => {
		return res.render('add-entry', { title: 'Add Entry' });
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

	router.post('/add-entry', (req, res) => {
		res.redirect('/add-entry');
	});

	router.post('/save-entry', (req, res) => {
		const user = userList.find(user => req.session.username === user.name);
		console.log(user!.shoppingList);

		if (user!.shoppingList.find(entry => entry.date === req.body.date)) {
			console.log('slort already filled');
		} else {
			console.log(req.body.date, [ req.body.list ]);
			let i = 0;

			// linear is enough
			for (const entry of user!.shoppingList) {
				if (entry.date > req.body.date) {
					break;
				} else {
					i++;
				}
			}

			user?.shoppingList.splice(i, 0, new ShoppingListEntry(req.body.date, [ req.body.list ]));
			res.redirect('/');
		}
	});

	router.post('/show-entry', (req, res) => {
		const user = userList.find(user => req.session.username === user.name);
		const entry = user?.shoppingList.find(entry => entry.date === req.body.bttn);

		if (!entry) {
			res.redirect('/');
		}

		res.render('entry', {
			entry,
			notFirst: !(entry!.date === user!.shoppingList[0].date),
			notLast: !(entry!.date === user!.shoppingList[user!.shoppingList.length - 1].date),
		});
	});

	router.post('/back', (req, res) => {
		res.redirect('/');
	});

	router.post('/prev-entry', (req, res) => {
		const user = userList.find(user => req.session.username === user.name);
		let entry = user?.shoppingList.find(entry => entry.date === req.body.bttn);

		if (!entry) {
			res.redirect('/');
		}

		const index = user!.shoppingList.indexOf(entry!);
		entry = user!.shoppingList[index - 1];

		res.render('entry', {
			entry,
			notFirst: !(entry!.date === user!.shoppingList[0].date),
			notLast: !(entry!.date === user!.shoppingList[user!.shoppingList.length - 1].date),
		});
	});

	router.post('/next-entry', (req, res) => {
		const user = userList.find(user => req.session.username === user.name);
		let entry = user?.shoppingList.find(entry => entry.date === req.body.bttn);

		if (!entry) {
			res.redirect('/');
		}

		const index = user!.shoppingList.indexOf(entry!);
		entry = user!.shoppingList[index + 1];

		res.render('entry', {
			entry,
			notFirst: !(entry!.date === user!.shoppingList[0].date),
			notLast: !(entry!.date === user!.shoppingList[user!.shoppingList.length - 1].date),
		});
	});
};
