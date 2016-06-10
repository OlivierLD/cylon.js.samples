'use strict';

var url = require('url');


var Echo = require('./EchoService');


module.exports.getEcho = function getEcho (req, res, next) {
  Echo.getEcho(req.swagger.params, res, next);
};

module.exports.getTestEcho = function getTestEcho (req, res, next) {
  Echo.getTestEcho(req.swagger.params, res, next);
};

module.exports.postEcho = function postEcho (req, res, next) {
  Echo.postEcho(req.swagger.params, res, next);
};
