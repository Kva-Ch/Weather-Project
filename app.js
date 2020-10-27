const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {

  res.render("index.ejs");

});

app.post("/weather", function(req, res) {

  // console.log(req.body);
  const query = req.body.cityName;
  const apiKey = "c2853c7d21168bd2ac2050040edf025e";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  https.get(url, function(response) {
    const statusCode = response.statusCode;
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      if(statusCode!=404){
        console.log(weatherData);
        const temp = weatherData.main.temp;
        const feelsLike = weatherData.main.feels_like;
        const description = weatherData.weather[0].description;
        const visibility = weatherData.visibility / 1000;
        const pressure = weatherData.main.pressure;
        const humidity = weatherData.main.humidity;

        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.render("weather", {
          weatherDescription: description,
          query: query,
          temperature: temp,
          feelsLike: feelsLike,
          visibility: visibility,
          pressure: pressure,
          humidity: humidity,
          imgURL: imageURL
        });
        // res.write("<p>The weather is currently " + description + ".</p>");
        // res.write("<h1>The temperature in "+ query +"is " + temp + " degree Celcius.</h1>");
        // res.write("<img src=" + imageURL + " >");
        // res.send();
      } else{
        console.log(statusCode);
        res.render("pagenotfound");
      }

    });

  });

});

let port = process.env.PORT;
if(port == null || port ==""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server is runnning on port 3000");
});
