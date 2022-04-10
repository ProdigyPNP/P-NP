// @ts-nocheck muahahaha
import type { Server } from "http";
import express from "express";
import cors from "cors";
import { getGameStatus, getPatchedGameFile, getPatchedPublicGameFile } from "./util";
import { DOWNLOAD_LINK, VERSION } from "./constants";
import beautify from "js-beautify";
import fs from 'fs';
const unminifySource = false;
(async () => {
	const app = express();
	app.set('trust proxy', true)
	const gs = await getGameStatus();

	if (!gs) throw new Error("The game status request failed.");

	app.use(cors());
	app.use((req, res, next) => {
		res.set('Cache-Control', 'no-store')
		next()
	})

	let toAdd = []
	let data = JSON.parse(fs.readFileSync('./hits.json', 'utf8'))
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

	app.get(/\/(api\/)?game.min.js/, async (req, res) => {
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

	app.get("/version", (req, res) => res.send(VERSION));
	app.get("/download", (req, res) => res.redirect(DOWNLOAD_LINK));
	app.post("/hit", (req, res) => {
		let current = { "ip": req.ip, timestamp: Date.now() }
		toAdd.push(current)
		res.status(200)
		res.send({ "status": "success", "data": current })
	});
	app.get("/stats", (req, res) => {
		res.send(stats)
	});
	
	const addr: ReturnType<Server["address"]> = app.listen(process.env.PORT ?? 1337, () =>
		console.log(`P-NP has started on :${typeof addr === "string" ? addr : addr?.port ?? ""}!`)).address();
})();
