const express = require('express')
const db = require('../db');
let router = express.Router()
// const axios = require('axios')

var Amadeus = require('amadeus');
var amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

router.route("/flights").get(async (req, res) => {
    const originCode = req.query.originCode;
    const destCode = req.query.destCode;
    const deptDate = req.query.deptDate;
    const retDate = req.query.retDate;
    const numPass = req.query.numPass;

    if(originCode == undefined || destCode == undefined || 
        deptDate == undefined || retDate == undefined ||
         numPass == undefined) {
        console.log("Invalid parameters.");
        res.status(400).send("Invalid parameters.");
    } else {
        const flightResponse = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: originCode,
            destinationLocationCode: destCode,
            departureDate: deptDate,
            returnDate: retDate,
            adults: numPass,
            currencyCode: "USD"
        }).catch(err => {
            console.log(err);
            res.status(500).send(err);
        });

        try {
            res.status(200).json(JSON.parse(flightResponse.body));
        } catch {
            res.status(500).send("JSON err");
        }
    }
});

// router.route("/selectFlight").get(async (req, res) => {
//     const FeatureId = req.body.FeatureId;
//     const FeatureType = req.body.FeatureType;
//     const TripId = req.body.TripId;

//     if(FeatureId == undefined || FeatureType == undefined || TripId == undefined) {
//         console.log("Invalid parameters.")
//         res.status(400).send("Invalid parameters.")
//         return;
//     }

//     const query_string = `INSERT INTO TripFeatures VALUES ("${FeatureId}", "${FeatureType}", 0, "", 0, 0, null, ${TripId})`;
//     db.query(query_string, (err, data) => {
//         if(err) {
//             console.log(err);
//             res.status(500).send(err);
//         } else {
//             res.status(200).send(data);
//         }
//     });
// });

module.exports = router;