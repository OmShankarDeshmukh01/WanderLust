const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const passportLocalMongoose = require("passport-local-mongoose"); //installed passport-local-mongoose

const userSchema = new Schema({ //defined a new user schema
    email : {
        type : String,
        required : true
    }
});

//used this plugin as per the documentation on npm
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);