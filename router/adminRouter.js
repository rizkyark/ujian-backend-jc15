const router = require("express").Router()
const { generateQuery, asyncQuery } = require("../helper");
const db = require("../database");

router.post("/movies/add", (req, res) => {
    const { name, release_date, release_month, release_year, duration_min, genre, description} = req.body
        try {
            const qadd = `INSERT INTO movies (name, release_date, release_month, release_year, duration_min, genre, description) 
                          VALUES ('${name}', '${release_date}', '${release_month}',' ${release_year}', '${duration_min}', '${genre}', '${description}')`

            const result = await asyncQuery(qadd)

            const qupdate = `SELECT * from movies where id=${result.insertId} `
            const result2 = await asyncQuery(qupdate)
            res.status(200).send(result2)
        }
        catch (err) {
            console.log(err)
        }
})


router.patch("/movies/edit/:id", (req, res) => {

})

module.exports = router;