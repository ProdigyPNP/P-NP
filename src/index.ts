import type { Server } from "http"; // Server typings
import express from "express"; // Express server
import cors from "cors"; // CORS
import { getGameStatus, getPatchedGameFile, getPatchedPublicGameFile } from "./util"; // Gamefile patchers
import { DOWNLOAD_LINK, VERSION, LICENSE_LINK, SERVER_PORT, UNMINIFY_SOUCE } from "./constants"; // Constants
import beautify from "js-beautify"; // JavaScript beautifier
import fs from "fs"; // File system
import { hash } from "./hash"; // Hash function
import fetch from "node-fetch"; // fetch
import { latestCheatGui, startCachingCheatGui } from "./cheatGuiCache";




/* Increment hits.json by 1 */
function toHits () {
    var final = "";
    fs.readFile("hits.json", "utf8", function(err, data : string) {

        if (err) { return console.error(err); }

        const contents : number = Number(data);
        const incremented : number = contents + 1;
        const toStr : string = incremented.toString();
        final = toStr;
        fs.writeFile("hits.json", final, (err) => {
            if (err) return console.error(err);
        });
    });
}



(async () => {

	startCachingCheatGui();

	const app = express();
	app.set("trust proxy", true);
	const gs = await getGameStatus();

	if (!gs) { throw new Error("The game status request failed."); }

	app.use(cors());
	// @ts-expect-error
	app.use((req, res, next) => {
		res.set("Cache-Control", "no-cache");
		next();
	});





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
	    toHits();
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
		const output : string = VERSION || (await (await fetch("https://infinitezero.net/version")).text()).valueOf();
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

	const addr: ReturnType<Server["address"]> = app.listen(SERVER_PORT, () =>
		console.log(`[P-NP Patcher] P-NP has started on :${typeof addr === "string" ? addr : addr?.port ?? ""}!`)
	).address();

})();