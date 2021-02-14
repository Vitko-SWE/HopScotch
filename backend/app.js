const express = require("express");
const db = require('./db.js');
// const { auth, requiresAuth } = require('express-openid-connect');
// require('dotenv').config();

// const config = {
//     authRequired: false,
//     auth0Logout: true,
//     secret: process.env.AUTH0_SECRET,
//     clientID: process.env.AUTH0_CLIENT_ID,
//     issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
// };

const app = express();

app.use(express.urlencoded());
app.use(express.json());

if (process.env.NODE_ENV == "production") {
    const publicPath = path.join(__dirname, './frontend');
    app.use(express.static(publicPath));
    app.use('*', express.static(publicPath));
}

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there\
// if (!config.baseURL && !process.env.BASE_URL && process.env.NODE_ENV !== 'production') {
//     config.baseURL = `http://localhost:5000`;
// } else {
//     //TODO: implement production case for Auth0 base url
// }

// // auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config));

// // req.isAuthenticated is provided from the auth router
// app.get('/', (req, res) => {
//     res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

// app.get('/profile', requiresAuth(), (req, res) => {
//     res.send(JSON.stringify(req.oidc.user));
// });

app.listen(port, () => console.log(`Server up and running on port ${port} !`));