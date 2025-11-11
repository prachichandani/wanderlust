const user = require("../models/user.js");


module.exports.rendersignupform=(req,res)=>{
    res.render('user/signup.ejs');
};


module.exports.signup=(async(req,res)=>{
    try{
        let{username,email,password} = req.body;
        const newuser = new user({username,email});
        const registereduser = await user.register(newuser,password);
        console.log(registereduser);
        req.login(registereduser,(err)=>{
            if(err){
                 return next(err)
            }
             req.flash('success','welcome to wanderlust');
            res.redirect('/listings');
        })
       
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }
    
});

module.exports.renderloginform=(req,res)=>{
    res.render('user/login.ejs');
};

module.exports.login=async(req,res)=>{
        req.flash('success','You are logged in!');
        const redirectUrl = res.locals.redirectUrl || '/listings';
        res.redirect(redirectUrl);
};


module.exports.destroyuser=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','You are logged out!');
        res.redirect('/listings');
    })
};