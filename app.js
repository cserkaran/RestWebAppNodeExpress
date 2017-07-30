var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;
var Book = require('./models/bookModel');

var bookRouter = require('./Routes/bookRoutes')(Book);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', bookRouter);

app.get('/', function(req, res) {
    res.send('Welcome to API');
});

app.listen(port, function() {
    console.log('Gulp is running my app on PORT: ' + port);
});

module.exports = app;