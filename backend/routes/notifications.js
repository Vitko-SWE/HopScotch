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


router.route("/insertNotification").post((req, res) => {
    const query =  `INSERT INTO Notifications VALUES ("${req.body.UserId}", "${req.body.NotificationBody}", "${req.body.NotificationTitle}", "${req.body.TripName}", "${req.body.TripId}", "${req.body.NotificationId}")`;
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            console.log("posted Notification")
            res.send(data);
        }
    });
});

router.route("/deleteNotification/:notificationId").delete((req, res) => {
    const query = `DELETE FROM Notifications WHERE NotificationId = '${req.params.notificationId}'`
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            console.log("Notification deleted")
            res.send(data);
        }
    });
});



  module.exports = router;