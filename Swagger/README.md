### Cylon & Swagger

Here is a quick illustration of the way to invoke REST services to work with Cylon drivers.

Start from the file named `speak.yaml`, it is the description of the services that will
- be consumed by a REST client
- invoke the Cylon driver

The REST client can be embedded in a web page. As Cylon runs on `node.js`, the node server can also be used as an HTTP server. 
We are going to do this without `Express.js`, which is not necessary in this sall example.

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
