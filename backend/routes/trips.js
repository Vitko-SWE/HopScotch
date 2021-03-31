const express = require('express')
const db = require('../db');
const { route } = require('./homepage');
let router = express.Router()

router.route("/createtrip").post((req, res) => {
  let users = [];
  let userquery = "select UserId from User where ";
  for (const email of req.body.owners) {
    userquery += `EmailAddress = "${email}" or `;
  }
  userquery = userquery.slice(0, -4) + ";";
  db.query(userquery, (err, data2) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      if (data2.length === req.body.owners.length || req.body.owners[0] === "") {
        const query = `insert into Trip(Name, Origin, Destination, StartDate, EndDate, OutboundFlightId, InboundFlightId, Features, IsLocked) values('${req.body.title.split("'").join("\\'")}', '${req.body.origin.split("'").join("\\'")}', '${req.body.destination.split("'").join("\\'")}', '${req.body.startdate}', '${req.body.enddate}', NULL, NULL, NULL, 0);`;
        db.query(query, (err, data) => {
          if (err) {
            console.log(err);
            res.send(err);
          }
          else {
            console.log(data);
            let query2 = `insert into TripUser(UserId, TripId, Role) values('${req.headers.userid}', ${data.insertId}, 'Owner')`;
            for (const editor of data2) {
              query2 += `, ('${editor.UserId}', ${data.insertId}, 'Owner')`;
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
  const query = `update Trip set Name = '${req.body.title.split("'").join("\\'")}', Origin = '${req.body.origin.split("'").join("\\'")}', Destination = '${req.body.destination.split("'").join("\\'")}', StartDate = '${req.body.startdate}', EndDate = '${req.body.enddate}' where TripId = '${req.params.tripid}';`;
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

router.route("/deletetrip/:tripid").delete((req, res) => {
  //Getting the trip so we can delete from features and flights table
  const tripGetQuery = `select TripId, InboundFlightId, OutboundFlightId, Features from Trip where TripId = '${req.params.tripid}';`;
  db.query(tripGetQuery, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      //Deleting flight entries
      const flightDeleteQuery = `Delete from Flight where FlightId = ${data[0].OutboundFlightId} or FlightId = ${data[0].InboundFlightId};`
      db.query(flightDeleteQuery, (err2, data2) => {
        if (err) {
          console.log(err2);
          res.send(err2);
        }
        else {
          //Deleting trip user entires
          const tripUserDeleteQuery = `Delete from TripUser where Tripid = '${req.params.tripid}';`
          db.query(tripUserDeleteQuery, (err3, data3) => {
            if (err) {
              console.log(err3);
              res.send(err3);
            }
            else {
              //Deleting trip entry
              const tripDeleteQuery = `Delete from Trip where TripId = '${req.params.tripid}'`
              db.query(tripDeleteQuery, (err4, data4) => {
                if (err) {
                  console.log(err4);
                  res.send(err4);
                }
                else
                  res.send(data4);
                //TODO: Make one for TripFeatures when that's implemented
              });
            }
          });
        }
      });
    }
  })
})

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
      if (data2.length === req.body.users.length || req.body.users[0] === "") {
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
      else {
        res.status(404).send("Given email addresses do not all represent existing users.");
      }
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

router.route("/vote").post((req, res) => {
  if(req.body.tripid == null || req.body.userid == null
    || req.body.featureid == null || req.body.isflight == null
    || req.body.score == null) {
      return res.status(400).send("400 Invalid parameters.")
  }

  const checkQuery = `SELECT * FROM Votes WHERE UserId='${req.body.userid}' AND TripId='${req.body.tripid}' AND FeatureId='${req.body.featureid}' AND IsFlight=${req.body.isflight}`
  db.query(checkQuery, (err, data) => {
    if(err) {
      console.log(err)
      return res.status(500).send(err)
    }

    if(data.length == 0) {
      // has not voted yet
      const query = `INSERT INTO Votes(UserId, TripId, FeatureId, IsFlight, Score) values ('${req.body.userid}', '${req.body.tripid}', '${req.body.featureid}', ${req.body.isflight}, ${req.body.score})`
      db.query(query, (err, data) => {
        if(err) {
          return res.status(500).send(err)
        } else {
          return res.status(200).send(data)
        }
      })
    } else if(data.length == 1) {
      //updating existing vote
      const query = `UPDATE Votes SET Score=${req.body.score} WHERE UserId='${req.body.userid}' AND TripId='${req.body.tripid}' AND FeatureId='${req.body.featureid}' AND IsFlight=${req.body.isflight}`
      db.query(query, (err, data) => {
        if(err) {
          return res.status(500).send(err)
        } else {
          return res.status(200).send(data)
        }
      })
    } else {
      //weird error that should never happen
      return res.status(500).send("Multiple votes recorded. Yikes.")
    }
  })
})

//gets a record of all votes for a feature
router.route("/:tripid/vote/:featureid").get((req, res) => {
  const checkQuery = `SELECT * FROM Votes WHERE TripId='${req.params.tripid}' AND FeatureId='${req.params.featureid}'`
  db.query(checkQuery, (err, data) => {
    if(err) {
      return res.status(500).send(err)
    } else {
      return res.status(200).send(data)
    }
  })
})

//gets a specific vote for a user
router.route("/:tripid/vote/:featureid").get((req, res) => {
  if(req.headers.userid == null) {
    return res.status(400).send("Missing user id.")
  }

  const checkQuery = `SELECT * FROM Votes WHERE TripId='${req.params.tripid}' AND FeatureId='${req.params.featureid} AND UserId='${req.headers.userid}'`
  db.query(checkQuery, (err, data) => {
    if(err) {
      return res.status(500).send(err)
    } else {
      return res.status(200).send(data)
    }
  })
})

//gets total score for a feature
router.route("/:tripid/vote/:featureid").get((req, res) => {
  const checkQuery = `SELECT SUM(Score) FROM Votes WHERE TripId='${req.params.tripid}' AND FeatureId='${req.params.featureid}'`
  db.query(checkQuery, (err, data) => {
    if(err) {
      return res.status(500).send(err)
    } else {
      return res.status(200).send(data)
    }
  })
})

//for a specific trip, get all the features and it's details
router.route("/:tripid/votes").get((req, res) => {
  const checkQuery = `SELECT v.FeatureId, SUM(v.Score) as Score, tf.FeatureName, tf.FeatureType, GROUP_CONCAT(u.Name) as Voters, v.IsFlight FROM Votes v JOIN TripFeatures tf ON v.FeatureId=tf.FeatureId JOIN User u ON v.UserId=u.UserId WHERE v.TripId=${req.params.tripid} GROUP BY v.FeatureId`
  db.query(checkQuery, (err, data) => {
    if(err) {
      return res.status(500).send(err)
    } else {
      return res.status(200).send(data)
    }
  })
})

module.exports = router;
