const mongoose = require('mongoose'),
      fs       = require('fs'),
      Page     = require('../models/page');

const storySchema = new mongoose.Schema({
	name: String,
	image: String,
	story: String
});

storySchema.pre('updateOne', async function () {
    try {
        let del_img = await this.model.findOne(this.getQuery());
        fs.unlinkSync('./uploads/' + del_img.image);
    } catch (err) {
        console.log(err);
    }
});

module.exports = mongoose.model("Story",storySchema);
