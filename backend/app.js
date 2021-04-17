const express = require("express");
const db = require('./db');
const myTrips = require("./routes/homepage");
const userService = require('./routes/users');
const tripsService = require('./routes/trips');
const searchService = require('./routes/search')
const searchHotelService = require('./routes/searchHotel')
const featureService = require("./routes/features");
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
// const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

require('dotenv').config()

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors())

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://flyhopscotch-dev.us.auth0.com/.well-known/jwks.json'
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: process.env.AUTH0_ISSUER,
    algorithms: ['RS256']
}).unless({path: [
    /^(?!\/api).*$/
]});

app.use(jwtCheck);

// app.use(express.urlencoded());
// app.use(express.json());
// app.use(cors())


app.use("/api/homepage", myTrips)
app.use("/api/user", userService);
app.use("/api/trips", tripsService);
app.use("/static/airlinelogos", express.static("./airlineLogos"))
app.use("/api/search", searchService);
app.use("/api/hotel", searchHotelService);
app.use("/api/features", featureService);

if (process.env.NODE_ENV == "production") {
    const publicPath = path.join(__dirname, './frontend');
    app.use(express.static(publicPath));
    app.use('*', express.static(publicPath));
}


app.get('/api/authorized', (req, res) => {
    res.send('Secured Resource');
})

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
