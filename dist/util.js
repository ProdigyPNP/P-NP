"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatchedPublicGameFile = exports.getPatchedGameFile = exports.patchGameFile = exports.logtraffic = exports.getGameFile = exports.getGameStatus = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const constants_1 = require("./constants");
const displayImages_1 = require("./displayImages");
const sucrase_1 = require("sucrase");
const es6 = (...args) => (0, sucrase_1.transform)(String.raw(...args), { transforms: ["typescript"] }).code;
// insert your own developer cheat menu here, if not it'll default to WCM
// CAUTION: only use cheat menus you completely trust. cheat menus have complete access
const cheatMenuLink = ""
    || "https://raw.githubusercontent.com/ProdigyPNP/ProdigyMathGameHacking/master/cheatGUI/dist/bundle.js";
let lastGameStatus = null;
const getGameStatus = async () => {
    if (lastGameStatus)
        return lastGameStatus;
    try {
        const json = (await (await (0, node_fetch_1.default)("https://math.prodigygame.com/play?launcher=true")).text()).match(/(?<=gameStatusDataStr = ').+(?=')/);
        if (!json?.length)
            return null;
        return JSON.parse(json[0]);
    }
    catch (e) {
        console.warn(`An error occurred while obtaining the game status.\n${e}`);
        return null;
    }
};
exports.getGameStatus = getGameStatus;
setInterval(() => {
    lastGameStatus = null;
    patchedPublicGameFile = null;
}, 30 * 60 * 1000); // 30 minutes
const gameFileCache = {};
const getGameFile = async (version) => {
    if (version in gameFileCache)
        return gameFileCache[version];
    if (!version.match(/^[0-9-.]+$/))
        throw new Error("Invalid version specified.");
    try {
        return (gameFileCache[version] = await (await (0, node_fetch_1.default)(`https://code.prodigygame.com/code/${version}/game.min.js?v=${version}`)).text());
    }
    catch (e) {
        throw new Error(`Could not fetch game file with version ${version}.\nReason: ${e}`);
    }
};
exports.getGameFile = getGameFile;
const logtraffic = () => {
};
exports.logtraffic = logtraffic;
const patchGameFile = (str, version) => {
    const variables = [str.match(/window,function\((.)/)[1], str.match(/var (.)={}/)[1]];
    const patches = Object.entries({
        [`s),this._game=${variables[1]}`]: `s),this._game=${variables[1]};
			jQuery.temp = window._;
			let lodashChecker = setInterval(() => {
				if (jQuery.temp !== window._) {
					window._ = jQuery.temp;
					delete jQuery.temp;
					clearInterval(lodashChecker);
				}
			});
			Object.defineProperty(window._, "instance", { 
				get: () => ${variables[0]}.instance,
		enumerable: true,
	configurable: true
			});`,
        [`${variables[0]}.constants=Object`]: `window._.constants=${variables[0]},${variables[0]}.constants=Object`,
        [`window,function(${variables[0]}){var ${variables[1]}={};`]: `window,function(${variables[0]}){var ${variables[1]}={};window._.modules=${variables[1]};`,
        [`${variables[0]}.prototype.hasMembership=`]: `${variables[1]}.prototype.hasMembership=_=>true,${variables[1]}.prototype.originalHasMembership=`,
        "answerQuestion=function(){": `answerQuestion=function(){
			if (!_.constants.get('GameConstants.Debug.EDUCATION_ENABLED')) {
				const wasCorrect = Math.random() < _.constants.get('GameConstants.Debug.AUTO_ANSWER_CORRECT_PERCENT');
                this.onQuestionAnswered.dispatch(wasCorrect, 0, null);
                if (wasCorrect) {
                    this.onQuestionAnsweredCorrectly.dispatch(0, null);
                } else {
                    this.onQuestionAnsweredIncorrectly.dispatch(0, null);
                }
                return;
			}
		`
    });
    patches.push([/type\.sendEvent=function\((.), (.), (.)\) \{/, `type.sendEvent=function($1, $2, $3) {
			if (!_.constants.get('GameConstants.Debug.EDUCATION_ENABLED')) {
				return
			}
		`]);
    patches.push([/(var .=this.findParameter("externalFactory"))/, `
	if (!_.constants.get('GameConstants.Debug.EDUCATION_ENABLED')) {
		const wasCorrect: boolean = Math.random() < _.constants.get('GameConstants.Debug.AUTO_ANSWER_CORRECT_PERCENT');
		this.finish({ answerCorrect: wasCorrect, responseTime: 0 });
		return;
	}
	$1`]);
    patches.push([/openQuestionInterfaceThenEmitNotifications=function\((.), (.), (.), (.), (.)\) \{/, `openQuestionInterfaceThenEmitNotifications=function($1, $2, $3, $4, $5) {
	if (!_.constants.get('GameConstants.Debug.EDUCATION_ENABLED')) {
		const wasCorrect = true;
		const skill = {}
		const questionAnswerResponse = { eventType, skill, wasCorrect };
		this.fireEvent(MathTowerNotificationType.TOWER_TOWN_QUESTION_ANSWERED, questionAnswerResponse);
		if (callback) {
			callback(wasCorrect, 10, 1, false, false, skill);
		}
		return;
	}
	`]);
    patches.push([/.\.setContentVisible\(!1\)\}\)/, "})"]);
    return `
${es6 `
	/** DO NOT TOUCH **/
	const _getBox=(o,t)=>({string:"+",style:"font-size: 1px; padding: 0 "+Math.floor(o/2)+"px; line-height: "+t+"px;"});
	console.image=((o,t=1)=>{const e=new Image;e.onload=(()=>{const n=_getBox(e.width*t,e.height*t);
	console.log("%c"+n.string,n.style+"background: url("+o+"); background-size: "+e.width*t+"px "
	+e.height*t+"px; color: transparent;")}),e.src=o});
	/** ok touch now */
	const oldLog = console.log.bind(console);
	console.log = (...d) => {
		if (d && d.length && typeof d[0] === "string" && d[0].includes("This is a browser feature for developers only")) return "lol no";
		if (new Error().stack?.split("\n").reverse()[0]?.includes("load-identity")) return "fuck you";
		return oldLog(...d);
	};
	_.variables = Object.create(null);
`}

${patches.reduce((l, c) => l.replace(...c), str)}

${es6 `
	_.functions = Object.create(null);
	_.functions.escapeBattle = () => {
		const currentState = _.instance.game.state.current;
		if (currentState === "PVP") _.instance.game.state.states.PVP.endPVP();
		else if (currentState === "CoOp") _.instance.prodigy.world.$(_.player.data.zone);
		else _.instance.game.state.callbackContext.runAwayCallback();
	};
	Object.defineProperty(_, "player", {
		get: () => _.${str.match(new RegExp("instance.prodigy.gameContainer.get\\(\"...-....\"\\).player"))?.[0]},
		enumerable: true,
configurable: true
	});
	Object.defineProperty(_, "gameData", { 
		get: () => _.instance.game.state.states.get("Boot")._gameData,
enumerable: true,
configurable: true
	});
	Object.defineProperty(_, "localizer", {
		get: () => _.instance.prodigy.gameContainer.get("LocalizationService"),
enumerable: true,
configurable: true
	});
	Object.defineProperty(_, "network", {
		get: () => _.player.game.input.onDown._bindings[0].context,
enumerable: true,
configurable: true
	});
	Object.defineProperty(_, "hack", {
enumerable: true,
configurable: true,
		get: () => _
	});

	fetch('https://p-np.prodigypnp.repl.co/hit',{method: "POST"})

	console.log("%cP-NP Patcher", "font-size:40px;color:#540052;font-weight:900;font-family:sans-serif;");
	console.log("%cVersion ${constants_1.VERSION}", "font-size:20px;color:#000025;font-weight:700;font-family:sans-serif;");
	
	console.image((e => e[Math.floor(Math.random() * e.length)])(${JSON.stringify(displayImages_1.displayImages)}));
	SW.Load.onGameLoad();
	setTimeout(() =>
		(async () =>
			eval(
				await (
					await fetch(
						"${cheatMenuLink}"
					)
				).text()
			)
		)(), 15000);
	console.trace = () => {};
`}
`;
};
exports.patchGameFile = patchGameFile;
const patchedGameFileCache = {};
const getPatchedGameFile = async (version) => {
    if (version in patchedGameFileCache)
        return patchedGameFileCache[version];
    return (patchedGameFileCache[version] = (0, exports.patchGameFile)(await (0, exports.getGameFile)(version), version));
};
exports.getPatchedGameFile = getPatchedGameFile;
let patchedPublicGameFile = null;
const getPatchedPublicGameFile = async (hash) => {
    if (patchedPublicGameFile)
        return patchedPublicGameFile;
    if (!hash.match(/^[a-fA-F0-9]+$/))
        throw new Error("Invalid hash.");
    const file = await (await (0, node_fetch_1.default)(`https://code.prodigygame.com/js/public-game-${hash}.min.js`)).text();
    return (patchedPublicGameFile = `
	(() => {
		const console = new Proxy({}, { get: () => () => {} });
		${file}
	})();
	`);
};
exports.getPatchedPublicGameFile = getPatchedPublicGameFile;
