const express = require('express')
const db = require('../db');
let router = express.Router();

router.route("/editprices/:tripid").post((req, res) => {
  for (let i = 0; i < req.body.input.length; i++) {
    const query = `update TripFeatures set Price = ${req.body.input[i].price} where TripId = '${req.params.tripid}' and FeatureId = '${req.body.input[i].id}';`;
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
    });
  }
  res.status(200).send();
});

router.route("/getDiningFeatures/:tripid").get((req, res) => {
  const query = `select * from TripFeatures where TripId = '${req.params.tripid}' AND (FeatureType = "Dining");`;
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

router.route("/getHotelFeatures/:tripid").get((req, res) => {
  const query = `select * from TripFeatures where TripId = '${req.params.tripid}' AND (FeatureType = "Hotel");`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      console.log("Hotels")
      console.log(data)
      res.send(data);
    }
  });
});

router.route("/getAttractionFeatures/:tripid").get((req, res) => {
  const query = `select * from TripFeatures where TripId = '${req.params.tripid}' AND (FeatureType = "Tour/Activity");`;
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      console.log("Attractions")
      console.log(data)
      res.send(data);
    }
  });
});

router.route("/getConfirmedDiningFeatures/:tripid").get((req, res) => {
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
  const query = `select * from TripFeatures where TripId = '${req.params.tripid}' AND (FeatureType NOT IN ("Dining"));`;
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

router.route("/getConfirmedOtherFeatures/:tripid").get((req, res) => {
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
