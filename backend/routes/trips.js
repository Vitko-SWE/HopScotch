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

router.route("/updatetrip/:tripid").post((req, res) => {
  const query = `update Trip set Name = '${req.body.title.split("'").join("\\'")}', Origin = '${req.body.origin.split("'").join("\\'")}', Destination = '${req.body.destination.split("'").join("\\'")}', StartDate = '${req.body.startdate}', EndDate = '${req.body.enddate}', OutboundFlightId = ${req.body.outboundflightid}, InboundFlightId = ${req.body.inboundflightid}, Features = '${req.body.features.split("'").join("\\'")}' where TripId = '${req.params.tripid}';`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      console.log(data);
      res.send(data);
    }
  });
});

router.route("/gettrip/:tripid").get((req, res) => {
  const query = `select * from Trip where TripId = '${req.params.tripid}';`;
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

router.route("/gettripusers/:tripid/:role").get((req, res) => {
  if (req.params.role !== "all") {
    const query = `select * from User where UserId in (select UserId from TripUser where TripId = '${req.params.tripid}' and Role = '${req.params.role}');`;
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        res.send(data);
      }
    });
  }
  else {
    const query = `select * from User where UserId in (select UserId from TripUser where TripId = '${req.params.tripid}');`;
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        res.send(data);
      }
    });
  }
});

router.route("/addtripusers/:tripid/:role").post((req, res) => {
  let userquery = "select UserId from User where ";
  for (const email of req.body.users) {
    userquery += `EmailAddress = "${email}" or `;
  }
  userquery = userquery.slice(0, -4) + ";";
  db.query(userquery, (err, data2) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      let query = `insert into TripUser(UserId, TripId, Role) values`;
      for (const editor of data2) {
        query += ` ('${editor.UserId}', ${req.params.tripid}, '${req.params.role}'),`;
      }
      query = query.slice(0, -1) + ";";
      db.query(query, (err, data) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        else {
          res.send(data);
        }
      });
    }
  });
});

router.route("/getuserrole/:tripid/:userid").get((req, res) => {
  const query = `select Role from TripUser where TripId = '${req.params.tripid}' and UserId = '${req.params.userid}';`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      if (data.length === 0) {
        res.status(404).send("User not found for given trip.");
      }
      else {
        res.send(data);
      }
    }
  })
});

router.route("/edituserrole/:tripid/:userid").post((req, res) => {
  const query = `update TripUser set Role = '${req.body.newrole}' where TripId = '${req.params.tripid}' and UserId = '${req.params.userid}';`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(data);
    }
  })
});

router.route("/removeuser/:tripid/:userid").delete((req, res) => {
  const query = `delete from TripUser where TripId = '${req.params.tripid}' and UserId = '${req.params.userid}';`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(data);
    }
  })
});

module.exports = router;
