/** Stanford Javascript Crypto Library */
import sjcl from "sjcl";


/** Generate base64-encoded SHA256 for given string. */
export default function hash (text : string) : string {
  var hashed = sjcl.hash.sha256.hash(text);
  return sjcl.codec.base64.fromBits(hashed);
}