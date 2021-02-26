const express = require('express')
const db = require('../db');
let router = express.Router()

router.route("/myTrips")
    // /homepage/myTrips
    .get((req, res) => {
        console.log(req.headers.userid)
        var query_string = 'SELECT * FROM Trip WHERE TripId '
        query_string += `IN (SELECT TripUser.TripId FROM TripUser WHERE TripUser.UserId = "${req.headers.userid}")`
        db.query(query_string, (err,data) => {
            if(err) {
                console.log("sql error" + err)
                return
            };
            console.log('Data received from Db:');
            console.log(data);
            res.send(data)
          });
    })

router.route("/createtrip").post((req, res) => {
  const query_string = `insert into Trip(Name, Origin, Destination, StartDate, EndDate, InboundFlightId, OutboundFlightId, Features, IsLocked) values('${req.body.title}', '${req.body.origin}', '${req.body.destination}', '${req.body.startdate}', '${req.body.enddate}', ${req.body.inboundflightid}, ${req.body.outboundflightid}, '${req.body.features}', 0);`;
  db.query(query_string, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      console.log(data);
      const query_string2 = `insert into TripUser(UserId, TripId, Role) values('${req.headers.userid}', ${data.insertId}, 'Owner');`;
      db.query(query_string2, (err1, data1) => {
        if (err1) {
          console.log(err1);
          res.send(err1);
        }
        else {
          console.log(data1);
          res.send({
            tripInsert: data,
            tripUserInsert: data1,
          });
        }
      });
    }
  });
});

module.exports = router;
