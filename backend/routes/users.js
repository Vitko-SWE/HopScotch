const express = require("express");
const db = require('../db');
let router = express.Router()
var ManagementClient = require('auth0').ManagementClient;
var request = require("request");
require('dotenv').config()

// This is an object to retrieve managment api token
var options = { 
    method: 'POST',
    url: 'https://flyhopscotch-dev.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: process.env.CREDENTIALS 
};
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

        //Delete users from auth0
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

            var deleted = false

            management.users.delete({ id: req.headers.user_id }, function (err) {
                if (err) {
                // Handle error.
                    console.log(err)
                    return err
                }
                else {
                    deleted = true
                    console.log("User was deleted from auth0")
                    
                    // Delete user from database
                    var query_string = `DELETE FROM User WHERE User.UserId="${req.headers.user_id}"`;
                    db.query(query_string, (err, data) => {
                        if (err) {
                            console.log( err)
                            return err;
                        }
                        console.log("User was succefully delted from DB")
                    })
            
                    query_string = `DELETE FROM TripUser WHERE TripUser.UserId="${req.headers.user_id}"`;
            
                    //Delete all user trips
                    db.query(query_string, (err, data) => {
                        if (err) {
                            console.log(err)
                            return err;
                        }
            
                        res.send(data);
                        console.log("All user trips were succefully deleted")
                    })
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

router.route("/getTripUsers/:TripId")
    .get((req, res) => {
        var query = `SELECT * FROM TripUser WHERE TripId = "${req.params.TripId}"`
        console.log(req.params.TripId)
        db.query(query, (err, data) => {
            if (err)
                return err;
            res.send(data);
        })
    })


module.exports = router;
