const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user')
            .populate('campsites')
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id }) //search for "a" current user's fav 
            .then(Favorite => {
                if (favorite) {
                    // if user has a favorite, then add new favorite?
                    // looping through using forEach
                    req.body.forEach(campsite => {
                        if (!favorite.campsites.includes(favorite._id))
                            favorite.campsites.push(favorite._id);
                    })

                    favorite.save()
                        .then(favorite => {
                            console.log('Favorite Created ', favorite);
                            res.statusCode = 200; // really don't need--redundant
                            res.setHeader('Content-Type', 'application/json'); // really don't need--redundant
                            res.json(favorite);
                        })
                }
            })
            .catch(err => next(err));
    })
    
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id }) //findOne
            .then(favorite => {
                if (favorite) {
                    favorite.remove()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                }
            });

        favoriteRouter.route('/:campsiteId')
            .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
            .get(cors.cors, authenticate.verifyUser, (req, res) => {
                res.statusCode = 403;
                res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
            })
            
            .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
                Favorite.findOne({ user: req.user._id })
                    .then(favorite => {
                        if (favorite) {
                            if (!favorite.campsites.includes(req.params.campsiteId)) { //forEach, includes, indexOf, or push methods
                                favorite.campsites.push(req.params.campsiteId)
                                favorite.save()
                                    .then(favorite => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorite);
                                    })
                                    .catch(err => next(err));
                            } else {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.end('That campsite is already in the list of favorites!');
                            }
                        } else {
                            Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] })
                                .then(favorite => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                                .catch(err => next(err));
                        }
                    })
                    .catch(err => next(err));
            })
            .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
                res.statusCode = 403;
                res.end(
                    `PUT operation not supported on /favorites/${req.params.campsiteId}`
                );
            })

            .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
                Favorite.findOne({ user: req.user._id })
                    .then(favorite => {
                        if (favorite) {
                            // indexOf finds the position
                            let index = favorite.campsites.indexOf(req.params.campsiteId);
                            if (index >= 0) {
                                // delete from array method
                                favorite.campsites.splice(index, 1);
                            }
                            favorite.save()
                                .then(favorite => {
                                    Favorite.findById(favorite._id)
                                        .then(favorite => {
                                            console.log('Favorite Campsite Deleted!', favorite);
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(favorite);
                                        })
                                })
                                .catch(err => next(err));
                        } else {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }
                    })
                    .catch(err => next(err));
            });
    }
    );

module.exports = favoriteRouter;