const express = require('express')
const db = require('../db');
const axios = require("axios");
let router = express.Router()

router.route("/attractionsearch").post((req, res) => {
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(req.body.location)}&key=AIzaSyDhf9OqY8Z3uNub0hgRYttINkf1gXOGZH4`).then((resploc) => {
    axios.post("https://test.api.amadeus.com/v1/security/oauth2/token", "grant_type=client_credentials&client_id=Q4aEVTArfMixbGwELBlPoHgWPmy4PmTR&client_secret=cXMQ7qdUH24shfpA", {
      headers: {
        Content_Type: "application/x-www-form-urlencoded",
      },
    }).then((resp) => {
      const token = resp.data.access_token;

      if (req.body.filter === "Points of Interest") {
        axios.get(`https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=${resploc.data.results[0].geometry.location.lat}&longitude=${resploc.data.results[0].geometry.location.lng}&radius=20`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((respon) => {
          let uf = respon.data.data;
          for (let i = 0; i < uf.length; i++) {
            if (uf[i].name.toLowerCase().includes(req.body.query.toLowerCase())) {
              continue;
            }
            if (uf[i].category.toLowerCase().includes(req.body.query.toLowerCase())) {
              continue;
            }

            let curr = false;
            for (let j = 0; j < uf[i].tags.length; j++) {
              if (uf[i].tags[j].toLowerCase().includes(req.body.query.toLowerCase())) {
                curr = true;
                break;
              }
            }
            if (curr) {
              continue;
            }

            uf.splice(i, 1);
            i--;
          }
          const fr = {
            ta: [],
            poi: uf,
          };
          res.send(fr);
        }).catch((err) => {
          console.log(err);
          res.send(err);
        });
      }
      else {
        axios.get(`https://test.api.amadeus.com/v1/shopping/activities?latitude=${resploc.data.results[0].geometry.location.lat}&longitude=${resploc.data.results[0].geometry.location.lng}&radius=20`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((respo) => {
          let uft = respo.data.data;
          for (let i = 0; i < uft.length; i++) {
            if (uft[i].name.toLowerCase().includes(req.body.query.toLowerCase())) {
              continue;
            }
            if (uft[i].shortDescription.toLowerCase().includes(req.body.query.toLowerCase())) {
              continue;
            }

            uft.splice(i, 1);
            i--;
          }

          if (req.body.filter === "All") {
            axios.get(`https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=${resploc.data.results[0].geometry.location.lat}&longitude=${resploc.data.results[0].geometry.location.lng}&radius=20`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then((respon) => {
              let ufp = respon.data.data;
              for (let i = 0; i < ufp.length; i++) {
                if (ufp[i].name.toLowerCase().includes(req.body.query.toLowerCase())) {
                  continue;
                }
                if (ufp[i].category.toLowerCase().includes(req.body.query.toLowerCase())) {
                  continue;
                }

                let curr = false;
                for (let j = 0; j < ufp[i].tags.length; j++) {
                  if (ufp[i].tags[j].toLowerCase().includes(req.body.query.toLowerCase())) {
                    curr = true;
                    break;
                  }
                }
                if (curr) {
                  continue;
                }

                ufp.splice(i, 1);
                i--;
              }
              const fr = {
                ta: uft,
                poi: ufp,
              };
              res.send(fr);
            }).catch((err) => {
              console.log(err);
              res.send(err);
            });
          }
          else {
            const fr = {
              ta: uft,
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
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
});

router.route("/addtour").post((req, res) => {
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(req.body.geoCode.latitude + "," + req.body.geoCode.longitude)}&key=AIzaSyDhf9OqY8Z3uNub0hgRYttINkf1gXOGZH4`).then((resploc) => {
    db.query(`insert into TripFeatures(FeatureId, FeatureType, Price, Location, StartDateTime, EndDateTime, BookingURL, TripId) values("${req.body.id}", "Tour/Activity", ${req.body.price}, "${resploc.data.results[0].formatted_address}", 0, 0, "${req.body.bookingLink}", ${req.body.tripid});`, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        res.send(data);
      }
    });
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
});

router.route("/addpoi").post((req, res) => {
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(req.body.geoCode.latitude + "," + req.body.geoCode.longitude)}&key=AIzaSyDhf9OqY8Z3uNub0hgRYttINkf1gXOGZH4`).then((resploc) => {
    db.query(`insert into TripFeatures(FeatureId, FeatureType, Price, Location, StartDateTime, EndDateTime, BookingURL, TripId) values("${req.body.id}", "Point of Interest", 0, "${resploc.data.results[0].formatted_address}", 0, 0, NULL, ${req.body.tripid});`, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        res.send(data);
      }
    });
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
});

module.exports = router;
