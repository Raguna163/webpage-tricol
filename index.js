//NODE MODULES
const express        = require('express'),
	  app            = express(),
	  open           = require('open'),
	  mongoose       = require('mongoose'),
	  moment         = require('moment'),
	  flash          = require('connect-flash'),
	  methodOverride = require('method-override'),
	  passport       = require('passport'),
	  passportLocal  = require('passport-local'),
	  port           = process.env.PORT || 3000;
	  
require('mongoose-moment')(mongoose);

// == MODELS ==
const Image   = require('./models/image'),	
	  User    = require('./models/user'),
	  Page    = require('./models/page'),
	  Story   = require('./models/story'),
	  Gallery = require('./models/gallery'),
	  Video   = require('./models/video');

// EXPRESS SETUP
app.use(flash()); 
app.set('view engine', 'ejs');
app.use(methodOverride("_m"));
app.use(require('body-parser').urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));
app.use(require('express-session')({
	secret: "tercesasisiht",
	resave: false,
	saveUninitialized: false
}));

// PASSPORT SETUP
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.user = req.user;
	res.locals.route = req.originalUrl.split('/');
	res.locals.error = req.flash("error");
	res.locals.positive = req.flash("positive");
	res.locals.success = req.flash("success");
	res.locals.info = req.flash("info");
	next();
});
// CHECK ALL ROUTES FOR AUTHENTICATION
app.use('/pages', function(req, res, next) {
	if (req.isAuthenticated()) next();
	else { req.flash("error","You must be signed in.");
		   res.redirect('/users/login'); }
});

// ROUTES SETUP
app.use('/users', require('./routes/user'));
app.use('/pages', require('./routes/pages'));
app.use('/pages/:id/stories', require('./routes/story'));
app.use('/pages/:id/galleries', require('./routes/galleries'));
app.use('/pages/:id/videos', require('./routes/videos'));

// Root Route
app.get('/', (req,res) => { 
    res.render('index');
});

// 404 Route
// app.get('*',(req,res) =>{
// 	res.send("404 PAGE NOT FOUND");
// });

const mongooseOptions = { useNewUrlParser: true, 
	                      useUnifiedTopology: true,
	                      useFindAndModify: false,
	                      useCreateIndex: true }
mongoose.connect('mongodb://localhost:27017/webpage',mongooseOptions);

var serv_msg = `Serving website @ http://localhost:${port}/`;
app.listen(port, () => console.log(serv_msg));
open(`http://localhost:${port}/`,
	{app: ['firefox', '--private']});