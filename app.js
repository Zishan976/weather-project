const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/", (req, res) => {
  const city = req.body.city;
  const apiKey = process.env.Weather_api_key;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  https
    .get(url, (apiResponse) => {
      let data = "";
      apiResponse.on("data", (chunk) => {
        data += chunk;
      });
      apiResponse.on("end", () => {
        const weatherData = JSON.parse(data);
        if (apiResponse.statusCode === 200) {
          res.render("result", {
            location: weatherData.name,
            country: weatherData.sys.country,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
            temperature: weatherData.main.temp,
            condition: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
          });
        } else {
          res.send("<h1>Error: City not found. Please try again.</h1>");
        }
      });
    })
    .on("error", (err) => {
      res
        .status(500)
        .send(
          "<h1>Error: Could not fetch weather data. Please try again later.</h1>"
        );
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
