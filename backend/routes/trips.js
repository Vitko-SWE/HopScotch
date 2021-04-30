const express = require('express')
const db = require('../db');
const { route } = require('./homepage');
let router = express.Router()
require('dotenv').config()
const yelp = require('yelp-fusion');
const client = yelp.client(process.env.YELP_SECRET);
const PDFDocument = require('pdfkit');
const axios = require("axios");

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

router.route("/getConfirmedFeatures/:tripid").get((req, res) => {
  const query = `select * from TripFeatures where TripId = '${req.params.tripid}' AND Confirmed = 'true';`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(data)
    }
  })
});

router.route("/lockTrip/:tripid").post((req, res) => {
  const query = `update Trip set IsLocked = 1 where TripId = '${req.params.tripid}'`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(data)
    }
  })
});

router.route("/unlockTrip/:tripid").post((req, res) => {
  const query = `update Trip set IsLocked = 0 where TripId = '${req.params.tripid}'`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(data)
    }
  })
});

router.route("/confirmFeature/:tripid/:featureid").post((req, res) => {
  if (!(req.body.confirmed == "true" || req.body.confirmed == "false")) {
    console.log("Invalid parameters.")
    res.status(400).send("Invalid parameters.")
    return;
  }

  if (req.body.isFlight == null) {
    console.log("Invalid parameters.")
    res.status(400).send("Invalid parameters.")
    return;
  }

  if (req.body.isFlight == true) {
    const query = `update Flight set Confirmed = '${req.body.confirmed}' where TripID = '${req.params.tripid}' and FlightId = '${req.params.featureid}'`;
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        res.send(data)
      }
    })
  } else {
    const query = `update TripFeatures set Confirmed = '${req.body.confirmed}' where TripId = '${req.params.tripid}' and FeatureId = '${req.params.featureid}'`;
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        res.send(data)
      }
    })
  }
});

router.route("/deleteFeature/:tripid/:featureid").post((req, res) => {
  if (req.body.isFlight == null) {
    console.log("Invalid parameters.")
    res.status(400).send("Invalid parameters.")
    return;
  }

  if (req.body.isFlight == true) {
    const query = `DELETE FROM Votes WHERE TripID = '${req.params.tripid}' and FeatureId = '${req.params.featureid}';\nDELETE FROM Flight WHERE TripID = '${req.params.tripid}' and FlightId = '${req.params.featureid}';`;
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        res.send(data)
      }
    })
  } else {
    const query = `DELETE FROM Votes WHERE TripId = '${req.params.tripid}' and FeatureId = '${req.params.featureid}';\nDELETE FROM TripFeatures WHERE TripID = '${req.params.tripid}' and FeatureId = '${req.params.featureid}';`;
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        res.send(data)
      }
    })
  }
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

router.route("/getuserrole/:userid").get((req, res) => {
  const query = `select * from TripUser where UserId = '${req.params.userid}';`;
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

router.route("/editbudget/:tripid").post((req, res) => {
  const query = `update Trip set Budget = ${req.body.budget} where TripId = '${req.params.tripid}';`;
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
  });
});

