// Args from the command line
if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " <your Adafruit-IO key>");
  process.exit(-1);
}
var AIOKey = process.argv[2];
console.log('AIO Key: ' + AIOKey);

// Initialize REST post client
var Client = require('node-rest-client').Client;

var client = new Client();

var TEMP_FEED  = "air-temperature";
var PRESS_FEED = "atm-press";
var HUM_FEED   = "humidity";

var BASE_URL = "https://io.adafruit.com/api/feeds/";
var SUFFIX = "/data";

var postURL = BASE_URL + TEMP_FEED + SUFFIX;

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
     bme280: { driver: 'bme280' }
  },

  work: function(dev) {
    every((10).second(), function () {

      dev.bme280.readPressure(function(err, val) {
        if (err) {
          console.log("bme280.readPressure:" , err);
          return;
        }
        console.log("readPressure call:");
        console.log("\tTemperature: " + val.temp + " C");
        console.log("\tPressure: " + (val.press / 100).toFixed(2) + " hPa");
        // Send data
        postURL = BASE_URL + TEMP_FEED + SUFFIX;
        var args = {
          data: { "value": val.temp.toFixed(2) },
          headers: { "X-AIO-Key": AIOKey,
                     "Content-Type": "application/json" }
        };
        try {
          client.post(postURL, args, function (data, response) {
            // parsed response body as js object
      //    console.log(data);
            // raw response
      //    console.log(response);
          });
        } catch (err) {
          console.err(err);
        }

        postURL = BASE_URL + PRESS_FEED + SUFFIX;
        args = {
          data: { "value": (val.press / 100).toFixed(2) },
          headers: { "X-AIO-Key": AIOKey,
                     "Content-Type": "application/json" }
        };
        try {
          client.post(postURL, args, function (data, response) {
          // parsed response body as js object
      //     console.log(data);
             // raw response
      //     console.log(response);
          });
        } catch (err) {
          console.err(err);
        }
        // POST completed
      });

      after((1).second(), function() {
          dev.bme280.readHumidity(function(err, val) {
            if (err) {
              console.log("bme280.readHumidity:" , err);
              return;
            }
            console.log("readHumidity call:");
            console.log("\tHumidity: " + val.hum.toFixed(2) + " %");
            // Send data
            postURL = BASE_URL + HUM_FEED + SUFFIX;
            var args = {
              data: { "value": val.hum.toFixed(2) },
              headers: { "X-AIO-Key": AIOKey,
                         "Content-Type": "application/json" }
            };
            try {
              client.post(postURL, args, function (data, response) {
                // parsed response body as js object
          //    console.log(data);
                // raw response
          //    console.log(response);
              });
            } catch (err) {
              console.err(err);
            }
            // POST completed
          });
      });
    });
  }
}).start();
