const mongoose = require('mongoose'),
      moment   = require('moment');

const commentSchema = new mongoose.Schema({
	content: String,
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
	createdAt: 'Moment'
});

commentSchema.pre('save', function(next) {
	if (this.isNew) {
		this.createdAt = new moment();
	}
	next();
});

commentSchema.pre('find', function(next) {
	this.populate("replies");
	this.populate("author");
	next();
});

module.exports = mongoose.model("Comment",commentSchema); 