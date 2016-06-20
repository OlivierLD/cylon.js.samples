/*
 * Basic LED program.
 */
var Cylon = require("cylon");

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
    mcp3008: { driver: 'mcp3008', pins: { miso: 16, mosi: 18, clock: 12, chipselect: 22 } }
  },

  work: function(dev) {
    dev.mcp3008.init();
    every((1).second(), function () {
      var value = dev.mcp3008.read(function () {
//      console.log("Toggle completed ");
      });
      console.log("Value:" + value);
    });
  }
}).start();
