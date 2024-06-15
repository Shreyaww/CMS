const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const path = require('path');

router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'admin'; // all the routes here will use the admin layout
    next();

});

router.get('/', (req, res) => {

    Post.find({})
        .then(posts => {
            res.render('admin/posts', { posts: posts });
        });

    // res.render('admin/posts/index')

});

router.get('/create', (req, res) => {
    res.render('admin/posts/create')
});

router.post('/create', (req, res) => {

    let errors = [];

    if (!req.body.title) {
        errors.push({ message: "Please add a Title" })
    }
    if (!req.body.body) {
        errors.push({ message: "Please add a Description" })
    }

    if (errors.length > 0) {
        res.render('admin/posts/create', {
            errors: errors
        })

    }
    else {
        let filename = 'public/uploads/IMG_0985.JPG';

        if (!isEmpty(req.files)) {
            // The req.files object contains files that were uploaded, and file refers to the specific file being processed.
            let file = req.files.file;
            filename = Date.now() + '-' + file.name;

            file.mv('./public/uploads/' + filename, (err) => {
                if (err) throw err;
            })
        }


        let allowComments = true;

        if (req.body.allowComments) {
            allowComments = true;
        }
        else {
            allowComments = false;
        }

        // constructor post 
        const newPost = new Post({
            title: req.body.title,
            status: req.body.status,
            allowComments: allowComments,
            body: req.body.body,
            file: filename
        })

        newPost.save().then(savedPost => {
            
            req.flash('success_message', 'Post ' + savedPost.title  + ' was created successfully' )

            console.log(savedPost);
            res.redirect('/admin/posts')

        }).catch(error => {
            
            console.log(error + "Could Not save")
        });
    }



    // console.log(req.body.allowComments);
});


router.get('/edit/:id', (req, res) => {

    // res.send(req.params.id);

    Post.findOne({ _id: req.params.id })
        .then(post => {
            res.render('admin/posts/edit', { post: post });
        });

    //res.render('admin/posts/edit')
})

router.put('/edit/:id', (req, res) => {


    Post.findOne({ _id: req.params.id })
        .then(post => { 

            let allowComments = true;

            if (req.body.allowComments) {
                allowComments = true;
            }
            else {
                allowComments = false;
            }

            post.title = req.body.title;
            post.allowComments = allowComments;
            post.status = req.body.status;
            post.body = req.body.body;
            //post.file = req.files.filename;

            if (!isEmpty(req.files)) {
        
                let file = req.files.file;
                filename = Date.now() + '-' + file.name;
                post.file = filename;
        
                file.mv('./public/uploads/' + filename, (err) => {
                    if (err) throw err;
                })
            }

            post.save().then(updatedPost => {
                
                req.flash('success_message' , ' Post was updated successfully' )
                res.redirect('/admin/posts')

            })

        });

})

router.delete('/:id', (req, res) => {
    const postId = req.params.id;

    Post.findOneAndDelete({_id : postId})
        .then(result => {

            fs.unlink(uploadDir + result.file, (err) => {
                if (result) {
                    result.deleteOne();
                    req.flash('success_message' , ' Post was deleted successfully' )
                    res.redirect('/admin/posts');
                }
            });
        })
})

module.exports = router;