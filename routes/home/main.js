const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next) =>{
    req.app.locals.layout = 'home';
    next();
});
// Route for the home page
router.get('/', (req, res) => {

    // req.session.shreya = 'Shreya';

    // if(req.session.shreya){
    //     console.log(`We Found ${req.session.shreya}`);
    // }

    

    res.render('home/index');
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


module.exports = router;