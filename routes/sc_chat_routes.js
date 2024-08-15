const express = require("express");
const router = express.Router();
const chat_methods = require("../controllers/sc_chat_controller");
const { jwtChecker } = require("../controllers/auth_controller")
router.get('/', jwtChecker, chat_methods.getChatPage);

module.exports = router;

