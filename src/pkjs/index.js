var Clay = require('./clay');
var clayConfig = require('./config');
var clay = new Clay(clayConfig, null, { autoHandleEvents: false });

Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (e && !e.response) {
    return;
  }

  // Return settings from Config Page to watch
  var settings = clay.getSettings(e.response, false);

  // Flatten to match localStorage version
  var settingsFlat = {};
  Object.keys(settings).forEach(function(key) {
    if (typeof settings[key] === 'object' && settings[key]) {
      settingsFlat[key] = settings[key].value;
    } else {
      settingsFlat[key] = settings[key];
    }
  });
  Pebble.postMessage(settingsFlat);
});

function request(url, type, callback){
  var xhr = new XMLHttpRequest();
  xhr.onload = function(){
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
}

Pebble.on('message', function(event) {
  // Get the message that was passed
  var message = event.data;
  if (message.fetch) {        
    navigator.geolocation.getCurrentPosition(function(pos) {
      var url = 'http://api.openweathermap.org/data/2.5/weather' +
              '?lat=' + pos.coords.latitude +
              '&lon=' + pos.coords.longitude +
              '&appid=' + message.apikey;

      request(url, 'GET', function(respText) {
        var weatherData = JSON.parse(respText);
        Pebble.postMessage({
            'weather': {
              // Convert from Kelvin
              'celcius': Math.round(weatherData.main.temp - 273.15),
              'fahrenheit': Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32),
              'desc': weatherData.weather[0].main
            }
          });
      });
    }, function(err) {
      console.error('Error getting location');
    },
    { timeout: 15000, maximumAge: 60000 });
  }
  
   if (event.data.command === 'settings') {
     //console.log("checking settings");
     restoreSettings();
  }
});

function restoreSettings() {
  // Restore settings from localStorage and send to watch
  var settings = JSON.parse(localStorage.getItem('clay-settings'));
  if (settings) {
    Pebble.postMessage(settings);
  }
}