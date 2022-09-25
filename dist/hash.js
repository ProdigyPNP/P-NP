"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = void 0;
const sjcl_1 = __importDefault(require("sjcl"));
function hash(text) {
    var hashed = sjcl_1.default.hash.sha256.hash(text);
    return sjcl_1.default.codec.base64.fromBits(hashed);
}
exports.hash = hash;
//# sourceMappingURL=hash.js.map