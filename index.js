const express = require("express");
const expressSession = require("express-session");
const cookie_parser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose")
const app = express();
const flash = require('connect-flash');




const auth_routes = require("./routes/auth_routes");
const sc_chat_routes = require("./routes/sc_chat_routes");
const mg_chat_routes = require("./routes/mg_chat_routes");
const {jwtChecker} = require("./controllers/auth_controller")

const staticPath = path.join(__dirname + "/public")
const viewsPath = path.join(__dirname, "/views");

app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "secret123"
}))
app.use(flash());
app.use(cookie_parser());



app.set('view engine', 'ejs');
app.set('views', viewsPath);

mongoose.connect("mongodb://127.0.0.1:27017/grade12ChatApp").then((msg) => {
    console.log("database connected");
}).catch((err) => {
    console.log(err);
})

app.use("/auth/v3", auth_routes);
app.use("/science/chat", sc_chat_routes);
app.use("/management/chat", mg_chat_routes);
app.use("/", jwtChecker, (req, res) => {
    res.render("home")
})

// Chat System Backend
const http = require("http")
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);

// Import The Socket Modules
require("./socket/mg_chat_socket")(io);
require("./socket/sc_chat_socket")(io);


server.listen(3000, () => {
    console.log("server started at port 3000")
})