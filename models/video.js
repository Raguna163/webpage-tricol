const mongoose = require('mongoose'),
      fs       = require('fs');

const videoSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    video: String
});

module.exports = mongoose.model("Video", videoSchema);