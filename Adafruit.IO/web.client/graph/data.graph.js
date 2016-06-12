/*
 * @author olivier@lediouris.net

 Sample data:
  [
    {
      "timestamp": 1465669794572,
      "temp": 20.64
    },
    {
      "timestamp": 1465669794591,
      "temp": 20.64,
      "hum": 62.43
    },
    {
      "timestamp": 1465669798769,
      "temp": 20.64,
      "press": 1017.04,
      "hum": 62.43
    },
    {
      "timestamp": 1465669799569,
      "temp": 20.64,
      "press": 1017.04,
      "hum": 62.43
    },
    {
      "timestamp": 1465669799619,
      "temp": 20.64,
      "press": 1017.04,
      "hum": 62.43
    },
    {
      "timestamp": 1465669799633,
      "temp": 20.64,
      "press": 1017.04,
      "hum": 62.43
    },
    {
      "timestamp": 1465669804567,
      "temp": 20.64,
      "press": 1017.04,
      "hum": 62.43
    },
    {
      "timestamp": 1465669804583,
      "temp": 20.64,
      "press": 1017.04,
      "hum": 62.43
    },
    {
      "timestamp": 1465669804596,
      "temp": 20.64,
      "press": 1017.04,
      "hum": 62.43
    },
    {
      "timestamp": 1465669809584,
      "temp": 20.64,
      "press": 1017.04,
      "hum": 62.43
    },
    {
      "timestamp": 1465669809598,
      "temp": 20.64,
      "press": 1017.04,
      "hum": 62.43
    },
    ...
  ]
 */

var graph;

window.onload = function() {
};

var updateOnClick = function(idx, press, temp, hum) {
  var txtDate = JSONParser.graphData[idx].getDataDate();
//console.log("Date is : " + reformatDate(txtDate));
  var utc = document.getElementById("tz");
  document.getElementById("recno").innerHTML = "Record #<b style='color:red;'>" + (idx + 1) + "</b> of " + JSONParser.graphData.length + ", " +  reformatDate(txtDate);

  graph.drawGraph("graphCanvas", graphdata, idx);
};

var reformatDate = function(d, fmt) {
  var utcDate = d;
  if (!isNaN(Number(d))) {
    utcDate = new Date(d)
  }
  var date;
  if (fmt === undefined) {
    fmt = "D d-M-Y H:i";
  }
  // 07-03 00:00
  var dateRegExpr = new RegExp("(\\d{2})-(\\d{2})\\s(\\d{2}):(\\d{2})");
  var matches = dateRegExpr.exec(utcDate);
  if (matches !== null) {      // Date is a string like "07-29 10:11"
    var month   = matches[1];
    var day     = matches[2];
    var hours   = matches[3];
    var minutes = matches[4];
    date = new Date();
    date.setMonth(parseInt(month - 1));
    date.setDate(parseInt(day));
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    date.setSeconds(0);
  } else {
    date = utcDate; // Already a date
  }

  var time = date.getTime();
  date = new Date(time);
//console.log("becomes: " + date.toString());
  return date.format(fmt);
};

var mouseMoveOnGraphCallback = function(idx) {
  if (JSONParser.graphData.length > idx) {
    data = JSONParser.graphData[idx];
    updateOnClick(idx,
                  data.getDataPress(),
                  data.getDataTemp(),
                  data.getDataHum());
  }
};

var graphdata = [];

var setGraphData = function(gd) {
  JSONParser.parse(gd);
  displayData();
};

 // Parse the data
var onDataChange = function() {
  var text = document.getElementById("spot").value;

  if (text.length > 0) {
    var graphData = JSON.parse(text); // graphData is a json object.
    JSONParser.parse(graphData);
    displayData();
  }
};

var interval;

var displayData = function() {
  var graphData = JSONParser.graphData;
  if (graphData !== null && graphData !== undefined && graphData.length > 0) {
    graphdata = [];
    var type = document.getElementById("data-type").value;

//  console.log("Type: [" + type + "]");
    var unit = "kt";

    for (var i=0; i<graphData.length; i++) {
      if (type === "TEMP") {
        graphdata.push(new Tuple(i, parseFloat(graphData[i].getDataTemp())));
        unit = "\272C";
      } else if (type === "PRESS") {
        graphdata.push(new Tuple(i, parseFloat(graphData[i].getDataPress())));
        unit = "hPa";
      } else if (type === "HUM") {
        graphdata.push(new Tuple(i, parseFloat(graphData[i].getDataHum())));
        unit = "%";
      }
    }
    var w = document.getElementById("graphCanvas").width;
    graph = new Graph("graphCanvas", w, 200, graphdata, mouseMoveOnGraphCallback, unit);
    // Last value recorded
    var idx = JSONParser.graphData.length - 1;
    var data = JSONParser.graphData[idx];
    updateOnClick(idx,
                  data.getDataPress(),
                  data.getDataTemp(),
                  data.getDataHum());
  }
};

var JSONParser =
{
  graphData : [],

  parse : function(JSONContent, cb, cb2)
  {
    JSONParser.graphData  = [];
    var linkList = "";

    for (var i=0; i<JSONContent.length; i++)
    {
      var date  = JSONContent[i].timestamp;
      var press = JSONContent[i].press;
      var temp  = JSONContent[i].temp;
      var hum   = JSONContent[i].hum;
      if (date  !== undefined &&
          press !== undefined &&
          temp  !== undefined &&
          hum   !== undefined) {
        JSONParser.graphData.push(new graphData(date, press, temp, hum));
      }
    }    
  }
};

var graphData = function(date, press, temp, hum)
{
  var dataDate  = date;
  var dataPress = press;
  var dataTemp  = temp;
  var dataHum   = hum;

  this.getDataDate  = function() { return dataDate; };
  this.getDataPress = function() { return dataPress; };
  this.getDataTemp  = function() { return dataTemp; };
  this.getDataHum   = function() { return dataHum; };
};
