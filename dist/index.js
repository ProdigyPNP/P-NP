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
const unminifySource = false;
(async () => {
    const app = (0, express_1.default)();
    app.set('trust proxy', true);
    const gs = await (0, util_1.getGameStatus)();
    if (!gs)
        throw new Error("The game status request failed.");
    app.use((0, cors_1.default)());
    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store');
        next();
    });
    let toAdd = [];
    let validate = (a, b, type) => {
        switch (type) {
            case "day":
                return a.getFullYear() === b.getFullYear() &&
                    a.getMonth() === b.getMonth() &&
                    a.getDate() === b.getDate();
                break;
            case "week":
                return a.getFullYear() === b.getFullYear() &&
                    a.getMonth() === b.getMonth() &&
                    Math.ceil((a.getDate() - 1 - a.getDay()) / 7) === Math.ceil((b.getDate() - 1 - b.getDay()) / 7);
                break;
            case "month":
                return a.getFullYear() === b.getFullYear() &&
                    a.getMonth() === b.getMonth();
                break;
        }
    };


    // [example.com/game.min.js]
    app.get(/\/(api\/)?game.min.js/, async (req, res) => {
        if (req.query.version && typeof req.query.version !== "string")
            return res.status(400).send("Invalid version specified.");
        const version = req.query.version || gs.gameClientVersion;
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



    // [example.com/public-game.min.js]
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


    // [example.com/version]
    app.get("/version", (req, res) => res.send(constants_1.VERSION));


    // [example.com/download]
    app.get("/download", (req, res) => res.redirect(constants_1.DOWNLOAD_LINK));

    // [example.com/license]
    app.get("/license", (req, res) => res.redirect("https://github.com/ProdigyPNP/P-NP/blob/master/LICENSE.txt"));



    // Annonce that P-NP has started on [example.com:PORT]
    const addr = app.listen(process.env.PORT || 1337, () => console.log(`P-NP has started on :${typeof addr === "string" ? addr : addr.port || ""}!`)).address();
})();
