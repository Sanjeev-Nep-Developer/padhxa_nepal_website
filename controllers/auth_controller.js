const auth_model = require("../models/auth_model");
const jwt = require("jsonwebtoken");

const authMethods = {
    getLogin(req, res) {
        res.render("auth/login")
    },
    getRegister(req, res) {
        res.render("auth/register")
    },
    async postLogin(req, res) {
        const { username, password } = req.body;
        console.log(username, password)
        const user = await auth_model.findOne({ username });
        // console.log(user)

        if (user) {
            const jwtToken = req.cookies.jwtToken;
            res.cookie("user_name", user.username)

            if (!jwtToken) {
                if (user.username == username && user.password == password) {
                    const paylod = {
                        username: user.username,
                        password: user.password,
                    }
                    const jwtToken = jwt.sign(paylod, "secret", { expiresIn: "180d" });
                    res.cookie("jwtToken", jwtToken);
                    res.render("home")
                } else {
                    if (user.password != password) {
                        res.render("error", {
                            errorCode: 500,
                            errorMessage: "Invalid Password Try Again"
                        })
                    } else {
                        res.render("error", {
                            errorCode: 500,
                            errorMessage: "Try Again"
                        })
                    }
                }
                // res.send("jwt token is not present");
            } else {
                await jwt.verify(jwtToken, "secret", (err, decoded) => {
                    if (err) {
                        if (err.name == 'TokenExpiredError') {
                            console.log("JWT EXPIRED");
                            // res.render("error", {
                            //     errorCode: 500,
                            //     errorMessage: "TOKEN EXPIRE RE_LOGIN AGAIN WITH YOUR CREDENTIALS",
                            //     button:"Register",
                            //     link:"/auth/v3/register"
                            // })
                            if (user.username == username && user.password == password) {

                                const paylod = {
                                    username: user.username,
                                    password: user.password,
                                }
                                const jwtToken = jwt.sign(paylod, "secret", { expiresIn: "180d" });
                                res.cookie("jwtToken", jwtToken);
                                res.render("home")
                            } else {
                                if (user.password != password) {
                                    res.render("error", {
                                        errorCode: 500,
                                        errorMessage: "Invalid Password Try Again !!"
                                    })
                                } else {
                                    res.render("error", {
                                        errorCode: 500,
                                        errorMessage: "Try Again !!"
                                    })
                                }
                            }
                        }

                        else {
                            console.log("jwt auth failed got error", err);
                            res.render("error", {
                                errorCode: 500,
                                errorMessage: "Server Problem  !!"
                            })
                            return;
                        }

                    }
                    if (!err) {
                        try {
                            console.log("jwt decoded", decoded);

                            if (decoded.password != password) {
                                res.render("error", {
                                    errorCode: 500,
                                    errorMessage: "Invalid password !!"
                                })
                            } else {
                                res.render("home")
                            }
                        } catch (err) {
                            console.log("error occured in jwt decoded", err);
                            res.render("error", {
                                errorCode: 500,
                                errorMessage: "Server Problem !!"
                            })
                        }
                    }

                    // res.render("home");
                })
            }

        } else {
            res.render("error", {
                errorCode: 500,
                errorMessage: "No users Found !!"
            })
        }
        console.log(username, password);
    },
    async postRegister(req, res) {
        const { username, password, grade, college,email,phoneNumber } = req.body;

        const cond = await auth_model.findOne({ username });
        // console.log(cond != null)
        if (cond == null) {
            const payload = {
                username: username,

                password: password
            }
            const jwtToken = jwt.sign(payload, "secret", { expiresIn: "180d" });
            console.log(jwtToken);
            res.cookie("jwtToken", jwtToken);
            res.cookie("user_name", username)

            await auth_model.create({ username, password, grade, college,email,phoneNumber });
            res.render("home")
            console.log(username, password);
        } else {
            if (cond != null) {
                res.render("error", {
                    errorCode: 500,
                    errorMessage: "Username Already Exists !!"
                })

            }
        }

    }
}

const jwtChecker = async (req, res, next) => {
    if (req.cookies.jwtToken) {
        const jwtToken = req.cookies.jwtToken;
        await jwt.verify(jwtToken, "secret", (err, decoded) => {
            if (err) {
                if (err.name = 'TokenExpiredError') {
                    res.render("auth/login");
                }
                res.render("error", {
                    errorCode: 500,
                    errorMessage: "NO valid token got errror on jwt checker  !!"
                })
                return;
            }
            next();
        })
    } else {
        res.render("auth/login")
        // res.render("error", {
        //     errorCode: 500,
        //     errorMessage: " Bro ,You Are Not Verified to Access The Site , Login Yourself - Sanjeev Khadka  !!"
        // })
    }
}

module.exports = { authMethods, jwtChecker };