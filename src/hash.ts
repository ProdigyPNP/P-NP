const sjcl = require("sjcl");


// Generate base64-encoded SHA256 for given string.
export function hash  (s : string) {
  var hashed = sjcl.hash.sha256.hash(s);
  return sjcl.codec.base64.fromBits(hashed);
}