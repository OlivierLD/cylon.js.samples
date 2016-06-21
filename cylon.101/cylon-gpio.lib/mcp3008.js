/*
 * MCP3008 driver
*/

"use strict";

var Cylon = require("cylon");

/**
 * A MCP3008 driver
 *
 * @constructor mcp3008
 *
 * @param {Object} opts options object
 * pins: {
 *   miso: 16.
 *   mosi: 18,
 *   clock: 12,
 *   chipselect: 22,
 *   verbose: true|false (optional)
 * }
 */
var MCP3008 = module.exports = function MCP3008(opts) {
  MCP3008.__super__.constructor.apply(this, arguments);

  this.miso       = opts.pins.miso || null;
  this.mosi       = opts.pins.mosi || null;
  this.clock      = opts.pins.clock || null;
  this.chipSelect = opts.pins.chipselect || null;

  this.verbose = opts.pins.verbose;
  if (this.verbose === undefined) {
    this.verbose = false;
  }
  
  if (this.miso == null) {
    throw new Error("No MISO pin specified for MCP3008. Cannot proceed");
  }
  if (this.mosi == null) {
    throw new Error("No MOSI pin specified for MCP3008. Cannot proceed");
  }
  if (this.clock == null) {
    throw new Error("No CLOCK pin specified for MCP3008. Cannot proceed");
  }
  if (this.chipSelect == null) {
    throw new Error("No CHIP SELECT pin specified for MCP3008. Cannot proceed");
  }

  this.commands = {
    init: this.init,
    read: this.read
  };
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(MCP3008, Cylon.Driver);

/**
 * Starts the MCP3008
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
MCP3008.prototype.start = function(callback) {
  callback();
};

/**
 * Stops the MCP3008
 *
 * @param {Function} callback to be triggered when halted
 * @return {void}
 */
MCP3008.prototype.halt = function(callback) {
  callback();
};

/**
 */
MCP3008.prototype.init = function(callback) {
  console.log('Init - start');
  this.connection.digitalWrite(this.mosi, 0, callback);  // Out
  this.connection.digitalWrite(this.clock, 0, callback); // Out
  this.connection.digitalWrite(this.chipSelect, 0, callback); // Out
  // Mosi IN
  console.log('Init - end');
};

/**
 */
MCP3008.prototype.read = function(channel, callback) {
  this.connection.digitalWrite(this.chipSelect, 1);
  this.connection.digitalWrite(this.clock, 0);
  this.connection.digitalWrite(this.chipSelect, 0);

  var adccommand = channel;
  if (this.verbose) { console.log("1 -       ADCCOMMAND: " + toHex(adccommand, 4)); }
  adccommand |= 0x18; // 0x18: 00011000
  if (this.verbose) { console.log("2 -       ADCCOMMAND: " + toHex(adccommand, 4)); }
  adccommand <<= 3;
  if (this.verbose) { console.log("3 -       ADCCOMMAND: " + toHex(adccommand, 4)); }
  // Send 5 bits: 8 - 3. 8 input channels on the MCP3008.
  for (var i=0; i<5; i++) {
    if (this.verbose) { console.log("4(" + i + ") -    ADCCOMMAND: " + toHex(adccommand, 4)); }
    if ((adccommand & 0x80) != 0x0) { // 0x80 = 0&10000000
      this.connection.digitalWrite(this.mosi, 1);
    } else {
      this.connection.digitalWrite(this.mosi, 0);
    }
    adccommand <<= 1;
    // Clock high and low
    tickOnPin(this.connection, this.clock);
  }

  var adcOut = 0;
  for (var i=0; i<12; i++) { // Read in one empty bit, one null bit and 10 ADC bits
    tickOnPin(this.connection, this.clock);
    adcOut <<= 1;

    if (isHigh(this.connection, this.miso)) {
      // Shift one bit on the adcOut
      adcOut |= 0x1;
    }
    if (this.verbose) { console.log("       ADCOUT: " + toHex(adcOut, 4) + ", " + i); }
  }
  this.connection.digitalWrite(this.chipSelect, 1);

  adcOut >>= 1; // Drop first bit
  return adcOut;
};

var isHigh = function(conn, pin) {
  console.log('Reading pin #' + pin);
  conn.digitalRead(pin, function(err, val) {
	    console.log(' >> Val:' + val + ", Err:" + err);
	  });
  setTimeout(function() {
	  console.log('Read!');
  }, 1000);
  return true;
};

var tickOnPin = function(conn, pin) {
  conn.digitalWrite(pin, 1);
  conn.digitalWrite(pin, 0);
};

var toHex = function(num, len) {
  return '0x' + lpad(num.toString(16), len, '0');
};

var lpad = function(str, len, pad) {
  var s = str;
  while (s.length < len) {
    s = pad + s;
  }
  return s;
};
