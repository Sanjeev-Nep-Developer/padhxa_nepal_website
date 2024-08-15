
const chat_model = require("../models/sc_chat_model");
const cookieParser = require("socket.io-cookie-parser")

module.exports = function (io) {
    const sc_chat = io.of("/scienceChat");
    io.use(cookieParser());


    sc_chat.on('connection', async (socket) => {
        console.log("A user connected");

        let current_user_name;

        try {
            const allMessages = await chat_model.find();

            sc_chat.emit("historyMessages", allMessages);

        } catch (err) {
            console.log("error on fetching the messages", err);
        }
        // Emit the number of clients
        sc_chat.emit("numberClients", io.engine.clientsCount);

        // Handling user name from the client

        socket.on("user_nme", (user_name_db) => {
            current_user_name = user_name_db;
            console.log("name received", user_name_db)

        })


        // Handle incoming messages
        socket.on('message', async (msg) => {
            sc_chat.emit("numberClients", io.engine.clientsCount);

            console.log("Message Received ", msg);
            const timestamp = new Date().toLocaleString([], {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
            sc_chat.emit("message", { name: current_user_name, textMsg: msg, timestamp: timestamp });

            const messageData = {
                name: current_user_name, textMsg: msg, time: timestamp
            };
            try {
                await chat_model.create(messageData);
            }
            catch (err) {
                console.log("error saving messages", err);
            }

        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};
