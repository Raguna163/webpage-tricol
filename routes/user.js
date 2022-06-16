// USER ROUTES
// node_modules
const router  = require('express').Router({mergeParams: true}),
	  flash   = require('connect-flash'),
	  sizeOf  = require('image-size'),
	  moment  = require('moment'),
	  lookup  = require('country-code-lookup');

const Upload  = require('../middleware/upload'),
	  User    = require('../models/user'),
	  Comment = require('../models/comments'),
	  Image   = require('../models/image');

// ROUTES
router.get('/', async (req,res) => {
	let users = await User.find({});
	// .populate({ path: 'replies', populate: { path: 'replies' } }).exec();
	res.render('user/users', {profiles: users});
});

// ROUTES
router.get('/view', async (req,res) => {
	res.redirect('/');
});

router.get('/register', (req,res) => {
	res.render('user/register');
});

router.post('/register', Upload.single('avatar'), async (req, res) => { 
	try {
		let { country, capital } = lookup.byIso(req.body.country);
		let user = await User.register({
			username: req.body.username,
			colour: req.body.colour,
			gender: req.body.gender,
			iso: req.body.country,
			country: country,
			city: capital,
			avatar: req.file.destination.substring(9) + req.file.filename
		},req.body.password);
		req.flash("positive", `Registered ${user.username}!`)
		res.redirect('/users/login');
	} catch (err) {
		console.log(err);
	}
});

router.get('/login', (req,res) => {
	res.render('user/login');
});

//Passport auth handes callback
router.post('/login', require('../middleware/passportAuth'),()=>{}); 

router.get('/logout', (req,res) => {
	req.user.lastActive = new moment();
	req.logout();
	req.flash("info","Logged you out!");
	res.redirect('/');
});

router.get('/add/:uid', async (req, res) => {
	try {
		let cur_user = await User.findOne({ _id: req.user._id }).populate('friends').exec();
		let profile = await User.findById(req.params.uid).populate('friends').exec();
		cur_user.friends.push(profile);
		profile.friends.push(cur_user);
		cur_user.save();
		profile.save();
		req.flash("positive", `Friend, ${profile.username} added!`);
		res.redirect('/users/view/' + req.params.uid);
	} catch (err) {
		console.log(err);
	}
});

router.get('/view/:uid', async (req,res) => {
	try {
		let profile = await User.findById(req.params.uid).populate("comments").populate('friends').exec();
		res.render('user/user', {profile:profile});
	} catch (err) {
		console.log(err);
	}
});

router.post('/view/:uid', async (req, res) => {
	try {
		let user = await User.findById(req.params.uid);
		let comment = await Comment.create({
			content: req.body.comment,
			author: req.user._id
		});
		comment.save();
		user.comments.push(comment);
		user.save();
		req.flash("positive","Comment added!");
		res.redirect('/users/view/' + req.params.uid);
	} catch (err) {
		console.log(err);
	}
});

router.post('/view/:uid/:rid', async (req, res) => {
	try {
		let comment = await Comment.findById(req.params.rid);
		let reply = await Comment.create({
			content: req.body.comment,
			author: req.user._id
		});
		reply.save();
		comment.replies.push(reply);
		comment.save();
		req.flash("positive","Reply added!");
		res.redirect('/users/view/' + req.params.uid);
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;