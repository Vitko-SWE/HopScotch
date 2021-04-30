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

  router.route("/getflightinfo/:carriercode/:flightnumber").get((req, res) => {
    const query = `select ArrivalDelayTime, Cancelled, Diverted from FlightInfo where CarrierCode = '${req.params.carriercode}' AND FlightNumber = ${req.params.flightnumber}`;
    db.query(query, (err, data) => {
      if(err) {
        console.log(err);
        res.send(err);
      }
      console.log(`Getting data for: ${req.params.carriercode}${req.params.flightnumber}`)
      if(data.length === 0)
        res.status(404).send();
      else {
        var totalFlights = data.length;
        var numDelayed = 0;
        var numCancelled = 0;
        var numDiverted = 0;
        data.forEach(function(func) {
          if(func.ArrivalDelayTime > 10)
            numDelayed++;
          if(func.Cancelled !== 0)
            numCancelled++;
          if(func.Diverted !== 0)
            numDiverted++;
        })
        const returnObject = {totalFlights: totalFlights, numDelayed: numDelayed, numCancelled: numCancelled, numDiverted: numDiverted}
        res.status(200).send(returnObject);
      }
    })
  })

  module.exports = router;
