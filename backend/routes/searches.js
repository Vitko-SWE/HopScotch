const express = require('express')
const db = require('../db');
let router = express.Router()

router.route("/attractionsearch/:query").get((req, res) => {
  console.log(`Query: "${req.params.query}"`);
});

module.exports = router;
