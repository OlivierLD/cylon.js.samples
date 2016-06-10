'use strict';

process.title = "swagger-speak-service";

var app = require('connect')();
var http = require('http');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var fs = require('fs');
var serverPort = 8765;

// swaggerRouter configuration
var options = {
  swaggerUi: '/swagger.json',
  controllers: './controllers',
  useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  app.use("/data", function(req, resp) {
//  console.log("Data...", req, resp);
    staticHandler(req, resp);
  });

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });
});

var verbose = false;

var staticHandler = function(req, res) {

  if (verbose) {
    console.log("Speaking HTTP from " + __dirname);
    console.log("Server received an HTTP Request:\n" + req.method + "\n" + req.url + "\n-------------");
    console.log("ReqHeaders:" + JSON.stringify(req.headers, null, '\t'));
    console.log('Request:' + req.url);
    var prms = require('url').parse(req.url, true);
    console.log(prms);
    console.log("Search: [" + prms.search + "]");
    console.log("-------------------------------");
  }

  var resource = req.url; // .substring("/data/".length);
  console.log('Loading static ' + req.url + " (" + __dirname + "/.." + resource + ")");
  fs.readFile(__dirname + '/..' + resource, function (err, data) {
        if (err) {
          console.log("Err:", err);
          res.writeHead(500);
          return res.end('Error loading ' + resource);
        }
        if (verbose) {
          console.log("Read resource content:\n---------------\n" + data + "\n--------------");
        }
        var contentType = "text/html";
        if (resource.endsWith(".css")) {
          contentType = "text/css";
        } else if (resource.endsWith(".html")) {
          contentType = "text/html";
        } else if (resource.endsWith(".xml")) {
          contentType = "text/xml";
        } else if (resource.endsWith(".js")) {
          contentType = "text/javascript";
        } else if (resource.endsWith(".jpg")) {
          contentType = "image/jpg";
        } else if (resource.endsWith(".gif")) {
          contentType = "image/gif";
        } else if (resource.endsWith(".png")) {
          contentType = "image/png";
        }

        res.writeHead(200, {'Content-Type': contentType});
        //  console.log('Data is ' + typeof(data));
        if (resource.endsWith(".jpg") ||
            resource.endsWith(".gif") ||
            resource.endsWith(".png")) {
          //  res.writeHead(200, {'Content-Type': 'image/gif' });
          res.end(data, 'binary');
        } else {
          res.end(data.toString().replace('$PORT$', serverPort.toString())); // Replace $PORT$ with the actual port value.
        }
      });
}; // HTTP Handler
