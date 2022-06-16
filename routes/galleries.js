const router = require('express').Router({mergeParams: true}),
      Upload = require('../middleware/upload'),
      Galleries = require('../controllers/galleries.js');

router.get('/new', (req,res) => {
    res.render('galleries/newgallery',{pageid: req.params.id});
});

router.get('/', (req,res) => {
	res.redirect('../');
});

router.post('/', Upload.single('img'), Galleries.create);

router.route('/:gid')
		.get(Galleries.view)
		.delete(Galleries.delete)
		.all(Upload.array('gallery'))
		.post(Galleries.upload);


router.get('/:gid/add', Galleries.add);

router.route('/:gid/:img')
		.get(Galleries.showImg)
		.put(Galleries.updateImg)
		.delete(Galleries.deleteImg);


router.get('/:gid/:img/save', Galleries.saveImg);

module.exports = router;

// router.get('/:gid', Galleries.view);
// router.post('/:gid', Upload.array('gallery'), Galleries.upload);
// router.delete('/:gid',Galleries.delete);
// router.get('/:gid/:img', Galleries.showImg);
// router.put('/:gid/:img', Galleries.updateImg);
// router.delete('/:gid/:img', Galleries.deleteImg);