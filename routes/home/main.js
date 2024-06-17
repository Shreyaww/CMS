const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');


router.all('/*', (req, res, next) =>{
    req.app.locals.layout = 'home';
    next();
});
// Route for the home page
router.get('/', (req, res) => {

    //. Once the find query completes, the then method is executed with posts being the result
    // of the query — an array of all the documents found.

    Post.find({}).then(posts =>{
        res.render('home/index', {posts : posts});
    })

    // req.session.shreya = 'Shreya';

    // if(req.session.shreya){
    //     console.log(`We Found ${req.session.shreya}`);
    // }

    
});

router.get('/about', (req, res) => {
    res.render('home/about');
});

router.get('/login', (req, res) => {
    res.render('home/login');
});

router.get('/register', (req, res) => {
    res.render('home/register');
});

router.get('/post/:id', (req, res) => {
    Post.findOne({_id : req.params.id }).then(post =>{
       // res.send(post.body)

       res.render('home/post', {post : post})
    })
});


module.exports = router;