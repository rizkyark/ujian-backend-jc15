const router = require("express").Router()
const { query2, asyncQuery } = require("../helper");
const db = require("../database");

router.get("/get/all", (req, res) => {
    try {
        const qall = `select m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description, ms.status, l.location, st.time 
                     from movies m join movie_status ms on m.status = ms.id
                     join schedules s on s.movie_id = m.id
                     join locations l on l.id = s.location_id
                     join show_times st on st.id = s.time_id`;
        const result = await asyncQuery(qall)
        res.status(200).send(result)
    }
    catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

router.get("/get", (req, res) => {
    try {
        const qget = `select m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description, ms.status, l.location, st.time 
                     from movies m join movie_status ms on m.status = ms.id
                     join schedules s on s.movie_id = m.id
                     join locations l on l.id = s.location_id
                     join show_times st on st.id = s.time_id
                     where ${query2(req.query)} `;
        const result = await asyncQuery(qget);
        res.status(200).send(result)
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router