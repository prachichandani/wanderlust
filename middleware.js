 const listing = require("./models/listing.js");
 const ExpressError = require('./utils/ExpressError.js');
 const {listingschema, reviewschema} = require('./schema.js');
 const review = require("./models/review.js");

module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in !');
        return res.redirect('/login');
    }
    next();
};

module.exports.saveredirectUrl = (req, res, next) => { // ✅ spelling must match exactly
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isowner=async(req,res,next)=>{
    let { id } = req.params;
    let listingg = await listing.findById(id);
    if(!listingg.owner._id.equals(res.locals.currentuser._id)){
        req.flash('error','You are not the owner of this listing');
        return  res.redirect(`/listings/${id}`); 
    }
    next();
}

module.exports.isauthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let revieww = await review.findById(reviewId);
    if(!revieww.author.equals(res.locals.currentuser._id)){
        req.flash('error','You are not the author of this review');
        return  res.redirect(`/listings/${id}`); 
    }
    next();
}

module.exports.validatelisting = (req,res,next)=>{
     let {error} = listingschema.validate(req.body);
        if(error){
             throw new ExpressError(404, error);
        }else{
             next();
    }
}

module.exports.validatereview = (req,res,next)=>{
        let {error} = reviewschema.validate(req.body);
        if(error){
           throw new ExpressError(404, error);
        }else{
            next();
        }
    }

