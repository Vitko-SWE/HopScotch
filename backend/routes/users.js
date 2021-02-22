const express = require("express");
const db = require('../db');
let router = express.Router()

router.route("/getbyuserid/:userId")
    .get((req, res) => {
        console.log("UserId: " + req.params.userId);
        var query_string = "SELECT * from User where UserId = " + req.params.userId;

        db.query(query_string, (err, data) => {
            if(err)
                console.log("SQL Get userId error: " + err);
            console.log("GET user by userId data: " + data);
            res.send(data);
        });
    });

router.route("/postnewuser")
    .post((req, res) => {
        
    })
module.exports = router