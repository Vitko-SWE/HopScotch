const express = require('express')
const db = require('../db');
let router = express.Router()

router.route("/createtrip").post((req, res) => {
  let users = [];
  let userquery = "select UserId from User where ";
  for (const email of req.body.editors) {
    userquery += `EmailAddress = "${email}" or `;
  }
  userquery = userquery.slice(0, -4) + ";";
  db.query(userquery, (err, data2) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      if (data2.length === req.body.editors.length || req.body.editors[0] === "") {
        const query = `insert into Trip(Name, Origin, Destination, StartDate, EndDate, OutboundFlightId, InboundFlightId, Features, IsLocked) values('${req.body.title.split("'").join("\\'")}', '${req.body.origin.split("'").join("\\'")}', '${req.body.destination.split("'").join("\\'")}', '${req.body.startdate}', '${req.body.enddate}', ${req.body.outboundflightid}, ${req.body.inboundflightid}, '${req.body.features.split("'").join("\\'")}', 0);`;
        db.query(query, (err, data) => {
          if (err) {
            console.log(err);
            res.send(err);
          }
          else {
            console.log(data);
            let query2 = `insert into TripUser(UserId, TripId, Role) values('${req.headers.userid}', ${data.insertId}, 'Owner')`;
            for (const editor of data2) {
              query2 += `, ('${editor.UserId}', ${data.insertId}, 'Editor')`;
            }
            query2 += ";";
            db.query(query2, (err1, data1) => {
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
      }
      else {
        res.status(404).send("Given email addresses do not all represent existing users.");
      }
    }
  });
});

router.route("/gettrip/:tripid").get((req, res) => {
  let query = `select * from Trip where TripId = '${req.params.tripid}';`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(data[0]);
    }
  });
});

router.route("/gettripowners/:tripid").get((req, res) => {
  let query = `select * from User where UserId in (select UserId from TripUser where TripId = '${req.params.tripid}' and Role = 'Owner');`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(data);
    }
  });
});

router.route("/gettripeditors/:tripid").get((req, res) => {
  let query = `select * from User where UserId in (select UserId from TripUser where TripId = '${req.params.tripid}' and Role = 'Editor');`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(data);
    }
  });
});

router.route("/gettripviewers/:tripid").get((req, res) => {
  let query = `select * from User where UserId in (select UserId from TripUser where TripId = '${req.params.tripid}' and Role = 'Viewer');`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(data);
    }
  });
});

module.exports = router;
