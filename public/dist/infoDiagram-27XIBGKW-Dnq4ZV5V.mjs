import { n as e } from "./chunk-Y2CYZVJY-i11wjrBe.mjs";
import { m as t } from "./src-zU1FfJ4L.mjs";
import { c as n } from "./chunk-DU6HZSFF-pZyqSmOp.mjs";
import { p as r } from "./dist-D-UnJAjD.mjs";
import { n as i } from "./mermaid-parser.core-B9WckHdo.mjs";
//#region node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-27XIBGKW.mjs
var a = { parse: /* @__PURE__ */ e(async (e) => {
	let n = await i("info", e);
	t.debug(n);
}, "parse") }, o = { version: "11.17.2" }, s = {
	parser: a,
	db: { getVersion: /* @__PURE__ */ e(() => o.version, "getVersion") },
	renderer: { draw: /* @__PURE__ */ e((e, i, a) => {
		t.debug("rendering info diagram\n" + e);
		let o = r(i);
		n(o, 100, 400, !0), o.append("g").append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${a}`);
	}, "draw") }
};
//#endregion
export { s as diagram };
