const express = require('express')
const db = require('../db');
let router = express.Router()
const search = require('./search');

router.route("/search").get((req, res) => {
    //Calling google places to get the location translated into coordiantes
    console.log(req.headers.hotel);
    console.log(req.headers.location);

    
    //Calling google places to get the hotels from the coordiantes given

    //Returning the list of hotels
    
});

module.exports = router