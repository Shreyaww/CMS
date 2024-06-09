const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

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
        body: req.body.body
    })

    newPost.save().then(savedPost => {

        console.log(savedPost);
        res.redirect('/admin/posts')

    }).catch(error => {
        console.log("Could Not save")
    });

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

            post.save().then(updatedPost => {

                res.redirect('/admin/posts')

            })

        });

})

router.delete('/:id', (req, res) =>{
    const postId = req.params.id;

    Post.findByIdAndDelete(postId)
        .then(result => {
            if (result) {
                res.redirect('/admin/posts');
            }
        })
})

module.exports = router;