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
//save weatherinfo to the localstorage
function saveWeatherInfo(weatherInfo) {
  console.log(weatherInfo);
  localStorage.setItem("weather-info", JSON.stringify(weatherInfo));
}
function displayWeatherStatus(weatherInfo) {
  console.log(weatherInfo);
  cityNameE1.textContent = "";
  currentWeatherInfoE1.textContent = "";
  futureWeatherContainer.textContent = "";
  console.log(weatherInfo);
  var currentDate = weatherInfo.weather[0].date;

  currentDate = moment(currentDate).format("L");

  var weatherIcon = weatherInfo.weather[0].icon;
  var city = weatherInfo.name;

  console.log(city);

  var weatherIconI = document.createElement("img");
  weatherIconI.className = "fs-3 text";
  weatherIconI.src = "http://openweathermap.org/img/wn/" + weatherIcon + ".png";
  // document.append(weatherIconI);

  cityNameE1.innerHTML =
    "<span>" + city + " " + "&#40;" + currentDate + "&#41</span>";
  cityNameE1.append(weatherIconI);
  // tempSpanE1 = document.createElement("span");
  // tempSpanE1.innerHTML = "<span>" + temp + "&#8457;" + "</span>";
  var currentDayWeather = {
    Temprature: weatherInfo.weather[0].temp,
    humidity: weatherInfo.weather[0].humidity,
    WindSpeed: weatherInfo.weather[0].speed,
    UvIndex: weatherInfo.weather[0].Uvindex,
  };

  // weatherInfo[0].push(city);
  // weatherInfo.city.push(currentDayWeather);
  var index = -1;
  for (var i in currentDayWeather) {
    index++;
    listCurrentWeaterE1 = document.createElement("li");

    listCurrentWeaterE1.className = "list-unstyled list-group-item border-0";
    listCurrentWeaterE1.innerHTML =
      i + ":" + "<span>" + currentDayWeather[i] + "</span>";

    // index++;
    console.log(currentDayWeather[i]);
    if (index === 0) {
      var degreeF = document.createElement("span");
      degreeF.innerHTML = "<span>&#8457;</span>";
      listCurrentWeaterE1.appendChild(degreeF);
    }
    if (index === 3) {
      var uvIndex = Math.floor(currentDayWeather[i]);

      if (uvIndex >= 0 && uvIndex <= 2) {
        listCurrentWeaterE1.className = "green";
      } else if (uvIndex >= 3 && uvIndex <= 5) {
        listCurrentWeaterE1.className = "yellow";
      } else if (uvIndex >= 6 && uvIndex <= 7) {
        listCurrentWeaterE1.className = "orange";
      } else if (uvIndex >= 8 && uvIndex <= 10) {
        listCurrentWeaterE1.className = "red";
      } else if (uvIndex >= 10) {
        listCurrentWeaterE1.className = "pink";
      }
    }
    currentWeatherInfoE1.appendChild(listCurrentWeaterE1);
  }

  displayFutureWeather(weatherInfo);
}
// weatherInfo.forEach((item) => {
//   for (const property in item) {
//     console.log(item[property]);
//   }
// });

//display 5 day weather status
function displayFutureWeather(weatherInfo) {
  for (var i = 1; i < 6; i++) {
    // var UvIndex
    var date = weatherInfo.weather[i].date;
    date = moment(date).format("L");
    // var sunnyEmoji=data[i]
    var temp = weatherInfo.weather[i].temp;
    var humidity = weatherInfo.weather[i].humidity;
    // var futureForcast = { date: date, temp: temp, humidity: humidity };
    // var listE1 = document.createElement("div");
    // listE1.className = "card";

    var cardWrapper = document.createElement("div");

    cardWrapper.className = "col card-body";
    // var cardBody = document.createElement("div");
    // cardBody.className = "";

    var headerE1 = document.createElement("h4");
    headerE1.className = "";
    headerE1.textContent = date;

    var unorderedListE2 = document.createElement("p");
    unorderedListE2.className = "list-unstyled";
    unorderedListE2.textContent = temp;

    var listIcon = document.createElement("p");

    if (temp >= 65) {
      listIcon.className = "ion-ios7-sunny list-unstyled";
    } else if (Math.floor(temp) >= 45 && Math.floor(temp) < 65) {
      listIcon.className = "ion-ios7-partlysunny  list-unstyled";
    } else if (Math.floor(temp) >= 25 && Math.floor(temp) <= 35) {
      listIcon.className = "cloudy list-unstyled";
    } else if (Math.floor(temp) < 25) {
      listIcon.className = "ion-ios7-rainy   list-unstyled";
    }

    // <i class="ion-ios7-sunny"></i>
    // <i class="ion-ios7-partlysunny"></i>
    // <i class="ion-ios7-rainy"></i>

    var degreeF = document.createElement("span");
    degreeF.innerHTML = "<span>&#8457;</span>";
    unorderedListE2.appendChild(degreeF);

    var listaE1 = document.createElement("li");
    listaE1.textContent = humidity;
    listaE1.className = "card-text list-unstyled";
    cardWrapper.appendChild(headerE1);
    cardWrapper.appendChild(unorderedListE2);
    cardWrapper.appendChild(listIcon);
    cardWrapper.appendChild(listaE1);

    futureWeatherContainer.appendChild(cardWrapper);
  }
}
