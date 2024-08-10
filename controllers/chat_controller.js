const chat_model = require("../models/chat_model");

const chat_Methods = {
    getChatPage(req, res) {




        res.render("chat")
    },
    getChatMessages(req, res) {
        console.log("get chat  message called")
    },
    postMessage(req, res) {
        console.log("post chat message called")
    }
}

module.exports = chat_Methods