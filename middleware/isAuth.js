module.exports = function(req, res, next) {
	if (req.isAuthenticated()) next();
	else { req.flash("error","You must be signed in.");
		   res.redirect('/users/login'); }
} 