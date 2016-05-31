// Args from the command line
if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " <your Adafruit-IO key>");
  process.exit(-1);
}
var AIOKey = process.argv[2];
console.log('AIO Key: ' + AIOKey);

//Example POST method invocation
var Client = require('node-rest-client').Client;

var client = new Client();

var FEED = "air-temperature";
var BASE_URL = "https://io.adafruit.com/api/feeds/";
var SUFFIX = "/data";

var postURL = BASE_URL + FEED + SUFFIX;
var args = {
  data: { "value": 18.01 },
  headers: { "X-AIO-Key": AIOKey,
             "Content-Type": "application/json" }
};

client.post(postURL, args, function (data, response) {
    console.log("Post response came back");
	// parsed response body as js object
//	console.log(data);

	// raw response
//	console.log(response);
}).on('error', function(err) {
    console.error('POST request Ooops ', err);
});

client.on('error', function(err) {
    console.error('Something went wrong with the client', err);
});

if (false) {
// registering remote methods
    client.registerMethod("postMethod", postURL, "POST");

    client.methods.postMethod(args, function (data, response) {
        // parsed response body as js object
        console.log(data);
        // raw response
        console.log(response);
    });
}