const express = require('express')
const db = require('../db');
const axios = require("axios");
let router = express.Router()

router.route("/attractionsearch").post((req, res) => {
  axios.post("https://test.api.amadeus.com/v1/security/oauth2/token", "grant_type=client_credentials&client_id=Q4aEVTArfMixbGwELBlPoHgWPmy4PmTR&client_secret=cXMQ7qdUH24shfpA", {
    headers: {
      Content_Type: "application/x-www-form-urlencoded",
    },
  }).then((resp) => {
    const token = resp.data.access_token;

    if (req.body.filter === "Points of Interest") {
      axios.get(`https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=${req.body.latitude}&longitude=${req.body.longitude}&radius=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((respon) => {
        const fr = {
          ta: [],
          poi: respon.data.data,
        };
        res.send(fr);
      }).catch((err) => {
        console.log(err);
        res.send(err);
      });
    }
    else {
      axios.get(`https://test.api.amadeus.com/v1/shopping/activities?latitude=${req.body.latitude}&longitude=${req.body.longitude}&radius=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((respo) => {
        if (req.body.filter === "All") {
          axios.get(`https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=${req.body.latitude}&longitude=${req.body.longitude}&radius=20`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((respon) => {
            const fr = {
              ta: respo.data.data,
              poi: respon.data.data,
            };
            res.send(fr);
          }).catch((err) => {
            console.log(err);
            res.send(err);
          });
        }
        else {
          const fr = {
            ta: respo.data.data,
            poi: [],
          };
          res.send(fr);
        }
      }).catch((err) => {
        console.log(err);
        res.send(err);
      });
    }
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
});

module.exports = router;
