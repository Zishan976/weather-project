const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require('dotenv').config();
console.log(`Weather_api_key: ${process.env.Weather_api_key}`);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/index.html");


});

app.post("/", (req, res) => {

    const query = req.body.city;
    const capQuery = query.slice(0, 1).toUpperCase() + query.slice(1, query.length).toLowerCase();
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&units=metric&appid=${process.env.Weather_api_key}&q=` + capQuery;

    https.get(url, (response) => {
        if (response.statusCode === 200) {

            response.on("data", (data) => {
                const weatherdata = JSON.parse(data);
                const location = weatherdata.name;
                const temp = weatherdata.main.temp;
                const condition = weatherdata.weather[0].description;
                const icon = weatherdata.weather[0].icon;
                const img = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
                res.write("<h1>The temperature in " + location + " is " + temp + " deg C.</h1>");
                res.write("<h3>Current weather is " + condition + ".</h3>");
                res.write("<img src=" + img + " alt='weather img'>")

                res.send();
            })
        } else {

            res.status(401).send("Did not find any weather data");
        };
    })


})





const port = process.env.port || 3000

app.listen(3000, () => {
    console.log(`sarver is running on port ${port}.`);

});