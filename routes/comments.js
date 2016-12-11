/** This module defines the routes for comments using the store.js as db memory
 *
 * @author Dennis Ritter
 *
 * @module routes/comments
 * @type {Router}
 */
'use strict';

// modules
var express = require('express');
var logger = require('debug')('me2u4:videos');
var store = require('../blackbox/store');
const {validateComment, allKeys} = require('./../validators/comments');
const {filterParserFactory, filterResponseData} = require('./../restapi/filter');

var comments = express.Router();

comments.use(filterParserFactory(Object.keys(allKeys)));

const methodNotAllowed = (req, res, next) => {
    const err = new Error(`Method ${req.method} is not allowed.`);
    err.status = 405;
    next(err);
};

// routes **********************
comments.route('/')
    .post((req, res, next) => {
        const videoId = req.body.videoid;
        let comment = req.body;

        try{
            // check if video with id:{videoId} exists
            store.select('videos', videoId);
            comment = validateComment(comment);
            store.insert('comments', comment);
            res.locals.items = comment;
            res.status = 201;
            next();
        }
        catch(err){
            const err = new Error(`A video with id ${videoId} does not exist.`);
            err.status = 404;
            next(err);
            return;
        }
    })
    .get((res,req,next) => {
        try {
            const comments = store.select('comments');
            res.locals.items = comments;
            res.status = 200;
            next();
        }
        catch(err){
            next(err);
        }
    })
    .put(methodNotAllowed)
    .delete(methodNotAllowed);

comments.route('/:id')
    .get((req, res, next) => {
        const id = req.params.id;
        try{
            const comment = store.select('comments', id);
            res.locals.items = comment;
            next();
        }
        catch(err){
            next(err);
        }
    })
    .put((req,res,next) => {
        let comment = req.body;
        try {
            comment = validateComment(comment);
            store.replace('comments', comment.id, comment);
            res.locals.items = comment;
            res.status = 200;
            next();
        }
        catch(err){
            next(err);
        }
    })
    .delete((req,res,next) => {
        const id = req.params.id;
        try{
            store.remove('comments', id);
            res.status = 200;
            next();
        }
        catch(err){
            next(err);
        }
    })
    .post(methodNotAllowed);

comments.route('/videos/:videoid')
    .get((req,res,next) => {
        const videoId = req.params.videoid;
        try{
            // check if video with id:{videoId} exists
            store.select('videos', videoId);
            let comments = store.select('comments');
            if(comments.length > 0) {
                comments.filter((comment) => comment.videoid === parseInt(videoId, 10));
            }
            res.locals.items = comments;
            res.status = 200;
            next();
        }
        catch(err){
            next(err);
        }
    })
    .delete((req,res,next) => {
        const videoId = req.params.videoid;
        try{
            // check if video with id:{videoId} exists
            store.select('videos', videoId);
            let comments = store.select('comments');
            comments.forEach((comment) => {
                if(comment.videoid === parseInt(videoId, 10)){
                    store.remove('comments', comment.id);
                    res.status = 200;
                    next();
                }
            });
        }
        catch(err){
            next(err);
        }
    })
    .post(methodNotAllowed)
    .put(methodNotAllowed);

comments.use(filterResponseData);

module.exports = comments;
