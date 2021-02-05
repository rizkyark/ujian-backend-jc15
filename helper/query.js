const utill = require("util");
const database = require("../database")

const generateQuery = (body) => {
    let result = ""
    for (let key in body) {
        result += `${key} = ${database.escape(body[key])},`;
    }
    return result.slice(0, -1);
}

const asyncQuery = utill.promisify(database.query).bind(database);

const query2 = (obj) => {
    let temp = ""
    let result1 = ""
    let result2 = ""
        for (let key in obj) {
            result1 += ` ${key} = ${database.escape(obj[key].replace(/%/g, " "))} and`
    }
    temp += result1.slice(0, -4);
    return result2 += temp + ` having ms.status="on show" or ms.status="upcomming"`
}


module.exports = { generateQuery, asyncQuery, query2 };