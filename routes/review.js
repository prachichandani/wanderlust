const express = require('express');
const router = require('express').Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {reviewschema} = require('../schema.js');
const listing = require("../models/listing.js");
 const review = require("../models/review.js");
 const {validatereview,isloggedin,isauthor} = require('../middleware.js')
 const reviewcontroller= require('../controllers/review.js')


//review route
    router.post('/',isloggedin,validatereview,wrapAsync(reviewcontroller.createreview));

    //delete review route
    router.delete('/:reviewId',isloggedin,isauthor,wrapAsync(reviewcontroller.destroyreview));


    module.exports = router;