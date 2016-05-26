### Cylon.js, IoT, Adafruit-IO...

Install Node.js
Install Cylon.js for the Raspberry Pi

Install cylon.js as explained [here](https://github.com/hybridgroup/cylon-raspi).

To get started, read [this](https://cylonjs.com/documentation/platforms/raspberry-pi/).

Install a REST client
```
 $ npm install node-rest-client
```
Doc is [here](https://www.npmjs.com/package/node-rest-client).

You need an Adafruit-IO key.

_Example_: feed Adafruit-IO from Cylon.js:
```
 $ sudo node data.feeder.js <your Adafruit-IO key>
```
This reads a BMP180 from cylon.js, and send data to an Adafruit-IO feed.

