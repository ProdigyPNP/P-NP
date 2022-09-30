import sjcl from "sjcl";
export default function hash(text) {
    var hashed = sjcl.hash.sha256.hash(text);
    return sjcl.codec.base64.fromBits(hashed);
}
//# sourceMappingURL=hash.js.map