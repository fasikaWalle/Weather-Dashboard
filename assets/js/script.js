var userInputE1 = document.querySelector("#city-name");
var userFormE1 = document.querySelector("#user-city");
var cityNameE1 = document.querySelector("#city-name-container");
var currentWeatherInfoE1 = document.querySelector("#current-weather-info");
var currentWeatherContainerE1 = document.querySelector(
  "#current-Weather-Container"
);
var futureWeatherContainer = document.querySelector("#future-weather");
var searchHistory = document.querySelector("#search-history");
var cityHistory = [];
//fetch the weather from open weather API
var getWeatherInfo = function (city) {
  fetch(
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      ",US&appid=9a13e2c3a669281036969bd73512a30b"
  )
    .then(function (response) {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("unable to connect");
      }
    })
    .then(function (data) {
      if (typeof data !== "undefined") {
        console.log(data);
        var weatherData = data;
      }

      fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          city +
          "&key=AIzaSyBa-FnbmtIaZwuxcv1y8P9ukGSSFW6o1ag"
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("unable to connect");
          }
        })
        .then((data) => {
          //data.json();
          var cityLongtiude = data.results[0].geometry.location.lng;
          var cityLatitude = data.results[0].geometry.location.lat;

          fetch(
            "http://api.openweathermap.org/data/2.5/uvi?lat=" +
              cityLatitude +
              "&lon=" +
              cityLongtiude +
              "&appid=9a13e2c3a669281036969bd73512a30b"
          )
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error("unable to connect");
              }
            })
            .then((data) => {
              appendCityName(city);
              ChangeDataFormat(weatherData, data);
              // displayWeatherStatus(weatherData, data);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log("unable to connect the server" + error);
    });
};

var getUserCity = function (event) {
  event.preventDefault();
  var userCity = userInputE1.value.trim();
  userInputE1.value = "";
  if (userCity) {
    getWeatherInfo(userCity);
  } else {
    alert("please insert correct name");
  }
};
