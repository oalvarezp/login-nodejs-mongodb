const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const authRoutes = require('./routes/auth');

// Initialiters
const app = express();
require('./database');
require('./passport/passport');

// Settings
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	app.locals.error = req.flash('error');
	app.locals.errorSignin = req.flash('errorSignin');
	app.locals.user = req.user;
	next();
});

//Routes
app.use('/', authRoutes);

// Starting the server
app.listen(app.get('port'), () => {
	console.log('Server on port', app.get('port'));
});