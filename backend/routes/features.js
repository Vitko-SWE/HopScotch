const express = require('express')
const db = require('../db');
let router = express.Router()

router.route("/getDiningFeatures/:tripid").get((req, res) => {
    const query = `select * from TripFeatures where TripId = '${req.params.tripid}' AND (FeatureType = "Dining" AND Confirmed = "true");`;
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log("dining")
        console.log(data)
        res.send(data);
      }
    });
  });

  router.route("/getOtherFeatures/:tripid").get((req, res) => {
    const query = `select * from TripFeatures where TripId = '${req.params.tripid}' AND (FeatureType NOT IN ("Dining") AND Confirmed = "true");`;
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log("dining")
        console.log(data)
        res.send(data);
      }
    });
  });

  module.exports = router;