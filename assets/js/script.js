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

function getWeatherInfo(city) {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      ",US&appid=9a13e2c3a669281036969bd73512a30b"
  )
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("unable to connect");
      }
    })
    .then(function (data) {
      if (typeof data !== "undefined") {
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
            "https://api.openweathermap.org/data/2.5/uvi?lat=" +
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
              errorMessage(error);
            });
        })
        .catch(function (error) {
          errorMessage(error);
        });
    })
    .catch((error) => {
      errorMessage(error);
    });
}

//display error message if fetch process failed
function errorMessage(error) {
  cityNameE1.textContent = "";
  currentWeatherInfoE1.textContent = "";
  futureWeatherContainer.textContent = "";
  var errorText = document.createElement("div");
  errorText.className = "alert alert-danger mt-3";
  errorText.textContent =
    "unable to connect the server please check your input!!" + error;
  cityNameE1.appendChild(errorText);
  throw error;
}

//get userInput which is city name
function getUserCity(event) {
  event.preventDefault();
  var userCity = userInputE1.value.trim();
  userInputE1.value = "";
  if (userCity) {
    getWeatherInfo(userCity);
  } else {
    alert("please insert correct name");
  }
}

//append city name to the DOM
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
//check the city name in case if it exist in localstorage
function checkHistoryCity(city) {
  var flag = false;
  cityHistory.forEach((cityitem) => {
    if (cityitem.toUpperCase() === city.toUpperCase()) {
      flag = true;
    }
  });
  cityHistory.push(city);
  return flag;
}
//change data format inorder to save the localstorage
function ChangeDataFormat(data, UvIndex) {
  var weatherInfo = JSON.parse(localStorage.getItem("weather-info")) || [];
  var uniqeData = filterUniqueData(data);
  data.list = uniqeData;
  var weatherFutureInfo = {};
  var weather = [];
  var city = {};
  console.log(data.list[0].dt_txt);
  weatherFutureInfo.date = data.list[0].dt_txt;
  weatherFutureInfo.icon = data.list[0].weather[0].icon;
  weatherFutureInfo.temp = data.list[0].main.temp;
  weatherFutureInfo.humidity = data.list[0].main.humidity;
  weatherFutureInfo.speed = data.list[0].wind.speed;
  weatherFutureInfo.Uvindex = UvIndex.value;
  weather.push(weatherFutureInfo);

  for (var i = 1; i < data.list.length; i++) {
    var weatherFutureInfo = {};
    weatherFutureInfo.date = data.list[i].dt_txt;
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

    var dateExists = uniqueDate.indexOf(currentDate);
    if (dateExists < 0) {
      distinct.push(array[i]);
      uniqueDate.push(currentDate);
    }
  }

  return distinct;
}
//save weatherinfo to the localstorage
function saveWeatherInfo(weatherInfo) {
  localStorage.setItem("weather-info", JSON.stringify(weatherInfo));
}
//display current days weather status
function displayWeatherStatus(weatherInfo) {
  cityNameE1.textContent = "";
  currentWeatherInfoE1.textContent = "";
  futureWeatherContainer.textContent = "";

  var currentDate = weatherInfo.weather[0].date;

  currentDate = moment(currentDate).format("L");

  var weatherIcon = weatherInfo.weather[0].icon;
  var city = weatherInfo.name;

  var weatherIconI = document.createElement("img");
  weatherIconI.className = "fs-3 text";
  weatherIconI.src =
    "https://openweathermap.org/img/wn/" + weatherIcon + ".png";

  cityNameE1.innerHTML =
    "<span>" + city + " " + "&#40;" + currentDate + "&#41</span>";
  cityNameE1.append(weatherIconI);

  var currentDayWeather = {
    Temprature: weatherInfo.weather[0].temp,
    humidity: weatherInfo.weather[0].humidity,
    WindSpeed: weatherInfo.weather[0].speed,
    UvIndex: weatherInfo.weather[0].Uvindex,
  };

  var index = -1;
  for (var i in currentDayWeather) {
    index++;
    listCurrentWeaterE1 = document.createElement("li");

    listCurrentWeaterE1.className = "list-unstyled list-group-item border-0";
    listCurrentWeaterE1.innerHTML =
      i + ":" + "<span>" + currentDayWeather[i] + "</span>";

    if (index === 0) {
      var degreeF = document.createElement("span");
      degreeF.innerHTML = "<span>&#8457;</span>";
      listCurrentWeaterE1.appendChild(degreeF);
    }
    if (index === 3) {
      var uvIndex = Math.floor(currentDayWeather[i]);
      if (uvIndex >= 0 && uvIndex <= 2) {
        console.log(listCurrentWeaterE1.lastChild);
        listCurrentWeaterE1.lastChild.className = "green";
      } else if (uvIndex >= 3 && uvIndex <= 5) {
        listCurrentWeaterE1.lastChild.className = "yellow";
      } else if (uvIndex >= 6 && uvIndex <= 7) {
        listCurrentWeaterE1.lastChild.className = "orange";
      } else if (uvIndex >= 8 && uvIndex <= 10) {
        listCurrentWeaterE1.lastChild.className = "red";
      } else if (uvIndex >= 10) {
        listCurrentWeaterE1.lastChild.className = "pink";
      }
    }
    currentWeatherInfoE1.appendChild(listCurrentWeaterE1);
  }

  displayFutureWeather(weatherInfo);
}

//display 5 day weather status
function displayFutureWeather(weatherInfo) {
  for (var i = 1; i < weatherInfo.weather.length; i++) {
    var date = weatherInfo.weather[i].date;
    date = moment(date).format("L");
    var temp = weatherInfo.weather[i].temp;
    var humidity = weatherInfo.weather[i].humidity;

    var cardWrapper = document.createElement("div");
    cardWrapper.className = "col card-body";

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
//target the history city name by event deligation
function retriveWeatherInfo(event) {
  var getCityName = event.target.innerHTML;
  displayLocalData(getCityName);
}

//display datta from localstorage when we click the history list
function displayLocalData(cityName) {
  var weatherInfo = JSON.parse(localStorage.getItem("weather-info"));
  for (var i = 0; i < weatherInfo.length; i++) {
    if (weatherInfo[i].name.toUpperCase() == cityName.toUpperCase()) {
      displayWeatherStatus(weatherInfo[i]);
    }
  }
}
//event listners for the history and form
searchHistory.addEventListener("click", retriveWeatherInfo);
userFormE1.addEventListener("submit", getUserCity);
