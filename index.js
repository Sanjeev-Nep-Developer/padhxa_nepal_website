const express = require("express");
const expressSession = require("express-session");
const cookie_parser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose")
const app = express();
const flash = require('connect-flash');




const auth_routes = require("./routes/auth_routes");
const chat_routes = require("./routes/chat_routes");

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
app.use("/chat", chat_routes);

// Chat System Backend
const http = require("http")
const server = http.createServer(app);

const socketIoSetup = require("./socket/socket")

socketIoSetup(server);

server.listen(3000, () => {
    console.log("server started at port 3000")
})