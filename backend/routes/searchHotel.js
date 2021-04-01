const axios  = require('axios');
const express = require('express')
const db = require('../db');
let router = express.Router()
const search = require('./search');

router.route("/search").get((req, res) => {
    //Calling google places to get the location translated into coordiantes
    //console.log(req.headers.hotel);
    //console.log(req.headers.location);

    axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.headers.location}&types=geocode&key=${process.env.GOOGLE_PLACE_KEY}`)
    .then((res2) => {
        //console.log(res2.data.predictions[0].place_id);
        axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${res2.data.predictions[0].place_id}&key=${process.env.GOOGLE_PLACE_KEY}`)
        .then((res3) => {
            //console.log(res3.data.result.geometry.location.lat);
            //console.log(res3.data.result.geometry.location.lng);

            axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${res3.data.result.geometry.location.lat},${res3.data.result.geometry.location.lng}&name=${req.headers.hotel}&radius=8000&type=lodging&fields=formatted_address,photos,name,rating,geometry,price_level&key=${process.env.GOOGLE_PLACE_KEY}`)
            .then((res4) =>{
                const sendBack = [];
                const sendBackPromises = [];
                for(i = 0; i < res4.data.results.length; i++) {
                    sendBackPromises.push(
                        axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${res4.data.results[i].place_id}&key=AIzaSyDhf9OqY8Z3uNub0hgRYttINkf1gXOGZH4`)
                        .then((res5) => {
                            //console.log(sendBack);
                            sendBack.push(res5.data.result);
                        })
                    );
                }
                Promise.allSettled(sendBackPromises).then(() =>
                    res.send(sendBack)
                );
            });
        });
    });
});

router.route("/selectHotel").post((req, res) => {
    console.log(req.body);
    var query_string = `INSERT INTO TripFeatures VALUES ("${req.body.FeatureId}", "${req.body.FeatureType}", 0, "${req.body.Address}", 0, 0, "${req.body.BookingUrl}", ${req.body.TripId}, "${req.body.FeatureName}", null, false)`;

    db.query(query_string, (err, data) => {
        if (err) {
            console.log(err)
            return err;
        }
        console.log(data)
        res.send(data);
    })



})

module.exports = router
