const express = require("express");
const db = require('../db');
let router = express.Router()

router.route("/getbyuserid/:userId")
    .get((req, res) => {
        var query_string = `SELECT * from User where UserId = "${req.params.userId}"`;

        db.query(query_string, (err, data) => {
            if(err)
                console.log("SQL Get userId error: " + err);
            res.send(data);
        });
    });

router.route("/postnewuser")
    .post((req, res) => {
        var query_string = `INSERT INTO User VALUES ()`
        console.log("I am in post new user!");
    })
module.exports = router