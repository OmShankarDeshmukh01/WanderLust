//here we will write all the code of initialization for "data.js" file

const mongoose = require("mongoose");  //required mongoosh
const initData2 = require("./data.js");  //required the data.js file in which all the data ins being downloaded from internet
const Listing = require("../models/listing.js"); //require listing.js 

//this code in written to establish the connection between the database and server
main().then((res)=>{  // this ".then" function  was not in the mongoose QuickStart we added it to get a message that we are connected to the Database
    console.log("Connected to DB");//get the value that we are connected in console
}).catch(err => console.log(err));//catch the error and print


//connecting to mongoose
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');// changed test to wanderlust because to want to change the name of the database to Wanderlust
}

const initDB = async () =>{ //creating an async function to surf inside database data. 
  await Listing.deleteMany({}); //first we will empty all the data which was present earlier
  await Listing.insertMany(initData2.data); //inserting all the data from the data.js file which is required in intiData variable
  console.log("data was initialized"); //to know that all the data in data.ejs have been initialized in the database we write this command to get our answer in console as a hint

};
initDB(); //calling the initDB function