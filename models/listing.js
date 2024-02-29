const mongoose = require("mongoose"); //require mongoose
const Schema = mongoose.Schema;   //stored mongoose schema inside a constant variable so that we do not have to do it everytime
const Review = require("./review.js");

const listingSchema = new Schema({ //listing a Schema (basic way to assign operators)
    title : {
        type : String,
        required : true,
    },
    description : String,
    image :{
        type : String,
        default : "https://plus.unsplash.com/premium_photo-1681922761659-07483f67b6c7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", //default image if the image is not given then this will automaticall be assigned.(this image is given to get value of URL in the development phase and we do not have to put in again and again during testing phase)
        set : (v)=> 
        v === "" 
        ? "https://plus.unsplash.com/premium_photo-1681922761659-07483f67b6c7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
         : v , //used to set a default url( on the basis of user not developer )to the image using ternary operator( go to mongoose --> QuickStart --> Schemas -->Virtual)..
    },
    price : Number,
    location : String,
    country :String,
    reviews : [
        {
            type : Schema.Types.ObjectId, //object id of review
            ref : "Review"
        }
    ]
});

listingSchema .post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({reviews : {$in : listing.reviews}});
    }
    
});
const Listing = mongoose.model("Listing" , listingSchema); //list it inside a model
module.exports = Listing; //export the modules