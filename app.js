const express = require('express');
const app = express();
const path = require('path'); // Provides utilities for working with file and directory paths.
const { engine } = require('express-handlebars'); // Correct way to require express-handlebars
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars');

mongoose.connect('mongodb://localhost:27017/cms').then((db) =>{
    console.log("MONGO connected");
}).catch(error => console.log(error)); // mongodb will assume that there is a db named cms and we want to connect to cms db
// once we start inserting data mongoose will create the cms db if not present already


// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

const {select} = require('./helpers/handlebars-helpers');


// Setting up Handlebars
app.engine('handlebars', engine( {handlebars: allowInsecurePrototypeAccess(Handlebars), defaultLayout: 'home' , helpers : {select : select}}));
app.set('view engine', 'handlebars');

//Body Parser 
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// load routes
const main = require('./routes/home/main');
const admin = require('./routes/admin/admin');
const posts = require('./routes/admin/posts');

// use routes
app.use('/', main); 
app.use('/admin', admin);
app.use('/admin/posts', posts);
 

// Start the server
app.listen(8888, () => {
    console.log(`Listening on port 8888`);
});
