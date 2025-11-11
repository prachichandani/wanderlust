    if(process.env.NODE_ENV!= 'production'){
        require('dotenv').config()
    }
    const express = require('express');
    const app = express();
    const mongoose = require('mongoose');
    const path = require('path');
    // const mongourl = 'mongodb://127.0.0.1:27017/wanderlust'
    const dburl = process.env.ATLASDB_URL;

    
    const methodOverride = require('method-override');
    const ejsMate = require('ejs-mate');
    const ExpressError = require('./utils/ExpressError.js');
    const llistings = require('./routes/listing.js')
    const revieww = require('./routes/review.js')
    const session = require('express-session');
    const MongoStore = require('connect-mongo');

    const flash = require('connect-flash');
    const passport = require('passport');
    const LocalStrategy = require('passport-local');
    const User = require('./models/user.js');
    const user = require('./routes/user.js')

    app.set('view engine','ejs');
    app.set('views', path.join(__dirname,'views'));
    app.use(express.urlencoded({extended: true}));
    app.use(methodOverride('_method'));
    app.engine('ejs',ejsMate);
    app.use(express.static(path.join(__dirname,'/public')));


    const store = MongoStore.create({
        mongoUrl:dburl,
        crypto:{
            secret: process.env.SECRET,
        },
        touchAfter:24*3600
    })

    store.on('error',()=>{
        console.log('error in mongo session store',err);
    })

    const sessionoption = {
        store,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie:{
            expires: Date.now() + 7*24*60*1000,
            maxAge: 7*24*60*1000,
            httpOnly: true
        },
    };

    app.use(session(sessionoption));
    app.use(flash());


    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req,res,next)=>{
        res.locals.success=  req.flash('success');
        res.locals.error=  req.flash('error');
        res.locals.currentuser= req.user; 
        next();
    });


    main()
    .then(()=>{
        console.log('connected');
    })
    .catch((err)=>{
        console.log(err);
    })

    async function main(){
        // await mongoose.connect(mongourl);
        await mongoose.connect(dburl);
    }

    

    // app.get('/',(req,res)=>{
    //     res.send('hi');
    // });

    // app.get('/demouser', async (req, res) => {
    //     let fakeuser = new User({
    //         email: 'ac@gmail.com',
    //         username: 'pachi chandani'
    //     });

    //     let registereduser = await User.register(fakeuser, 'hlloworld');
    //     res.send(registereduser);
    
    // });
    


    app.use('/listings', llistings);
    app.use('/listings/:id/reviews', revieww);
    app.use('/', user);
   
    app.use((req,res,next)=>{
        next(new ExpressError(404, 'page not found'));
    })

    app.use((err, req,res,next)=>{
        let{statusCode = 500, message = 'something went wrong'} = err;
        res.status(statusCode).render('Error.ejs',{message})
    })


    // app.get('/testlisting', async(req,res)=>{
    //      let sample = new listing({
    //         title: 'my villa',
    //         discription: 'by the beach',
    //         price: 2000,
    //         location: 'goa',
    //         country: 'india',
            
    //     });
    //     await sample.save();
    //     console.log('suceesful');
    //     res.send('working');
    // });

    app.listen(8080,()=>{
        console.log('listening');
    });