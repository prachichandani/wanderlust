        const express = require('express');
        const router = express.Router();
        const wrapAsync = require('../utils/wrapAsync.js');
        const ExpressError = require('../utils/ExpressError.js');
        const {listingschema, reviewschema} = require('../schema.js');
        const listing = require("../models/listing.js");
        const {isloggedin, isowner, validatelisting} = require('../middleware.js')
        const listingcontroller = require('../controllers/listing.js')
        const multer = require('multer');
        const {storage} = require('../cloudConfig.js');
        const upload = multer({storage});

        

            //index route
            router.get('/',wrapAsync(listingcontroller.index));


            //new route
            router.get('/new',isloggedin, listingcontroller.rendernewform);


            //show route
            router.get('/:id',wrapAsync(listingcontroller.showlisting));


            //create route
            router.post('/',isloggedin,upload.single('listing[image]'),validatelisting,wrapAsync(listingcontroller.createlisting));
            


            //edit route
            router.get('/:id/edit',isloggedin,isowner,wrapAsync(listingcontroller.rendereditform));


            //update route
            router.put('/:id',isloggedin,isowner,upload.single('listing[image]'),validatelisting,wrapAsync(listingcontroller.updatelisting));


            //delete route
            router.delete('/:id',isloggedin,isowner,wrapAsync(listingcontroller.destroylisting));

            

        module.exports = router;