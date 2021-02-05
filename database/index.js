const mysql = require("mysql")

const db = mysql.createConnection({
    host: "localhost",
    user: "rizky",
    password: "rizky123",
    database: "backend_2021",
    port: 3306,
});

module.exports = db