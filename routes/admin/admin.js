const express = require('express');
const router = express.Router();
const User = require('../../models/Post');
const faker = require('faker');

//all: This method is used to handle all HTTP methods (GET, POST, PUT, DELETE, etc.). It registers a 
//middleware or handler that will be executed for any type of HTTP request.
//'/*' pattern matches all paths that are routed through this router.
router.all('/*', (req, res, next) =>{

    //req.app.locals.layout = 'admin'; ensures that every request handled by this router will use the 'admin'
    // layout template when rendering views. This is useful when you have different layouts for different 
    //parts of your application (e.g., an admin section and a public section).
    req.app.locals.layout = 'admin';
    next();
});

// Route for the admin page
router.get('/', (req, res) => {
    res.render('admin/index');
});

router.post('/generate-fake-posts', (req,res) =>{

    for(let i = 0; i < req.body.amount; i++){
        
        let post = new User();
        
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments =  faker.datatype.boolean();
        post.body = faker.lorem.sentence();

        post.save();
    }
    res.redirect('/admin/posts');
})



module.exports = router;