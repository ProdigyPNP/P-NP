import beautify from "js-beautify"; // JavaScript beautifier
import cors from "cors"; // CORS
import express from "express"; // Express server
import fetch from "node-fetch"; // fetch
import fs from "fs"; // File System
import RateLimit from "express-rate-limit"; // Rate Limiter
import http from "http"; // HTTP Server
import https from "https"; // HTTPS Server

import { getGameStatus, getPatchedGameFile, getPatchedPublicGameFile } from "./util.js"; // Gamefile patchers
import { DOWNLOAD_LINK, VERSION, LICENSE_LINK, HTTP_PORT, UNMINIFY_SOUCE, HTTPS, HTTPS_CHAIN_PATH, HTTPS_KEY_PATH, HTTPS_PORT, PRODUCTION } from "./constants.js"; // Constants
import hash from "./hash.js"; // Hash function
import { latestCheatGui, startCachingCheatGui } from "./cheatGuiCache.js";


(async () => {

	startCachingCheatGui();

	const app = express();
	app.set("trust proxy", true);
	const gs = await getGameStatus();

	if (!gs) { throw new Error("The game status request failed."); }

	// Cross Origin Resource Sharing
	app.use(cors());

	// No Caching
	app.use((_req, res, next) => {
		res.set("Cache-Control", "no-store");
		next();
	});

	// Rate Limit
	app.use(RateLimit({
		windowMs: 20*1000, // 20 seconds
		max: 4, // limit each IP to 4 requests per windowMs
    }));


	// Enforce hostname
	if (PRODUCTION !== "" && PRODUCTION !== "any") {
		app.use((req, res, next) => {

				if (req.hostname === "chat.prodigypnp.com") {
				 	res.redirect("https://chat.prodigypnp.com:8443/");
				} else if (req.hostname === "localhost") {
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

	


/*-----------------------------------------------*
 *                                               *
 *                 RATE LIMITER                  *
 *                                               *
 ------------------------------------------------*/






	app.get("/load-game.min.js", async (_req, res) => {


		
		var unmodifiedScript : string;
		var loadingText : string;


		(await fetch("https://code.prodigygame.com/js/load-game-ff6c26a637.min.js")).text().then(result => {
			unmodifiedScript = result;
		});

		
		(await fetch("https://raw.githubusercontent.com/ProdigyPNP/P-NP/master/loadingText.txt")).text().then(result => {
			loadingText = result;

			const loadVar : string = `const loadingText = \`${loadingText}\`.split("\\n");\n`;
			const send : string = loadVar + unmodifiedScript;

			res.type("text/js").send(send);
		});


		
	});


	// var loadingText=["Feeding pets","Studying spells","Delivering mail","Counting coins","Rearranging furniture","Solving for x","Planting grass","Burying fossils","Darkening the tower","Stocking shops","Dirtying socks","Cutting pizza","Carving wands","Sewing outfits","Petting buddies","Gathering clouds","Heating lava","Raking sand","Balancing equations","Mixing fractions","Carrying the one","Picking apples","Lighting lanterns","Going on tangents","Pulling levers","Planting beanstalks","Turning on weather machines","Waking Floatlings","Sharpening pencils","Memorizing times tables","Brewing potions","Morphing marbles","Getting lost in archives","Preparing questions","Warming up dance moves","Lighting fireworks","Sweeping confetti","Packing snowballs","Baking cakes","Chasing waterfalls","Hiding secrets","Rehearsing lines","Counting vertices","Comparing sizes"]




    // ./game.min.js
    // @ts-expect-error
	app.get(/\/(api\/)?game.min.js/, async (req, res) => {
		if (req.query.version && typeof req.query.version !== "string")
			return res.status(400).send("Invalid version specified.");
		const version = req.query.version ?? gs.gameClientVersion;
		try {
			res.type("js").send(`// game.min.js v${version}\n\n`+
				(UNMINIFY_SOUCE ? beautify : (_: any) => _)
					(await getPatchedGameFile(version))
			);
		} catch (e: unknown) {
			if (!(e instanceof Error)) throw e;
			return res.status(400).send(e.message);
		}
	});


    // ./public-game.min.js
    // @ts-expect-error
	app.get(/\/(api\/)?public-game.min.js/, async (req, res) => {
		if (typeof req.query.hash !== "string")
			return res.status(400).send("No hash specified.");
		try {
			res.type("js").send(await getPatchedPublicGameFile(req.query.hash));
		} catch (e: unknown) {
			if (!(e instanceof Error)) throw e;
			return res.status(400).send(e.message);
		}
	});

    // ./version
	app.get("/version", async (_req, res) => {
		const output : string = VERSION;
		res.type("text/plain").send(output);
	});


    // ./download
	app.get("/download", (_req, res) => res.redirect(DOWNLOAD_LINK));


	// ./license
    app.get("/license", (_req, res) => res.redirect(LICENSE_LINK));

	

    // ./gui
    app.get("/gui", (_req, res) => {
		res.type("text/js").send(latestCheatGui);
	});


    // ./gameVersion
    // @ts-expect-error
    app.get("/gameVersion", async (req, res) => {
    		if (req.query.version && typeof req.query.version !== "string")
    			return res.status(400).send("Invalid version specified.");
    		const version : String = req.query.version ?? gs.gameClientVersion;
    		try {
    			res.type("text/plain").send(version.valueOf());
    		} catch (e: unknown) {
    			if (!(e instanceof Error)) throw e;
    			return res.status(400).send(e.message);
    		}
    	});




	// ./hash
	// @ts-expect-error
	app.get("/hash", async (req, res) => {
		if (req.query.version && typeof req.query.version !== "string")
			return res.status(400).send("Invalid version specified.");
		const version : string = req.query.version ?? gs.gameClientVersion;

		res.type("text/plain").send(hash(`// game.min.js v${version}\n\n`+
		(UNMINIFY_SOUCE ? beautify : (_: any) => _)
			(await getPatchedGameFile(version))
		));
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

		/** HTTPS Server */
		let httpsServer = https.createServer({
            key: fs.readFileSync(HTTPS_KEY_PATH),
            cert: fs.readFileSync(HTTPS_CHAIN_PATH),
        }, app);

        // HTTPS server starts listening the `HTTPS_PORT`
        httpsServer.listen(HTTPS_PORT, () => {
            console.log(`СЕРВЕР HTTPS ВКЛЮЧЕН НА: http://localhost:${HTTPS_PORT}/`);
         });
    } else {
        console.log("НЕ ИСПОЛЬЗУЕМ HTTPS.");
    }

      
    /* HTTP Server */
    http.createServer(app).listen(HTTP_PORT, () => {
        console.log(`СЕРВЕР HTTP ВКЛЮЧЕН НА: http://localhost:${HTTP_PORT}/`);
    });


})();
