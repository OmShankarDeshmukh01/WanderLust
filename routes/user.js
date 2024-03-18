const express = require("express");
const router = express.Router(); //getting the router object  //setting the mergerParams to true so that we can merge id values with app.js
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup" , (req ,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup" , wrapAsync(async(req ,res)=>{  //async function because we are going to make changes in the databases   //wrap async is used for err handling
    try{
        let  {username , email , password} = req.body; //extracting username password and email  from user input
    const newUser = new User({email , username}); //creating new user from the extracted data
    const registerdUser = await User.register(newUser , password);
    req.login(registerdUser , (err)=>{  //.login is used to directly login the user after signup
        if(err){
            next();
        }
        req.flash("success" , "User registered sucessfully");
        res.redirect("/listings");
    })

    } catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
    
}));

router.get("/login" , (req ,res)=>{
    res.render("users/login.ejs");

});


//user authentication is going on (very important)
router.post("/login",saveRedirectUrl ,passport.authenticate('local'  ,{failureRedirect : "/login" , failureFlash : true } ) , async(req ,res)=>{  //passport.authenticate() is used to authonticate
    req.flash("success" , "Welcome to Wanderlust you are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);//redirect to the same page after login
});


//logout user
router.get("/logout" , async(req ,res ,next)=>{
    req.logout((err)=>{  //.log is used to clear the login details     //error wil store in this callback if error occurs during logout
        if(err){ //if error occurs then flash the message
          return  next(err);
        }
        req.flash("success" , "You are logged out successfully");
        res.redirect("/listings");
    })
})

module.exports = router;