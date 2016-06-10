
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
