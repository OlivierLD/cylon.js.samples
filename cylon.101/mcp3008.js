/*
 * Basic LED program.
 */
var Cylon = require("cylon");

var CH0 = 0, CH1 = 1, CH2 = 2, CH3 = 3, CH4 = 4, CH5 = 5, CH6 = 6, CH7 = 7;

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
    mcp3008: { driver: 'mcp3008', pins: { 
		                            miso: 16, 
		                            mosi: 18, 
		                            clock: 12, 
		                            chipselect: 22, 
		                            verbose: true } }
  },

  work: function(dev) {
    dev.mcp3008.init();
    every((1).second(), function () {
      var value = dev.mcp3008.read(CH0, function () {
//      console.log("Read completed ");
      });
      console.log("Value:" + value);
    });
  }
}).start();
