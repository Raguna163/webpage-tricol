const mongoose = require('mongoose'),
      fs       = require('fs'),
      moment   = require('moment');

const Comment = require('../models/comments'),
      Story = require('../models/story'),
      Gallery = require('../models/gallery'),
      Video   = require('../models/video');

var pageSchema = new mongoose.Schema({
	name: {type: String, default: "Page"},
	description: {type: String, default: "Description"},
	categories: [String],
	image: String,
	stories: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Story"
	}],
	galleries: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Gallery"
	}],
	videos: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Video"
	}],
	createdAt: 'Moment'
});

pageSchema.pre('save', function(next) {
    if (this.isNew) {
        this.createdAt = new moment();
    }
    next();
});

pageSchema.pre('updateOne', async function () {
	try {
		let pageToBeUpdated = await this.model.findOne(this.getQuery());
		if (this.image !== pageToBeUpdated.image) {
			fs.unlinkSync(`./uploads/pages/${pageToBeUpdated.name}/${pageToBeUpdated.image}`);
		}
	} catch (err) {
		console.log(err);
	}
});

pageSchema.post('findOneAndDelete', {document:true}, async (doc) => {
	try {
		await Story.deleteMany({_id: { $in: doc.stories } });
		await Gallery.deleteMany({_id: { $in: doc.galleries } });
		await Video.deleteMany({_id: { $in: doc.videos } });
		fs.unlinkSync(`./uploads/pages/${doc.name}/${doc.image}`);
		console.log("Page" + doc.name + " removed!");
	} catch (err) {
		console.log(err);
	}
});

module.exports = mongoose.model("Page",pageSchema);