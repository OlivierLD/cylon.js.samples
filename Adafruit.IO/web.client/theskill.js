var thermometer, prmsl;

$(document).ready(function() {
  thermometer = new Thermometer('tmpCanvas', 200);
  prmsl = new AnalogDisplay('prmslCanvas', 80, 1045, 10, 1, true, 50, 985, 0);

  setInterval(go, 5000); // Refresh every 5 seconds.
});

var FEED_NAME_TEMP  = 'air-temperature';
var FEED_NAME_PRESS = 'atm-press';

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
      //thermometer.animate(temp);
        thermometer.setValue(temp);
        $("#raw-temp").html(temp.toFixed(2) + "&deg;C")
      } catch (err) {
        $("#mess").text("Problem with temperature...:" + err);
        thermometer.setValue(0.0);
      }
      $("#last-value").text('Last updated ' + new Date());
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
      //thermometer.animate(temp);
        prmsl.setValue(press);
        $("#raw-prmsl").text(press.toFixed(2) + " hPa");
      } catch (err) {
        $("#mess").text("Problem with temperature...:" + err);
        prmsl.setValue(0.0);
      }
      $("#last-value").text('Last updated ' + new Date());
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
