const fs     = require('fs'),
      multer = require('multer');

const Gallery = require('../models/gallery')

function dirExists(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
		console.log(dir + " created!");
	}
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let dest = './uploads/'
  		dest += req.baseUrl.match(/[A-Za-z]+\b/g).pop() + '/'; // Find route in path
  		dirExists(dest);
  		dest += (req.body.name || req.body.username) + '/';
  		dirExists(dest);
  		cb(null, dest);
  	},
  	filename: function (req, file, cb) {
  		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4);
  		const mimetype = file.originalname.split('.').slice(-1).pop();
  		cb(null, `${file.fieldname}-${uniqueSuffix}.${mimetype}`);
  	}
  });
 

module.exports = multer({ storage: storage });