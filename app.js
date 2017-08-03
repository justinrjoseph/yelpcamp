require('dotenv').config({ silent: true });

let express = require('express'),
		app = express(),
		flash = require('connect-flash'),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		Campground = require('./models/campground'),
		Comment = require('./models/comment'),
		seedDB = require('./seeds'),
		passport = require('passport'),
		LocalStrategy = require('passport-local'),
		methodOverride = require('method-override'),
		User = require('./models/user');

let authRoutes = require('./routes/auth'),
		campgroundRoutes = require('./routes/campgrounds'),
		commentRoutes = require('./routes/comments');

mongoose.connect('mongodb://localhost/yelpcamp', { useMongoClient: true });

// seedDB();

app.use(require('express-session')({
	secret: 'once again Rusty wins cutest dog!',
	resave: false,
	saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(process.env.PORT, () => {
	console.log('YelpCamp server ready...');
});
