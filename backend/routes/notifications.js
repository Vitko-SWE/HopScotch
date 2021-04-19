const express = require('express')
const db = require('../db');
let router = express.Router();


router.route("/getNotifications/:UserId").get((req, res) => {
    const query = `select * from Notifications where UserId = '${req.params.UserId}';`;
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log("Notifications")
        console.log(data)
        res.send(data);
      }
    });
  });

  module.exports = router;