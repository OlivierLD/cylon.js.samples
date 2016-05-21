/**
 * See https://cylonjs.com/documentation/drivers/bmp180/ for wiring
 */
var Cylon = require('cylon');

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
    bmp180: { driver: 'bmp180' }
  },

  work: function(my) {
    my.bmp180.getTemperature(function(err, val) {
      if (err) {
        console.log(err);
        return;
      }

      console.log("getTemperature call:");
      console.log("\tTemp: " + val.temp + " C");
    });

    after((1).second(), function() {
      my.bmp180.getPressure(1, function(err, val) {
        if (err) {
          console.log(err);
          return;
        }

        console.log("getPressure call:");
        console.log("\tTemperature: " + val.temp + " C");
        console.log("\tPressure: " + (val.press / 100).toFixed(2) + " hPa");
      });
    });

    after((2).seconds(), function() {
      my.bmp180.getAltitude(1, null, function(err, val) {
        if (err) {
          console.log(err);
          return;
        }

        console.log("getAltitude call:");
        console.log("\tTemperature: " + val.temp + " C");
        console.log("\tPressure: " + (val.press / 100).toFixed(2) + " hPa");
        console.log("\tAltitude: " + (val.alt).toFixed(2) + " m");
      });
    });
  }
}).start();
