//in this file we are restructureing the /listings route

const express = require("express");
const router = express.Router(); //getting the router object
const Listing = require("../models/listing.js");//required listing.js from models folder
const wrapAsync = require("../utils/wrapAsync.js");//requireing wrapAsync function
const ExpressError = require("../utils/ExpressError.js");//requireing wrapAsync function 
const {listingSchema} = require("../schema.js");//required the file  which looks after that we have inputted correct value or not 
const {isloggedIn} = require("../middleware.js"); //required the created middleware


//copying all the /listing routes from app.js file

const ValidateListing = (req, res,next)=>{ //very useful function used to check from the schema.js file that the user input is correct or not
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , result.error);
    }
    else{
        next();
    }
};

//Index route
router.get("/" , async(req ,res)=>{ //making index route "/listings"
    const allListings =  await Listing.find({}); //saving all the data inside a const variable. 
    res.render("./listings/index.ejs" , {allListings} ); //rendering the index.js file for the "/listings" route
 });
 
 //New route     
 router.get("/new" ,isloggedIn, (req,res)=>{ //to add new listings  (new input values such as title , imageURL ,description,etc)         //passed the is loggedin middleware in the middle
     res.render("./listings/new.ejs");   //rendering the "new.ejs" file because it contains the form in which we will input data for edit
 });
 
 //Show route
 router.get("/:id" ,wrapAsync (async(req ,res)=>{ //used to show the data after clicking the anchor tag which is the title.
     let {id} =req.params; //extracting the id from the request paramaters
     const listing = await Listing.findById(id).populate("reviews").populate("owner"); //searching the data on the basis of the id  //populate is used to print all the data in show.ejs of reviews
     //if listing doesnot exits then print this error and redirect to /listings
     if(!listing){
        req.flash("error" , "Listing you requested for does not exist !");
        res.redirect("/listings");
     }
     console.log(listing);
     res.render("./listings/show.ejs" , {listing}); //rendering the "show.ejs" file and passing the {listing} value in the show.ejs file to see in the site.
 }));
 
 //Create route
 router.post("/" , ValidateListing ,isloggedIn , wrapAsync(async (req , res,next)=>{ //creating a post request to add all the details inputted in "new.ejs"
     let result =listingSchema.validate(req.body);
     console.log(result.error);
     if(result.error)
     {
         throw new ExpressError(400 , result.error);
     }
     let listing = req.body.listing; //NEW SYNTAX to get the listing values when we define field of objects.
     const newListing = await new Listing(listing); //Adding the value which is inputted by user in the Listing database.
     req.flash("success" , "New Listing Created!");//flashing msg on success
     newListing.owner = req.user._id;  //associated owner  with listing this means that on new account creation username will be asigned
     await newListing.save(); //saving the data permanently inside the database.
     res.redirect("/listings"); //redirecting the page to the index route to see the new addition in the site.
     // console.log(listing); //temp printing the value in the console to see what has to be printed.
 }));
 
 //Edit route
 router.get("/:id/edit" ,isloggedIn,wrapAsync (async (req,res)=>{ //edit route is created to edit the given content
     let {id} =req.params; //id has been extracted from the paramaters.
     const listing = await Listing.findById(id); //searching the data on the basis of the id 
     //if the listing doesnot exits then print this error does not go to the edit page if user goes to /edit and redirect to /listings
     if(!listing){
        req.flash("error" , "Listing you requested for does not exist !");
        res.redirect("/listings");
     }
     res.render("./listings/edit.ejs" , {listing}); //rendering the edit.ejs file to edit it in the realtime with the given value of listing in it
 }));
 
 //Update route
 router.put("/:id" , ValidateListing ,isloggedIn, wrapAsync( async (req , res)=>{ //update route with put request to put the values in the site after editing
     let {id} =req.params; //id has been extracted from the paramaters.
     await Listing.findByIdAndUpdate(id , {...req.body.listing});//here we are making changes in the database by useing the method "findByIdAndUpdate" and we are deconstructing the information from the body by using ...req.body.listing
     req.flash("success" , " Listing Updated Successfully!");
     res.redirect(`/listings/${id}`); // updating the site and redirecting the site to show.ejs
 }));
 
 //Delete route
 router.delete("/:id" ,isloggedIn , wrapAsync ( async (req , res)=>{//delete route with delete request to delete the value of listings from the database.
     let {id} =req.params; //id has been extracted from the paramaters.
     let deletedvalue = await Listing.findByIdAndDelete(id); //to find the value by id and delete from the database
     req.flash("success" , " Listing Deleted Successfully!");
     console.log(deletedvalue); //to get a temp idea on which data is deleted (inside the console)
     res.redirect("/listings"); //redirect to the main index route
 }));
 module.exports = router;