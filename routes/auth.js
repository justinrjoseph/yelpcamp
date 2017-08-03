let express = require('express'),
    router = express.Router(),
    { isLoggedIn } = require ('../middleware'),
    passport = require('passport'),
    User = require('../models/user');

router.get('/', (req, res) => {
	res.render('landing');
});

router.get('/register', (req, res) => {
	res.render('register')
});

router.post('/register', (req, res) => {
	let newUser = new User({ username: req.body.username });

	User.register(newUser, req.body.password, (err, user) => {
		if ( err ) {
			console.log(err.toString());
			return res.render('register', { error: err.message });
		} else {
			passport.authenticate('local')(req, res, () => {
        req.flash('success', `Welcome to YelpCamp, ${user.username}!`)
				res.redirect('/campgrounds');
			});
		}
	})
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login' }
	), (req, res) => {
});

router.get('/logout', (req, res) => {
	req.logout();
  req.flash('success', 'You have sucessfully logged out.');
	res.redirect('/campgrounds');
});

module.exports = router;
