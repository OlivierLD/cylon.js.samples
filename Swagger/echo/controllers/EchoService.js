'use strict';

exports.getEcho = function(args, res, next) {
  /**
   * parameters expected in the args:
  **/

  try {
    var mess = "I know, I sound like an idiot.";
    console.log("Saying:" + mess);
    speechDevice.mouth.say(mess);
  } catch (err) {
    console.log("Error:", err);
  }

  // no response value expected for this operation
  res.end();
}

exports.getTestEcho = function(args, res, next) {
  /**
   * parameters expected in the args:
  * id (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.postEcho = function(args, res, next) {
  /**
   * parameters expected in the args:
  * name (String)
  * year (String)
  **/
  // no response value expected for this operation
  res.end();
}

var speechDevice = undefined;

var Cylon = require('cylon');

Cylon.robot({
  // voice for espeak can be specified either in one string or as params for the adaptor.
  // both connections below will reproduce with the same voice.
  // connections: { speech: { adaptor: 'speech', language: 'en, gender: 'f', 'voice: '3' } },
  connections: {
    speech: { adaptor: 'speech' }
  },

  devices: {
    mouth: { driver: 'speech', language: "american", gender: "m", speed: 130 }
  },

  work: function(my) {

    speechDevice = my;
    console.log('Speech device initialized');

    my.mouth.say("Cylon ready");
//  my.mouth.say("I'm a Cylon.JS robot, and I'm talking!");
  }
}).start();