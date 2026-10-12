import { n as e } from "./chunk-Y2CYZVJY-i11wjrBe.mjs";
import { m as t } from "./src-zU1FfJ4L.mjs";
import { c as n } from "./chunk-DU6HZSFF-pZyqSmOp.mjs";
//#region node_modules/mermaid/dist/chunks/mermaid.core/chunk-POPQ4Y6H.mjs
var r = /* @__PURE__ */ e((e, r, o, s) => {
	e.attr("class", o);
	let { width: c, height: l, x: u, y: d } = i(e, r);
	n(e, l, c, s);
	let f = a(u, d, c, l, r);
	e.attr("viewBox", f), t.debug(`viewBox configured: ${f} with padding: ${r}`);
}, "setupViewPortForSVG"), i = /* @__PURE__ */ e((e, t) => {
	let n = e.node()?.getBBox() || {
		width: 0,
		height: 0,
		x: 0,
		y: 0
	};
	return {
		width: n.width + t * 2,
		height: n.height + t * 2,
		x: n.x,
		y: n.y
	};
}, "calculateDimensionsWithPadding"), a = /* @__PURE__ */ e((e, t, n, r, i) => `${e - i} ${t - i} ${n} ${r}`, "createViewBox");
//#endregion
export { r as t };
