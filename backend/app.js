const express = require("express");
const db = require('./db.js');



const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(express.query())

if (process.env.NODE_ENV == "production") {
    const publicPath = path.join(__dirname, './frontend');
    app.use(express.static(publicPath));
    app.use('*', express.static(publicPath));
}

app.get('/hopscotch', (req, res) => {

    db.execute('SELECT * FROM Trip WHERE TripID=1', (err,rows) => {
        if(err) throw err;
      
        console.log('Data received from Db:');
        console.log(rows);
        res.send(rows)
      });
})

// getTripByID()

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));


