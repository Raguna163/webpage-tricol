const mongoose = require('mongoose'),
      moment   = require('moment'),
      fs       = require('fs');

const imageSchema = new mongoose.Schema({
	meta: {
		width: Number, 
		height: Number,
		aspect: Number,
		size: Number
	},
	path: { type: String, required: true },
	filename: { type: String, required: true },
	originalname: { type: String, required: true },
	downloads: { type: Number, default: 0 },
	createdAt: 'Moment',
	updatedAt: 'Moment'
});

imageSchema.pre('save', function(next) {
	if (this.isNew) {
		this.createdAt = new moment();
	}
	this.updatedAt = new moment();
	next();
});

imageSchema.pre('findOneAndDelete', async function() {
	try {
		let doc = await this.model.findOne(this.getFilter());
		await fs.unlinkSync(`./uploads/${doc.path}`);
		console.log(doc.path + " deleted!");
	} catch (err) { 
		console.log(err); 
	}
});

let unlinkImages = async (doc,next) => {
    try {
		console.log("This prefinddeleteMANY: ");
		console.log(this);
    	console.log("Image unlinked:" + doc);
    	fs.unlinkSync(`./uploads/${doc.path}`);
    } catch (err) {
    	console.log(err); 
    }
}

imageSchema.post('deleteMany', unlinkImages);

module.exports = mongoose.model('Image',imageSchema);


/* MULTER JSON FORMAT
{
	"fieldname":"imageFile",
	"originalname":"103834575_2872459622981264_1959295880783576890_n.jpg",
	"encoding":"7bit",
	"mimetype":"image/jpeg",
	"destination":"./uploads/",
	"filename":"imageFile-1592941261870.jpg",
	"path":"uploads\\imageFile-1592941261870.jpg",
	"size":125611
}
*/