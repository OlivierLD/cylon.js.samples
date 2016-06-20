/*
 * Requires cylon-gpio
 * $> npm install cylon-gpio
 *
 * See https://cylonjs.com/documentation/drivers/direct-pin/
 */
var Cylon = require('cylon');

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
    pin: { driver: 'direct-pin', pin: 13 }
  },

  work: function(my) {
    var value = 0;
    every((1).second(), function() {
      my.pin.digitalWrite(value);
      value = (value == 0) ? 1 : 0;
    });
  }
}).start();
