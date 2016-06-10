'use strict';

var url = require('url');


var Speak = require('./SpeakService');


module.exports.postSentence = function postSentence (req, res, next) {
  Speak.postSentence(req.swagger.params, res, next);
};
