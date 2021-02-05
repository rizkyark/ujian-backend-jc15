const jwt = require("jsonwebtoken")
const TOKEN_KEY = procces.env.TOKEN_KEY

const createToken = (data) => {
    return jwt.sign(data, TOKEN_KEY)
};

const verifyToken = (req, res, next) => {
    const token = req.body.token
    if (!token) return res.status(400).send("not available")
    try {
        const result = jwt.verify(token, TOKEN_KEY)
        console.log("result:", result)
        req.user = result
        next()
    }
    catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
}


module.exports = { createToken, verifyToken };