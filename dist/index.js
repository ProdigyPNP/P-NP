import beautify from "js-beautify";
import cors from "cors";
import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import RateLimit from "express-rate-limit";
import http from "http";
import https from "https";
import { getGameStatus, getPatchedGameFile, getPatchedPublicGameFile } from "./util.js";
import { DOWNLOAD_LINK, VERSION, LICENSE_LINK, HTTP_PORT, UNMINIFY_SOUCE, HTTPS, HTTPS_CHAIN_PATH, HTTPS_KEY_PATH, HTTPS_PORT, PRODUCTION } from "./constants.js";
import hash from "./hash.js";
import { latestCheatGui, startCachingCheatGui } from "./cheatGuiCache.js";
(async () => {
    startCachingCheatGui();
    const app = express();
    app.set("trust proxy", true);
    const gs = await getGameStatus();
    if (!gs) {
        throw new Error("The game status request failed.");
    }
    app.use(cors());
    app.use((_req, res, next) => {
        res.set("Cache-Control", "no-store");
        next();
    });
    app.use(RateLimit({
        windowMs: 20 * 1000,
        max: 4,
    }));
    if (PRODUCTION !== "" && PRODUCTION !== "any") {
        app.use((req, res, next) => {
            if (req.hostname === "chat.prodigypnp.com") {
                res.redirect("https://chat.prodigypnp.com:8443/");
            }
            else if (req.hostname === "localhost") {
                next();
            }
            else if (req.hostname !== PRODUCTION) {
                res.status(403).send("Direct IP connection is prohibited. Try using hacks.prodigypnp.com");
            }
            else {
                next();
            }
        });
    }
    app.get("/load-game.min.js", async (_req, res) => {
        var unmodifiedScript;
        var loadingText;
        (await fetch("https://code.prodigygame.com/js/load-game-ff6c26a637.min.js")).text().then(result => {
            unmodifiedScript = result;
        });
        (await fetch("https://raw.githubusercontent.com/ProdigyPNP/P-NP/master/loadingText.txt")).text().then(result => {
            loadingText = result;
            const loadVar = `const loadingText = \`${loadingText}\`.split("\\n");\n`;
            const send = loadVar + unmodifiedScript;
            res.type("text/js").send(send);
        });
    });
    app.get(/\/(api\/)?game.min.js/, async (req, res) => {
        if (req.query.version && typeof req.query.version !== "string")
            return res.status(400).send("Invalid version specified.");
        const version = req.query.version ?? gs.gameClientVersion;
        try {
            res.type("js").send(`// game.min.js v${version}\n\n` +
                (UNMINIFY_SOUCE ? beautify : (_) => _)(await getPatchedGameFile(version)));
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
            res.type("js").send(await getPatchedPublicGameFile(req.query.hash));
        }
        catch (e) {
            if (!(e instanceof Error))
                throw e;
            return res.status(400).send(e.message);
        }
    });
    app.get("/version", async (_req, res) => {
        const output = VERSION;
        res.type("text/plain").send(output);
    });
    app.get("/download", (_req, res) => res.redirect(DOWNLOAD_LINK));
    app.get("/license", (_req, res) => res.redirect(LICENSE_LINK));
    app.get("/gui", (_req, res) => {
        res.type("text/js").send(latestCheatGui);
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
        res.type("text/plain").send(hash(`// game.min.js v${version}\n\n` +
            (UNMINIFY_SOUCE ? beautify : (_) => _)(await getPatchedGameFile(version))));
    });
    app.get("/", (_req, res) => {
        res
            .status(200)
            .type("text/html")
            .send(`<!DOCTYPE html>
			<html>
				<head>
					<title>Prodigy Game Patcher</title>
					<meta charset="utf-8" />
					<link rel="icon" type="image/png" href="https://raw.githubusercontent.com/ProdigyPNP/ProdigyMathGameHacking/master/.github/PTB.png"/>
				</head>	
				<body>
					<h1>Prodigy Gamefile Patcher</h1>
					<p>This is a tool for patching the game.min.js file of the Prodigy Game client.</p>
				</body>	
			</html>`);
    });
    if (HTTPS) {
        console.log("ИСПОЛЬЗУЕМ HTTPS.");
        let httpsServer = https.createServer({
            key: fs.readFileSync(HTTPS_KEY_PATH),
            cert: fs.readFileSync(HTTPS_CHAIN_PATH),
        }, app);
        httpsServer.listen(HTTPS_PORT, () => {
            console.log(`СЕРВЕР HTTPS ВКЛЮЧЕН НА: http://localhost:${HTTPS_PORT}/`);
        });
    }
    else {
        console.log("НЕ ИСПОЛЬЗУЕМ HTTPS.");
    }
    http.createServer(app).listen(HTTP_PORT, () => {
        console.log(`СЕРВЕР HTTP ВКЛЮЧЕН НА: http://localhost:${HTTP_PORT}/`);
    });
})();
//# sourceMappingURL=index.js.map