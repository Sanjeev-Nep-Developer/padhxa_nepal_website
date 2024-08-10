const mongoose = require("mongoose");

const user_name_Schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("user_name_model", user_name_Schema);