router.route("/vote").post((req, res) => {
  if (req.body.tripid == null || req.body.userid == null
    || req.body.featureid == null || req.body.isflight == null
    || req.body.score == null) {
    return res.status(400).send("400 Invalid parameters.")
  }

  const checkQuery = `SELECT * FROM Votes WHERE UserId='${req.body.userid}' AND TripId='${req.body.tripid}' AND FeatureId='${req.body.featureid}' AND IsFlight=${req.body.isflight}`
  db.query(checkQuery, (err, data) => {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    if (data.length == 0) {
      // has not voted yet
      const query = `INSERT INTO Votes(UserId, TripId, FeatureId, IsFlight, Score) values ('${req.body.userid}', '${req.body.tripid}', '${req.body.featureid}', ${req.body.isflight}, ${req.body.score})`
      db.query(query, (err, data) => {
        if (err) {
          return res.status(500).send(err)
        } else {
          return res.status(200).send(data)
        }
      })
    } else if (data.length == 1) {
      //updating existing vote
      const query = `UPDATE Votes SET Score=${req.body.score} WHERE UserId='${req.body.userid}' AND TripId='${req.body.tripid}' AND FeatureId='${req.body.featureid}' AND IsFlight=${req.body.isflight}`
      db.query(query, (err, data) => {
        if (err) {
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
    if (err) {
      return res.status(500).send(err)
    } else {
      return res.status(200).send(data)
    }
  })
})

//gets a specific vote for a user
router.route("/:tripid/voteuser/:featureid").get((req, res) => {
  if (req.headers.userid == null) {
    return res.status(400).send("Missing user id.")
  }

  const checkQuery = `SELECT * FROM Votes WHERE TripId='${req.params.tripid}' AND FeatureId='${req.params.featureid} AND UserId='${req.headers.userid}'`
  db.query(checkQuery, (err, data) => {
    if (err) {
      return res.status(500).send(err)
    } else {
      return res.status(200).send(data)
    }
  })
})

//gets total score for a feature
router.route("/:tripid/voteScore/:featureid").get((req, res) => {
  const checkQuery = `SELECT SUM(Score) FROM Votes WHERE TripId='${req.params.tripid}' AND FeatureId='${req.params.featureid}'`
  db.query(checkQuery, (err, data) => {
    if (err) {
      return res.status(500).send(err)
    } else {
      return res.status(200).send(data)
    }
  })
})

//for a specific trip, get all the features and it's details
router.route("/:tripid/votes").get((req, res) => {
  const checkTripFeaturesQuery = `SELECT * FROM (SELECT v.FeatureId, SUM(v.Score) as Score, tf.FeatureName, tf.FeatureType, GROUP_CONCAT(u.Name) as Voters, v.IsFlight, tf.BookingURL, tf.Confirmed FROM Votes v JOIN TripFeatures tf ON v.FeatureId=tf.FeatureId AND v.TripId = tf.TripId JOIN User u ON v.UserId=u.UserId WHERE v.TripId=${req.params.tripid} GROUP BY v.FeatureId, v.TripId) AS A JOIN (select FeatureId, (COUNT(distinct TripId) - 1) as Popularity from Votes GROUP BY FeatureId) AS B ON A.FeatureId=B.FeatureId`
  db.query(checkTripFeaturesQuery, (err, data) => {
    if (err) {
      return res.status(500).send(err)
    } else {
      const checkFlightsQuery = `SELECT * FROM (SELECT v.FeatureId, SUM(v.Score) as Score, CONCAT(f.Airline, ' ', f.Origin) as FeatureName, "Flight" as FeatureType, GROUP_CONCAT(u.Name) as Voters, v.IsFlight, f.BookingURL, f.Confirmed FROM Votes v JOIN Flight f ON v.FeatureId=f.FlightId AND v.TripId = f.TripId JOIN User u ON v.UserId=u.UserId WHERE v.TripId=${req.params.tripid} GROUP BY v.FeatureId, v.TripId) AS A JOIN (select FeatureId, (COUNT(distinct TripId) - 1) as Popularity from Votes GROUP BY FeatureId) AS B ON A.FeatureId=B.FeatureId`
      db.query(checkFlightsQuery, (err, data2) => {
        if (err) {
          return res.status(500).send(err);
        }
        else {
          const retArr = data.concat(data2);
          console.log(retArr);
          return res.send(retArr)
        }
      })
    }
  })
})

router.route("/myeditabletrips").get((req, res) => {
  var query_string = 'SELECT * FROM Trip WHERE TripId '
  query_string += `IN (SELECT TripUser.TripId FROM TripUser WHERE TripUser.UserId = "${req.headers.userid}" AND (TripUser.Role = "Owner" OR TripUser.Role = "Editor"))`
  db.query(query_string, (err, data) => {
    if (err) {
      console.log("sql error" + err)
      return
    };
    console.log('Data received from Db:');
    console.log(data);
    res.send(data)
  });
});

router.route("/getfeaturespure/:tripid").get((req, res) => {
  const query = `select * from TripFeatures where TripId = '${req.params.tripid}';`;
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

router.route("/getTripFeatures/:tripid").get(async (req, res) => {
  const query = `select * from TripFeatures where TripId = '${req.params.tripid}';`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      if (data.length === 0) {
        res.status(404).send("Trip features not found for the given trip.");
      }
      else {
        var diningOptions = []
        var promises = []
        var otherFeatures = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].FeatureType == "Dining") {
            promises.push(
              client.business(data[i].FeatureId).then(response => {
                console.log("request to yelp")
                // console.log(response.jsonBody);
                diningOptions.push(response.jsonBody)
                // console.log(diningOptions)
              })
            )


          }
          else {
            otherFeatures.push(data[i])
          }

          console.log(diningOptions)
        }


        var features = {
          dining: diningOptions,
          otherFeatures: otherFeatures
        }
        // console.log(diningOptions)
        Promise.allSettled(promises).then(() => res.send(features))
        // res.send(data);
      }
    }
  })
});

