const express = require('express')
const db = require('../db');
let router = express.Router()
const axios = require('axios')
const yelp = require('yelp-fusion');
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
      });
})

module.exports = router