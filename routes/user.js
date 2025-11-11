const express = require('express');
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {saveredirectUrl} = require('../middleware.js');
const usercontroller = require('../controllers/user.js');


router.get('/signup',usercontroller.rendersignupform);

router.post('/signup',wrapAsync(usercontroller.signup));


router.get('/login',usercontroller.renderloginform);


router.post('/login',
    saveredirectUrl,
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureFlash: true 
    }),usercontroller.login);



router.get('/logout',usercontroller.destroyuser);



module.exports= router;