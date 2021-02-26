const express = require("express");
const db = require('../db');
let router = express.Router()
var ManagementClient = require('auth0').ManagementClient;
var request = require("request");
require('dotenv').config()

// This an object to retrieve token
var options = { 
    method: 'POST',
    url: 'https://flyhopscotch-dev.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: process.env.CREDENTIALS 
};

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
        var query_string = `INSERT INTO User VALUES ("${req.body.userId}", "${req.body.name}", "${req.body.email}", null, null)`;
        console.log("posting new user")
        db.query(query_string, (err, data) => {
            if (err) {
                console.log(err)
                return err;
            }

            console.log(data)
            res.send(data);
        })
    });

router.route("/deleteUser")
    .delete((req, res) => {

        //Delete users in auth0
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
          
            console.log("body" + body);
            const access_token = body.access_token
          

            console.log(access_token)
            var management = new ManagementClient({
                token: access_token,
                domain: process.env.DOMAIN,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                scope: "delete:users"
            });

            management.users.delete({ id: req.headers.user_id }, function (err) {
                if (err) {
                // Handle error.
                console.log(err)
                }
                else {
                    // Delete user from database
                    var query_string = `"DELETE FROM User WHERE User.UserId=("${req.body.user_id}")`;
                    db.query(query_string, (err, data) => {
                        if (err)
                            return err;
                        res.send(data);
                    })
                    console.log("user deleted")
                }
            });
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
            if(err)
                return err;
            res.send(data);
        })
    });

module.exports = router