const flash   = require('connect-flash'),
      Image   = require('../models/image')
      Gallery = require('../models/gallery'),
      Comment = require('../models/comments'),
      User    = require('../models/user.js'),
      Page    = require('../models/page'),
      sizeOf  = require('image-size'),
      _       = require('lodash/core');


module.exports = {
    create: async (req, res) =>{
        try {
            let page = await Page.findById(req.params.id);
            let gallery = await Gallery.create({
                name: req.body.name,
                description: req.body.description,
                thumbnail: req.file.destination.substring(9) + req.file.filename
            });
            gallery.save();
            page.galleries.push(gallery);
            page.save();
            req.flash("positive",`${req.body.name} was successfully created by ${req.user.username}`);
            res.redirect(gallery._id);
        } catch (err) {
            console.log(err);
        }
    },
    upload: async (req,res) => {
        try {
            let gallery = await Gallery.findById(req.params.gid).populate("images");
            await req.files.forEach(async (file,idx,arr) => {
                try {
                    const dim = sizeOf(file.path);
                    let img = await Image.create({
                        meta: {
                            width: dim.width, 
                            height: dim.height,
                            aspect: dim.width/dim.height,
                            size: file.size
                        },
                        path: file.destination.substring(9) + file.filename,
                        filename: file.filename,
                        originalname: file.originalname,
                    });
                    img.save();
                    gallery.images.push(img);
                    if (idx === arr.length - 1) {
                        gallery.images = await _.sortBy(gallery.images,[o => o.originalname]);
                        gallery.save();
                    }
                } catch (err) {
                    console.log(err);
                }
            });
            req.flash("positive",`${req.files.length} images added!`);
            res.redirect(req.params.gid);
        } catch (err) {
            console.log(err);
        }
    },
    add: async (req,res) => {
        try {
            let gallery = await Gallery.findById(req.params.gid).lean();
            res.render('galleries/addimages',{gallery:gallery, id: req.params.id});
        } catch (err) {
            console.log(err);
        }
    },
    view: async (req,res) => {
        try {
            let gallery = await Gallery.findById(req.params.gid).lean().populate("images");
            let page = await Page.findById(req.params.id).lean();
            res.render('galleries/fullgallery',{gallery: gallery, page: page, id: req.params.id});
        } catch (err) {
            console.log(err);
        }
    },
    delete: async (req,res) => {
        try {
            let del = await Gallery.findByIdAndDelete(req.params.gid);
            req.flash("positive",`${del.name} was successfully deleted by ${req.user.username}`);
            res.redirect('/pages/' + req.params.id);
        } catch (err) {
            console.log(err);
        }
    },
    showImg: async (req, res) => {
        try {
            let gallery = await Gallery.findById(req.params.gid).populate("images").exec();
            let page = await Page.findById(req.params.id).lean();
            res.render('galleries/showimg',{gallery:gallery, page: page , params: req.params});
        } catch (err) {
            console.log(err);
        }
    },
    saveImg: async (req, res) => {
        try {
            let gallery = await Gallery.findById(req.params.gid).populate("images").exec();
            let user = await User.findOne({_id: req.user._id}).populate('gallery');
            user.gallery.images.push(gallery.images[req.params.img]);
            user.save();
            req.flash("success","Image saved!")
            res.redirect('../');
        } catch (err) {
            console.log(err);
        }
    },
    updateImg: async (req,res) => {
        await Gallery.updateOne(
            { _id: req.params.gid, "images.location": req.body.location },
            { $set: { "images.$.aspect" : req.body.aspect } }
        );
        req.flash("info","Image updated!");
        res.redirect('back');
    },
    deleteImg: async (req,res) => {
        let del_img = await Image.findByIdAndDelete(req.params.gid);
        res.redirect('../' + req.params.gid);
    }
}