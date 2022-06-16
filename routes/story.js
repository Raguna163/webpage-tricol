const fs     = require('fs'),
      router = require('express').Router({mergeParams: true});

const Stories = require('../controllers/story'),
      Upload  = require('../middleware/upload');


router.post('/', Upload.single('img'), Stories.create);

router.get('/new', Stories.new);

router.get('/:fid/edit', Stories.edit);

router.put('/:fid', Upload.single('img'), Stories.update);

router.delete('/:fid', Stories.delete);

module.exports = router; 