"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCachingCheatGui = exports.cheatGuiHistory = exports.latestCheatGui = void 0;
const constants_1 = require("./constants");
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.latestCheatGui = "";
exports.cheatGuiHistory = {};
async function startCachingCheatGui() {
    exports.latestCheatGui = (await (await (0, node_fetch_1.default)(constants_1.GUI_LINK)).text());
    setInterval(async () => {
        exports.latestCheatGui = (await (await (0, node_fetch_1.default)(constants_1.GUI_LINK)).text());
        if (constants_1.GUI_HISTORY) {
            Object.defineProperty(exports.cheatGuiHistory, "at:" + Date.now(), {
                value: exports.latestCheatGui,
                writable: false,
            });
            Object.defineProperty(exports.cheatGuiHistory, "latest", {
                value: exports.latestCheatGui,
                writable: true,
            });
        }
    }, 30 * 60 * 1000);
}
exports.startCachingCheatGui = startCachingCheatGui;
//# sourceMappingURL=cheatGuiCache.js.map