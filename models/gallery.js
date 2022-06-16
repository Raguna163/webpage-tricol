const fs       = require('fs'),
      mongoose = require('mongoose'),
      Comments = require('../models/comments'),
      Images   = require('../models/image'),
      moment   = require('moment');

gallerySchema = new mongoose.Schema({
    name: String,
    description: String,
    thumbnail: String,
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    createdAt: 'Moment',
    updatedAt: 'Moment'
});

gallerySchema.pre('save', function(next) {
    if (this.isNew) {
        this.createdAt = new moment();
    }
    this.updatedAt = new moment();
    next();
});

// Checks if image is new before deleting
gallerySchema.pre('updateOne', async function () {
    try {
        // this is updated, that is to be updated
        let that = await this.model.findOne(this.getQuery());
        if (this.thumbnail !== that.thumbnail) {
            fs.unlinkSync(`.\\uploads\\${that.thumbnail}`);
        }
    } catch (err) {
        console.log(err);
    }
});

let deleteImages = async function () {
    try {
        let doc = await this.model.findOne(this.getQuery());
        await Images.deleteMany({_id: { $in: doc.images }});
        await fs.unlinkSync(`.\\uploads\\${doc.thumbnail}`);
        fs.rmdirSync(`./uploads/galleries/${doc.name}`);
        console.log(`Gallery ${doc.name} removed!`)
    } catch (err) {
        console.log(err);
    }
}

gallerySchema.post('deleteMany', {document: true}, async (doc) => {
    try {
        await Images.deleteMany({_id: { $in: doc.images }});
        await fs.unlinkSync(`.\\uploads\\${doc.thumbnail}`);
        fs.rmdirSync(`./uploads/galleries/${doc.name}`);
        console.log(`Gallery ${doc.name} removed!`)
    } catch (err) {
        console.log(err);
    }
});
gallerySchema.post('findOneAndDelete', {document: true}, async (doc) => {
    try {
        await Images.deleteMany({_id: { $in: doc.images }});
        await fs.unlinkSync(`.\\uploads\\${doc.thumbnail}`);
        fs.rmdirSync(`./uploads/galleries/${doc.name}/`);
        console.log(`Gallery ${doc.name} removed!`)
    } catch (err) {
        console.log(err);
    }
});

module.exports = mongoose.model("Gallery",gallerySchema); 