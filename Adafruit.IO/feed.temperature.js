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

var FEED = "air-temperature";
var BASE_URL = "https://io.adafruit.com/api/feeds/";
var SUFFIX = "/data";

var postURL = BASE_URL + FEED + SUFFIX;

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
      dev.bmp180.getTemperature(function(err, val) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("getTemperature call:");
        console.log("\tTemp: " + val.temp + " C");
        // Send data
        var args = {
          data: { "value": val.temp.toFixed(2) },
          headers: { "X-AIO-Key": AIOKey,
                     "Content-Type": "application/json" }
        };
        client.post(postURL, args, function (data, response) {
          // parsed response body as js object
          console.log(data);
          // raw response
      //  console.log(response);
        });
        // POST completed
      });
    });
  }
}).start();
