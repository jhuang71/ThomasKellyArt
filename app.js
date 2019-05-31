var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	mongoose = require('mongoose'),
	Artwork = require('./models/artwork'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	seedDB = require('./seed.js');

var commentRoutes = require('./routes/comments'),
	artworkRoutes = require('./routes/artworks'),
	indexRoutes = require('./routes/index');
// seedDB();

mongoose
	.connect(process.env.DATABASEURL, {
		useNewUrlParser: true,
		useCreateIndex: true
	})
	.then(() => {
		console.log('Connected to DB!');
	})
	.catch((err) => {
		console.log('ERROR: ', err.message);
	});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.moment = require('moment');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// passport configuration
app.use(
	require('express-session')({
		secret: 'this will work for whatever i put here',
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passing currentUser to every route we have
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

// requiring routes
app.use(indexRoutes);
app.use('/artworks/:id/comments', commentRoutes);
app.use('/artworks', artworkRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
	console.log('The Yelp Camp Server has started!');
});

// app.listen(5000, function() {
// 	console.log('Kelly Artwork Server has started!');
// });
