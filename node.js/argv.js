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

var getMask = function(num) {
  var maskDim = 2;
  for (var i=2; i<16; i+=2) {
    maskDim = i;
    if (Math.abs(num) < (Math.pow(16, i) - 1)) {
      console.log("i=" + i + ", " + Math.abs(num) + " < " + (Math.pow(16, i) - 1));
      break;
    }
  }
  return Math.pow(16, maskDim) - 1;
};

var toHexString = function(num, len) {
  var l = (len !== undefined ? len : 4);
  return "0x" + lpad((num & getMask(num)).toString(16).trim().toUpperCase(), l, '0');
};

var lpad = function(str, len, pad) {
  var s = str;
  while (s.length < len) {
    s = (pad !== undefined ? pad : " ") + s;
  }
  return s;
};

var val = 255;
console.log("val:", val, "= 0x" + val.toString(16).trim().toUpperCase() + "");

val = 126543;
console.log("Val:" + val + " = ", toHexString(val, 8));

val = -1135;
console.log("Val:" + val + " = ", toHexString(val, 8));

val = Math.pow(16, 6) + 175;
console.log("Val:" + val + " = ", toHexString(val,  8));
console.log("Val:" + val + " = ", toHexString(val, 10));
