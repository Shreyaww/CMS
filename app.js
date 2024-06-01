const express = require('express');
const app = express();
const path = require('path'); // Provides utilities for working with file and directory paths.
const { engine } = require('express-handlebars'); // Correct way to require express-handlebars

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Setting up Handlebars
app.engine('handlebars', engine({ defaultLayout: 'home' }));
app.set('view engine', 'handlebars');

const main = require('./routes/home/main');
app.use('/', main);

// Start the server
app.listen(8888, () => {
    console.log(`Listening on port 8888`);
});
