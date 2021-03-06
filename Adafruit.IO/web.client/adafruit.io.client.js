var thermometer, prmsl, hum;

var sensordata = [];

var lastTemperature, lastPressure, lastHumidity;

$(document).ready(function() {
  thermometer = new Thermometer('tmpCanvas', 200);
  prmsl = new AnalogDisplay('prmslCanvas', 80, 1045, 10, 1, true, 50, 985, 0);
  hum   = new AnalogDisplay('humCanvas', 80, 100, 10, 1, true, 50, 0, 1);

  setInterval(go, 5000); // Refresh every 5 seconds.
});

var FEED_NAME_TEMP  = 'air-temperature';
var FEED_NAME_PRESS = 'atm-press';
var FEED_NAME_HUM   = 'humidity';

var getTempData = function() {
  var deferred = $.Deferred(),  // a jQuery deferred
      url = 'https://io.adafruit.com/api/feeds/' + FEED_NAME_TEMP,
      xhr = new XMLHttpRequest(),
      TIMEOUT = 10000;

  xhr.open('GET', url, true);
  var key = $("#a-key").val();
  xhr.setRequestHeader("X-AIO-Key", key);

  xhr.send();

  var requestTimer = setTimeout(function() {
    xhr.abort();
    deferred.reject();
  }, TIMEOUT);

  xhr.onload = function() {
    clearTimeout(requestTimer);
    if (xhr.status === 200) {
      deferred.resolve(xhr.response);
    } else {
      deferred.reject();
    }
  };
  return deferred.promise();
};

var getPressData = function() {
  var deferred = $.Deferred(),  // a jQuery deferred
      url = 'https://io.adafruit.com/api/feeds/' + FEED_NAME_PRESS,
      xhr = new XMLHttpRequest(),
      TIMEOUT = 10000;

  xhr.open('GET', url, true);
  var key = $("#a-key").val();
  xhr.setRequestHeader("X-AIO-Key", key);

  xhr.send();

  var requestTimer = setTimeout(function() {
    xhr.abort();
    deferred.reject();
  }, TIMEOUT);

  xhr.onload = function() {
    clearTimeout(requestTimer);
    if (xhr.status === 200) {
      deferred.resolve(xhr.response);
    } else {
      deferred.reject();
    }
  };
  return deferred.promise();
};

var getHumData = function() {
  var deferred = $.Deferred(),  // a jQuery deferred
      url = 'https://io.adafruit.com/api/feeds/' + FEED_NAME_HUM,
      xhr = new XMLHttpRequest(),
      TIMEOUT = 10000;

  xhr.open('GET', url, true);
  var key = $("#a-key").val();
  xhr.setRequestHeader("X-AIO-Key", key);

  xhr.send();

  var requestTimer = setTimeout(function() {
    xhr.abort();
    deferred.reject();
  }, TIMEOUT);

  xhr.onload = function() {
    clearTimeout(requestTimer);
    if (xhr.status === 200) {
      deferred.resolve(xhr.response);
    } else {
      deferred.reject();
    }
  };
  return deferred.promise();
};

var go = function() {
  var k = $("#a-key").val();

  if (k.trim().length > 0) {
    $("#mess").text('');
    $("#data").css('display', 'inline');

    setTimeout(function() {
      $('body').css('cursor', 'progress');
    }, 1);

    // Produce data, the promise
    var fetchTempData = getTempData();
    fetchTempData.done(function(value) {
  //  console.log("Done :" + value); // Raw data
      // Display it...
      var json = JSON.parse(value);
      try {
        var temp = parseFloat(json.last_value);
        try {
          var lastUpdated = json.updated_at;
          $("#last-value").text('Last updated, client:' + new Date() + ', server:' + reformatDate(new Date(lastUpdated)));
        } catch (timeErr) {
          console.error(timeErr);
        }
        lastTemperature = temp;
        sensordata.push({ timestamp: new Date().getTime(), temp: lastTemperature, press: lastPressure, hum: lastHumidity });
      //thermometer.animate(temp);
        thermometer.setValue(temp);
        $("#raw-temp").html(temp.toFixed(2) + "&deg;C")
        $("#temp").text(temp.toFixed(2));
      } catch (err) {
        $("#mess").text("Problem with temperature...:" + err);
        thermometer.setValue(0.0);
      }
//    $("#last-value").text('Last updated ' + new Date());
      setTimeout(function() {
        $('body').css('cursor', 'auto');
      }, 1);
    });

    var fetchHumData = getHumData();
    fetchHumData.done(function(value) {
  //  console.log("Done :" + value); // Raw data
      // Display it...
      var json = JSON.parse(value);
      try {
        var humpc = parseFloat(json.last_value);
        try {
          var lastUpdated = json.updated_at;
          $("#last-value").text('Last updated, client:' + new Date() + ', server:' + reformatDate(new Date(lastUpdated)));
        } catch (timeErr) {
          console.error(timeErr);
        }
        lastHumidity = humpc;
        sensordata.push({ timestamp: new Date().getTime(), temp: lastTemperature, press: lastPressure, hum: lastHumidity });
      //thermometer.animate(temp);
        hum.setValue(humpc);
        $("#raw-hum").html(humpc.toFixed(2) + " %")
        $("#hum").text(humpc.toFixed(2))
      } catch (err) {
        $("#mess").text("Problem with humidity...:" + err);
        hum.setValue(0.0);
      }
//    $("#last-value").text('Last updated ' + new Date());
      setTimeout(function() {
        $('body').css('cursor', 'auto');
      }, 1);
    });

    var fetchPressData = getPressData();
    fetchPressData.done(function(value) {
  //  console.log("Done :" + value); // Raw data
      // Display it...
      var json = JSON.parse(value);
      try {
        var press = parseFloat(json.last_value);
        try {
          var lastUpdated = json.updated_at;
          $("#last-value").text('Last updated, client:' + new Date() + ', server:' + reformatDate(new Date(lastUpdated)));
        } catch (timeErr) {
          console.error(timeErr);
        }
        lastPressure = press;
        sensordata.push({ timestamp: new Date().getTime(), temp: lastTemperature, press: lastPressure, hum: lastHumidity });
      //thermometer.animate(temp);
        prmsl.setValue(press);
        $("#raw-prmsl").text(press.toFixed(2) + " hPa");
        $("#press").text(press.toFixed(2));
      } catch (err) {
        $("#mess").text("Problem with temperature...:" + err);
        prmsl.setValue(0.0);
      }
//    $("#last-value").text('Last updated ' + new Date());
      setTimeout(function() {
        $('body').css('cursor', 'auto');
      }, 1);
    });

    // Errors etc
    fetchTempData.fail(function(error) {
      $("#mess").text('Data request failed (timeout? invalid key?), try again later.\n' + (error !== undefined ? error : ''));
    });
    fetchPressData.fail(function(error) {
      $("#mess").text('Data request failed (timeout?? invalid key?), try again later.\n' + (error !== undefined ? error : ''));
    });
  } else {
    $("#mess").text('Please enter your Adafruit-IO key in the field above');
    $("#data").css('display', 'none');
  }
};
