const express = require("express"); //required express
const app = express(); //saved express function inside a constant variable
const mongoose = require("mongoose"); //required mongoose
const Listing = require("./models/listing.js");//required listing.js from models folder
const path = require("path"); //require the path after requireing mongoose
const methodOverride = require("method-override");//required method-override to use PUT and DELETE request
const ejsMate = require("ejs-mate"); //requireing ejs-mate to get help in styleing 
const wrapAsync = require("./utils/wrapAsync.js");//requireing wrapAsync function 
const ExpressError = require("./utils/ExpressError.js");//requireing wrapAsync function 
const {listingSchema} = require("./schema.js");

const port = 8080;  //defined a port


//this code in written to establish the connection between the database and server
main().then((res)=>{  // this .then function  was not in the mongoose QuickStart we added it to get a message that we are connected to the Database
    console.log("Connected to DB"); //output data in console to know that we are connected to database
}).catch(err => console.log(err));  //catch error and print it


//connecting to mongoose
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');// changed test to wanderlust because to want to change the name of the database to Wanderlust
}

app.set("view engine" , "ejs"); //setting ejs
app.set("views" , path.join(__dirname , "views")); //setting views folder so that we can add html pages in it and and during linking of file we will not have to enter the views folder name again and again it will automatically understand
app.use(express.urlencoded({extended : true}));  //to get the values from the body and encode it
app.use(methodOverride("_method"));//we will use this "_method" to write PUT and DELETE request in the form / HTML site.
app.engine("ejs" , ejsMate); //essential to run ejs-mate
app.use(express.static(path.join(__dirname , "/public"))); //using static files such as css and javascript codes....



app.get("/" , (req ,res)=>{   //basic route
    res.send("hii i am root"); //response which we will see on the site
});

// app.get("/testlisting" , async (req , res)=>{ //testing route
//     let samplelisting =new Listing({ //inputing sample data 
//         title : "My New Villa",
//         description : "By the beach",
//         price : 1200 ,
//         location :"Calangute, Goa",
//         country : "India",
//     });
//     await samplelisting.save(); //saving the sample
//     console.log("Sample was saved"); //sending a positive signal in the console
//     res.send("succesfull testing"); //sending a positive response to the browser
// });


const ValidateListing = (req, res,next)=>{
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
app.get("/listings" , async(req ,res)=>{ //making index route "/listing"
   const allListings =  await Listing.find({}); //saving all the data inside a const variable. 
   res.render("./listings/index.ejs" , {allListings}); //rendering the index.js file for the "/listings" route
});

//New route     
app.get("/listings/new" , (req,res)=>{ //to add new listings  (new input values such as title , imageURL ,description,etc)
    res.render("./listings/new.ejs");   //rendering the "new.ejs" file because it contains the form in which we will input data for edit
});

//Show route
app.get("/listings/:id" ,wrapAsync (async(req ,res)=>{ //used to show the data after clicking the anchor tag which is the title.
    let {id} =req.params; //extracting the id from the request paramaters
    const listing = await Listing.findById(id); //searching the data on the basis of the id 
    res.render("./listings/show.ejs" , {listing}); //rendering the "show.ejs" file and passing the {listing} value in the show.ejs file to see in the site.
}));

//Create route
app.post("/listings" , ValidateListing , wrapAsync(async (req , res,next)=>{ //creating a post request to add all the details inputted in "new.ejs"
    let result =listingSchema.validate(req.body);
    console.log(result.error);
    if(result.error)
    {
        throw new ExpressError(400 , result.error);
    }
    let listing = req.body.listing; //NEW SYNTAX to get the listing values when we define field of objects.
    const newListing = await new Listing(listing); //Adding the value which is inputted by user in the Listing database.
    // if(!newListing.title){
    //     throw new ExpressError(400 , "Title is missing!");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400 , "Description is missing!");
    // }
    // if(!newListing.location){
    //     throw new ExpressError(400 , "Location is missing!");
    // }
    // if(!newListing.country){
    //     throw new ExpressError(400 , "Country is missing!");
    // }
    await newListing.save(); //saving the data permanently inside the database.
    res.redirect("/listings"); //redirecting the page to the index route to see the new addition in the site.
    // console.log(listing); //temp printing the value in the console to see what has to be printed.
}));

//Edit route
app.get("/listings/:id/edit" ,wrapAsync (async (req,res)=>{ //edit route is created to edit the given content
    let {id} =req.params; //id has been extracted from the paramaters.
    const listing = await Listing.findById(id); //searching the data on the basis of the id 
    res.render("./listings/edit.ejs" , {listing}); //rendering the edit.ejs file to edit it in the realtime with the given value of listing in it
}));

//Update route
app.put("/listings/:id" , ValidateListing , wrapAsync( async (req , res)=>{ //update route with put request to put the values in the site after editing
    let {id} =req.params; //id has been extracted from the paramaters.
    await Listing.findByIdAndUpdate(id , {...req.body.listing});//here we are making changes in the database by useing the method "findByIdAndUpdate" and we are deconstructing the information from the body by using ...req.body.listing
    res.redirect(`/listings/${id}`); // updating the site and redirecting the site to show.ejs
}));

//Delete route
app.delete("/listings/:id" ,wrapAsync ( async (req , res)=>{//delete route with delete request to delete the value of listings from the database.
    let {id} =req.params; //id has been extracted from the paramaters.
    let deletedvalue = await Listing.findByIdAndDelete(id); //to find the value by id and delete from the database
    console.log(deletedvalue); //to get a temp idea on which data is deleted (inside the console)
    res.redirect("/listings"); //redirect to the main index route
}));


app.all("*" , (req ,res,next)=>{
    next(new ExpressError(404 , "Page Not Found!"));
});

app.use((err ,req ,res ,next)=>{
    let{statusCode = 500 , message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs" ,{err});
});



app.listen(port , ()=>{     //listing the port 8080 so that we can type "localhost:8080" in the web and can get the message in console that app is listenihng to port
    console.log("app is listening to port"); //to know that we are connected to loacl host we print it in the console
});
