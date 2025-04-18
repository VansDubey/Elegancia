const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    name:String,
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:String
})

module.exports = mongoose.model("User", userSchema); //users