const fs     = require('fs'),
      router = require('express').Router();

const Pages = require('../controllers/pages'),
      Upload = require('../middleware/upload');

router.route('/new')
      .get(Pages.new);

router.route('/')
      .get(Pages.showAll)
      .all(Upload.single('img'))
      .post(Pages.create);

router.route('/:id')
      .get(Pages.show)
      .delete(Pages.delete)
      .all(Upload.single('img'))
      .post(Pages.edit);


router.route('/:id/edit')
      .get(Pages.showEditPage);

module.exports = router; 