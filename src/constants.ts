/** Insert your own PHEx version here, if not P-NP will default to fetching the latest one from Infinite Zero.
 * CAUTION: PHEx will prompt to update if the version does not math this one's version. */
export const VERSION : string = "3.0.1";

/** Insert your own developer cheat menu here, if not it'll default to cheatGUI.
 * CAUTION: Only use cheat menus you completely trust. Cheat menus have complete JavaScript eval access. */
export const GUI_LINK : string = "" || "https://raw.githubusercontent.com/ProdigyPNP/ProdigyMathGameHacking/master/cheatGUI/dist/bundle.js";

/** If you want to cache cheatGUI history, set this to true.
 * CAUTION: This may use lots of memory, and slow down P-NP. */
export const GUI_HISTORY : boolean = false;

/** Insert your own PHEx download link here, if not it'll default to the PHEx on the official GitHub repo.
 * CAUTION: Only use PHEx downloads you completley trust. PHEx downloads have complete browser extension access. */
export const DOWNLOAD_LINK : string = "" || "https://raw.githubusercontent.com/ProdigyPNP/ProdigyMathGameHacking/master/PHEx/build/extension.zip";

/** Insert your own license link here, if not it'll default to the PHEx on the official GitHub repo.
 * CAUTION: Only use license links you completley trust. Please note that this URL must lead to a copy of the MPL-2.0 license of ProdigyPNP. */
export const LICENSE_LINK : string = "" || "https://github.com/ProdigyPNP/ProdigyMathGameHacking/blob/master/LICENSE.txt";

/** Replace 0 with your own http server port here, if not it'll default to 80.
 * CAUTION: Remeber that server port 80 is the default http port, and port 443 is the default HTTPS port. */
export const HTTP_PORT : number = 0 || 80;

/** Replace 0 with your own https server port here, if not it'll default to 443.
 * CAUTION: Remeber that server port 80 is the default http port, and port 443 is the default HTTPS port. */
export const HTTPS_PORT : number = 0 || 443;

/** If you want to unminify game.min.js before it is outputted to the browser, set this to true.
 * CAUTION: This is not recommended, as it will increase the size of the game.min.js file. Use only for debugging. */
export const UNMINIFY_SOUCE : boolean = true;

/** If you do not want to run the HTTPS server, change this to false.
 * CAUTION: You will then need a seperate method to get HTTPS (or have none). */
export const HTTPS : boolean = true;

/** Insert your own path to the privatekey.pem SSL certificate here. If not, ProdigyPNP's default one will be used.
 * CAUTION: Remember to use the full path, and change this to YOUR DOMAIN's SSL Certificate. DO NOT LEAK THIS FILE. */
export const HTTPS_KEY_PATH : string = "" || "/etc/letsencrypt/live/hacks.prodigypnp.com/privkey.pem";
 
/** Insert your own path to the fullchain.pem SSL certificate here. If not, ProdigyPNP's default one will be used.
 * CAUTION: Remember to use the full path, and change this to YOUR DOMAIN's SSL Certificate. */
export const HTTPS_CHAIN_PATH : string = "" || "/etc/letsencrypt/live/hacks.prodigypnp.com/fullchain.pem";

/** Insert your own domain here, or set it to "any" to disable this lock.
 * CAUTION: Not using such a lock, permitting direct IP connection means it bypasses Cloudflare. */
export const PRODUCTION : string =  "" || "hacks.prodigypnp.com";
