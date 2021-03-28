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

            axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${res3.data.result.geometry.location.lat},${res3.data.result.geometry.location.lng}&name=${req.headers.hotel}&radius=8000&type=hotel&key=${process.env.GOOGLE_PLACE_KEY}`)
            .then((res4) =>{
                //console.log(res4.data.results);
                res.send(res4.data.results);
            });
        });
    });
});

module.exports = router