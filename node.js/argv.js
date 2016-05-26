// Args from the commnand line
if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " SOME_PARAM");
  process.exit(-1);
}
var param = process.argv[2];
console.log('Param: ' + param);

// Env variables, reading.
var someValue = process.env['SOME_VALUE'];
console.log("Some value:" + someValue);

var val = 255;
console.log("val:", val, "= 0x" + val.toString(16).trim().toUpperCase() + "");

var toHexString = function(num, len) {
  return "0x" + lpad(num.toString(16).trim().toUpperCase(), (len !== undefined ? len : 4), '0');
}

var lpad = function(str, len, pad) {
  var s = str;
  while (s.length < len) {
    s = (pad !== undefined ? pad : " ") + s;
  }
  return s;
}

val = Number.MAX_VALUE; // Wow!
console.log("Val:" + val + " = ", toHexString(val, 8));
