"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const util_1 = require("./util");
const constants_1 = require("./constants");
const js_beautify_1 = __importDefault(require("js-beautify"));
const fs_1 = __importDefault(require("fs"));
const hash_1 = require("./hash");
const node_fetch_1 = __importDefault(require("node-fetch"));
const unminifySource = false;
const port = 1337;
function toHits() {
    var final = "";
    fs_1.default.readFile("hits.json", "utf8", function (err, data) {
        if (err)
            return console.error(err);
        const contents = Number(data);
        const incremented = contents + 1;
        const toStr = incremented.toString();
        final = toStr;
        fs_1.default.writeFile("hits.json", final, (err) => {
            if (err)
                return console.error(err);
        });
    });
}
(async () => {
    var cheatGuiCache = (await (await (0, node_fetch_1.default)(constants_1.GUI_LINK)).text());
    setInterval(async () => {
        cheatGuiCache = (await (await (0, node_fetch_1.default)(constants_1.GUI_LINK)).text());
    }, 30 * 60 * 1000);
    const app = (0, express_1.default)();
    app.set("trust proxy", true);
    const gs = await (0, util_1.getGameStatus)();
    if (!gs)
        throw new Error("The game status request failed.");
    app.use((0, cors_1.default)());
    app.use((req, res, next) => {
        res.set("Cache-Control", "no-store");
        next();
    });
    app.get("/load-game.min.js", async (req, res) => {
        var unmodifiedScript;
        var loadingText;
        (await (0, node_fetch_1.default)("https://code.prodigygame.com/js/load-game-ff6c26a637.min.js")).text().then(result => {
            unmodifiedScript = result;
        });
        (await (0, node_fetch_1.default)("https://raw.githubusercontent.com/ProdigyPNP/P-NP/master/loadingText.txt")).text().then(result => {
            loadingText = result;
            const loadVar = `const loadingText = \`${loadingText}\`.split("\\n");\n`;
            const send = loadVar + unmodifiedScript;
            res.type("text/js").send(send);
        });
    });
    app.get(/\/(api\/)?game.min.js/, async (req, res) => {
        toHits();
        if (req.query.version && typeof req.query.version !== "string")
            return res.status(400).send("Invalid version specified.");
        const version = req.query.version ?? gs.gameClientVersion;
        try {
            res.type("js").send(`// game.min.js v${version}\n\n` +
                (unminifySource ? js_beautify_1.default : (_) => _)(await (0, util_1.getPatchedGameFile)(version)));
        }
        catch (e) {
            if (!(e instanceof Error))
                throw e;
            return res.status(400).send(e.message);
        }
    });
    app.get(/\/(api\/)?public-game.min.js/, async (req, res) => {
        if (typeof req.query.hash !== "string")
            return res.status(400).send("No hash specified.");
        try {
            res.type("js").send(await (0, util_1.getPatchedPublicGameFile)(req.query.hash));
        }
        catch (e) {
            if (!(e instanceof Error))
                throw e;
            return res.status(400).send(e.message);
        }
    });
    app.get("/version", async (req, res) => {
        if (constants_1.VERSION == "getFromInfiniteZero") {
            res.type("text/plain").send((await (await (0, node_fetch_1.default)("https://infinitezero.net/version")).text()).valueOf());
        }
        else {
            res.type("text/plain").send(constants_1.VERSION.valueOf());
        }
    });
    app.get("/download", (req, res) => res.redirect(constants_1.DOWNLOAD_LINK));
    app.get("/license", (req, res) => res.redirect(constants_1.LICENSE_LINK));
    app.get("/gui", (req, res) => {
        res.type("text/js").send(cheatGuiCache);
    });
    app.get("/gameVersion", async (req, res) => {
        if (req.query.version && typeof req.query.version !== "string")
            return res.status(400).send("Invalid version specified.");
        const version = req.query.version ?? gs.gameClientVersion;
        try {
            res.type("text/plain").send(version.valueOf());
        }
        catch (e) {
            if (!(e instanceof Error))
                throw e;
            return res.status(400).send(e.message);
        }
    });
    app.get("/hash", async (req, res) => {
        if (req.query.version && typeof req.query.version !== "string")
            return res.status(400).send("Invalid version specified.");
        const version = req.query.version ?? gs.gameClientVersion;
        res.type("text/plain").send((0, hash_1.hash)(`// game.min.js v${version}\n\n` +
            (unminifySource ? js_beautify_1.default : (_) => _)(await (0, util_1.getPatchedGameFile)(version))));
    });
    const addr = app.listen(port, () => console.log(`[P-NP Patcher] P-NP has started on :${typeof addr === "string" ? addr : addr?.port ?? ""}!`)).address();
})();
//# sourceMappingURL=index.js.map