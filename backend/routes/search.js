const express = require('express')
const db = require('../db');
let router = express.Router()
const axios = require('axios')
const yelp = require('yelp-fusion');
const { response } = require('express');
require('dotenv').config()
const client = yelp.client(process.env.YELP_SECRET);

var Amadeus = require('amadeus');
var amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

router.route("/searchDining").get((req, resp) => {
    client.search({
        term: req.headers.string,
        location: req.headers.city,
      }).then(response => {
        console.log(response.jsonBody.businesses);
        resp.send(response.jsonBody.businesses)
      }).catch(e => {
        console.log(e);
        resp.send([])
      });
})

router.route("/selectDining").post((req, resp) => {
  console.log(req.body.TripId)
    var query_string = `INSERT INTO TripFeatures VALUES ("${req.body.FeatureId}", "${req.body.FeatureType}", 0, "", "${req.body.StartDateTime}", "${req.body.EndDateTime}", null, ${req.body.TripId}, null, null, false)`;
    console.log("posting new dining feature")
    db.query(query_string, (err, data) => {
        if (err) {
            console.log(err)
            return err;
        }

        console.log(data)
        resp.send(data);
    })
})

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
    db.query(`insert into TripFeatures(FeatureId, FeatureType, Price, Location, StartDateTime, EndDateTime, BookingURL, TripId, FeatureName, PictureURL, Confirmed) values("${req.body.id}", "Tour/Activity", ${req.body.price}, "${resploc.data.results[0].formatted_address}", 0, 0, "${req.body.bookingLink}", ${req.body.tripid}, "${req.body.name}", "${req.body.picURL}", false);`, (err, data) => {
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
    db.query(`insert into TripFeatures(FeatureId, FeatureType, Price, Location, StartDateTime, EndDateTime, BookingURL, TripId, FeatureName) values("${req.body.id}", "Point of Interest", 0, "${resploc.data.results[0].formatted_address}", 0, 0, NULL, ${req.body.tripid}, "${req.body.name}");`, (err, data) => {
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

router.route("/selectFlight").post(async (req, res) => {
    console.log(req.body)
    const FlightData = req.body.FlightData;
    const TripId = req.body.TripId;
    const Price = req.body.Price;
    const Airline = req.body.Airline;
    const Origin = req.body.Origin;
    const Destination = req.body.Destination;
    const User = req.body.User

    if(FlightData == null || TripId == null || Price == null
        || Airline == null || Origin == null || Destination == null) {
        console.log("Invalid parameters.")
        res.status(400).send("Invalid parameters.")
        return;
    }

    const query_string = `INSERT INTO Flight(TripID, Price, Airline, Origin, Destination, FlightData, User) VALUES (${TripId}, ${Price}, "${Airline}", "${Origin}", "${Destination}", "${FlightData}", "${User}")`;
    db.query(query_string, (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

module.exports = router
