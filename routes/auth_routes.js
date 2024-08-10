const express = require("express");
const router = express.Router();
const {authMethods, jwtChecker} = require("../controllers/auth_controller");

router.get("/login", authMethods.getLogin);
router.get("/register", authMethods.getRegister);

router.post("/login", authMethods.postLogin);
router.post("/register", authMethods.postRegister);

router.get("/chat/", jwtChecker, (req, res) => {
    res.render("chat");
})

module.exports = router;