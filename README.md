### Cylon.js, IoT, Adafruit-IO...

Install Node.js
Install Cylon.js for the Raspberry Pi

Install cylon.js as explained [here](https://github.com/hybridgroup/cylon-raspi).

To get started, read [this](https://cylonjs.com/documentation/platforms/raspberry-pi/).

Install a REST client for nodejs:
```
 $ npm install node-rest-client
```
Doc is [here](https://www.npmjs.com/package/node-rest-client).

You need an Adafruit-IO key. Those who don't have one can get it from [Adafruit-IO](https://io.adafruit.com).

_Example_: feed Adafruit-IO from Cylon.js:
```
 $ sudo node data.feeder.bme280.js <your Adafruit-IO key>
```
This reads a BME280 from cylon.js, and send data to an Adafruit-IO feed.

Then you can visualize the data on the [Adafruit-IO](https://io.adafruit.com) web site, or by launching `index.html`,
located in the `Adafruit.IO/web.client` directory of the repo.

... and more.
