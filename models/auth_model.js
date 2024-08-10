const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    college:{
        type:String
    },
    
    
})

module.exports = mongoose.model("jwtAuth", userSchema);