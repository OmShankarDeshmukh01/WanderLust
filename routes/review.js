//in this file we are restructureing the review route

const express = require("express");
const router = express.Router({ mergeParams :true }); //getting the router object  //setting the mergerParams to true so that we can merge id values with app.js
const wrapAsync = require("../utils/wrapAsync.js");//requireing wrapAsync function
const ExpressError = require("../utils/ExpressError.js");//requireing wrapAsync function 
const {reviewSchema} = require("../schema.js");//required the file  which looks after that we have inputted correct value or not 
const Review = require("../models/review.js"); //required review.js from models folder
const Listing = require("../models/listing.js");//required listing.js from models folder





const ValidateReview = (req, res,next)=>{ //very useful function used to check from the schema.js file that the user input is correct or not
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , result.error);
    }
    else{
        next();
    }
};
//post review route
router.post("/" ,ValidateReview, wrapAsync( async(req ,res)=>{
    let listing = await Listing.findById(req.params.id); //get the id from body
    let newReview = new Review(req.body.review);
 
    listing.reviews.push(newReview); //access reviews array from listing.js     //here we push new review in this array
    req.flash("success" , "New Review Created!");
    await newReview.save();
    await listing.save();
 
 //    console.log("new review saved");
 //    res.send("new review saved");
    res.redirect(`/listings/${listing._id}`)//redirect to this route
 }));
 
 //review delete route
 router.delete("/:reviewId" , wrapAsync(async(req ,res)=>{ // the the route we have cut the common path in both the routes
     let{ id , reviewId } = req.params;
     await Listing.findByIdAndUpdate(id , {$pull : {review : reviewId}}); //$pull finds the id from the review and matches it if the id matcher than it updates the value
     const del  = await Review.findByIdAndDelete(reviewId);
     req.flash("success" , "Review Deleted Successfully!");
     console.log( del);
     res.redirect(`/listings/${id}`);
 }));

 module.exports = router;