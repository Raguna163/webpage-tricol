const Page = require('../models/page.js');

module.exports = {
    showAll: async (req,res) => {
        try {
            let pages = await Page.find({});
            res.render('pages/pages',{pages:pages});
        } catch (err) {
            console.log(err);
        }
    },
    create: async (req, res) => {
        if (!req.file) {
            res.redirect('back');
        } else {
            try {
                res.redirect('/pages');
            } catch (err) {
                console.log(err);
            }
        }
    },
    show: async (req, res) => {
        try {
            let page = await Page.findById(req.params.id)
                                  .populate("stories")
                                  .populate("galleries")
                                  .populate("videos").exec();
            res.locals.title = page.name;
            res.render('pages/page',{page:page});
        } catch (err) { 
            console.log(err);
        }
    },
    edit: async (req, res) => {
        let newPage = {};
        if (req.file) {
            newPage.image = req.file.filename;
        }
        try {
            newPage.name = req.body.name;
            res.redirect('/pages/' + req.params.id);
        } catch (err) {
            console.log(err);
        }
    },
    delete: async (req,res) => {
        try {
            res.redirect('/pages');
        } catch (err) {
            console.log(err);
        }
    },
    showEditPage: async (req, res) => {
        try {
            let page = await Page.findById(req.params.id);
            res.render('pages/editpage',{page:page});
        } catch (err) {
            console.log(err);
        }
    },
    new: async (req,res) => {
        res.render('pages/newpage');
    }
}