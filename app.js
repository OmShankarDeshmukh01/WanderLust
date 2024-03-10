const express = require("express"); //required express
const app = express(); //saved express function inside a constant variable
const mongoose = require("mongoose"); //required mongoose
const Listing = require("./models/listing.js");//required listing.js from models folder
const path = require("path"); //require the path after requireing mongoose
const methodOverride = require("method-override");//required method-override to use PUT and DELETE request
const ejsMate = require("ejs-mate"); //requireing ejs-mate to get help in styleing 
const ExpressError = require("./utils/ExpressError.js");//requireing wrapAsync function 
const listings = require("./routes/listing.js");//required all the /listing routes from  routes folder and listing.js file
const reviews = require("./routes/review.js");//required all the reviews from review.js
const session = require("express-session");
const flash = require("connect-flash");
const port = 8080;  //defined a port //


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

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false , 
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnlt : true,
    },
};

app.get("/" , (req ,res)=>{   //basic route
    res.send("hii i am root"); //response which we will see on the site
});


app.use(session(sessionOptions));
//we should use flash always before the routes because we will use flash with the help of routes
app.use(flash());

//middleware
app.use((req , res , next) =>{
    //stored success msg
    res.locals.success = req.flash("success");
    //stored error msg
    res.locals.error = req.flash("error");
    next();
})


//this single line requires all the listing route from the routes folder
app.use("/listings" , listings); //write the common path which was deleted

app.use("/listings/:id/reviews" , reviews);

app.all("*" , (err , req ,res,next)=>{
    console.log(err);
    next(new ExpressError(404 , "Page Not Found!"));
});

app.use((err ,req ,res ,next)=>{
    let{statusCode = 500 , message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs" ,{err});
});



app.listen(port , ()=>{     //listing the port 8080 so that we can type "localhost:8080" in the web and can get the message in console that app is listenihng to port
    console.log("app is listening to port"); //to know that we are connected to loacl host we print it in the console
});
