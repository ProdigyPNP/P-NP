import { GUI_HISTORY, GUI_LINK } from "./constants.js";
import fetch from "node-fetch";
export var latestCheatGui = "";
export var cheatGuiHistory = {};
export async function startCachingCheatGui() {
    latestCheatGui = (await (await fetch(GUI_LINK)).text());
    setInterval(async () => {
        latestCheatGui = (await (await fetch(GUI_LINK)).text());
        if (GUI_HISTORY) {
            Object.defineProperty(cheatGuiHistory, "at:" + Date.now(), {
                value: latestCheatGui,
                writable: false,
            });
            Object.defineProperty(cheatGuiHistory, "latest", {
                value: latestCheatGui,
                writable: true,
            });
        }
    }, 30 * 60 * 1000);
}
//# sourceMappingURL=cheatGuiCache.js.map