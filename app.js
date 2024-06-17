const express = require('express');
const app = express();
const path = require('path'); // Provides utilities for working with file and directory paths.
const { engine } = require('express-handlebars'); // Correct way to require express-handlebars
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars');
const methodOverrid = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/cms').then((db) => {
    console.log("MONGO connected");
}).catch(error => console.log(error)); // mongodb will assume that there is a db named cms and we want to connect to cms db
// once we start inserting data mongoose will create the cms db if not present already


// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

const { select, generateTime} = require('./helpers/handlebars-helpers');

// Setting up Handlebars
app.engine('handlebars', engine({ handlebars: allowInsecurePrototypeAccess(Handlebars), defaultLayout: 'home', helpers: { select: select, generateTime : generateTime } }));
app.set('view engine', 'handlebars');

//Upload Middleware 

app.use(upload());

//Body Parser 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Method Override
app.use(methodOverrid('_method'));

app.use(session({
    secret: 'shreyasingh',
    resave: false,
    saveUninitialized: true
}))

app.use(flash());

// Local Variable using middleware
app.use((req, res, next) =>{

    res.locals.success_message = req.flash('success_message');
    // res.locals.image_updated = req.flash('image_updated');
    // res.locals.post_deleted = req.flash('post_deleted');

    next();
})

// load routes
const main = require('./routes/home/main');
const admin = require('./routes/admin/admin');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories')

// use routes
app.use('/', main);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);


// Start the server
app.listen(8888, () => {
    console.log(`Listening on port 8888`);
});
