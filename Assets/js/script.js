var apiUrl = 'https://api.openweathermap.org';
var apiKey = "f2632b476b7c8f2b74d12f66078b6b96";

var searcHistory = [];
var searchedCity = "";
var selectedCity = "Atlanta"

var Urlquery = "http://api.openweathermap.org/data/2.5/weather?q" + selectedCity + "&appid=" +  apiKey;
var WeatherAPI = "'https://api.openweathermap.org";

var weatherCard = document.createElement("div");
var weatherBody = document.createElement("div");
var weatherHeader = document.createElement("h3");

var Theinput = document.getElementById("the-input");
var searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", getCityLatLon);

var storedSearchhistory = localStorage.getItem('search-history');
if ('search-history'){
    search-history = JSON.parse('search-history');
}
createHistoryButtons();

function getWeather(cityCoordinates){
    var weatherDataCall = apiRootUrl + "/data/2.5/onecall?lat=" + cityCoordinates.lat + "&lon=" + cityCoordinates.lon + "&exclude=hourly,minutely,alerts&appid=" +apiKey;
    fetch(weatherDataCall)
    .then(function(reponse){
        return reponse.json();
     })
     .then(function(data){
         if (!data.status ===200){
             console.error("Invalid data returned!");
         } else {
             populateWeather(data);
         }
     })
     .catch(function(err){
         console.error(err);
     });

    }
    func