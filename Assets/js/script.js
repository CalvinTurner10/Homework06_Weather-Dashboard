
var apiUrl = 'https://api.openweathermap.org';
var apiKey = "f2632b476b7c8f2b74d12f66078b6b96";
var apiImage = "/img/w/";


var searchHistory = [];
var searchedCity = "";
var selectedCity = "Atlanta"

var Urlquery = "http://api.openweathermap.org/data/2.5/weather?q" + selectedCity + "&appid=" + apiKey;
var requestURLAtlantaGa = "https://api.openweathermap.org/data/2.5/onecall?lat=33.75&lon=84.38&exclude=hourly,minutely,alerts&appid=f2632b476b7c8f2b74d12f66078b6b96";
var WeatherAPI = "'https://api.openweathermap.org";

var weatherBox = document.createElement("div");
var weatherBody = document.createElement("div");
var weatherHeader = document.createElement("h3");

var Theinput = document.getElementById("the-input");
var searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", getCityLatLon);

var storedsearchHistory = localStorage.getItem('search-history');
if (storedsearchHistory) {
    searchHistory = JSON.parse(storedsearchHistory);
}
createHistoryButtons();

function getWeather(cityCoordinates) {
    var weatherDataCall = apiUrl + "/data/2.5/onecall?lat=" + cityCoordinates.lat + "&lon=" + cityCoordinates.lon + "&exclude=hourly,minutely,alerts&appid=" + apiKey;
    fetch(weatherDataCall)
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (data) {
            if (!data.status === 200) {
                console.error("Invalid data returned!");
            } else {
                populateWeather(data);
            }
        })
        .catch(function (err) {
            console.error(err);
        });

}
function getCityLatLon() {
    searchedCity = Theinput.value;
    if (!searchHistory.includes(searchedCity)) {
        searchHistory.push(searchedCity);
        localStorage.setItem('search-history', JSON.stringify(searchHistory));
        createHistoryButtons();


    }
    var geoAPICall = apiUrl + "/geo/1.0/direct?q=" + searchedCity + "&limit=5&appid=" + apiKey;
    fetch(geoAPICall)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data[0]) {
                console.error("Invalid data returned!")
            } else {
                getWeather(data[0]);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}
function populateWeather(weatherData) {
    populateTodayWeather(weatherData.current);
    populateForecast(weatherData.daily);
}

function populateTodayWeather(currentWeather) {
    var icon = currentWeather.weather[0].icon;

    var cityNameDiv = document.getElementById("name");
    var dateDiv = document.getElementById("date");
    var conditionsImg = document.getElementById("conditons");
    var temperatureDiv = document.getElementById("temp");
    var humidiyDiv = document.getElementById("humdity");
    var windSpeedDiv = document.getElementById("windspeed");
    var uvIndexDiv = document.getElementById("uvIndex");

    cityNameDiv.textContent = searchedCity;
    dateDiv.textContent = getDate(currentWeather.dt);
    temperatureDiv.textContent = "Temperature: " + convertTemp(currentWeather.temp) + "\u00B0F";
    conditionsImg.setAttribute("src", getIcon(icon));
    humidiyDiv.textContent = "Humidity: " + currentWeather.humidity + "%";
    windSpeedDiv.textContent = "Wind Speed" + currentWeather.wind_speed + "mph";
    uvIndexDiv.textContent = "UV index: " + currentWeather.uvi;
}

function populateForecast(dailyWeather) {
    console.log(dailyWeather);
    var cards = document.getElementsByClassName("card");
    for (var i = 0; i < cards.length; i++) {
        var cardHead = cards[i].getElementsByClassName("card-header");
        cardHead[0].textContent = getDate(dailyWeather[i + 1].dt);

        var cardText = cards[i].getElementsByClassName("card-text");
        var iconUrl = getIcon(dailyWeather[i + 1].weather[0].icon);
        cardText[0].setAttribute('src', iconUrl);
        cardText[1].textContent = "Temp: " + convertTemp(dailyWeather[i + 1].temp.day) + "\u00B0F";
        cardText[2].textContent = "Wind: " + dailyWeather[i + 1].wind_speed + "mph";
        cardText[3].textContent = "Humidity: " + dailyWeather[i + 1].humidity + "%";


    }
}


function getIcon(iconId) {
    return apiUrl + apiImage + iconId + ".png";

}
function convertTemp(tempKelvin) {
    return Math.trunc((tempKelvin - 273.15) * 9 / 5 + 32);
}
function getDate(timestamp) {
    return moment.unix(timestamp).format('l')
}
function createHistoryButtons() {
    var theSearchButtons = document.getElementById("search-history");
    theSearchButtons.innerHTML = '';
    for (var i = 0; i < searchHistory.length; i++) {
        var historyButton = document.createElement("button");
        historyButton.textContent = searchHistory[i];
        historyButton.addEventListener("click", userSearchButtonWeather);
        theSearchButtons.append(historyButton);
    }
}
function userSearchButtonWeather(e) {
    e.preventDefault();
    Theinput.value = this.textContent;
    getCityLatLon();
}
