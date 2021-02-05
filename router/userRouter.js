const router = require("express").Router()
const { generateQuery, asyncQuery } = require("../helper");
const { createToken, verifyToken } = require("../helper");
const cryptojs = require("crypto-js");
const SECRET_KEY = process.env.CRYPTO_KEY;
const db = require("../database");
let token

router.post("/register", (req, res) => {
    const { username, password, email } = req.body;

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send(errors.array()[0].msg)

    const hashpass = cryptojs.HmacMD5(password, SECRET_KEY);

    try {
        const checkUser = `SELECT * FROM users
                           WHERE username="${username}" 
                           OR email="${email}"`
        
        const checkRes = await asyncQuery(checkUser)
        if (checkRes.length !== 0) return res.status(400).send("username/email has already exist");

        const qadd = `INSERT INTO users(uid, username, email, password, role, status) 
                      VALUES ("${Date.now()}", "${username}", "${email}", ${db.escape(hashpass.toString())}, 1, 1)`;
        
        const resadd = await asyncQuery(qadd);
        const qtoken = `SELECT id, uid, username, email, role FROM users where id= ${resadd.insertID}`;
        const restoken = await asyncQuery(qtoken);
        token = createToken({ uid: restoken[0].uid, role: restoken[0].role })
        const qshow = `SELECT id, uid, username, email, "${token}" as token FROM users where id=${resadd.insertID}`;
        const result = await asyncQuery(qshow);
        res.status(200).send(result[0]);
        return token;        
    }
    catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    try {
        const hashpass = cryptojs.HmacMD5(password, SECRET_KEY);

        const queryLogin = `SELECT id, uid, username, email, status, role, '${token}' as token FROM users
                            WHERE username=${db.escape(username)} 
                            AND password=${db.escape(hashpass.toString())}
                            AND status <> 3`
        const result = await asyncQuery(queryLogin);
        if (result.length === 0) return res.status(400).send("invalid username or password")
        res.status(200).send(result[0]);
    }
    catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

router.patch("/deactive", (req, res) => {
    try {
        const checkUser = `SELECT * FROM user WHERE token='${req.body.token}'`
        const checkRes = await asyncQuery(checkUser)
        console.log(checkRes)
        if (checkRes.length === 0) return res.status(400).send(`token ${req.body.token} isn't available`)
        
        const qedit = `UPDATE products SET status='deactive'
                        WHERE token='${req.body.token}'`
        await asyncQuery(qedit)
        console.log(qedit)
        const qnew = `SELECT uid, status FROM user WHERE token='${req.body.token}'`
        const result2 = await asyncQuery(qnew)
        res.status(200).send(result2)
    }
    catch (err) {
    console.log(err)
    res.status(400).send(err)
    }

})

router.patch("/activate", (req, res) => {
    try {
        const checkUser = `SELECT * FROM user WHERE token='${req.body.token}'`
        const checkRes = await asyncQuery(checkUser)
        console.log(checkRes)
        if (checkRes.length === 0) return res.status(400).send(`token ${req.body.token} isn't available`)
        
        const qedit = `UPDATE products SET status='active'
                        WHERE token='${req.body.token}'`
        await asyncQuery(qedit)
        console.log(qedit)
        const qnew = `SELECT uid, status FROM user WHERE token='${req.body.token}'`
        const result2 = await asyncQuery(qnew)
        res.status(200).send(result2)
    }
    catch (err) {
    console.log(err)
    res.status(400).send(err)
    }
})

router.patch("/close", (req, res) => {
    try {
        const checkUser = `SELECT * FROM user WHERE token='${req.body.token}'`
        const checkRes = await asyncQuery(checkUser)
        console.log(checkRes)
        if (checkRes.length === 0) return res.status(400).send(`token ${req.body.token} isn't available`)
        
        const qedit = `UPDATE products SET status='closed'
                        WHERE token='${req.body.token}'`
        await asyncQuery(qedit)
        console.log(qedit)
        const qnew = `SELECT uid, status FROM user WHERE token='${req.body.token}'`
        const result2 = await asyncQuery(qnew)
        res.status(200).send(result2)
    }
    catch (err) {
    console.log(err)
    res.status(400).send(err)
    }
})

module.exports = router;