const express = require('express')
// const db = require('../db');
let router = express.Router()

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
        //TODO: Call API
        
    }
})

module.exports = router;