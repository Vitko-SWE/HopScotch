const express = require('express')
const db = require('../db');
let router = express.Router()
const axios = require('axios')
const yelp = require('yelp-fusion');
const { response } = require('express');
require('dotenv').config()
const client = yelp.client(process.env.YELP_SECRET);

router.route("/searchDining").get((req, resp) => {
    client.search({
        term: req.headers.string,
        location: req.headers.city,
      }).then(response => {
        console.log(response.jsonBody.businesses);
        resp.send(response.jsonBody.businesses)
      }).catch(e => {
        console.log(e);
        resp.send([])
      });
})

router.route("/selectDining").post((req, resp) => {
  console.log(req.body.TripId)
    var query_string = `INSERT INTO TripFeatures VALUES ("${req.body.FeatureId}", "${req.body.FeatureType}", 0, "", 0, 0, null, ${req.body.TripId})`;
    console.log("posting new dining feature")
    db.query(query_string, (err, data) => {
        if (err) {
            console.log(err)
            return err;
        }

        console.log(data)
        resp.send(data);
    })
})

module.exports = router