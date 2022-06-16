const Page  = require('../models/page'),
	  Story = require('../models/story');

module.exports = {
	create: async (req, res) => {
		try {
			let page = await Page.findById(req.params.id);
			let story = await Story.create({
				name: req.body.name,
				image: req.file.filename,
				story: req.body.story
			});
			story.save();
			page.stories.push(story);
			page.save();
			res.redirect('/pages/' + req.params.id);
		} catch (err) {
			console.log(err);
		}
	},
	new: async (req, res) => {
		try {
			let page = await Page.findById(req.params.id).lean();
			res.render('newstory',{page:page});
		} catch (err) {
			console.log(err);
		}
	},
	edit: async (req, res) => {
		try {
			let story = await Story.findById(req.params.fid).lean();
			res.render('editstory',{story:story, pageid: req.params.id});
		} catch (err) {
			console.log(err);
		}
	},
	update:async (req, res) => {
		let newStory = {};
		try {
			newStory.title = req.body.title;
			newStory.story = req.body.story;
			if (req.file) {
				newStory.image = req.file.filename;
			}
			let story = await Story.updateOne({_id: req.params.fid},newStory);
			res.redirect('/pages/' + req.params.id);
		} catch (err) {
			console.log(err);
		}
	},
	delete: async (req,res) => {
		try {
			let story = await Story.findOneAndDelete({_id: req.params.fid});
			fs.unlinkSync('./uploads/' + story.image);
			res.redirect('/pages/' + req.params.id)
		} catch (err) {
			console.log(err);
		}
	}
}