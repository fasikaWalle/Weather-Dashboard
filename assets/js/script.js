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

//append city name
function appendCityName(city) {
  var cityListed = checkHistoryCity(city);
  if (cityListed) {
    return;
  }
  var listHistoryE1 = document.createElement("li");
  listHistoryE1.className = "list-group-item";
  listHistoryE1.textContent = city;
  searchHistory.append(listHistoryE1);
}
function ChangeDataFormat(data, UvIndex) {
  var weatherInfo = JSON.parse(localStorage.getItem("weather-info")) || [];
  // var weatherInfo = [];
  console.log(data);
  var uniqeData = filterUniqueData(data);
  data.list = uniqeData;
  var weatherFutureInfo = {};
  var weather = [];
  var city = {};
  console.log(data);
  weatherFutureInfo.date = data.list[0].dt_txt;
  weatherFutureInfo.icon = data.list[0].weather[0].icon;
  weatherFutureInfo.temp = data.list[0].main.temp;
  weatherFutureInfo.humidity = data.list[0].main.humidity;
  weatherFutureInfo.speed = data.list[0].wind.speed;
  weatherFutureInfo.Uvindex = UvIndex.value;
  weather.push(weatherFutureInfo);
  console.log(data);

  for (var i = 1; i < 6; i++) {
    var weatherFutureInfo = {};
    weatherFutureInfo.date = data.list[i].dt_txt;
    console.log(weatherFutureInfo.date);
    weatherFutureInfo.temp = data.list[i].main.temp;
    weatherFutureInfo.humidity = data.list[i].main.humidity;
    weather.push(weatherFutureInfo);
  }
  city.name = data.city.name;
  city.weather = weather;
  // weatherInfo.push(city);
  var flag = 0;
  for (var i = 0; i < weatherInfo.length; i++) {
    if (weatherInfo[i].name == city.name) {
      flag = 1;
      break;
    }
  }
  if (flag == 0) {
    weatherInfo.push(city);
    saveWeatherInfo(weatherInfo);
  }

  displayWeatherStatus(city);
}
//filter the data by its date inorder to avoid similar dates
function filterUniqueData(data) {
  var array = data.list;
  var uniqueDate = [];
  var distinct = [];
  for (let i = 0; i < array.length; i++) {
    var currentDate = array[i].dt_txt;
    currentDate = moment(currentDate).format("L");
    // 2021 - 01 - 18;
    console.log(currentDate);
    var dateExists = uniqueDate.indexOf(currentDate);
    if (dateExists < 0) {
      distinct.push(array[i]);
      uniqueDate.push(currentDate);
    }
  }
  console.log(distinct);
  return distinct;
}
