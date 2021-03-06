import type { Server } from "http"; // Server typings
import express from "express"; // Express server
import cors from "cors"; // CORS
import { getGameStatus, getPatchedGameFile, getPatchedPublicGameFile } from "./util"; // Gamefile patchers
import { DOWNLOAD_LINK, VERSION, GUI_LINK, LICENSE_LINK } from "./constants"; // Constants
import beautify from "js-beautify"; // JavaScript beautifier
import fs from "fs"; // File system
import { hash } from "./hash"; // Hash function
import fetch from "node-fetch";

const unminifySource = false; // Unminify source code


const port = 1337; // <------ Port


// Increment hits.json by 1
function toHits () {
    var final = "";
    fs.readFile("hits.json", "utf8", function(err, data : string) {

        if (err) return console.error(err);

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

	var cheatGuiCache : string = (await (await fetch(GUI_LINK)).text());
	setInterval(async () => {
		cheatGuiCache = (await (await fetch(GUI_LINK)).text())
	}, 30*60*1000); // 30 minutes

	const app = express();
	app.set("trust proxy", true);
	const gs = await getGameStatus();

	if (!gs) throw new Error("The game status request failed.");

	app.use(cors());
	// @ts-expect-error
	app.use((req, res, next) => {
		res.set("Cache-Control", "no-store");
		next();
	});






	/*



	let toAdd = []
	let data = JSON.parse(fs.readFileSync("./hits.json", "utf8"))
	let validate = (a: any, b: any, type: any) => {

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
					a.getMonth() === b.getMonth()
				break;
		}


	}
	let stats = {

		count: data.length,
		uniques: [...new Set(data.flatMap(({ ip }: { ip: any }) => ip))].sort().length,
		timeData: {


			recent: ["day", "week", "month"].map((y) => { return [y, { count: data.map((x) => { if (validate(new Date(), new Date(x.timestamp), y)) { return x; } }).filter(Boolean).length, uniques: [...(data.map((x) => { if (validate(new Date(), new Date(x.timestamp), y)) { return x } }).filter(Boolean)).map(x => x.ip).reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map()).keys()].length },]; }).reduce((o, v, i) => { return (o[v[0]] = v.slice(1)[0]), o; }, {}),
			analysis: {

				day: new Array(14)
					.fill()
					.map((a, index) => {

						let date = new Date()
						let month = date.getMonth() + 1
						let day = date.getDate() - index
						let year = date.getFullYear()
						if (day < 1) {
							day = new Date(date.getYear(), date.getMonth(), 0).getDate() + day;
							--month
						}
						if (month < 1) {

							month = 12;
							year--
						}
						return { month: month, day: day, year: year }
					}).reverse().map(x => {

						return [
							`${x.month}/${x.day}`,
							{

								count: data.filter((y) => {
									return (
										new Date(y.timestamp).getFullYear() === x.year &&
										new Date(y.timestamp).getMonth() + 1 === x.month &&
										new Date(y.timestamp).getDate() === x.day
									);
								}).length, 
								uniques: 
								[...new Set(data.filter((y) => {
									return (
										new Date(y.timestamp).getFullYear() === x.year &&
										new Date(y.timestamp).getMonth() + 1 === x.month &&
										new Date(y.timestamp).getDate() === x.day
									);
								}).flatMap(({ ip }: { ip: any }) => ip))].sort().length
							},
						];

					}),
				
				month: new Array(12)
					.fill()
					.map((a, index) => {

						let date = new Date()
						let month = date.getMonth() - (index - 1)
						let year = date.getFullYear()
						if (month < 1) {

							month = 12 + month
							--year
						}
						return { month: month, year: year }
					}).reverse().map(x => {

						return [
							`${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][x.month - 1]} ${x.year}`,
							{

								count: data.filter((y) => {
									return (
										new Date(y.timestamp).getFullYear() === x.year &&
										new Date(y.timestamp).getMonth() + 1 === x.month

									);
								}).length,
								uniques: [...new Set(data.filter((y) => {
									return (
										new Date(y.timestamp).getFullYear() === x.year &&
										new Date(y.timestamp).getMonth() + 1 === x.month

									);
								}).flatMap(({ ip }: { ip: any }) => ip))].sort().length

							}
						];

					})


			}
		}
	}
	

	setInterval(() => {
		data = JSON.parse(fs.readFileSync('./hits.json', 'utf8'))
		fs.writeFileSync('./hits.json', JSON.stringify(data.slice(0).concat(toAdd)))
		toAdd = []
		stats = {

			count: data.length,
			uniques: [...new Set(data.flatMap(({ ip }: { ip: any }) => ip))].sort().length,
			timeData: {


				recent: ["day", "week", "month"].map((y) => { return [y, { count: data.map((x) => { if (validate(new Date(), new Date(x.timestamp), y)) { return x; } }).filter(Boolean).length, uniques: [...(data.map((x) => { if (validate(new Date(), new Date(x.timestamp), y)) { return x } }).filter(Boolean)).map(x => x.ip).reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map()).keys()].length },]; }).reduce((o, v, i) => { return (o[v[0]] = v.slice(1)[0]), o; }, {}),
				analysis: {

					day: new Array(14)
						.fill()
						.map((a, index) => {

							let date = new Date()
							let month = date.getMonth() + 1
							let day = date.getDate() - index
							let year = date.getFullYear()
							if (day < 1) {
								day = new Date(date.getYear(), date.getMonth(), 0).getDate() + day;
								--month
							}
							if (month < 1) {

								month = 12;
								year--
							}
							return { month: month, day: day, year: year }
						}).reverse().map(x => {

							return [
								`${x.month}/${x.day}`,
								{

									count: data.filter((y) => {
										return (
											new Date(y.timestamp).getFullYear() === x.year &&
											new Date(y.timestamp).getMonth() + 1 === x.month &&
											new Date(y.timestamp).getDate() === x.day
										);
									}).length, 
									uniques: 
									[...new Set(data.filter((y) => {
										return (
											new Date(y.timestamp).getFullYear() === x.year &&
											new Date(y.timestamp).getMonth() + 1 === x.month &&
											new Date(y.timestamp).getDate() === x.day
										);
									}).flatMap(({ ip }: { ip: any }) => ip))].sort().length
								},
							];

						}),
					
					month: new Array(12)
						.fill()
						.map((a, index) => {

							let date = new Date()
							let month = date.getMonth() - (index - 1)
							let year = date.getFullYear()
							if (month < 1) {

								month = 12 + month
								--year
							}
							return { month: month, year: year }
						}).reverse().map(x => {

							return [
								`${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][x.month - 1]} ${x.year}`,
								{

									count: data.filter((y) => {
										return (
											new Date(y.timestamp).getFullYear() === x.year &&
											new Date(y.timestamp).getMonth() + 1 === x.month
	
										);
									}).length,
									uniques: [...new Set(data.filter((y) => {
										return (
											new Date(y.timestamp).getFullYear() === x.year &&
											new Date(y.timestamp).getMonth() + 1 === x.month
	
										);
									}).flatMap(({ ip }: { ip: any }) => ip))].sort().length

								}
							];

						})


				}
			}
		}
	},30*60*1000)



	*/

	// @ts-expect-error
	app.get("/load-game.min.js", async (req, res) => {


		
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
				(unminifySource ? beautify : (_: any) => _)
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
    // @ts-expect-error
	app.get("/version", (req, res) => res.type("text/plain").send(VERSION.valueOf()));


    // ./download
    // @ts-expect-error
	app.get("/download", (req, res) => res.redirect(DOWNLOAD_LINK));


	// ./license
	// @ts-expect-error
    app.get("/license", (req, res) => res.redirect(LICENSE_LINK));

	

    // ./gui
    // @ts-expect-error
    app.get("/gui", (req, res) => {
		res.type("text/js").send(cheatGuiCache);
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
		const version = req.query.version ?? gs.gameClientVersion;

		res.type("text/plain").send(hash(`// game.min.js v${version}\n\n`+
		(unminifySource ? beautify : (_: any) => _)
			(await getPatchedGameFile(version))
		));
	});




	/*
	app.post("/hit", (req, res) => {
		let current = { "ip": req.ip, timestamp: Date.now() }
		toAdd.push(current)
		res.status(200)
		res.send({ "status": "success", "data": current })
	});

	app.get("/stats", (req, res) => {
		res.send(stats)
	});
	*/
	
	const addr: ReturnType<Server["address"]> = app.listen(port, () =>
		console.log(`[P-NP Patcher] P-NP has started on :${typeof addr === "string" ? addr : addr?.port ?? ""}!`)).address();
})();



/*

const dashboard = (`
[P-NP Patcher]
ProdigyMathGame P-NP Patcher is running on :${port}
P-NP Dashboard!
    [B] - Rebuild the gamefiles
    [X] - Shut down P-NP
    [J] - Dump game.min.js
`);



readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

console.log(dashboard);



process.stdin.on("keypress", (str, key) => {
    const { name, ctrl } = key;

    // exit
    if (name === "x" || (name === "c" && ctrl)) {
        console.log("[P-NP Patcher] Shutting down P-NP...");
        process.exit();
    }

    // build
    if (name === "b") {

        console.log("[P-NP Patcher] P-NP Rebuild is coming soon.");
        return;
    }

    if (name === "j") {
        console.log(`[OldGuard] Dumping JavaScript bundle...`);
        console.log(`// game.min.js v${version}\n\n`+
                    				(unminifySource ? beautify : (_: any) => _)
                    					(await getPatchedGameFile(version))
        );
        return;
    }

});


*/