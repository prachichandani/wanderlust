 const listing = require("../models/listing.js");
 const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
 const maptoken =  process.env.MAP_TOKEN
 const geocodingClient = mbxGeocoding({ accessToken: maptoken });


module.exports.index=async(req,res)=>{
    const alllistings = await listing.find({});
    res.render('listings/index.ejs',{alllistings});
};

module.exports.rendernewform=(req, res) => {
    res.render('listings/new.ejs'); 
};

module.exports.showlisting=(async(req,res)=>{
    let {id} = req.params;
    const listingg= await listing.findById(id).populate({path:'reviews', populate:{path:'author'}}).populate('owner');
    if(!listingg){
        req.flash('error', 'listing does not exist');
            return res.redirect('/listings');
    }
    res.render('listings/show.ejs',{listingg});
});

module.exports.createlisting=async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
        // query:'new delhi, india',
        limit: 1
    })
    
    .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new listing(req.body.listing);
    newlisting.owner= req.user._id;
    newlisting.image = {url, filename};
     newlisting.geometry= response.body.features[0].geometry;
     const savedlisting = await newlisting.save();
    // await newlisting.save();
     console.log(savedlisting);
    req.flash('success', 'new listing added');
    res.redirect('/listings');

};

module.exports.rendereditform=async(req,res)=>{
    let {id} = req.params;
    const listingg = await listing.findById(id);
    if(!listingg){
    req.flash('error', 'listing does not exist');
        return res.redirect('/listings');
    }
    let originalimage = listingg.image.url;
    originalimage = originalimage.replace('/upload','/upload/h_200,w_300');
    res.render('listings/edit.ejs',{listingg, originalimage});                 
};

module.exports.updatelisting=async (req,res)=>{
    const { id } = req.params;
    let listingg = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== 'undefined'){
         let url = req.file.path;
        let filename = req.file.filename;

        listingg.image = {url,filename};
        
    }
    await listingg.save();
    req.flash('success', 'listing updated');
    res.redirect(`/listings/${id}`); 
};

module.exports.destroylisting=( async (req,res)=>{
    const { id } = req.params;
    const deleted = await listing.findByIdAndDelete(id);
    req.flash('success', 'listing deleted');
    res.redirect('/listings');
});

