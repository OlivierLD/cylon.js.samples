'use strict';

exports.postSentence = function(args, res, next) {
  /**
   * parameters expected in the args:
  * sentence (String)
  **/
//console.log(">> postSentence received:", args);
  // args is like this:
  /*
   {
     sentence: {
       path: ['paths', '/', 'post', 'parameters', '0'],
       schema: {
         name: 'sentence',
         in: 'formData',
         description: 'The actual sentence to speak',
         required: true,
         type: 'string'
       },
       originalValue: 'Roule ma poule!',
       value: 'Roule ma poule!'
     }
   }   */
  var sentence = args.sentence.originalValue;
  console.log(">> Speaking:", sentence);
  try {
    if (speechDevice !== undefined) {
      speechDevice.mouth.say(sentence);
    } else {
      console.log("speechDevice is null...");
    }
  } catch (err) {
    console.log("Error:", err);
  }
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
    mouth: { driver: 'speech', language: "american", gender: "m", speed: 170 }
//  mouth: { driver: 'speech', language: "french", gender: "m", speed: 170 }
  },

  work: function(my) {

    speechDevice = my;
    console.log('Speech device initialized');

    my.mouth.say("Cylon, ready for duty");
//  my.mouth.say("I'm a Cylon.JS robot, and I'm talking!");
  }
}).start();
