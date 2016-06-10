### Cylon & Swagger

Here is a quick illustration of the way to use REST services to invoke Cylon drivers features.
REST is a standard, that is why we can think of it. Enabling REST on top of Cylon provides it a universal access.

Start from the file named `speak.yaml`, it is the description of the services that will
- be consumed by a REST client
- invoke the Cylon driver

The REST client can be embedded in a web page. As Cylon runs on `node.js`, the node server can also be used as an HTTP server. 
We are going to do this without `Express.js`, which is not necessary in this sall example.
We will use the Swagger code generator to create the stubs (server-side skeletons) that will be fleshed later.
This generated code _will become_ the implementation of the REST service(s) consuming the Cylon driver's features.
As such, any REST-aware client can invoke it. It will be the bridge between a client (Web browser, curl, REST client program, ...)
and the Cylon driver's features your application can be interested in.

The REST client can be embedded in a web page. As Cylon runs on `node.js`, the node server can also be used as an HTTP server. 
We are going to do this _without_ `Express.js`, which is not necessary for this small example.

#### Step by step
- generate the server-side stubs, for `node.js`, run the `gen-code.sh` script:
```
 $ gen-code.sh speak
```
This will
- Generate the server side javascript artifacts for `node.js`
- Install the node components reuired by Swagger
- Install the Cylon components (`cylon` and `cylon-speech`)
- Start the node server

If all is good - i.e. you have no error messages - stop the server (hit Ctrl+C), we need to add some code to the generated one.

##### HTTP Server code
In `index.js` (Swagger generated), add the following code at the end of the file (this is also the content of the file named `httpserver.snippet.js`):
```
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
```
and refer to it before the server is started, as follow:
<pre>

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  <b>app.use("/data", function(req, resp) {
    staticHandler(req, resp);
  });</b>

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
</pre>
For this http server: whatever URL that begins with `/data/` refers to a static document (see the URL at the very bottom of this document).
The root of those documents is located in the `web.client` directory (at the same level as `speak` and `echo`, under `Swagger`).

##### Service code
In `SpeakService.js` (Swagger generated), add the following code at the end of the file:
```
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
  },

  work: function(my) {

    speechDevice = my;
    console.log('Speech device initialized');

    my.mouth.say("Cylon ready");
  }
}).start();
```
and modify the `postSentence` method, so it looks like this:
<pre>
exports.postSentence = function(args, res, next) {
  /**
   * parameters expected in the args:
  * sentence (String)
  **/
  <b>var sentence = args.sentence.originalValue;
  console.log(">> Speaking:", sentence);
  try {
    speechDevice.mouth.say(sentence);
  } catch (err) {
    console.log("Error:", err);
  }</b>
  // no response value expected for this operation
  res.end();
}
</pre>
You should be OK to restart the server.
```
$ node .
```

You are now ready to give it a first try, from a browser, reach
```
 http://localhost:8765/data/web.client/index.html
```

And see - listen - for yourself.

### Final note
Above, we used a web page to call the Speech service. This web page uses a REST client to communicate with the code generated by Swagger,
leveraging the JQuery promises.

_*The exact same calls can be made using tools like `curl`, `Postman`, etc.*_

The web UI is just a bit more sexy.
