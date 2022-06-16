const fs       = require('fs'),
	  plm      = require('passport-local-mongoose'),
	  mongoose = require('mongoose'),
	  moment   = require('moment');

const Comment = require('../models/comments'),
	  Story   = require('../models/story');


userSchema = new mongoose.Schema({
	iso: String,
	country: String,
	city: String,
	gender: String,
	colour: String,
	avatar: {type: String, required: true },
	stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	joined: 'Moment',
	lastActive: 'Moment'
});
 
userSchema.plugin(plm);

userSchema.pre('save', function(next) {
	if (this.isNew) {
		this.joined = new moment();
		this.lastActive = new moment();
	}
	next();
});

userSchema.post('findOneAndDelete', {document: true}, async (doc) => {
	try {
		Comment.deleteMany({_id: { $in: doc.comments } });
		Gallery.deleteOne({_id: { $in: doc.gallery }});
		fs.unlinkSync(`.\\uploads\\${doc.avatar}`);
		console.log(`User ${doc.username} has been deleted!`);
	} catch (err) {
		console.log(err);
	}
});

module.exports = mongoose.model("User", userSchema);