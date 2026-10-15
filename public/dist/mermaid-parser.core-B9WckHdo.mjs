import { C as e, S as t, _ as n, a as r, b as i, c as a, d as o, f as ee, g as te, h as ne, i as s, l as re, m as ie, n as c, o as l, p as ae, r as oe, s as se, t as u, u as d, v as ce, w as f, x as p, y as le } from "./chunk-FOHPRMQF-BBThACIH.mjs";
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-I5DQTOEV.mjs
var ue = class extends u {
	static {
		p(this, "RadarTokenBuilder");
	}
	constructor() {
		super(["radar-beta"]);
	}
}, m = { parser: {
	TokenBuilder: /* @__PURE__ */ p(() => new ue(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ p(() => new s(), "ValueConverter")
} };
function h(n = l) {
	let r = f(e(n), d), i = f(t({ shared: r }), ae, m);
	return r.ServiceRegistry.register(i), {
		shared: r,
		Radar: i
	};
}
p(h, "createRadarServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-OUJLGHUK.mjs
var de = class extends u {
	static {
		p(this, "RailroadTokenBuilder");
	}
	constructor() {
		super(["railroad-beta"]);
	}
}, g = /* @__PURE__ */ p((e) => {
	let t = e.slice(1, -1), n = "";
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		if (r === "\\" && e + 1 < t.length) {
			e++;
			let r = t[e];
			switch (r) {
				case "n":
					n += "\n";
					break;
				case "r":
					n += "\r";
					break;
				case "t":
					n += "	";
					break;
				default: n += r;
			}
		} else n += r;
	}
	return n;
}, "decodeEscapedString"), fe = class extends c {
	static {
		p(this, "RailroadValueConverter");
	}
	runConverter(e, t, n) {
		let r = super.runConverter(e, t, n);
		if (e.name === "TITLE" && typeof r == "string") {
			let e = r.trim();
			if (e.startsWith("\"") && e.endsWith("\"") || e.startsWith("'") && e.endsWith("'")) return g(e);
		}
		return r;
	}
	runCustomConverter(e, t, n) {
		if (e.name === "RR_STRING") return g(t);
	}
}, _ = { parser: {
	TokenBuilder: /* @__PURE__ */ p(() => new de(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ p(() => new fe(), "ValueConverter")
} };
function v(n = l) {
	let r = f(e(n), d), i = f(t({ shared: r }), te, _);
	return r.ServiceRegistry.register(i), {
		shared: r,
		Railroad: i
	};
}
p(v, "createRailroadServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-2ZTRR5NV.mjs
var pe = class extends u {
	static {
		p(this, "RailroadEbnfTokenBuilder");
	}
	constructor() {
		super(["railroad-ebnf-beta"]);
	}
}, y = /* @__PURE__ */ p((e) => {
	let t = e.slice(1, -1), n = "";
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		if (r === "\\" && e + 1 < t.length) {
			e++;
			let r = t[e];
			switch (r) {
				case "n":
					n += "\n";
					break;
				case "r":
					n += "\r";
					break;
				case "t":
					n += "	";
					break;
				default: n += r;
			}
		} else n += r;
	}
	return n;
}, "decodeEscapedString"), me = class extends c {
	static {
		p(this, "RailroadEbnfValueConverter");
	}
	runConverter(e, t, n) {
		let r = super.runConverter(e, t, n);
		if (e.name === "TITLE" && typeof r == "string") {
			let e = r.trim();
			if (e.startsWith("\"") && e.endsWith("\"") || e.startsWith("'") && e.endsWith("'")) return y(e);
		}
		return r;
	}
	runCustomConverter(e, t, n) {
		if (e.name === "EBNF_STRING") return y(t);
		if (e.name === "EBNF_SPECIAL_SEQUENCE") return t.slice(1, -1).trim();
	}
}, b = { parser: {
	TokenBuilder: /* @__PURE__ */ p(() => new pe(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ p(() => new me(), "ValueConverter")
} };
function x(n = l) {
	let r = f(e(n), d), i = f(t({ shared: r }), ne, b);
	return r.ServiceRegistry.register(i), {
		shared: r,
		RailroadEbnf: i
	};
}
p(x, "createRailroadEbnfServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-XHIXRSVI.mjs
var he = class extends u {
	static {
		p(this, "RailroadAbnfTokenBuilder");
	}
	constructor() {
		super(["railroad-abnf-beta"]);
	}
}, ge = class extends c {
	static {
		p(this, "RailroadAbnfValueConverter");
	}
	runConverter(e, t, n) {
		let r = super.runConverter(e, t, n);
		if (e.name === "TITLE" && typeof r == "string") {
			let e = r.trim();
			if (e.startsWith("\"") && e.endsWith("\"") || e.startsWith("'") && e.endsWith("'")) return e.slice(1, -1);
		}
		return r;
	}
	runCustomConverter(e, t, n) {
		if (e.name === "ABNF_STRING") return t.slice(1, -1);
	}
}, S = { parser: {
	TokenBuilder: /* @__PURE__ */ p(() => new he(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ p(() => new ge(), "ValueConverter")
} };
function C(n = l) {
	let r = f(e(n), d), i = f(t({ shared: r }), ie, S);
	return r.ServiceRegistry.register(i), {
		shared: r,
		RailroadAbnf: i
	};
}
p(C, "createRailroadAbnfServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-747NJXEK.mjs
var _e = class extends u {
	static {
		p(this, "RailroadPegTokenBuilder");
	}
	constructor() {
		super(["railroad-peg-beta"]);
	}
}, w = /* @__PURE__ */ p((e) => {
	let t = e.slice(1, -1), n = "";
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		if (r === "\\" && e + 1 < t.length) {
			e++;
			let r = t[e];
			switch (r) {
				case "n":
					n += "\n";
					break;
				case "r":
					n += "\r";
					break;
				case "t":
					n += "	";
					break;
				default: n += r;
			}
		} else n += r;
	}
	return n;
}, "decodeEscapedString"), ve = class extends c {
	static {
		p(this, "RailroadPegValueConverter");
	}
	runConverter(e, t, n) {
		let r = super.runConverter(e, t, n);
		if (e.name === "TITLE" && typeof r == "string") {
			let e = r.trim();
			if (e.startsWith("\"") && e.endsWith("\"") || e.startsWith("'") && e.endsWith("'")) return w(e);
		}
		return r;
	}
	runCustomConverter(e, t, n) {
		if (e.name === "PEG_STRING") return w(t);
	}
}, T = { parser: {
	TokenBuilder: /* @__PURE__ */ p(() => new _e(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ p(() => new ve(), "ValueConverter")
} };
function E(r = l) {
	let i = f(e(r), d), a = f(t({ shared: i }), n, T);
	return i.ServiceRegistry.register(a), {
		shared: i,
		RailroadPeg: a
	};
}
p(E, "createRailroadPegServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-6K3QC6MW.mjs
var ye = class extends u {
	static {
		p(this, "TreemapTokenBuilder");
	}
	constructor() {
		super(["treemap"]);
	}
}, be = /classDef\s+([A-Z_a-z]\w+)(?:\s+([^\n\r;]*))?;?/, xe = class extends c {
	static {
		p(this, "TreemapValueConverter");
	}
	runCustomConverter(e, t, n) {
		if (e.name === "NUMBER2") return parseFloat(t.replace(/,/g, ""));
		if (e.name === "SEPARATOR" || e.name === "STRING2") return t.substring(1, t.length - 1);
		if (e.name === "INDENTATION") return t.length;
		if (e.name === "ClassDef") {
			if (typeof t != "string") return t;
			let e = be.exec(t);
			if (e) return {
				$type: "ClassDefStatement",
				className: e[1],
				styleText: e[2] || void 0
			};
		}
	}
};
function D(e) {
	let t = e.validation.TreemapValidator, n = e.validation.ValidationRegistry;
	if (n) {
		let e = { Treemap: t.checkSingleRoot.bind(t) };
		n.register(e, t);
	}
}
p(D, "registerValidationChecks");
var Se = class {
	static {
		p(this, "TreemapValidator");
	}
	checkSingleRoot(e, t) {
		let n;
		for (let r of e.TreemapRows) r.item && (n === void 0 && r.indent === void 0 ? n = 0 : (r.indent === void 0 || n !== void 0 && n >= parseInt(r.indent, 10)) && t("error", "Multiple root nodes are not allowed in a treemap.", {
			node: r,
			property: "item"
		}));
	}
}, O = {
	parser: {
		TokenBuilder: /* @__PURE__ */ p(() => new ye(), "TokenBuilder"),
		ValueConverter: /* @__PURE__ */ p(() => new xe(), "ValueConverter")
	},
	validation: { TreemapValidator: /* @__PURE__ */ p(() => new Se(), "TreemapValidator") }
};
function k(n = l) {
	let r = f(e(n), d), i = f(t({ shared: r }), le, O);
	return r.ServiceRegistry.register(i), D(i), {
		shared: r,
		Treemap: i
	};
}
p(k, "createTreemapServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-ICYGCRZG.mjs
var Ce = class extends c {
	static {
		p(this, "WardleyValueConverter");
	}
	runCustomConverter(e, t, n) {
		switch (e.name.toUpperCase()) {
			case "LINK_LABEL": return t.substring(1).trim();
			default: return;
		}
	}
}, A = { parser: { ValueConverter: /* @__PURE__ */ p(() => new Ce(), "ValueConverter") } };
function j(n = l) {
	let r = f(e(n), d), a = f(t({ shared: r }), i, A);
	return r.ServiceRegistry.register(a), {
		shared: r,
		Wardley: a
	};
}
p(j, "createWardleyServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-6TQVIW2G.mjs
var we = class extends u {
	static {
		p(this, "CynefinTokenBuilder");
	}
	constructor() {
		super(["cynefin-beta"]);
	}
}, M = { parser: {
	TokenBuilder: /* @__PURE__ */ p(() => new we(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ p(() => new s(), "ValueConverter")
} };
function Te(n = l) {
	let i = f(e(n), d), a = f(t({ shared: i }), r, M);
	return i.ServiceRegistry.register(a), {
		shared: i,
		Cynefin: a
	};
}
p(Te, "createCynefinServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-KI3K4JFJ.mjs
var Ee = class extends u {
	static {
		p(this, "GitGraphTokenBuilder");
	}
	constructor() {
		super(["gitGraph"]);
	}
}, N = { parser: {
	TokenBuilder: /* @__PURE__ */ p(() => new Ee(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ p(() => new s(), "ValueConverter")
} };
function P(n = l) {
	let r = f(e(n), d), i = f(t({ shared: r }), a, N);
	return r.ServiceRegistry.register(i), {
		shared: r,
		GitGraph: i
	};
}
p(P, "createGitGraphServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-5V3GS4D5.mjs
var De = class extends u {
	static {
		p(this, "InfoTokenBuilder");
	}
	constructor() {
		super(["info", "showInfo"]);
	}
}, F = { parser: {
	TokenBuilder: /* @__PURE__ */ p(() => new De(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ p(() => new s(), "ValueConverter")
} };
function I(n = l) {
	let r = f(e(n), d), i = f(t({ shared: r }), re, F);
	return r.ServiceRegistry.register(i), {
		shared: r,
		Info: i
	};
}
p(I, "createInfoServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-UY3FDG6J.mjs
var Oe = class extends u {
	static {
		p(this, "PacketTokenBuilder");
	}
	constructor() {
		super(["packet"]);
	}
}, L = { parser: {
	TokenBuilder: /* @__PURE__ */ p(() => new Oe(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ p(() => new s(), "ValueConverter")
} };
function R(n = l) {
	let r = f(e(n), d), i = f(t({ shared: r }), o, L);
	return r.ServiceRegistry.register(i), {
		shared: r,
		Packet: i
	};
}
p(R, "createPacketServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-3Z5EZCMW.mjs
var ke = class extends u {
	static {
		p(this, "PieTokenBuilder");
	}
	constructor() {
		super(["pie", "showData"]);
	}
}, Ae = class extends c {
	static {
		p(this, "PieValueConverter");
	}
	runCustomConverter(e, t, n) {
		if (e.name === "PIE_SECTION_LABEL") return t.replace(/"/g, "").trim();
	}
}, z = { parser: {
	TokenBuilder: /* @__PURE__ */ p(() => new ke(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ p(() => new Ae(), "ValueConverter")
} };
function B(n = l) {
	let r = f(e(n), d), i = f(t({ shared: r }), ee, z);
	return r.ServiceRegistry.register(i), {
		shared: r,
		Pie: i
	};
}
p(B, "createPieServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-IH6LHLGP.mjs
var je = class extends c {
	static {
		p(this, "TreeViewValueConverter");
	}
	runCustomConverter(e, t, n) {
		if (e.name === "INDENTATION") return t?.length || 0;
		if (e.name === "QUOTED_NAME") return t.substring(1, t.length - 1);
		if (e.name === "BARE_NAME") return t.replace(/[\t ]+$/, "");
		if (e.name === "CLASS_ANNOTATION") return t.trim().substring(3).trim();
		if (e.name === "ICON_ANNOTATION") {
			let e = t.trim();
			return e.substring(5, e.length - 1);
		}
		if (e.name === "DESC_ANNOTATION") return t.trim().substring(2).trim();
	}
}, Me = class extends u {
	static {
		p(this, "TreeViewTokenBuilder");
	}
	constructor() {
		super(["treeView-beta"]);
	}
}, V = { parser: {
	TokenBuilder: /* @__PURE__ */ p(() => new Me(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ p(() => new je(), "ValueConverter")
} };
function H(n = l) {
	let r = f(e(n), d), i = f(t({ shared: r }), ce, V);
	return r.ServiceRegistry.register(i), {
		shared: r,
		TreeView: i
	};
}
p(H, "createTreeViewServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-6AZGARVD.mjs
var Ne = class extends u {
	static {
		p(this, "ArchitectureTokenBuilder");
	}
	constructor() {
		super(["architecture"]);
	}
}, Pe = class extends c {
	static {
		p(this, "ArchitectureValueConverter");
	}
	runCustomConverter(e, t, n) {
		if (e.name === "ARCH_ICON") return t.replace(/[()]/g, "").trim();
		if (e.name === "ARCH_TEXT_ICON") return t.replace(/["()]/g, "");
		if (e.name === "ARCH_TITLE") {
			let e = t.replace(/^\[|]$/g, "").trim();
			return (e.startsWith("\"") && e.endsWith("\"") || e.startsWith("'") && e.endsWith("'")) && (e = e.slice(1, -1), e = e.replace(/\\"/g, "\"").replace(/\\'/g, "'")), e.trim();
		}
	}
}, U = { parser: {
	TokenBuilder: /* @__PURE__ */ p(() => new Ne(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ p(() => new Pe(), "ValueConverter")
} };
function W(n = l) {
	let r = f(e(n), d), i = f(t({ shared: r }), oe, U);
	return r.ServiceRegistry.register(i), {
		shared: r,
		Architecture: i
	};
}
p(W, "createArchitectureServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-6EIED4P4.mjs
var Fe = class extends u {
	static {
		p(this, "EventModelingTokenBuilder");
	}
	constructor() {
		super(["eventmodeling"]);
	}
}, G = /* @__PURE__ */ new Set(["cmd", "command"]), K = /* @__PURE__ */ new Set(["evt", "event"]), q = /* @__PURE__ */ new Set(["rmo", "readmodel"]), J = /* @__PURE__ */ new Set(["pcr", "processor"]), Y = /* @__PURE__ */ new Set(["ui"]);
function X(e) {
	let t = e.validation.EventModelingValidator, n = e.validation.ValidationRegistry;
	if (n) {
		let e = {
			EmTimeFrame: t.checkSourceFrameTypes.bind(t),
			EmResetFrame: t.checkSourceFrameTypes.bind(t)
		};
		n.register(e, t);
	}
}
p(X, "registerValidationChecks");
var Ie = class {
	static {
		p(this, "EventModelingValidator");
	}
	checkSourceFrameTypes(e, t) {
		e.sourceFrames.length !== 0 && (G.has(e.modelEntityType) ? this.validateSources(e, /* @__PURE__ */ new Set([...Y, ...J]), "command", "ui or processor", t) : K.has(e.modelEntityType) ? this.validateSources(e, G, "event", "command", t) : q.has(e.modelEntityType) ? this.validateSources(e, K, "read model", "event", t) : J.has(e.modelEntityType) ? this.validateSources(e, q, "processor", "read model", t) : Y.has(e.modelEntityType) && this.validateSources(e, q, "ui", "read model", t));
	}
	validateSources(e, t, n, r, i) {
		for (let a of e.sourceFrames) {
			let o = a.ref;
			o !== void 0 && !t.has(o.modelEntityType) && i("error", `A ${n} can only receive input from a ${r}, not from '${o.modelEntityType}'.`, {
				node: e,
				property: "sourceFrames"
			});
		}
	}
}, Z = {
	parser: {
		TokenBuilder: /* @__PURE__ */ p(() => new Fe(), "TokenBuilder"),
		ValueConverter: /* @__PURE__ */ p(() => new s(), "ValueConverter")
	},
	validation: { EventModelingValidator: /* @__PURE__ */ p(() => new Ie(), "EventModelingValidator") }
};
function Le(n = l) {
	let r = f(e(n), d), i = f(t({ shared: r }), se, Z);
	return r.ServiceRegistry.register(i), X(i), {
		shared: r,
		EventModel: i
	};
}
p(Le, "createEventModelingServices");
//#endregion
//#region node_modules/mermaid/node_modules/@mermaid-js/parser/dist/mermaid-parser.core.mjs
var Q = {}, Re = {
	info: /* @__PURE__ */ p(async () => {
		let { createInfoServices: e } = await import("./info-A6RAGUB7-DH7_O8zt.mjs");
		Q.info = e().Info.parser.LangiumParser;
	}, "info"),
	packet: /* @__PURE__ */ p(async () => {
		let { createPacketServices: e } = await import("./packet-AYTQ26CC-C5Fhskc7.mjs");
		Q.packet = e().Packet.parser.LangiumParser;
	}, "packet"),
	pie: /* @__PURE__ */ p(async () => {
		let { createPieServices: e } = await import("./pie-WAS4IAKB-DqJ0O17i.mjs");
		Q.pie = e().Pie.parser.LangiumParser;
	}, "pie"),
	treeView: /* @__PURE__ */ p(async () => {
		let { createTreeViewServices: e } = await import("./treeView-Q6P3EWNA-DLEJu7db.mjs");
		Q.treeView = e().TreeView.parser.LangiumParser;
	}, "treeView"),
	architecture: /* @__PURE__ */ p(async () => {
		let { createArchitectureServices: e } = await import("./architecture-7GRP2DOG-BF_f4MTk.mjs");
		Q.architecture = e().Architecture.parser.LangiumParser;
	}, "architecture"),
	gitGraph: /* @__PURE__ */ p(async () => {
		let { createGitGraphServices: e } = await import("./gitGraph-4MIJSDKK-QgvRzu83.mjs");
		Q.gitGraph = e().GitGraph.parser.LangiumParser;
	}, "gitGraph"),
	eventmodeling: /* @__PURE__ */ p(async () => {
		let { createEventModelingServices: e } = await import("./eventmodeling-NTZA5JFV-B4nqAjyy.mjs");
		Q.eventmodeling = e().EventModel.parser.LangiumParser;
	}, "eventmodeling"),
	radar: /* @__PURE__ */ p(async () => {
		let { createRadarServices: e } = await import("./radar-RG4KPBEZ-3DQFCp6t.mjs");
		Q.radar = e().Radar.parser.LangiumParser;
	}, "radar"),
	railroad: /* @__PURE__ */ p(async () => {
		let { createRailroadServices: e } = await import("./railroad-74A4TZTK-WEWyiJqF.mjs");
		Q.railroad = e().Railroad.parser.LangiumParser;
	}, "railroad"),
	railroadEbnf: /* @__PURE__ */ p(async () => {
		let { createRailroadEbnfServices: e } = await import("./railroad-ebnf-LZEXJU2U-J_KHYaAJ.mjs");
		Q.railroadEbnf = e().RailroadEbnf.parser.LangiumParser;
	}, "railroadEbnf"),
	railroadAbnf: /* @__PURE__ */ p(async () => {
		let { createRailroadAbnfServices: e } = await import("./railroad-abnf-HS5TGJTU-OlPXEx_n.mjs");
		Q.railroadAbnf = e().RailroadAbnf.parser.LangiumParser;
	}, "railroadAbnf"),
	railroadPeg: /* @__PURE__ */ p(async () => {
		let { createRailroadPegServices: e } = await import("./railroad-peg-WCYAUIDC-DL9ymdhV.mjs");
		Q.railroadPeg = e().RailroadPeg.parser.LangiumParser;
	}, "railroadPeg"),
	treemap: /* @__PURE__ */ p(async () => {
		let { createTreemapServices: e } = await import("./treemap-WGGIJYW6-CQ4S6NEU.mjs");
		Q.treemap = e().Treemap.parser.LangiumParser;
	}, "treemap"),
	wardley: /* @__PURE__ */ p(async () => {
		let { createWardleyServices: e } = await import("./wardley-WFR3VGLG-DlLesWgj.mjs");
		Q.wardley = e().Wardley.parser.LangiumParser;
	}, "wardley"),
	cynefin: /* @__PURE__ */ p(async () => {
		let { createCynefinServices: e } = await import("./cynefin-OW5HDTMX-Drh0ioBd.mjs");
		Q.cynefin = e().Cynefin.parser.LangiumParser;
	}, "cynefin")
};
async function ze(e, t) {
	let n = Re[e];
	if (!n) throw Error(`Unknown diagram type: ${e}`);
	Q[e] || await n();
	let r = Q[e].parse(t);
	if (r.lexerErrors.length > 0 || r.parserErrors.length > 0) throw new $(r);
	return r.value;
}
p(ze, "parse");
var $ = class extends Error {
	constructor(e) {
		let t = e.lexerErrors.map((e) => `Lexer error on line ${e.line !== void 0 && !isNaN(e.line) ? e.line : "?"}, column ${e.column !== void 0 && !isNaN(e.column) ? e.column : "?"}: ${e.message}`).join("\n"), n = e.parserErrors.map((e) => `Parse error on line ${e.token.startLine !== void 0 && !isNaN(e.token.startLine) ? e.token.startLine : "?"}, column ${e.token.startColumn !== void 0 && !isNaN(e.token.startColumn) ? e.token.startColumn : "?"}: ${e.message}`).join("\n");
		super(`Parsing failed: ${t} ${n}`), this.result = e;
	}
	static {
		p(this, "MermaidParseError");
	}
};
//#endregion
export { v as A, T as C, b as D, C as E, h as M, x as O, k as S, S as T, M as _, U as a, j as b, H as c, L as d, R as f, P as g, N as h, Le as i, m as j, _ as k, z as l, I as m, ze as n, W as o, F as p, Z as r, V as s, $ as t, B as u, Te as v, E as w, O as x, A as y };
