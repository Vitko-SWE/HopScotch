const express = require('express')
const db = require('../db');
let router = express.Router()

router.route("/getflights/:tripid").get((req, res) => {
    const query = `select * from Flight where TripId = '${req.params.tripid}';`;
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log("flights")
        console.log(data)
        res.send(data[0]);
      }
    });
  });

  module.exports = router;