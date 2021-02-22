const express = require("express");
const db = require('./db.js');
const userService = require('./routes/users');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
require('dotenv').config()

const app = express();

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
});

app.use(jwtCheck);

app.use(express.urlencoded());
app.use(express.json());

app.use("/user", userService);

if (process.env.NODE_ENV == "production") {
    const publicPath = path.join(__dirname, './frontend');
    app.use(express.static(publicPath));
    app.use('*', express.static(publicPath));
}

app.get('/authorized', (req, res) => {
    res.send('Secured Resource');
})

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
