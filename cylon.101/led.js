/*
 * Basic LED program.
 */
var Cylon = require("cylon");

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
    led: { driver: 'led', pin: 11 }
  },

  work: function(dev) {
    every((1).second(), function () {
      dev.led.toggle(function () {
//      console.log("Toggle completed ");
      });
      dev.led.isOn(function(err, value) {
        if (err !== null) {
          console.log("err: ", err);
        }
        console.log("Led is ", (value ? "on" : "off"));
      });
    });
  }
}).start();
