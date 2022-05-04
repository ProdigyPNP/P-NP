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
const port = 1337; // <------ Port
function toHits() {
    var final = "";
    fs_1.default.readFile("hits.json", "utf8", function (err, data) {
        const contents = Number(data);
        const incremented = contents + 1;
        const toStr = incremented.toString();
        final = toStr;
        fs_1.default.writeFile("hits.json", final, (error) => { });
    });
}
(async () => {
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
    // ./game.min.js
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
    // ./public-game.min.js
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
    // ./version
    app.get("/version", (req, res) => res.send(constants_1.VERSION));
    // ./download
    app.get("/download", (req, res) => res.redirect(constants_1.DOWNLOAD_LINK));
    // ./license
    app.get("/license", (req, res) => res.redirect(constants_1.LICENSE_LINK));
    // ./gui
    app.get("/gui", (req, res) => res.redirect(constants_1.GUI_LINK));
    // ./gameVersion
    app.get("/gameVersion", async (req, res) => {
        if (req.query.version && typeof req.query.version !== "string")
            return res.status(400).send("Invalid version specified.");
        const version = req.query.version ?? gs.gameClientVersion;
        try {
            res.send(version);
        }
        catch (e) {
            if (!(e instanceof Error))
                throw e;
            return res.status(400).send(e.message);
        }
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
    const addr = app.listen(port, () => console.log(`[P-NP Patcher] P-NP has started on :${typeof addr === "string" ? addr : addr?.port ?? ""}!`)).address();
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
