const express = require("express");
const db = require("./db")
const myTrips = require("./routes/homepage")
const cors = require("cors")

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors())

app.use("/homepage", myTrips)

if (process.env.NODE_ENV == "production") {
    const publicPath = path.join(__dirname, './frontend');
    app.use(express.static(publicPath));
    app.use('*', express.static(publicPath));
}

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
