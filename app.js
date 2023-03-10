import express from 'express';
import {engine} from 'express-handlebars';
import morgan from 'morgan';
import bodyParser from 'body-parser';

// load mongoose
import mongoose from 'mongoose';
// load method  override
import  MethodOverride from "method-override"
import ideasRoute from "./routes/ideasRoute.js";
import flash from "connect-flash";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();
// console.log(process.env.PORT);
// console.log(process.env.mongoURI);

const app=express();
const PORT=process.env.PORT||3100;//node.js runtime variable
//export PORT=3000;

//NODE_ENV=production, development
mongoose
    .connect(process.env.mongoURI)
    .then(() => console.log("Mongodb connected..."))
    .catch((err) => console.error(err));

import usersRoute from "./routes/usersRoute.js"
import passport from 'passport';
import passportConfig from './config/passportConfig.js';
passportConfig(passport);

//setup handlebars middleware
app.engine('handlebars', engine());
app.set('view engine','handlebars');
app.set('views','./views');
app.use(morgan("tiny"));//server communication 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(MethodOverride("_method")); //place _method into template engine
// set up an express-session
app.use(
    session({
        secret : "anything",
        resave : true,
        saveUninitialized : true,
        cookie:{ maxAge:15* 1000},
    })
);
app.use(passport.initialize());
app.use(passport.session());
//connect -flash store flash messages in session
app.use(flash());

app.use(function(req,res,next){//middleware function must in the top
    console.log("Time", Date.now());
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.fail_passport = req.flash("fail_passport");
    res.locals.user = req.user || null;
    console.log("====login User====", res.locals.user);
    next();//pass to next middleware function or route handler in the chain
});
app.get("/",(req, res)=>{
    console.log(req.session.cookie.maxAge / 1000);

    res.render('index', {title:"Welcome"});//{layout:'main2.handlebars'}
    //{}wrap the variable to a package, and pass to handlebars
});



app.get('/about',(req,res)=>{
    res.render("about");
});

// app.get('/ideas/ideasIndex',(req,res)=>{
//    res.render("ideas/ideasIndex");
// });

import ensureAuthenticated from './helpers/auth.js';

app.use("/ideas", ensureAuthenticated,ideasRoute); 
app.use("/users", usersRoute); 
app.use(function(req,res,next){
    console.log("Time", Date.now());
    next();
});

app.get('*',(req,res)=>{
    res.status(404);
    res.render("404");
});

app.listen(PORT,()=>{
    console.log(`listening to server ${PORT}`);
});


