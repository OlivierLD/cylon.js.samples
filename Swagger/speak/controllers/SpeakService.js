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
  // no response value expected for this operation
  res.end();
}

