const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const { userRouter, movieRouter } = require("./router");

// main app
const app = express()

const db = require("./database")
const { userRouter } = require('./router')
db.connect((err) => {
    if (err) return console.error("error connecting")

    console.log(`connected with id : ${db.threadId}`)
})

// apply middleware
app.use(cors())
app.use(bodyparser.json())

// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM-15</h1>')
app.get('/', response)

app.use("/users", userRouter);
app.use("/movies", movieRouter);


// bind to local machine
const PORT = process.env.PORT || 2000
app.listen(PORT, () => `CONNECTED : port ${PORT}`)