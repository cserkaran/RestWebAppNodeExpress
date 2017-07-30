var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var routes = function(Book) {
    var db = mongoose.connect('mongodb://localhost/bookAPI', {
        useMongoClient: true,
        /* other options */
    });

    var bookRouter = express.Router();
    bookRouter.route('/Books')
        .post(function(req, res) {
            var book = new Book(req.body);

            book.save();
            res.status(201).send(book);
        })
        .get(function(req, res) {
            var query = {};

            if (req.query.genre) {
                query.genre = req.query.genre;
            }

            Book.find(query, function(err, books) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(books);
                }
            });
        });

    bookRouter.use('/Books/:bookId', function(req, res, next) {
        Book.findById(req.params.bookId, function(err, book) {
            if (err) {
                res.status(500).send(err);
            } else if (book) {
                req.book = book;
                next();
            } else {
                res.status(404).send('no book found');
            }
        });
    });

    bookRouter.route('/Books/:bookId')
        .get(function(req, res) {
            res.json(req.book);
        })
        .put(function(req, res) {
            var book = req.book;
            book.title = req.body.title;
            book.author = req.body.author;
            book.genre = req.body.genre;
            book.read = req.body.read;
            book.save(function(err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.book);
                }
            });
        }).patch(function(req, res) {
            if (req.body._id) {
                delete(req.body._id);
            }

            for (var p in req.body) {
                req.book[p] = req.body[p];
            }

            req.book.save(function(err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.book);
                }
            });
        }).delete(function(req, res) {
            req.book.remove(function(err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(204).send('Removed');
                }
            });
        });

    return bookRouter;
};

module.exports = routes;