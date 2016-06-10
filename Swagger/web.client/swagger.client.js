var textarea;

$(document).ready(function() {
  textarea = $("#sentence");
});

var sendSentence = function() {
  var deferred = $.Deferred(),  // a jQuery deferred
      url = 'http://localhost:8765/speak',
      xhr = new XMLHttpRequest(),
      TIMEOUT = 10000;
/* curl -X POST --header 'Content-Type: application/x-www-form-urlencoded'
                --header 'Accept: application/json'
                -d 'sentence=Some content' 'http://localhost:8765/speak/' */
  xhr.open('POST', url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("Accept",       "application/json");

  var sentence = textarea.val();
  xhr.send("sentence=" + sentence); // urlencoded is like a query string


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

var invokeSpeakService = function() {
  var swaggerService = sendSentence();
  swaggerService.done(function (value) {
    //  console.log("Done :" + value); // Raw data
    setTimeout(function () {
      $('body').css('cursor', 'auto');
    }, 1);
  });
};
