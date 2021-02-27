const express = require("express");
const db = require('../db');
let router = express.Router()
const axios = require('axios')

router.route("/getbyuserid/:userId")
    .get((req, res) => {
        var query_string = `SELECT * from User where UserId = "${req.params.userId}"`;

        db.query(query_string, (err, data) => {
            if (err)
                console.log("SQL Get userId error: " + err);
            res.send(data);
        });
    });

router.route("/postnewuser")
    .post((req, res) => {
        var query_string = `INSERT INTO User VALUES ("${req.body.userId}", "${req.body.name}", "${req.body.email}", null)`;
        db.query(query_string, (err, data) => {
            if (err)
                return err;
            res.send(data);
        })
    });

router.route("/updateName")
    .post((req, res) => {
        var query_string = `UPDATE User SET NAME = "${req.headers.name}" WHERE UserId = "${req.headers.userid}"`;
        db.query(query_string, (err, data) => {
            if (err)
                return err;
            res.send(data);
        })
    });

router.route("/updateAboutMe")
    .post((req, res) => {
        var query_string = `UPDATE User SET AboutMe = "${req.headers.aboutme}" WHERE UserId = "${req.headers.userid}"`;
        db.query(query_string, (err, data) => {
            if (err)
                return err;
            res.send(data);
        })
    });


router.route("/changePassword")
    .post((req, res) => {
        axios
            .post('https://flyhopscotch-dev.us.auth0.com/dbconnections/change_password', {
                email: req.headers.email,
                connection: 'Username-Password-Authentication'
            })
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.error(error)
            })
});

module.exports = router