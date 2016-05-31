// Args from the command line
if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " <your Adafruit-IO key>");
  process.exit(-1);
}
var AIOKey = process.argv[2];
console.log('AIO Key: ' + AIOKey);

var Client = require('node-rest-client').Client;
 
var client = new Client();

var FEED_NAME = 'onoff';
var BASE_URL = 'https://io.adafruit.com/api/feeds/';

var getUrl = BASE_URL + FEED_NAME;
var args = {
  headers: {"X-AIO-Key": AIOKey}
};
// direct way 
client.get(getUrl, args, function (data, response) {
	// parsed response body as js object 
//	console.log("===== DATA =======")
//	console.log(data);
	console.log("Last Value (direct) :", data.last_value);
	// raw response 
//	console.log("===== RESPONSE =======")
//	console.log(response);
}).on('error', function(err) {
                  console.error('GET request ', err);
               });

client.on('error', function(err) {
    console.error('Something went wrong with the client', err);
});

// registering remote methods 
client.registerMethod("getOnOff", getUrl, "GET");
 
client.methods.getOnOff(args, function (data, response) {
	// parsed response body as js object
//	console.log(data);
	console.log("Last Value (registered) :", data.last_value);
	// raw response
//	console.log(response);
});
