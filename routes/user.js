const express = require("express");
const router = express.Router(); //getting the router object  //setting the mergerParams to true so that we can merge id values with app.js


router.get("/signup" , (req ,res)=>{
    res.render("users/signup.ejs");
});

module.exports = router;