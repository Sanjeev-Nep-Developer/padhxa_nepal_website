const mongoose = require("mongoose");

const message_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    textMsg: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("scienceChat", message_schema);
