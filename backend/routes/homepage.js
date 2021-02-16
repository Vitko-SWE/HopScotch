const express = require('express')
const db = require('../db');
let router = express.Router()

router.route("/myTrips")
    // /homepage/myTrips
    .get((req, res) => {
        console.log(req.headers.userid)
        var query_string = 'SELECT * FROM Trip WHERE TripId '
        query_string += 'IN (SELECT TripUser.TripId FROM TripUser WHERE TripUser.UserId = ' + req.headers.userid + ')'
        db.query(query_string, (err,data) => {
            if(err) {
                console.log(err)
                return -1
            };
            console.log('Data received from Db:');
            console.log(data);
            res.send(data)
          });
    })

module.exports = router