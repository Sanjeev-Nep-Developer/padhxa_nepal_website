
const chat_Methods = {
    getChatPage(req, res) {




        res.render("sc_chat")
    },
    getChatMessages(req, res) {
        console.log("get chat  message called")
    },
    postMessage(req, res) {
        console.log("post chat message called")
    }
}

module.exports = chat_Methods