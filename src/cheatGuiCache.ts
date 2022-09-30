import { GUI_HISTORY, GUI_LINK } from "./constants.js";
import fetch from "node-fetch"; // fetch

export var latestCheatGui : string = "";
export var cheatGuiHistory : object = {};


/** Begin caching cheatGUI */
export async function startCachingCheatGui () {

    latestCheatGui = (await (await fetch(GUI_LINK)).text());

    setInterval(async () => {

        /** Change latestCheatGui to the latest cheat GUI bundle. */
        latestCheatGui = (await (await fetch(GUI_LINK)).text());

        /** If GUI_HISTORY is true, then save GUI history. */
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

    }, 30*60*1000); /** Interval every 30 minutes */

}