router.get("/gettripimage/:tripid", (req, res) => {
  const query = `select Destination from Trip where TripId = '${req.params.tripid}';`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${data[0].Destination}&inputtype=textquery&fields=photos&key=AIzaSyDhf9OqY8Z3uNub0hgRYttINkf1gXOGZH4`).then((res1) => {
        res.send(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${res1.data.candidates[0].photos[0].photo_reference}&key=AIzaSyDhf9OqY8Z3uNub0hgRYttINkf1gXOGZH4`);
      }).catch((err) => {
        console.log(err);
        res.send(err);
      });
    }
  });
});

router.post('/:tripid/pdf', (req, res) => {
  const query = `select * from Trip where TripId = '${req.params.tripid}';`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      const doc = new PDFDocument;
      const tripdata = data[0];

      doc.pipe(res);

      doc.fontSize(24).text(tripdata.Name, {
        align: "center",
      });

      doc.moveDown();

      let collabs = "Trip Collaborators: ";
      for (let i = 0; i < req.body.people.length; i++) {
        collabs += (req.body.people[i].Name + (i === req.body.people.length - 1 ? "" : ", "));
      }
      doc.fontSize(16).text(collabs);

      doc.moveDown();

      doc.fontSize(20).text("Trip Details", {
        align: "center",
      });

      doc.fontSize(16).text(`Origin: ${tripdata.Origin}`);
      doc.fontSize(16).text(`Destination: ${tripdata.Destination}`);
      doc.fontSize(16).text(`Start Date: ${`${(new Date(tripdata.StartDate)).getMonth() + 1}/${(new Date(tripdata.StartDate)).getDate()}/${(new Date(tripdata.StartDate)).getFullYear()}`}`);
      doc.fontSize(16).text(`End Date: ${`${(new Date(tripdata.EndDate)).getMonth() + 1}/${(new Date(tripdata.EndDate)).getDate()}/${(new Date(tripdata.EndDate)).getFullYear()}`}`);
      // doc.fontSize(16).text(`OutboundFlightId: ${tripdata.OutboundFlightId}`);
      // doc.fontSize(16).text(`InboundFlightId: ${tripdata.InboundFlightId}`);

      doc.moveDown();

      doc.fontSize(20).text("Trip Features", {
        align: "center",
      });

      for (let i = 0; i < req.body.featureInfo.dining.length; i++) {
        doc.fontSize(16).text(req.body.featureInfo.dining[i].name, {
          align: "center",
        });
        doc.fontSize(12).text(req.body.featureInfo.dining[i].phone, {
          align: "center",
        });
        doc.fontSize(12).fillColor("blue").text("Yelp URL", {
          link: req.body.featureInfo.dining[i].url,
          underline: true,
          align: "center",
        });
        doc.fillColor("black");
        doc.moveDown();
      }
      for (let i = 0; i < req.body.featureInfo.otherFeatures.length; i++) {
        doc.fontSize(16).text(req.body.featureInfo.otherFeatures[i].FeatureName, {
          align: "center",
        });
        doc.fontSize(12).text(req.body.featureInfo.otherFeatures[i].Location, {
          align: "center",
        });
        doc.fontSize(12).fillColor("blue").text("Booking URL", {
          link: req.body.featureInfo.otherFeatures[i].BookingURL,
          underline: true,
          align: "center",
        });
        doc.fillColor("black");
        doc.moveDown();
      }

      doc.end();
    }
  });
});

module.exports = router;
