const router = require('express').Router({mergeParams: true}),
      Upload = require('../middleware/upload'),
      Video  = require('../models/video'),
      Page = require('../models/page');


router.get('/new', (req,res) => {
    res.render('newvideo',{id: req.params.id});
});

router.get('/:vid', async (req,res) => {
    try {
        let video = await Video.findById(req.params.vid);
        res.render('showvid',{video:video, id: req.params.id});
    } catch (err) {
        console.log(err);
    }
});

router.post('/', Upload.any() , async (req, res) => {
    if (!req.files) {
        res.redirect('back');
    }
    try {
        console.log(req.files);
        let page = await Page.findById(req.params.id);
        let video = await Video.create({
            name: req.body.name,
            description: req.body.description,
            image: req.files[0].filename,
            video: req.files[1].filename
        });
        video.save()
        page.videos.push(video);
        page.save()
        res.redirect('/pages/' + req.params.id);
    } catch (err) {
       console.log(err);
    }
});

module.exports = router;