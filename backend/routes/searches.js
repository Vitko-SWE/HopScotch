const express = require('express')
const db = require('../db');
const axios = require("axios");
let router = express.Router()

router.route("/attractionsearch/:query").get((req, res) => {
  axios.post("https://test.api.amadeus.com/v1/security/oauth2/token", "grant_type=client_credentials&client_id=Q4aEVTArfMixbGwELBlPoHgWPmy4PmTR&client_secret=cXMQ7qdUH24shfpA", {
    headers: {
      Content_Type: "application/x-www-form-urlencoded",
    },
  }).then((resp) => {
    const token = resp.data.access_token;
    axios.get("https://test.api.amadeus.com/v1/shopping/activities?latitude=41.397158&longitude=2.160873&radius=1", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((respo) => {
      res.send(respo.data);
    }).catch((err) => {
      console.log(err);
      res.send(err);
    });
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
});

module.exports = router;
