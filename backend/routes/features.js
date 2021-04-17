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

module.exports = router;
