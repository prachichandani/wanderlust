const listing = require("../models/listing.js");
 const review = require("../models/review.js");


module.exports.createreview=async(req,res)=>{
        let listingg = await listing.findById(req.params.id);
        let newreview = new review(req.body.review);
        newreview.author= req.user._id;
        listingg.reviews.push(newreview);
        await newreview.save();
        await listingg.save();
        req.flash('success', 'review added');
        res.redirect(`/listings/${listingg._id}`);

    };

module.exports.destroyreview=(async(req,res)=>{
        let{id, reviewId} = req.params;

        await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await review.findByIdAndDelete(reviewId);
        req.flash('success', 'review deleted');
        res.redirect(`/listings/${id}`); 

    });