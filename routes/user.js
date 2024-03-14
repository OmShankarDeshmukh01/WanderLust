const express = require("express");
const router = express.Router(); //getting the router object  //setting the mergerParams to true so that we can merge id values with app.js
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/signup" , (req ,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup" , wrapAsync(async(req ,res)=>{  //async function because we are going to make changes in the databases   //wrap async is used for err handling
    try{
        let  {username , email , password} = req.body; //extracting username password and email  from user input
    const newUser = new User({email , username}); //creating new user from the extracted data
    const registerdUser = await User.register(newUser , password);
    console.log(registerdUser);
    req.flash("success" , "User registered sucessfully");
    res.redirect("/listings");
    } catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
    
}));

router.get("/login" , (req ,res)=>{
    res.render("users/login.ejs");

});


module.exports = router;