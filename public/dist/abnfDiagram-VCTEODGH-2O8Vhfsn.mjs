import { n as e } from "./chunk-Y2CYZVJY-i11wjrBe.mjs";
import { m as t } from "./src-zU1FfJ4L.mjs";
import "./chunk-DU6HZSFF-pZyqSmOp.mjs";
import "./dist-D-UnJAjD.mjs";
import { n, r, t as i } from "./chunk-SVP7TREG-JcRBotSQ.mjs";
import { t as a } from "./chunk-JWPE2WC7-DIKiF5cm.mjs";
import { E as o, t as s } from "./mermaid-parser.core-B9WckHdo.mjs";
//#region node_modules/mermaid/dist/chunks/mermaid.core/abnfDiagram-VCTEODGH.mjs
var c = o().RailroadAbnf.parser.LangiumParser, l = /* @__PURE__ */ e((e) => {
	let t = e.alternatives.map(u);
	return t.length === 1 ? t[0] : {
		type: "choice",
		alternatives: t
	};
}, "transformAlternation"), u = /* @__PURE__ */ e((e) => {
	let t = e.elements.map(f);
	return t.length === 1 ? t[0] : {
		type: "sequence",
		elements: t
	};
}, "transformConcatenation"), d = /* @__PURE__ */ e((e) => {
	if (e.includes("*")) {
		let [t, n] = e.split("*");
		return {
			min: t ? parseInt(t, 10) : 0,
			max: n ? parseInt(n, 10) : Infinity
		};
	}
	let t = parseInt(e, 10);
	return {
		min: t,
		max: t
	};
}, "parseRepeat"), f = /* @__PURE__ */ e((e) => {
	let t = p(e.primary);
	if (!e.repeat) return t;
	let { min: n, max: r } = d(e.repeat);
	return n === 0 && r === 1 ? {
		type: "optional",
		element: t
	} : {
		type: "repetition",
		element: t,
		min: n,
		max: r
	};
}, "transformElement"), p = /* @__PURE__ */ e((e) => {
	switch (e.$type) {
		case "AbnfStringLiteral": return {
			type: "terminal",
			value: e.value
		};
		case "AbnfNumVal": return {
			type: "terminal",
			value: e.value
		};
		case "AbnfRuleName": return {
			type: "nonterminal",
			name: e.name
		};
		case "AbnfGroup": return l(e.element);
		case "AbnfOptionalGroup": return {
			type: "optional",
			element: l(e.element)
		};
		default: throw Error(`Unsupported ABNF primary node: ${e.$type}`);
	}
}, "transformPrimary"), m = /* @__PURE__ */ e((e) => ({
	name: e.name,
	definition: l(e.definition)
}), "transformRule"), h = /* @__PURE__ */ e((e) => {
	a(e, i), e.title && i.setTitle(e.title), e.rules.map((e) => i.addRule(m(e)));
}, "populateDb"), g = {
	parser: {
		parse: /* @__PURE__ */ e((e) => {
			i.clear(), t.debug("[ABNF Parser] Starting Langium parse");
			let n = c.parse(e);
			if (n.lexerErrors.length > 0 || n.parserErrors.length > 0) throw new s(n);
			let r = n.value;
			t.debug("[ABNF Parser] Parsed rules:", r.rules.length), h(r), t.debug("[ABNF Parser] Parse complete");
		}, "parse"),
		parser: { yy: i }
	},
	db: i,
	renderer: r,
	styles: n
};
//#endregion
export { g as diagram };
