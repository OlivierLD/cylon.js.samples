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

var BASE_URL = "https://io.adafruit.com/api/feeds/";
var SUFFIX = "/data";

var postURL = BASE_URL + TEMP_FEED + SUFFIX;

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
     bmp180: { driver: 'bmp180' }
  },

  work: function(dev) {
    every((10).second(), function () {

      dev.bmp180.getPressure(1, function(err, val) {
        if (err) {
          console.log("BMP180.getPressure:" , err);
          return;
        }
        console.log("getPressure call:");
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
    });
  }
}).start();
