import { n as e, t } from "./rolldown-runtime-DArdT4gl.mjs";
import { n } from "./chunk-Y2CYZVJY-i11wjrBe.mjs";
import { h as r, m as i, p as a } from "./src-zU1FfJ4L.mjs";
import { $ as o, C as s, E as c, I as l, L as u, N as d, P as f, Q as p, S as m, T as h, V as g, W as _, X as v, Z as y, _ as b, b as x, c as S, g as C, l as w, m as T, n as E, p as D, q as O, r as k, s as ee, t as te, u as A, x as j } from "./chunk-DU6HZSFF-pZyqSmOp.mjs";
import { S as ne, a as M, d as N, f as P, g as F, h as I, i as re, o as ie, v as ae, x as oe, y as se } from "./chunk-75Z2AOVW-sIPAoDgV.mjs";
import "./chunk-P2QGCYS3-BusXxhDh.mjs";
import { r as ce } from "./chunk-PWAF6VOD-DljmJYAQ.mjs";
import { i as le } from "./chunk-GMAD6QVW-DpOzNmM-.mjs";
import { a as ue } from "./chunk-4HAMMTFA-Bx6uajYd.mjs";
import { i as de, n as fe, r as pe, t as me } from "./chunk-GVQU2GXP-Bif_fRc_.mjs";
import { n as he, t as ge } from "./chunk-L3NEJ4N5-Bgn9jQX1.mjs";
import { a as _e, c as ve, i as ye, l as be, n as xe, r as Se, s as Ce, t as we } from "./chunk-OSK3NFVY-UBdEJcvD.mjs";
import { t as Te } from "./graphlib-XW-Jr8pF.mjs";
var Ee = {
	rect: "rectangle",
	circle: "ellipse"
}, De = {
	startOnLoad: !1,
	flowchart: { curve: "linear" },
	themeVariables: { fontSize: "20px" },
	maxEdges: 500,
	maxTextSize: 5e4
}, Oe = class {
	constructor({ converter: e }) {
		this.convert = (e, t) => this.converter(e, {
			...t,
			fontSize: t.fontSize || 20
		}), this.converter = e;
	}
}, ke;
(function(e) {
	e.ROUND = "round", e.STADIUM = "stadium", e.DOUBLECIRCLE = "doublecircle", e.CIRCLE = "circle", e.DIAMOND = "diamond", e.CYLINDER = "cylinder";
})(ke ||= {});
var L;
(function(e) {
	e.COLOR = "color";
})(L ||= {});
var R;
(function(e) {
	e.FILL = "fill", e.STROKE = "stroke", e.STROKE_WIDTH = "stroke-width", e.STROKE_DASHARRAY = "stroke-dasharray";
})(R ||= {});
//#endregion
//#region node_modules/@excalidraw/mermaid-to-excalidraw/dist/converter/helpers.js
var Ae = (/* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.removeMarkdown = void 0, e.removeMarkdown = function(e, t) {
		t === void 0 && (t = { listUnicodeChar: "" }), t ||= {}, t.listUnicodeChar = t.hasOwnProperty("listUnicodeChar") ? t.listUnicodeChar : !1, t.stripListLeaders = !t.hasOwnProperty("stripListLeaders") || t.stripListLeaders, t.gfm = !t.hasOwnProperty("gfm") || t.gfm, t.useImgAltText = !t.hasOwnProperty("useImgAltText") || t.useImgAltText, t.preserveLinks = t.hasOwnProperty("preserveLinks") ? t.preserveLinks : !1;
		var n = e || "";
		n = n.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, "");
		try {
			t.stripListLeaders && (n = t.listUnicodeChar ? n.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, t.listUnicodeChar + " $1") : n.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, "$1")), t.gfm && (n = n.replace(/\n={2,}/g, "\n").replace(/~{3}.*\n/g, "").replace(/~~/g, "").replace(/`{3}.*\n/g, "")), t.preserveLinks && (n = n.replace(/\[(.*?)\][\[\(](.*?)[\]\)]/g, "$1 ($2)")), n = n.replace(/<[^>]*>/g, "").replace(/^[=\-]{2,}\s*$/g, "").replace(/\[\^.+?\](\: .*?$)?/g, "").replace(/\s{0,2}\[.*?\]: .*?$/g, "").replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, t.useImgAltText ? "$1" : "").replace(/\[(.*?)\][\[\(].*?[\]\)]/g, "$1").replace(/^\s{0,3}>\s?/g, "").replace(/(^|\n)\s{0,3}>\s?/g, "\n\n").replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, "").replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm, "$1$2$3").replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, "$2").replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, "$2").replace(/(`{3,})(.*?)\1/gm, "$2").replace(/`(.+?)`/g, "$1").replace(/\n{2,}/g, "\n\n");
		} catch (t) {
			return console.error(t), e;
		}
		return n;
	};
})))(), je = {
	arrow_circle: { endArrowhead: "circle" },
	arrow_cross: { endArrowhead: "bar" },
	arrow_open: {
		endArrowhead: null,
		startArrowhead: null
	},
	double_arrow_circle: {
		endArrowhead: "circle",
		startArrowhead: "circle"
	},
	double_arrow_cross: {
		endArrowhead: "bar",
		startArrowhead: "bar"
	},
	double_arrow_point: {
		endArrowhead: "arrow",
		startArrowhead: "arrow"
	}
}, Me = (e) => je[e], Ne = (e) => {
	let t = e.text;
	return e.labelType === "markdown" && (t = (0, Ae.removeMarkdown)(e.text)), Pe(t);
}, Pe = (e) => e.replace(/\s?(fa|fab):[a-zA-Z0-9-]+/g, ""), Fe = (e) => {
	let t = {};
	return Object.keys(e).forEach((n) => {
		switch (n) {
			case R.FILL:
				t.backgroundColor = e[n], t.fillStyle = "solid";
				break;
			case R.STROKE:
				t.strokeColor = e[n];
				break;
			case R.STROKE_WIDTH:
				t.strokeWidth = Number(e[n]?.split("px")[0]);
				break;
			case R.STROKE_DASHARRAY: t.strokeStyle = "dashed";
		}
	}), t;
}, Ie = (e) => {
	let t = {};
	return Object.keys(e).forEach((n) => {
		switch (n) {
			case L.COLOR: t.strokeColor = e[n];
		}
	}), t;
}, Le = (e, t) => [e, t], Re = .62, ze = 12, Be = 12, Ve = (e, t) => Math.max(20, Math.ceil(e.length * t * Re)), He = (e, t, n, r) => {
	let i = r || 20;
	if (e !== ke.CYLINDER || !t || t.includes("\n")) return i;
	let a = Math.max(20, n - ze);
	return Ve(t, i) <= a ? i : Math.max(Be, Math.floor(a / (t.length * Re)));
}, Ue = (e) => {
	let t = {};
	e.subGraphs.map((n) => {
		n.nodeIds.forEach((r) => {
			t[n.id] = {
				id: n.id,
				parent: null,
				isLeaf: !1
			}, t[r] = {
				id: r,
				parent: n.id,
				isLeaf: e.vertices[r] !== void 0
			};
		});
	});
	let n = {};
	return [...Object.keys(e.vertices), ...e.subGraphs.map((e) => e.id)].forEach((e) => {
		if (!t[e]) return;
		let r = t[e], i = [];
		for (r.isLeaf || i.push(`subgraph_group_${r.id}`); r.parent;) i.push(`subgraph_group_${r.parent}`), r = t[r.parent];
		n[e] = i;
	}), {
		getGroupIds: (e) => n[e] || [],
		getParentId: (e) => t[e] ? t[e].parent : null
	};
}, We = new Oe({ converter: (e, t) => {
	let n = [], r = t.fontSize, { getGroupIds: i, getParentId: a } = Ue(e);
	return e.subGraphs.reverse().forEach((e) => {
		let t = i(e.id), a = Ne(e), o = Ve(a, r || 16) + 64, s = Math.max(e.width, o), c = e.x - (s - e.width) / 2, l = Fe(e.containerStyle), u = Ie(e.labelStyle), d = {
			id: e.id,
			type: "rectangle",
			groupIds: t,
			x: c,
			y: e.y,
			width: s,
			height: e.height,
			label: {
				groupIds: t,
				text: a,
				fontSize: r,
				verticalAlign: "top",
				...u
			},
			...l
		};
		n.push(d);
	}), Object.values(e.vertices).forEach((e) => {
		if (!e) return;
		let t = i(e.id), a = Ne(e), o = He(e.type, a, e.width, r), s = Fe(e.containerStyle), c = Ie(e.labelStyle), l = {
			id: e.id,
			type: "rectangle",
			groupIds: t,
			x: e.x,
			y: e.y,
			width: e.width,
			height: e.height,
			strokeWidth: 2,
			label: {
				groupIds: t,
				text: a,
				fontSize: o,
				...c
			},
			link: e.link || null,
			...s
		};
		switch (e.type) {
			case ke.STADIUM:
				l = {
					...l,
					roundness: { type: 3 }
				};
				break;
			case ke.ROUND:
				l = {
					...l,
					roundness: { type: 3 }
				};
				break;
			case ke.DOUBLECIRCLE: {
				t.push(`doublecircle_${e.id}}`);
				let r = {
					type: "ellipse",
					groupIds: t,
					x: e.x + 5,
					y: e.y + 5,
					width: e.width - 10,
					height: e.height - 10,
					strokeWidth: 2,
					roundness: { type: 3 },
					label: {
						groupIds: t,
						text: a,
						fontSize: o,
						...c
					}
				};
				l = {
					...l,
					groupIds: t,
					type: "ellipse"
				}, n.push(r);
				break;
			}
			case ke.CIRCLE:
				l.type = "ellipse";
				break;
			case ke.DIAMOND: l.type = "diamond";
		}
		n.push(l);
	}), e.edges.forEach((e) => {
		let t = [], o = a(e.start), s = a(e.end);
		o && o === s && (t = i(o));
		let { startX: c, startY: l, reflectionPoints: u } = e, d = u.map((e) => Le(e.x - u[0].x, e.y - u[0].y)), f = Me(e.type || "arrow_point"), p = n.find((t) => t.id === e.start), m = n.find((t) => t.id === e.end);
		if (!p || !m) return;
		let h = {
			id: `${e.start}_${e.end}`,
			type: "arrow",
			groupIds: t,
			x: c,
			y: l,
			strokeWidth: e.stroke === "thick" ? 4 : 2,
			strokeStyle: e.stroke === "dotted" ? "dashed" : void 0,
			points: d,
			...e.text ? { label: {
				text: Ne(e),
				fontSize: r,
				groupIds: t
			} } : {},
			roundness: { type: 2 },
			...f,
			start: { id: p.id || "" },
			end: { id: m.id || "" }
		};
		n.push(h);
	}), { elements: n };
} }), z = (e = 21) => crypto.getRandomValues(new Uint8Array(e)).reduce((e, t) => (t &= 63, e += t < 36 ? t.toString(36) : t < 62 ? (t - 26).toString(36).toUpperCase() : t > 62 ? "-" : "_", e), ""), Ge = new Oe({ converter: (e) => {
	let t = z(), { width: n, height: r } = e, i = {
		type: "image",
		x: 0,
		y: 0,
		width: n,
		height: r,
		status: "saved",
		fileId: t
	};
	return {
		files: { [t]: {
			id: t,
			mimeType: e.mimeType,
			dataURL: e.dataURL
		} },
		elements: [i]
	};
} }), Ke = (e, t) => [e, t], qe = (e) => e.replace(/\\n/g, "\n"), Je = (e) => {
	let t = {
		type: "line",
		x: e.startX,
		y: e.startY,
		points: [Ke(0, 0), Ke(e.endX - e.startX, e.endY - e.startY)],
		width: e.endX - e.startX,
		height: e.endY - e.startY,
		strokeStyle: e.strokeStyle || "solid",
		strokeColor: e.strokeColor || "#000",
		strokeWidth: e.strokeWidth || 1
	};
	return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), e.id && Object.assign(t, { id: e.id }), t;
}, Ye = (e) => {
	let t = {
		type: "text",
		x: e.x,
		y: e.y,
		width: e.width,
		height: e.height,
		text: qe(e.text) || "",
		fontSize: e.fontSize,
		verticalAlign: "top",
		strokeColor: e.color
	};
	return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), e.id && Object.assign(t, { id: e.id }), t;
}, Xe = (e) => {
	let t = {
		text: qe(e?.label?.text || ""),
		fontSize: e?.label?.fontSize,
		textAlign: e.label?.textAlign,
		verticalAlign: e.label?.verticalAlign || "middle",
		strokeColor: e.label?.color || "#000",
		...e.groupId ? { groupIds: [e.groupId] } : {}
	}, n = {};
	e.type === "rectangle" && e.subtype === "activation" && (n = {
		backgroundColor: "#e9ecef",
		fillStyle: "solid"
	});
	let r = {
		id: e.id,
		type: e.type,
		x: e.x,
		y: e.y,
		width: e.width,
		height: e.height,
		label: t,
		strokeStyle: e?.strokeStyle,
		strokeWidth: e?.strokeWidth,
		strokeColor: e?.strokeColor,
		backgroundColor: e?.bgColor,
		fillStyle: "solid",
		...n
	};
	return e.groupId && Object.assign(r, { groupIds: [e.groupId] }), r;
}, Ze = (e) => {
	let t = {
		type: "arrow",
		x: e.startX,
		y: e.startY,
		points: e.points?.map(([e, t]) => Ke(e, t)) || [Ke(0, 0), Ke(e.endX - e.startX, e.endY - e.startY)],
		width: e.endX - e.startX,
		height: e.endY - e.startY,
		strokeStyle: e?.strokeStyle || "solid",
		endArrowhead: e?.endArrowhead || null,
		startArrowhead: e?.startArrowhead || null,
		label: {
			text: qe(e?.label?.text || ""),
			fontSize: 16,
			textAlign: e?.label?.textAlign,
			verticalAlign: e?.label?.verticalAlign
		},
		roundness: { type: 2 },
		start: e.start,
		end: e.end
	};
	return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), t;
}, Qe = 10, $e = 16, et = 24, tt = 4, nt = (e) => {
	if (!e) return !0;
	let t = e.trim().toLowerCase();
	return t === "transparent" || t === "none" || t === "rgba(0,0,0,0)" || t === "rgba(0, 0, 0, 0)";
}, rt = (e, t) => Math.max(20, Math.round(e.length * t * .6)), it = (e, t, n = !0) => {
	let r = e, i = r.groupIds ?? [];
	if (i.includes(t) || (r.groupIds = [...i, t]), !n || !r.label) return;
	let a = r.label.groupIds ?? [];
	a.includes(t) || (r.label.groupIds = [...a, t]);
}, at = new Oe({ converter: (e) => {
	let t = [], n = [];
	if (Object.values(e.nodes).forEach((e) => {
		e && e.length && e.forEach((e) => {
			let r;
			switch (e.type) {
				case "line":
					r = Je(e);
					break;
				case "rectangle":
				case "ellipse":
					r = Xe(e);
					break;
				case "text":
					r = Ye(e);
					break;
				default: throw `unknown type ${e.type}`;
			}
			e.type === "rectangle" && e?.subtype === "activation" ? n.push(r) : t.push(r);
		});
	}), Object.values(e.lines).forEach((e) => {
		e && t.push(Je(e));
	}), Object.values(e.arrows).forEach((e) => {
		e && (t.push(Ze(e)), e.sequenceNumber && t.push(Xe(e.sequenceNumber)));
	}), t.push(...n), e.loops) {
		let { lines: n, texts: r, nodes: i } = e.loops;
		n.forEach((e) => {
			t.push(Je(e));
		}), r.forEach((e) => {
			t.push(Ye(e));
		}), i.forEach((e) => {
			t.push(Xe(e));
		});
	}
	return e.groups && e.groups.forEach((e) => {
		let { actorKeys: n, name: r } = e, i = Infinity, a = Infinity, o = 0, s = 0;
		if (!n.length) return;
		let c = t.filter((e) => {
			if (e.id) {
				let t = e.id.indexOf("-"), r = e.id.substring(0, t);
				return n.includes(r);
			}
			return !1;
		});
		if (!c.length || (c.forEach((e) => {
			e.x !== void 0 && e.y !== void 0 && e.width !== void 0 && e.height !== void 0 && (i = Math.min(i, e.x), a = Math.min(a, e.y), o = Math.max(o, e.x + e.width), s = Math.max(s, e.y + e.height));
		}), !Number.isFinite(i) || !Number.isFinite(a) || !Number.isFinite(o) || !Number.isFinite(s))) return;
		let l = i - Qe, u = a - Qe, d = o - i + 20, f = s - a + 20, p = z(), m = z(), h = Xe({
			type: "rectangle",
			x: l,
			y: u,
			width: d,
			height: f,
			bgColor: nt(e.fill) ? void 0 : e.fill,
			strokeColor: "#1f1f1f",
			strokeWidth: 1,
			id: p,
			groupId: m
		});
		if (t.unshift(h), t.forEach((e) => {
			e.id !== p && e.x !== void 0 && e.y !== void 0 && e.width !== void 0 && e.height !== void 0 && e.x >= i && e.x + e.width <= o && e.y >= a && e.y + e.height <= s && it(e, m);
		}), r) {
			let e = Ye({
				type: "text",
				id: z(),
				text: r,
				x: l + tt,
				y: u - et,
				width: rt(r, $e),
				height: 24,
				fontSize: $e,
				color: "#1f1f1f",
				groupId: m
			});
			it(e, m, !1), t.push(e);
		}
	}), { elements: t };
} }), ot = new Oe({ converter: (e) => {
	let t = [];
	return e.nodes.forEach((e) => {
		e && e.length && e.forEach((e) => {
			let n;
			switch (e.type) {
				case "line":
					n = Je(e);
					break;
				case "rectangle":
				case "ellipse":
					n = Xe(e);
					break;
				case "text":
					n = Ye(e);
					break;
				default: throw `unknown type ${e.type}`;
			}
			t.push(n);
		});
	}), Object.values(e.lines).forEach((e) => {
		e && t.push(Je(e));
	}), Object.values(e.arrows).forEach((e) => {
		if (!e) return;
		let n = Ze(e);
		t.push(n);
	}), Object.values(e.text).forEach((e) => {
		let n = Ye(e);
		t.push(n);
	}), Object.values(e.namespaces).forEach((n) => {
		let r = Object.keys(n.classes), i = [...r], a = [
			...e.lines,
			...e.arrows,
			...e.text
		];
		r.forEach((e) => {
			let t = a.filter((t) => t.metadata && t.metadata.classId === e).map((e) => e.id);
			t.length && i.push(...t);
		});
		let o = {
			type: "frame",
			id: z(),
			name: n.id,
			children: i
		};
		t.push(o);
	}), { elements: t };
} }), st = new Oe({ converter: (e) => {
	let t = [];
	return e.nodes.forEach((e) => {
		e && e.length && e.forEach((e) => {
			let n;
			switch (e.type) {
				case "line":
					n = Je(e);
					break;
				case "rectangle":
				case "ellipse":
					n = Xe(e);
					break;
				case "text":
					n = Ye(e);
					break;
				default: throw `unknown type ${e.type}`;
			}
			t.push(n);
		});
	}), e.lines.forEach((e) => {
		t.push(Je(e));
	}), e.arrows.forEach((e) => {
		t.push(Ze(e));
	}), e.text.forEach((e) => {
		t.push(Ye(e));
	}), { elements: t };
} }), ct = (e, t) => [e, t], lt = 16, ut = 14, dt = 1, ft = "#000000", pt = 10, mt = 10, ht = 1.25, gt = /* @__PURE__ */ new Set([
	"choice",
	"fork",
	"join",
	"stateStart",
	"stateEnd",
	"divider"
]), _t = (e) => e.shape === "stateEnd" ? [`state_end_group_${e.id}`] : void 0, vt = (e) => e.shape === "rectWithTitle" && e.description.length ? [e.text, ...e.description].join("\n") : e.text, yt, bt = () => {
	if (yt !== void 0) return yt;
	if (typeof document > "u") return yt = null, yt;
	try {
		yt = document.createElement("canvas").getContext("2d");
	} catch {
		yt = null;
	}
	return yt;
}, xt = (e, t) => {
	let n = bt();
	return n ? (n.font = `${t}px Excalifont, sans-serif`, n.measureText(e).width) : e.length * t * .6;
}, St = (e, t, n) => {
	if (xt(e, t) <= n) return [e];
	let r = [], i = "";
	for (let a of e) {
		let e = `${i}${a}`;
		i && xt(e, t) > n ? (r.push(i), i = a) : i = e;
	}
	return i && r.push(i), r;
}, Ct = (e, t, n) => {
	if (!e.trim() || xt(e, t) <= n) return e;
	let r = e.split(/\s+/).filter(Boolean), i = [], a = "";
	for (let e of r) {
		let r = St(e, t, n);
		for (let [e, o] of r.entries()) {
			let r = a ? `${a}${a && e === 0 ? " " : ""}${o}` : o;
			xt(r, t) <= n ? a = r : (a && i.push(a), a = o);
		}
		r.length;
	}
	return i.push(a), i.join("\n");
}, wt = (e, t, n) => {
	let r = e.map((e) => Ct(e, t, n)).join("\n").split("\n");
	return {
		width: Math.max(...r.map((e) => xt(e, t))),
		height: r.length * t * ht
	};
}, Tt = (e, t, n, r) => {
	let i = e.split("\n");
	for (let e = lt; e >= ut; e -= dt) {
		let { height: r } = wt(i, e, t);
		if (r <= n) return e;
	}
	return r;
}, Et = (e) => {
	let t = vt(e);
	if (!t || gt.has(e.shape)) return lt;
	let n = Math.max(1, e.width - pt), r = Math.max(1, e.height - mt), i = t.split("\n");
	return i.length > 1 && Math.max(...i.map((e) => xt(e, lt))) <= n ? lt : Tt(t, n, r, i.length === 1 ? lt : ut);
}, Dt = (e) => {
	if (gt.has(e.shape)) return;
	let t = vt(e);
	if (t) return {
		text: t,
		fontSize: Et(e),
		verticalAlign: e.shape === "rectWithTitle" || e.shape === "roundedWithTitle" ? "top" : "middle",
		...Ie(e.labelStyle)
	};
}, Ot = (e) => {
	let t = Fe(e.containerStyle), n = Dt(e), r = e.shape === "choice" ? "diamond" : e.shape === "stateStart" || e.shape === "stateEnd" ? "ellipse" : "rectangle", i = e.shape === "rect" || e.shape === "rectWithTitle" || e.shape === "roundedWithTitle", a = e.shape === "stateStart" || e.shape === "fork" || e.shape === "join", o = t.backgroundColor || t.strokeColor || ft, s = t.strokeColor || t.backgroundColor || ft;
	return {
		id: e.id,
		type: r,
		..._t(e) ? { groupIds: _t(e) } : {},
		x: e.x,
		y: e.y,
		width: e.width,
		height: e.height,
		...n ? { label: n } : {},
		...t,
		...i ? { roundness: { type: 3 } } : {},
		...a ? {
			backgroundColor: o,
			strokeColor: s,
			fillStyle: "solid"
		} : {}
	};
}, kt = (e) => {
	if (!e.dividerLine) return null;
	let t = Fe(e.containerStyle);
	return {
		id: `${e.id}__divider`,
		type: "line",
		x: e.dividerLine.startX,
		y: e.dividerLine.startY,
		width: e.dividerLine.endX - e.dividerLine.startX,
		height: e.dividerLine.endY - e.dividerLine.startY,
		points: [ct(0, 0), ct(e.dividerLine.endX - e.dividerLine.startX, e.dividerLine.endY - e.dividerLine.startY)],
		strokeColor: t.strokeColor || "#000",
		strokeWidth: t.strokeWidth || 1
	};
}, At = (e) => {
	let t = Fe(e.containerStyle), n = Math.max(2, Math.min(e.width, e.height) * .32), r = e.endInnerColor || t.strokeColor || t.backgroundColor || ft;
	return {
		id: `${e.id}__inner`,
		type: "ellipse",
		groupIds: _t(e),
		x: e.x + n,
		y: e.y + n,
		width: Math.max(1, e.width - n * 2),
		height: Math.max(1, e.height - n * 2),
		backgroundColor: r,
		strokeColor: r,
		fillStyle: "solid",
		strokeWidth: 1
	};
}, jt = (e) => {
	let t = e.reflectionPoints.map((e, t, n) => {
		let r = n[0];
		return t === 0 ? ct(0, 0) : ct(e.x - r.x, e.y - r.y);
	});
	return {
		id: e.id,
		type: "arrow",
		x: e.startX,
		y: e.startY,
		width: e.endX - e.startX,
		height: e.endY - e.startY,
		points: t,
		strokeColor: e.strokeColor || "#000",
		strokeWidth: e.strokeWidth || 2,
		strokeStyle: e.strokeStyle || "solid",
		endArrowhead: e.isNoteEdge ? null : "triangle",
		roundness: { type: 2 },
		start: { id: e.start },
		end: { id: e.end },
		...e.text ? { label: {
			text: e.text,
			fontSize: 16
		} } : {}
	};
}, Mt = new Oe({ converter: (e) => {
	let t = [];
	return e.nodes.forEach((e) => {
		if (!e.isRenderable) return;
		let n = Ot(e);
		t.push(n);
		let r = kt(e);
		r && t.push(r), e.shape === "stateEnd" && t.push(At(e));
	}), e.edges.forEach((e) => {
		t.push(jt(e));
	}), { elements: t };
} }), B = (e) => {
	e = Ft(e);
	let t = e.replace(/#(\d+);/g, "&#$1;").replace(/#([a-z]+);/g, "&$1;"), n = document.createElement("textarea");
	return n.innerHTML = t, n.value;
}, Nt = (e) => {
	let t = e.getAttribute("transform")?.match(/translate\(([ \d.-]+),\s*([\d.-]+)\)/), n = 0, r = 0;
	return t && (n = Number(t[1]), r = Number(t[2])), {
		transformX: n,
		transformY: r
	};
}, Pt = (e) => {
	let t = e;
	return t = t.replace(/style.*:\S*#.*;/g, (e) => e.substring(0, e.length - 1)), t = t.replace(/classDef.*:\S*#.*;/g, (e) => e.substring(0, e.length - 1)), t = t.replace(/#\w+;/g, (e) => {
		let t = e.substring(1, e.length - 1);
		return /^\+?\d+$/.test(t) ? `ﬂ°°${t}¶ß` : `ﬂ°${t}¶ß`;
	}), t;
}, Ft = function(e) {
	return e.replace(/ﬂ°°/g, "#").replace(/ﬂ°/g, "&").replace(/¶ß/g, ";");
}, It = .5, Lt = (e, t = It) => {
	let n = [];
	return e.forEach((e) => {
		let r = n[n.length - 1];
		r && Math.hypot(e[0] - r[0], e[1] - r[1]) <= t || n.push(e);
	}), n;
}, Rt = (e) => {
	let t = e.getAttribute("d");
	if (!t) return null;
	let n = Array.from(t.matchAll(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi), (e) => Number(e[0]));
	return n.length < 4 ? null : {
		startX: n[0],
		startY: n[1],
		endX: n[n.length - 2],
		endY: n[n.length - 1]
	};
}, zt = (e) => {
	let t = e.getAttribute("data-points");
	if (!t) {
		let t = Rt(e);
		return t ? [{
			x: t.startX,
			y: t.startY
		}, {
			x: t.endX,
			y: t.endY
		}] : [];
	}
	try {
		let e = atob(t), n = JSON.parse(e);
		return Array.isArray(n) ? n.filter((e) => e && typeof e.x == "number" && typeof e.y == "number" && Number.isFinite(e.x) && Number.isFinite(e.y)) : [];
	} catch {
		return [];
	}
}, Bt = (e, t = {
	x: 0,
	y: 0
}, n = "LM") => {
	if (e.tagName.toLowerCase() !== "path") throw Error(`Invalid input: Expected an HTMLElement of tag "path", got ${e.tagName}`);
	let r = e.getAttribute("d");
	if (!r) throw Error("Path element does not contain a \"d\" attribute");
	let i = r.split(RegExp(`(?=[${n}])`)), a = i[0].substring(1).split(",").map((e) => parseFloat(e)), o = i[i.length - 1].substring(1).split(",").map((e) => parseFloat(e)), s = i.map((e) => {
		let t = e[0], n = e.substring(1).split(",").map((e) => parseFloat(e));
		return t === "C" ? {
			x: n[4],
			y: n[5],
			command: t
		} : {
			x: n[0],
			y: n[1],
			command: t
		};
	}).filter((e, t, n) => {
		if (t === 0 || t === n.length - 1) return !0;
		if (e.x === n[t - 1].x && e.y === n[t - 1].y || t === n.length - 2 && e.command === "C") return !1;
		if (t === n.length - 2 && (n[t - 1].x === e.x || n[t - 1].y === e.y)) {
			let t = n[n.length - 1];
			return Math.hypot(t.x - e.x, t.y - e.y) > 20;
		}
		return e.x !== n[t - 1].x || e.y !== n[t - 1].y;
	}).map((e) => ({
		x: e.x + t.x,
		y: e.y + t.y
	}));
	return {
		startX: a[0] + t.x,
		startY: a[1] + t.y,
		endX: o[0] + t.x,
		endY: o[1] + t.y,
		reflectionPoints: s
	};
}, Vt = (e) => ({
	...e,
	elements: e.elements.map((e) => {
		if (!("points" in e) || !Array.isArray(e.points)) return e;
		let t = e.points;
		if (t.length < 2) return e;
		let n = Lt(t);
		return n.length === t.length ? e : {
			...e,
			points: n
		};
	})
}), Ht = (e, t = {}) => Vt((() => {
	switch (e.type) {
		case "graphImage": return Ge.convert(e, t);
		case "flowchart": return We.convert(e, t);
		case "sequence": return at.convert(e, t);
		case "class": return ot.convert(e, t);
		case "erd": return st.convert(e, t);
		case "state": return Mt.convert(e, t);
		default: throw Error(`graphToExcalidraw: unknown graph type "${e.type}, only flowcharts are supported!"`);
	}
})()), Ut = /* @__PURE__ */ n((e) => {
	let { securityLevel: t } = j(), n = a("body");
	if (t === "sandbox") {
		let t = a(`#i${e}`).node()?.contentDocument ?? document;
		n = a(t.body);
	}
	return n.select(`#${e}`);
}, "selectSvgElement");
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/isPrototype.mjs
function Wt(e) {
	let t = e?.constructor;
	return e === (typeof t == "function" ? t.prototype : Object.prototype);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isEmpty.mjs
function Gt(e) {
	if (e == null) return !0;
	if (oe(e)) return typeof e.splice != "function" && typeof e != "string" && !ne(e) && !ae(e) && !se(e) ? !1 : e.length === 0;
	if (typeof e == "object" || typeof e == "function") {
		if (e instanceof Map || e instanceof Set) return e.size === 0;
		let t = Object.keys(e);
		return Wt(e) ? t.filter((e) => e !== "constructor").length === 0 : t.length === 0;
	}
	return !0;
}
//#endregion
//#region node_modules/mermaid/dist/chunks/mermaid.core/chunk-2E4U76K2.mjs
function Kt(e, { edgePathsClass: t = "edges edgePaths" } = {}) {
	let n = e.insert("g").attr("class", "root");
	return {
		clusters: n.insert("g").attr("class", "clusters"),
		edgePaths: n.insert("g").attr("class", t),
		edgeLabels: n.insert("g").attr("class", "edgeLabels"),
		nodes: n.insert("g").attr("class", "nodes"),
		rootGroups: n
	};
}
n(Kt, "createLayoutElementGroups");
async function qt(e, t) {
	if (t.label) {
		let { shapeSvg: n, bbox: r } = await ue(e, t);
		t.labelBBox = {
			width: r.width,
			height: r.height
		}, n.remove();
	} else t.labelBBox = {
		width: 0,
		height: 0
	};
}
n(qt, "measureGroupLabel");
async function Jt(e, t, n) {
	let r = await pe(e, t, n), i = r.node()?.getBBox() ?? {
		width: 0,
		height: 0
	};
	return t.width = i.width, t.height = i.height, r;
}
n(Jt, "insertMeasuredNode");
async function Yt(e, t) {
	let n = new Te({
		multigraph: !0,
		compound: !0
	}), r = [...t.edges], i = j(), a = Kt(e), { edgeLabels: o, nodes: s } = a, c = /* @__PURE__ */ new Map(), l = e.node() != null;
	await Promise.all(t.nodes.map(async (e) => {
		if (e.isGroup) l && await qt(s, e), n.setNode(e.id, { ...e });
		else {
			if (l) {
				let t = await Jt(s, e, {
					config: i,
					dir: e.dir
				});
				c.set(e.id, t);
			}
			n.setNode(e.id, { ...e });
		}
	}));
	for (let e of r) l && Se(e) && await _e(o, e), n.setEdge(e.start, e.end, { ...e }, e.id), t.edges.some((t) => t.id === e.id) || t.edges.push(e);
	if (globalThis.mermaidCaptureSizes) {
		let { captureNodeSizes: n } = await import("./sizeCapture-INFHLROL-DR-68Vzi.mjs");
		n(e, t);
	}
	return {
		graph: n,
		groups: a,
		nodeElements: c
	};
}
n(Yt, "createGraphWithElements");
var V = /* @__PURE__ */ new Map(), Xt = /* @__PURE__ */ new Map(), Zt = /* @__PURE__ */ new Map(), Qt = /* @__PURE__ */ n(() => {
	Xt.clear(), Zt.clear(), V.clear();
}, "clear"), $t = /* @__PURE__ */ n((e, t) => {
	let n = Xt.get(t) || [];
	return i.trace("In isDescendant", t, " ", e, " = ", n.includes(e)), n.includes(e);
}, "isDescendant"), en = /* @__PURE__ */ n((e, t) => {
	let n = Xt.get(t) || [];
	return i.info("Descendants of ", t, " is ", n), i.info("Edge is ", e), e.v === t || e.w === t ? !1 : n ? n.includes(e.v) || $t(e.v, t) || $t(e.w, t) || n.includes(e.w) : (i.debug("Tilt, ", t, ",not in descendants"), !1);
}, "edgeInCluster"), tn = /* @__PURE__ */ n((e, t, n, r) => {
	i.debug("Copying children of ", e, "root", r, "data", t.node(e), r);
	let a = t.children(e) || [];
	e !== r && a.push(e), i.debug("Copying (nodes) clusterId", e, "nodes", a), a.forEach((a) => {
		if (t.children(a).length > 0) tn(a, t, n, r);
		else {
			let o = t.node(a);
			i.info("cp ", a, " to ", r, " with parent ", e), n.setNode(a, o), r !== t.parent(a) && (i.debug("Setting parent", a, t.parent(a)), n.setParent(a, t.parent(a))), e !== r && a !== e ? (i.debug("Setting parent", a, e), n.setParent(a, e)) : (i.info("In copy ", e, "root", r, "data", t.node(e), r), i.debug("Not Setting parent for node=", a, "cluster!==rootId", e !== r, "node!==clusterId", a !== e));
			let s = t.edges(a);
			i.debug("Copying Edges", s), s.forEach((a) => {
				i.info("Edge", a);
				let o = t.edge(a.v, a.w, a.name);
				i.info("Edge data", o, r);
				try {
					en(a, r) ? (i.info("Copying as ", a.v, a.w, o, a.name), n.setEdge(a.v, a.w, o, a.name), i.info("newGraph edges ", n.edges(), n.edge(n.edges()[0]))) : i.info("Skipping copy of edge ", a.v, "-->", a.w, " rootId: ", r, " clusterId:", e);
				} catch (e) {
					i.error(e);
				}
			});
		}
		i.debug("Removing node", a), t.removeNode(a);
	});
}, "copy"), nn = /* @__PURE__ */ n((e, t) => {
	let n = t.children(e), r = [...n];
	for (let i of n) Zt.set(i, e), r = [...r, ...nn(i, t)];
	return r;
}, "extractDescendants"), rn = /* @__PURE__ */ n((e, t, n) => {
	let r = e.edges().filter((e) => e.v === t || e.w === t), i = e.edges().filter((e) => e.v === n || e.w === n), a = r.map((e) => ({
		v: e.v === t ? n : e.v,
		w: e.w === t ? t : e.w
	})), o = i.map((e) => ({
		v: e.v,
		w: e.w
	}));
	return a.filter((e) => o.some((t) => e.v === t.v && e.w === t.w));
}, "findCommonEdges"), an = /* @__PURE__ */ n((e, t, n) => {
	let r = t.children(e);
	if (i.trace("Searching children of id ", e, r), r.length < 1) return e;
	let a;
	for (let e of r) {
		let r = an(e, t, n), i = rn(t, n, r);
		if (r) {
			if (i.length > 0) a = r;
			else return r;
		}
	}
	return a;
}, "findNonClusterChild"), on = /* @__PURE__ */ n((e) => !V.has(e) || !V.get(e).externalConnections ? e : V.has(e) ? V.get(e).id : e, "getAnchorId"), sn = /* @__PURE__ */ n((e, t) => {
	if (!e || t > 10) i.debug("Opting out, no graph ");
	else {
		i.debug("Opting in, graph "), e.nodes().forEach(function(t) {
			e.children(t).length > 0 && (i.debug("Cluster identified", t, " Replacement id in edges: ", an(t, e, t)), Xt.set(t, nn(t, e)), V.set(t, {
				id: an(t, e, t),
				clusterData: e.node(t)
			}));
		}), e.nodes().forEach(function(t) {
			let n = e.children(t), r = e.edges();
			n.length > 0 ? (i.debug("Cluster identified", t, Xt), r.forEach((e) => {
				$t(e.v, t) ^ $t(e.w, t) && (i.debug("Edge: ", e, " leaves cluster ", t), i.debug("Descendants of XXX ", t, ": ", Xt.get(t)), V.get(t).externalConnections = !0);
			})) : i.debug("Not a cluster ", t, Xt);
		});
		for (let t of V.keys()) {
			let n = V.get(t).id, r = e.parent(n);
			r !== t && V.has(r) && !V.get(r).externalConnections && (V.get(t).id = r);
			let i = e.edges().some((e) => e.v === t);
			if (n && V.get(t)?.externalConnections && i && dn(e, n, t)) {
				let r = fn(e, t, e.parent(n));
				r && (V.get(t).id = r);
			}
		}
		e.edges().forEach(function(t) {
			let n = e.edge(t);
			i.debug("Edge " + t.v + " -> " + t.w + ": " + JSON.stringify(t)), i.debug("Edge " + t.v + " -> " + t.w + ": " + JSON.stringify(e.edge(t)));
			let r = t.v, a = t.w;
			if (i.debug("Fix XXX", V, "ids:", t.v, t.w, "Translating: ", V.get(t.v), " --- ", V.get(t.w)), V.get(t.v) || V.get(t.w)) {
				if (i.debug("Fixing and trying - removing XXX", t.v, t.w, t.name), r = on(t.v), a = on(t.w), e.removeEdge(t.v, t.w, t.name), r !== t.v) {
					let i = e.parent(r);
					V.get(i).externalConnections = !0, n.fromCluster = t.v;
				}
				if (a !== t.w) {
					let r = e.parent(a);
					V.get(r).externalConnections = !0, n.toCluster = t.w;
				}
				i.debug("Fix Replacing with XXX", r, a, t.name), e.setEdge(r, a, n, t.name);
			}
		}), cn(e, 0), i.trace(V);
	}
}, "adjustClustersAndEdges"), cn = /* @__PURE__ */ n((e, t) => {
	if (t > 10) {
		i.error("Bailing out");
		return;
	}
	let n = e.nodes(), r = !1;
	for (let t of n) {
		let n = e.children(t);
		r ||= n.length > 0;
	}
	if (!r) i.debug("Done, no node has children", e.nodes());
	else {
		i.debug("Nodes = ", n, t);
		for (let r of n) if (i.debug("Extracting node", r, V, V.has(r) && !V.get(r).externalConnections, !e.parent(r), e.node(r), e.children("D"), " Depth ", t), !V.has(r)) i.debug("Not a cluster", r, t);
		else if (!V.get(r).externalConnections && e.children(r) && e.children(r).length > 0) {
			i.debug("Cluster without external connections, without a parent and with children", r, t);
			let n = e.graph().rankdir === "TB" ? "LR" : "TB";
			V.get(r)?.clusterData?.dir && (n = V.get(r).clusterData.dir, i.debug("Fixing dir", V.get(r).clusterData.dir, n));
			let a = new Te({
				multigraph: !0,
				compound: !0
			}).setGraph({
				rankdir: n,
				nodesep: 50,
				ranksep: 50,
				marginx: 8,
				marginy: 8
			}).setDefaultEdgeLabel(function() {
				return {};
			});
			tn(r, e, a, r), e.setNode(r, {
				clusterNode: !0,
				id: r,
				clusterData: V.get(r).clusterData,
				label: V.get(r).label,
				graph: a
			});
		} else i.debug("Cluster ** ", r, " **not meeting the criteria !externalConnections:", !V.get(r).externalConnections, " no parent: ", !e.parent(r), " children ", e.children(r) && e.children(r).length > 0, e.children("D"), t), i.debug(V);
		n = e.nodes(), i.debug("New list of nodes", n);
		for (let r of n) {
			let n = e.node(r);
			i.debug(" Now next level", r, n), n?.clusterNode && cn(n.graph, t + 1);
		}
	}
}, "extractor"), ln = /* @__PURE__ */ n((e, t) => {
	if (t.length === 0) return [];
	let n = Object.assign([], t);
	return t.forEach((t) => {
		let r = ln(e, e.children(t));
		n = [...n, ...r];
	}), n;
}, "sorter"), un = /* @__PURE__ */ n((e) => ln(e, e.children()), "sortNodesByHierarchy"), dn = /* @__PURE__ */ n((e, t, n) => {
	let r = e.parent(t);
	for (; r && r !== n;) {
		let t = V.get(r);
		if (t && !t.externalConnections) return !0;
		r = e.parent(r);
	}
	return !1;
}, "isNodeInExtractableCluster"), fn = /* @__PURE__ */ n((e, t, n) => {
	let r = e.children(t) ?? [];
	for (let i of r) {
		if (i === n || $t(i, n)) continue;
		let r = an(i, e, t);
		if (r && !dn(e, r, t)) return r;
	}
	return null;
}, "findSafeAnchorNode");
function pn({ prepareLayout: e, measureLayout: t, runLayoutCore: r, paintLayout: i, afterPaint: a, paintOptions: o }) {
	let s = t ?? hn;
	return /* @__PURE__ */ n(async function(t, n, c, l) {
		let u = n.select("g");
		(c?.insertMarkers ?? Ce)(u, t.markers, t.type, t.diagramId), mn();
		let d = {
			element: u,
			helpers: c,
			options: l
		};
		d.preparedLayout = await e?.(t, d);
		let f = await s(t, d), p = await r(t, d), m = {
			...d,
			measure: f
		};
		i ? await i(t, m, p) : await gn(t, m, o), await a?.(t, m, p);
	}, "render");
}
n(pn, "createCommonLayoutRenderer");
function mn() {
	me(), we(), ge(), Qt();
}
n(mn, "clearLayoutRenderState");
async function hn(e, { element: t }) {
	return await Yt(t, e);
}
n(hn, "defaultMeasureLayout");
async function gn(e, t, n = {}) {
	let { measure: r } = t, { groups: i } = r;
	for (let r of n.getNodes?.(e, t) ?? e.nodes) n.skipNode?.(r, t) || await _n(i, r, t, n);
	let a = yn(e.nodes);
	for (let r of e.edges) bn(r, n) || await xn(i, r, a, e, n, t);
}
n(gn, "paintLayoutData");
async function _n(e, t, n, r) {
	t.clusterNode ? de(t) : vn(t, n, r) ? await he(e.clusters, t) : de(t);
}
n(_n, "paintLayoutNode");
function vn(e, t, n) {
	return e.isGroup === !0 && (n.isCluster?.(e, t) ?? !0);
}
n(vn, "shouldPaintAsCluster");
function yn(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) n?.id && t.set(n.id, n);
	return t;
}
n(yn, "buildNodeLookup");
function bn(e, t) {
	return e.isLayoutOnly || !!t.skipEdge?.(e);
}
n(bn, "shouldSkipPaintEdge");
async function xn(e, t, n, r, i, a) {
	let o = ye(e.edgePaths, { ...t }, i.clusterDb ?? /* @__PURE__ */ new Map(), r.type, Sn(t.start, t, n, a, i), Sn(t.end, t, n, a, i), r.diagramId, Cn(t, i));
	Se(t) && (xe.has(t.id) || await _e(e.edgeLabels, t), wn(t, o));
}
n(xn, "paintLayoutEdge");
function Sn(e, t, n, r, i) {
	return i.getEdgeNode?.(e, t, r) ?? (e ? n.get(e) ?? {} : {});
}
n(Sn, "getRenderedNode");
function Cn(e, t) {
	return typeof t.skipIntersect == "function" ? t.skipIntersect(e) : t.skipIntersect ?? !1;
}
n(Cn, "shouldSkipIntersect");
function wn(e, t) {
	let n = t?.updatedPath ?? t?.originalPath, r = x(), { subGraphTitleTotalMargin: a } = fe({ flowchart: r.flowchart ?? {} });
	if (e.label) {
		let r = xe.get(e.id), o = e.x, s = e.y;
		if (n) {
			let r = F.calcLabelPosition(n);
			i.debug("Moving label " + e.label + " from (", o, ",", s, ") to (", r.x, ",", r.y, ") abc88"), t?.updatedPath && (o = r.x, s = r.y);
		}
		r.attr("transform", `translate(${o}, ${s + a / 2})`);
	}
	if (e?.startLabelLeft) {
		let t = be.get(e.id).startLeft, r = e?.x, i = e?.y;
		if (n) {
			let t = F.calcTerminalLabelPosition(e.arrowTypeStart ? 10 : 0, "start_left", n);
			r = t.x, i = t.y;
		}
		t.attr("transform", `translate(${r}, ${i})`);
	}
	if (e.startLabelRight) {
		let t = be.get(e.id).startRight, r = e.x, i = e.y;
		if (n) {
			let t = F.calcTerminalLabelPosition(e.arrowTypeStart ? 10 : 0, "start_right", n);
			r = t.x, i = t.y;
		}
		t.attr("transform", `translate(${r}, ${i})`);
	}
	if (e.endLabelLeft) {
		let t = be.get(e.id).endLeft, r = e.x, i = e.y;
		if (n) {
			let t = F.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_left", n);
			r = t.x, i = t.y;
		}
		t.attr("transform", `translate(${r}, ${i})`);
	}
	if (e.endLabelRight) {
		let t = be.get(e.id).endRight, r = e.x, i = e.y;
		if (n) {
			let t = F.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_right", n);
			r = t.x, i = t.y;
		}
		t.attr("transform", `translate(${r}, ${i})`);
	}
}
n(wn, "positionRenderedEdgeLabel");
//#endregion
//#region node_modules/mermaid/dist/chunks/mermaid.core/chunk-LNGE3PJU.mjs
function Tn(e) {
	return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
n(Tn, "getDefaultExportFromCjs");
var H = {}, En = {}, Dn = {}, On;
function kn() {
	if (On) return Dn;
	On = 1;
	function e(e) {
		return e == null;
	}
	n(e, "isNothing");
	function t(e) {
		return typeof e == "object" && !!e;
	}
	n(t, "isObject");
	function r(t) {
		return Array.isArray(t) ? t : e(t) ? [] : [t];
	}
	n(r, "toArray");
	function i(e, t) {
		if (t) {
			let n = Object.keys(t);
			for (let r = 0, i = n.length; r < i; r += 1) {
				let i = n[r];
				e[i] = t[i];
			}
		}
		return e;
	}
	n(i, "extend");
	function a(e, t) {
		let n = "";
		for (let r = 0; r < t; r += 1) n += e;
		return n;
	}
	n(a, "repeat");
	function o(e) {
		return e === 0 && 1 / e == -Infinity;
	}
	return n(o, "isNegativeZero"), Dn.isNothing = e, Dn.isObject = t, Dn.toArray = r, Dn.repeat = a, Dn.isNegativeZero = o, Dn.extend = i, Dn;
}
n(kn, "requireCommon");
var An, jn;
function Mn() {
	if (jn) return An;
	jn = 1;
	function e(e, t) {
		let n = "", r = e.reason || "(unknown reason)";
		return e.mark ? (e.mark.name && (n += "in \"" + e.mark.name + "\" "), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += "\n\n" + e.mark.snippet), r + " " + n) : r;
	}
	n(e, "formatError");
	function t(t, n) {
		Error.call(this), this.name = "YAMLException", this.reason = t, this.mark = n, this.message = e(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (/* @__PURE__ */ Error()).stack || "";
	}
	return n(t, "YAMLException2"), t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t.prototype.toString = /* @__PURE__ */ n(function(t) {
		return this.name + ": " + e(this, t);
	}, "toString"), An = t, An;
}
n(Mn, "requireException");
var Nn, Pn;
function Fn() {
	if (Pn) return Nn;
	Pn = 1;
	let e = kn();
	function t(e, t, n, r, i) {
		let a = "", o = "", s = Math.floor(i / 2) - 1;
		return r - t > s && (a = " ... ", t = r - s + a.length), n - r > s && (o = " ...", n = r + s - o.length), {
			str: a + e.slice(t, n).replace(/\t/g, "→") + o,
			pos: r - t + a.length
		};
	}
	n(t, "getLine");
	function r(t, n) {
		return e.repeat(" ", n - t.length) + t;
	}
	n(r, "padStart");
	function i(n, i) {
		if (i = Object.create(i || null), !n.buffer) return null;
		i.maxLength || (i.maxLength = 79), typeof i.indent != "number" && (i.indent = 1), typeof i.linesBefore != "number" && (i.linesBefore = 3), typeof i.linesAfter != "number" && (i.linesAfter = 2);
		let a = /\r?\n|\r|\0/g, o = [0], s = [], c, l = -1;
		for (; c = a.exec(n.buffer);) s.push(c.index), o.push(c.index + c[0].length), n.position <= c.index && l < 0 && (l = o.length - 2);
		l < 0 && (l = o.length - 1);
		let u = "", d = Math.min(n.line + i.linesAfter, s.length).toString().length, f = i.maxLength - (i.indent + d + 3);
		for (let a = 1; a <= i.linesBefore && !(l - a < 0); a++) {
			let c = t(n.buffer, o[l - a], s[l - a], n.position - (o[l] - o[l - a]), f);
			u = e.repeat(" ", i.indent) + r((n.line - a + 1).toString(), d) + " | " + c.str + "\n" + u;
		}
		let p = t(n.buffer, o[l], s[l], n.position, f);
		u += e.repeat(" ", i.indent) + r((n.line + 1).toString(), d) + " | " + p.str + "\n", u += e.repeat("-", i.indent + d + 3 + p.pos) + "^\n";
		for (let a = 1; a <= i.linesAfter && !(l + a >= s.length); a++) {
			let c = t(n.buffer, o[l + a], s[l + a], n.position - (o[l] - o[l + a]), f);
			u += e.repeat(" ", i.indent) + r((n.line + a + 1).toString(), d) + " | " + c.str + "\n";
		}
		return u.replace(/\n$/, "");
	}
	return n(i, "makeSnippet"), Nn = i, Nn;
}
n(Fn, "requireSnippet");
var In, Ln;
function U() {
	if (Ln) return In;
	Ln = 1;
	let e = Mn(), t = [
		"kind",
		"multi",
		"resolve",
		"construct",
		"instanceOf",
		"predicate",
		"represent",
		"representName",
		"defaultStyle",
		"styleAliases"
	], r = [
		"scalar",
		"sequence",
		"mapping"
	];
	function i(e) {
		let t = {};
		return e !== null && Object.keys(e).forEach(function(n) {
			e[n].forEach(function(e) {
				t[String(e)] = n;
			});
		}), t;
	}
	n(i, "compileStyleAliases");
	function a(n, a) {
		if (a ||= {}, Object.keys(a).forEach(function(r) {
			if (t.indexOf(r) === -1) throw new e("Unknown option \"" + r + "\" is met in definition of \"" + n + "\" YAML type.");
		}), this.options = a, this.tag = n, this.kind = a.kind || null, this.resolve = a.resolve || function() {
			return !0;
		}, this.construct = a.construct || function(e) {
			return e;
		}, this.instanceOf = a.instanceOf || null, this.predicate = a.predicate || null, this.represent = a.represent || null, this.representName = a.representName || null, this.defaultStyle = a.defaultStyle || null, this.multi = a.multi || !1, this.styleAliases = i(a.styleAliases || null), r.indexOf(this.kind) === -1) throw new e("Unknown kind \"" + this.kind + "\" is specified for \"" + n + "\" YAML type.");
	}
	return n(a, "Type2"), In = a, In;
}
n(U, "requireType");
var Rn, zn;
function Bn() {
	if (zn) return Rn;
	zn = 1;
	let e = Mn(), t = U();
	function r(e, t) {
		let n = [];
		return e[t].forEach(function(e) {
			let t = n.length;
			n.forEach(function(n, r) {
				n.tag === e.tag && n.kind === e.kind && n.multi === e.multi && (t = r);
			}), n[t] = e;
		}), n;
	}
	n(r, "compileList");
	function i() {
		let e = {
			scalar: {},
			sequence: {},
			mapping: {},
			fallback: {},
			multi: {
				scalar: [],
				sequence: [],
				mapping: [],
				fallback: []
			}
		};
		function t(t) {
			t.multi ? (e.multi[t.kind].push(t), e.multi.fallback.push(t)) : e[t.kind][t.tag] = e.fallback[t.tag] = t;
		}
		n(t, "collectType");
		for (let e = 0, n = arguments.length; e < n; e += 1) arguments[e].forEach(t);
		return e;
	}
	n(i, "compileMap");
	function a(e) {
		return this.extend(e);
	}
	return n(a, "Schema2"), a.prototype.extend = /* @__PURE__ */ n(function(n) {
		let o = [], s = [];
		if (n instanceof t) s.push(n);
		else if (Array.isArray(n)) s = s.concat(n);
		else if (n && (Array.isArray(n.implicit) || Array.isArray(n.explicit))) n.implicit && (o = o.concat(n.implicit)), n.explicit && (s = s.concat(n.explicit));
		else throw new e("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
		o.forEach(function(n) {
			if (!(n instanceof t)) throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
			if (n.loadKind && n.loadKind !== "scalar") throw new e("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
			if (n.multi) throw new e("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
		}), s.forEach(function(n) {
			if (!(n instanceof t)) throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
		});
		let c = Object.create(a.prototype);
		return c.implicit = (this.implicit || []).concat(o), c.explicit = (this.explicit || []).concat(s), c.compiledImplicit = r(c, "implicit"), c.compiledExplicit = r(c, "explicit"), c.compiledTypeMap = i(c.compiledImplicit, c.compiledExplicit), c;
	}, "extend"), Rn = a, Rn;
}
n(Bn, "requireSchema");
var Vn, Hn;
function Un() {
	return Hn || (Hn = 1, Vn = new (U())("tag:yaml.org,2002:str", {
		kind: "scalar",
		construct: /* @__PURE__ */ n(function(e) {
			return e === null ? "" : e;
		}, "construct")
	})), Vn;
}
n(Un, "requireStr");
var Wn, Gn;
function Kn() {
	return Gn || (Gn = 1, Wn = new (U())("tag:yaml.org,2002:seq", {
		kind: "sequence",
		construct: /* @__PURE__ */ n(function(e) {
			return e === null ? [] : e;
		}, "construct")
	})), Wn;
}
n(Kn, "requireSeq");
var qn, Jn;
function Yn() {
	return Jn || (Jn = 1, qn = new (U())("tag:yaml.org,2002:map", {
		kind: "mapping",
		construct: /* @__PURE__ */ n(function(e) {
			return e === null ? {} : e;
		}, "construct")
	})), qn;
}
n(Yn, "requireMap");
var Xn, Zn;
function Qn() {
	return Zn || (Zn = 1, Xn = new (Bn())({ explicit: [
		Un(),
		Kn(),
		Yn()
	] })), Xn;
}
n(Qn, "requireFailsafe");
var $n, er;
function tr() {
	if (er) return $n;
	er = 1;
	let e = U();
	function t(e) {
		if (e === null) return !0;
		let t = e.length;
		return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
	}
	n(t, "resolveYamlNull");
	function r() {
		return null;
	}
	n(r, "constructYamlNull");
	function i(e) {
		return e === null;
	}
	return n(i, "isNull"), $n = new e("tag:yaml.org,2002:null", {
		kind: "scalar",
		resolve: t,
		construct: r,
		predicate: i,
		represent: {
			canonical: /* @__PURE__ */ n(function() {
				return "~";
			}, "canonical"),
			lowercase: /* @__PURE__ */ n(function() {
				return "null";
			}, "lowercase"),
			uppercase: /* @__PURE__ */ n(function() {
				return "NULL";
			}, "uppercase"),
			camelcase: /* @__PURE__ */ n(function() {
				return "Null";
			}, "camelcase"),
			empty: /* @__PURE__ */ n(function() {
				return "";
			}, "empty")
		},
		defaultStyle: "lowercase"
	}), $n;
}
n(tr, "require_null");
var nr, rr;
function ir() {
	if (rr) return nr;
	rr = 1;
	let e = U();
	function t(e) {
		if (e === null) return !1;
		let t = e.length;
		return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
	}
	n(t, "resolveYamlBoolean");
	function r(e) {
		return e === "true" || e === "True" || e === "TRUE";
	}
	n(r, "constructYamlBoolean");
	function i(e) {
		return Object.prototype.toString.call(e) === "[object Boolean]";
	}
	return n(i, "isBoolean"), nr = new e("tag:yaml.org,2002:bool", {
		kind: "scalar",
		resolve: t,
		construct: r,
		predicate: i,
		represent: {
			lowercase: /* @__PURE__ */ n(function(e) {
				return e ? "true" : "false";
			}, "lowercase"),
			uppercase: /* @__PURE__ */ n(function(e) {
				return e ? "TRUE" : "FALSE";
			}, "uppercase"),
			camelcase: /* @__PURE__ */ n(function(e) {
				return e ? "True" : "False";
			}, "camelcase")
		},
		defaultStyle: "lowercase"
	}), nr;
}
n(ir, "requireBool");
var ar, or;
function sr() {
	if (or) return ar;
	or = 1;
	let e = kn(), t = U();
	function r(e) {
		return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
	}
	n(r, "isHexCode");
	function i(e) {
		return e >= 48 && e <= 55;
	}
	n(i, "isOctCode");
	function a(e) {
		return e >= 48 && e <= 57;
	}
	n(a, "isDecCode");
	function o(e) {
		if (e === null) return !1;
		let t = e.length, n = 0, o = !1;
		if (!t) return !1;
		let c = e[n];
		if ((c === "-" || c === "+") && (c = e[++n]), c === "0") {
			if (n + 1 === t) return !0;
			if (c = e[++n], c === "b") {
				for (n++; n < t; n++) {
					if (c = e[n], c !== "0" && c !== "1") return !1;
					o = !0;
				}
				return o && isFinite(s(e));
			}
			if (c === "x") {
				for (n++; n < t; n++) {
					if (!r(e.charCodeAt(n))) return !1;
					o = !0;
				}
				return o && isFinite(s(e));
			}
			if (c === "o") {
				for (n++; n < t; n++) {
					if (!i(e.charCodeAt(n))) return !1;
					o = !0;
				}
				return o && isFinite(s(e));
			}
		}
		for (; n < t; n++) {
			if (!a(e.charCodeAt(n))) return !1;
			o = !0;
		}
		return o ? isFinite(s(e)) : !1;
	}
	n(o, "resolveYamlInteger");
	function s(e) {
		let t = e, n = 1, r = t[0];
		if ((r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
		if (r === "0") {
			if (t[1] === "b") return n * parseInt(t.slice(2), 2);
			if (t[1] === "x") return n * parseInt(t.slice(2), 16);
			if (t[1] === "o") return n * parseInt(t.slice(2), 8);
		}
		return n * parseInt(t, 10);
	}
	n(s, "parseYamlInteger");
	function c(e) {
		return s(e);
	}
	n(c, "constructYamlInteger");
	function l(t) {
		return Object.prototype.toString.call(t) === "[object Number]" && t % 1 == 0 && !e.isNegativeZero(t);
	}
	return n(l, "isInteger"), ar = new t("tag:yaml.org,2002:int", {
		kind: "scalar",
		resolve: o,
		construct: c,
		predicate: l,
		represent: {
			binary: /* @__PURE__ */ n(function(e) {
				return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
			}, "binary"),
			octal: /* @__PURE__ */ n(function(e) {
				return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
			}, "octal"),
			decimal: /* @__PURE__ */ n(function(e) {
				return e.toString(10);
			}, "decimal"),
			hexadecimal: /* @__PURE__ */ n(function(e) {
				return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
			}, "hexadecimal")
		},
		defaultStyle: "decimal",
		styleAliases: {
			binary: [2, "bin"],
			octal: [8, "oct"],
			decimal: [10, "dec"],
			hexadecimal: [16, "hex"]
		}
	}), ar;
}
n(sr, "requireInt");
var cr, lr;
function ur() {
	if (lr) return cr;
	lr = 1;
	let e = kn(), t = U(), r = /* @__PURE__ */ RegExp("^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"), i = /* @__PURE__ */ RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
	function a(e) {
		return e === null || !r.test(e) ? !1 : isFinite(parseFloat(e, 10)) ? !0 : i.test(e);
	}
	n(a, "resolveYamlFloat");
	function o(e) {
		let t = e.toLowerCase(), n = t[0] === "-" ? -1 : 1;
		return "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Infinity : -Infinity : t === ".nan" ? NaN : n * parseFloat(t, 10);
	}
	n(o, "constructYamlFloat");
	let s = /^[-+]?[0-9]+e/;
	function c(t, n) {
		if (isNaN(t)) switch (n) {
			case "lowercase": return ".nan";
			case "uppercase": return ".NAN";
			case "camelcase": return ".NaN";
		}
		else if (t === Infinity) switch (n) {
			case "lowercase": return ".inf";
			case "uppercase": return ".INF";
			case "camelcase": return ".Inf";
		}
		else if (t === -Infinity) switch (n) {
			case "lowercase": return "-.inf";
			case "uppercase": return "-.INF";
			case "camelcase": return "-.Inf";
		}
		else if (e.isNegativeZero(t)) return "-0.0";
		let r = t.toString(10);
		return s.test(r) ? r.replace("e", ".e") : r;
	}
	n(c, "representYamlFloat");
	function l(t) {
		return Object.prototype.toString.call(t) === "[object Number]" && (t % 1 != 0 || e.isNegativeZero(t));
	}
	return n(l, "isFloat"), cr = new t("tag:yaml.org,2002:float", {
		kind: "scalar",
		resolve: a,
		construct: o,
		predicate: l,
		represent: c,
		defaultStyle: "lowercase"
	}), cr;
}
n(ur, "requireFloat");
var dr, fr;
function pr() {
	return fr || (fr = 1, dr = Qn().extend({ implicit: [
		tr(),
		ir(),
		sr(),
		ur()
	] })), dr;
}
n(pr, "requireJson");
var mr, hr;
function gr() {
	return hr || (hr = 1, mr = pr()), mr;
}
n(gr, "requireCore");
var _r, vr;
function yr() {
	if (vr) return _r;
	vr = 1;
	let e = U(), t = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), r = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
	function i(e) {
		return e === null ? !1 : t.exec(e) !== null || r.exec(e) !== null;
	}
	n(i, "resolveYamlTimestamp");
	function a(e) {
		let n = 0, i = null, a = t.exec(e);
		if (a === null && (a = r.exec(e)), a === null) throw Error("Date resolve error");
		let o = +a[1], s = a[2] - 1, c = +a[3];
		if (!a[4]) return new Date(Date.UTC(o, s, c));
		let l = +a[4], u = +a[5], d = +a[6];
		if (a[7]) {
			for (n = a[7].slice(0, 3); n.length < 3;) n += "0";
			n = +n;
		}
		if (a[9]) {
			let e = +a[10], t = +(a[11] || 0);
			i = (e * 60 + t) * 6e4, a[9] === "-" && (i = -i);
		}
		let f = new Date(Date.UTC(o, s, c, l, u, d, n));
		return i && f.setTime(f.getTime() - i), f;
	}
	n(a, "constructYamlTimestamp");
	function o(e) {
		return e.toISOString();
	}
	return n(o, "representYamlTimestamp"), _r = new e("tag:yaml.org,2002:timestamp", {
		kind: "scalar",
		resolve: i,
		construct: a,
		instanceOf: Date,
		represent: o
	}), _r;
}
n(yr, "requireTimestamp");
var br, xr;
function Sr() {
	if (xr) return br;
	xr = 1;
	let e = U();
	function t(e) {
		return e === "<<" || e === null;
	}
	return n(t, "resolveYamlMerge"), br = new e("tag:yaml.org,2002:merge", {
		kind: "scalar",
		resolve: t
	}), br;
}
n(Sr, "requireMerge");
var Cr, wr;
function Tr() {
	if (wr) return Cr;
	wr = 1;
	let e = U();
	function t(e) {
		if (e === null) return !1;
		let t = 0, n = e.length;
		for (let r = 0; r < n; r++) {
			let n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r".indexOf(e.charAt(r));
			if (!(n > 64)) {
				if (n < 0) return !1;
				t += 6;
			}
		}
		return t % 8 == 0;
	}
	n(t, "resolveYamlBinary");
	function r(e) {
		let t = e.replace(/[\r\n=]/g, ""), n = t.length, r = 0, i = [];
		for (let e = 0; e < n; e++) e % 4 == 0 && e && (i.push(r >> 16 & 255), i.push(r >> 8 & 255), i.push(r & 255)), r = r << 6 | "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r".indexOf(t.charAt(e));
		let a = n % 4 * 6;
		return a === 0 ? (i.push(r >> 16 & 255), i.push(r >> 8 & 255), i.push(r & 255)) : a === 18 ? (i.push(r >> 10 & 255), i.push(r >> 2 & 255)) : a === 12 && i.push(r >> 4 & 255), new Uint8Array(i);
	}
	n(r, "constructYamlBinary");
	function i(e) {
		let t = "", n = 0, r = e.length, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
		for (let a = 0; a < r; a++) a % 3 == 0 && a && (t += i[n >> 18 & 63], t += i[n >> 12 & 63], t += i[n >> 6 & 63], t += i[n & 63]), n = (n << 8) + e[a];
		let a = r % 3;
		return a === 0 ? (t += i[n >> 18 & 63], t += i[n >> 12 & 63], t += i[n >> 6 & 63], t += i[n & 63]) : a === 2 ? (t += i[n >> 10 & 63], t += i[n >> 4 & 63], t += i[n << 2 & 63], t += i[64]) : a === 1 && (t += i[n >> 2 & 63], t += i[n << 4 & 63], t += i[64], t += i[64]), t;
	}
	n(i, "representYamlBinary");
	function a(e) {
		return Object.prototype.toString.call(e) === "[object Uint8Array]";
	}
	return n(a, "isBinary"), Cr = new e("tag:yaml.org,2002:binary", {
		kind: "scalar",
		resolve: t,
		construct: r,
		predicate: a,
		represent: i
	}), Cr;
}
n(Tr, "requireBinary");
var Er, Dr;
function Or() {
	if (Dr) return Er;
	Dr = 1;
	let e = U(), t = Object.prototype.hasOwnProperty, r = Object.prototype.toString;
	function i(e) {
		if (e === null) return !0;
		let n = [], i = e;
		for (let e = 0, a = i.length; e < a; e += 1) {
			let a = i[e], o = !1;
			if (r.call(a) !== "[object Object]") return !1;
			let s;
			for (s in a) if (t.call(a, s)) {
				if (!o) o = !0;
				else return !1;
			}
			if (!o) return !1;
			if (n.indexOf(s) === -1) n.push(s);
			else return !1;
		}
		return !0;
	}
	n(i, "resolveYamlOmap");
	function a(e) {
		return e === null ? [] : e;
	}
	return n(a, "constructYamlOmap"), Er = new e("tag:yaml.org,2002:omap", {
		kind: "sequence",
		resolve: i,
		construct: a
	}), Er;
}
n(Or, "requireOmap");
var kr, Ar;
function jr() {
	if (Ar) return kr;
	Ar = 1;
	let e = U(), t = Object.prototype.toString;
	function r(e) {
		if (e === null) return !0;
		let n = e, r = Array(n.length);
		for (let e = 0, i = n.length; e < i; e += 1) {
			let i = n[e];
			if (t.call(i) !== "[object Object]") return !1;
			let a = Object.keys(i);
			if (a.length !== 1) return !1;
			r[e] = [a[0], i[a[0]]];
		}
		return !0;
	}
	n(r, "resolveYamlPairs");
	function i(e) {
		if (e === null) return [];
		let t = e, n = Array(t.length);
		for (let e = 0, r = t.length; e < r; e += 1) {
			let r = t[e], i = Object.keys(r);
			n[e] = [i[0], r[i[0]]];
		}
		return n;
	}
	return n(i, "constructYamlPairs"), kr = new e("tag:yaml.org,2002:pairs", {
		kind: "sequence",
		resolve: r,
		construct: i
	}), kr;
}
n(jr, "requirePairs");
var Mr, Nr;
function Pr() {
	if (Nr) return Mr;
	Nr = 1;
	let e = U(), t = Object.prototype.hasOwnProperty;
	function r(e) {
		if (e === null) return !0;
		let n = e;
		for (let e in n) if (t.call(n, e) && n[e] !== null) return !1;
		return !0;
	}
	n(r, "resolveYamlSet");
	function i(e) {
		return e === null ? {} : e;
	}
	return n(i, "constructYamlSet"), Mr = new e("tag:yaml.org,2002:set", {
		kind: "mapping",
		resolve: r,
		construct: i
	}), Mr;
}
n(Pr, "requireSet");
var Fr, Ir;
function Lr() {
	return Ir || (Ir = 1, Fr = gr().extend({
		implicit: [yr(), Sr()],
		explicit: [
			Tr(),
			Or(),
			jr(),
			Pr()
		]
	})), Fr;
}
n(Lr, "require_default");
var Rr;
function zr() {
	if (Rr) return En;
	Rr = 1;
	let e = kn(), t = Mn(), r = Fn(), i = Lr(), a = Object.prototype.hasOwnProperty, o = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, s = /[\x85\u2028\u2029]/, c = /[,\[\]{}]/, l = /^(?:!|!!|![0-9A-Za-z-]+!)$/, u = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
	function d(e) {
		return Object.prototype.toString.call(e);
	}
	n(d, "_class");
	function f(e) {
		return e === 10 || e === 13;
	}
	n(f, "isEol");
	function p(e) {
		return e === 9 || e === 32;
	}
	n(p, "isWhiteSpace");
	function m(e) {
		return e === 9 || e === 32 || e === 10 || e === 13;
	}
	n(m, "isWsOrEol");
	function h(e) {
		return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
	}
	n(h, "isFlowIndicator");
	function g(e) {
		if (e >= 48 && e <= 57) return e - 48;
		let t = e | 32;
		return t >= 97 && t <= 102 ? t - 97 + 10 : -1;
	}
	n(g, "fromHexCode");
	function _(e) {
		return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
	}
	n(_, "escapedHexLen");
	function v(e) {
		return e >= 48 && e <= 57 ? e - 48 : -1;
	}
	n(v, "fromDecimalCode");
	function y(e) {
		switch (e) {
			case 48: return "\0";
			case 97: return "\x07";
			case 98: return "\b";
			case 116: return "	";
			case 9: return "	";
			case 110: return "\n";
			case 118: return "\v";
			case 102: return "\f";
			case 114: return "\r";
			case 101: return "\x1B";
			case 32: return " ";
			case 34: return "\"";
			case 47: return "/";
			case 92: return "\\";
			case 78: return "";
			case 95: return "\xA0";
			case 76: return "\u2028";
			case 80: return "\u2029";
			default: return "";
		}
	}
	n(y, "simpleEscapeSequence");
	function b(e) {
		return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320);
	}
	n(b, "charFromCodepoint");
	function x(e, t, n) {
		t === "__proto__" ? Object.defineProperty(e, t, {
			configurable: !0,
			enumerable: !0,
			writable: !0,
			value: n
		}) : e[t] = n;
	}
	n(x, "setProperty");
	let S = Array(256), C = Array(256);
	for (let e = 0; e < 256; e++) S[e] = +!!y(e), C[e] = y(e);
	function w(e, t) {
		this.input = e, this.filename = t.filename || null, this.schema = t.schema || i, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.maxDepth = typeof t.maxDepth == "number" ? t.maxDepth : 100, this.maxTotalMergeKeys = typeof t.maxTotalMergeKeys == "number" ? t.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
	}
	n(w, "State");
	function T(e, n) {
		let i = {
			name: e.filename,
			buffer: e.input.slice(0, -1),
			position: e.position,
			line: e.line,
			column: e.position - e.lineStart
		};
		return i.snippet = r(i), new t(n, i);
	}
	n(T, "generateError");
	function E(e, t) {
		throw T(e, t);
	}
	n(E, "throwError");
	function D(e, t) {
		e.onWarning && e.onWarning.call(null, T(e, t));
	}
	n(D, "throwWarning");
	function O(e, t, n) {
		let r = e.anchorMapTransactions;
		if (r.length !== 0) {
			let n = r[r.length - 1];
			a.call(n, t) || (n[t] = {
				existed: a.call(e.anchorMap, t),
				value: e.anchorMap[t]
			});
		}
		e.anchorMap[t] = n;
	}
	n(O, "storeAnchor");
	function k(e) {
		e.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
	}
	n(k, "beginAnchorTransaction");
	function ee(e) {
		let t = e.anchorMapTransactions.pop(), n = e.anchorMapTransactions;
		if (n.length === 0) return;
		let r = n[n.length - 1], i = Object.keys(t);
		for (let e = 0, n = i.length; e < n; e += 1) {
			let n = i[e];
			a.call(r, n) || (r[n] = t[n]);
		}
	}
	n(ee, "commitAnchorTransaction");
	function te(e) {
		let t = e.anchorMapTransactions.pop(), n = Object.keys(t);
		for (let r = n.length - 1; r >= 0; --r) {
			let i = t[n[r]];
			i.existed ? e.anchorMap[n[r]] = i.value : delete e.anchorMap[n[r]];
		}
	}
	n(te, "rollbackAnchorTransaction");
	function A(e) {
		return {
			position: e.position,
			line: e.line,
			lineStart: e.lineStart,
			lineIndent: e.lineIndent,
			firstTabInLine: e.firstTabInLine,
			tag: e.tag,
			anchor: e.anchor,
			kind: e.kind,
			result: e.result
		};
	}
	n(A, "snapshotState");
	function j(e, t) {
		e.position = t.position, e.line = t.line, e.lineStart = t.lineStart, e.lineIndent = t.lineIndent, e.firstTabInLine = t.firstTabInLine, e.tag = t.tag, e.anchor = t.anchor, e.kind = t.kind, e.result = t.result;
	}
	n(j, "restoreState");
	let ne = {
		YAML: /* @__PURE__ */ n(function(e, t, n) {
			e.version !== null && E(e, "duplication of %YAML directive"), n.length !== 1 && E(e, "YAML directive accepts exactly one argument");
			let r = /^([0-9]+)\.([0-9]+)$/.exec(n[0]);
			r === null && E(e, "ill-formed argument of the YAML directive");
			let i = parseInt(r[1], 10), a = parseInt(r[2], 10);
			i !== 1 && E(e, "unacceptable YAML version of the document"), e.version = n[0], e.checkLineBreaks = a < 2, a !== 1 && a !== 2 && D(e, "unsupported YAML version of the document");
		}, "handleYamlDirective"),
		TAG: /* @__PURE__ */ n(function(e, t, n) {
			let r;
			n.length !== 2 && E(e, "TAG directive accepts exactly two arguments");
			let i = n[0];
			r = n[1], l.test(i) || E(e, "ill-formed tag handle (first argument) of the TAG directive"), a.call(e.tagMap, i) && E(e, "there is a previously declared suffix for \"" + i + "\" tag handle"), u.test(r) || E(e, "ill-formed tag prefix (second argument) of the TAG directive");
			try {
				r = decodeURIComponent(r);
			} catch {
				E(e, "tag prefix is malformed: " + r);
			}
			e.tagMap[i] = r;
		}, "handleTagDirective")
	};
	function M(e, t, n, r) {
		if (t < n) {
			let i = e.input.slice(t, n);
			if (r) for (let t = 0, n = i.length; t < n; t += 1) {
				let n = i.charCodeAt(t);
				n === 9 || n >= 32 && n <= 1114111 || E(e, "expected valid JSON character");
			}
			else o.test(i) && E(e, "the stream contains non-printable characters");
			e.result += i;
		}
	}
	n(M, "captureSegment");
	function N(t, n, r, i) {
		e.isObject(r) || E(t, "cannot merge mappings; the provided source object is unacceptable");
		let o = Object.keys(r);
		for (let e = 0, s = o.length; e < s; e += 1) {
			let s = o[e];
			t.maxTotalMergeKeys !== -1 && ++t.totalMergeKeys > t.maxTotalMergeKeys && E(t, "merge keys exceeded maxTotalMergeKeys (" + t.maxTotalMergeKeys + ")"), a.call(n, s) || (x(n, s, r[s]), i[s] = !0);
		}
	}
	n(N, "mergeMappings");
	function P(e, t, n, r, i, o, s, c, l) {
		if (Array.isArray(i)) {
			i = Array.prototype.slice.call(i);
			for (let t = 0, n = i.length; t < n; t += 1) Array.isArray(i[t]) && E(e, "nested arrays are not supported inside keys"), typeof i == "object" && d(i[t]) === "[object Object]" && (i[t] = "[object Object]");
		}
		if (typeof i == "object" && d(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge") {
			if (Array.isArray(o)) for (let r = 0, i = o.length; r < i; r += 1) N(e, t, o[r], n);
			else N(e, t, o, n);
		} else !e.json && !a.call(n, i) && a.call(t, i) && (e.line = s || e.line, e.lineStart = c || e.lineStart, e.position = l || e.position, E(e, "duplicated mapping key")), x(t, i, o), delete n[i];
		return t;
	}
	n(P, "storeMappingPair");
	function F(e) {
		let t = e.input.charCodeAt(e.position);
		t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : E(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
	}
	n(F, "readLineBreak");
	function I(e, t, n) {
		let r = 0, i = e.input.charCodeAt(e.position);
		for (; i !== 0;) {
			for (; p(i);) i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
			if (t && i === 35) do
				i = e.input.charCodeAt(++e.position);
			while (i !== 10 && i !== 13 && i !== 0);
			if (f(i)) for (F(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32;) e.lineIndent++, i = e.input.charCodeAt(++e.position);
			else break;
		}
		return n !== -1 && r !== 0 && e.lineIndent < n && D(e, "deficient indentation"), r;
	}
	n(I, "skipSeparationSpace");
	function re(e) {
		let t = e.position, n = e.input.charCodeAt(t);
		return !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || m(n)));
	}
	n(re, "testDocumentSeparator");
	function ie(t, n) {
		n === 1 ? t.result += " " : n > 1 && (t.result += e.repeat("\n", n - 1));
	}
	n(ie, "writeFoldedLines");
	function ae(e, t, n) {
		let r, i, a, o, s, c, l = e.kind, u = e.result, d = e.input.charCodeAt(e.position);
		if (m(d) || h(d) || d === 35 || d === 38 || d === 42 || d === 33 || d === 124 || d === 62 || d === 39 || d === 34 || d === 37 || d === 64 || d === 96) return !1;
		if (d === 63 || d === 45) {
			let t = e.input.charCodeAt(e.position + 1);
			if (m(t) || n && h(t)) return !1;
		}
		for (e.kind = "scalar", e.result = "", r = i = e.position, a = !1; d !== 0;) {
			if (d === 58) {
				let t = e.input.charCodeAt(e.position + 1);
				if (m(t) || n && h(t)) break;
			} else if (d === 35) {
				if (m(e.input.charCodeAt(e.position - 1))) break;
			} else if (e.position === e.lineStart && re(e) || n && h(d)) break;
			else if (f(d)) {
				if (o = e.line, s = e.lineStart, c = e.lineIndent, I(e, !1, -1), e.lineIndent >= t) {
					a = !0, d = e.input.charCodeAt(e.position);
					continue;
				}
				e.position = i, e.line = o, e.lineStart = s, e.lineIndent = c;
				break;
			}
			a &&= (M(e, r, i, !1), ie(e, e.line - o), r = i = e.position, !1), p(d) || (i = e.position + 1), d = e.input.charCodeAt(++e.position);
		}
		return M(e, r, i, !1), e.result ? !0 : (e.kind = l, e.result = u, !1);
	}
	n(ae, "readPlainScalar");
	function oe(e, t) {
		let n, r, i = e.input.charCodeAt(e.position);
		if (i !== 39) return !1;
		for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (i = e.input.charCodeAt(e.position)) !== 0;) if (i === 39) {
			if (M(e, n, e.position, !0), i = e.input.charCodeAt(++e.position), i === 39) n = e.position, e.position++, r = e.position;
			else return !0;
		} else f(i) ? (M(e, n, r, !0), ie(e, I(e, !1, t)), n = r = e.position) : e.position === e.lineStart && re(e) ? E(e, "unexpected end of the document within a single quoted scalar") : (e.position++, p(i) || (r = e.position));
		E(e, "unexpected end of the stream within a single quoted scalar");
	}
	n(oe, "readSingleQuotedScalar");
	function se(e, t) {
		let n, r, i, a = e.input.charCodeAt(e.position);
		if (a !== 34) return !1;
		for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (a = e.input.charCodeAt(e.position)) !== 0;) if (a === 34) return M(e, n, e.position, !0), e.position++, !0;
		else if (a === 92) {
			if (M(e, n, e.position, !0), a = e.input.charCodeAt(++e.position), f(a)) I(e, !1, t);
			else if (a < 256 && S[a]) e.result += C[a], e.position++;
			else if ((i = _(a)) > 0) {
				let t = i, n = 0;
				for (; t > 0; t--) a = e.input.charCodeAt(++e.position), (i = g(a)) >= 0 ? n = (n << 4) + i : E(e, "expected hexadecimal character");
				e.result += b(n), e.position++;
			} else E(e, "unknown escape sequence");
			n = r = e.position;
		} else f(a) ? (M(e, n, r, !0), ie(e, I(e, !1, t)), n = r = e.position) : e.position === e.lineStart && re(e) ? E(e, "unexpected end of the document within a double quoted scalar") : (e.position++, p(a) || (r = e.position));
		E(e, "unexpected end of the stream within a double quoted scalar");
	}
	n(se, "readDoubleQuotedScalar");
	function ce(e, t) {
		let n = !0, r, i, a, o = e.tag, s, c = e.anchor, l, u, d, f, p = /* @__PURE__ */ Object.create(null), h, g, _, v = e.input.charCodeAt(e.position);
		if (v === 91) l = 93, f = !1, s = [];
		else if (v === 123) l = 125, f = !0, s = {};
		else return !1;
		for (e.anchor !== null && O(e, e.anchor, s), v = e.input.charCodeAt(++e.position); v !== 0;) {
			if (I(e, !0, t), v = e.input.charCodeAt(e.position), v === l) return e.position++, e.tag = o, e.anchor = c, e.kind = f ? "mapping" : "sequence", e.result = s, !0;
			n ? v === 44 && E(e, "expected the node content, but found ','") : E(e, "missed comma between flow collection entries"), g = h = _ = null, u = d = !1, v === 63 && m(e.input.charCodeAt(e.position + 1)) && (u = d = !0, e.position++, I(e, !0, t)), r = e.line, i = e.lineStart, a = e.position, ge(e, t, 1, !1, !0), g = e.tag, h = e.result, I(e, !0, t), v = e.input.charCodeAt(e.position), (d || e.line === r) && v === 58 && (u = !0, v = e.input.charCodeAt(++e.position), I(e, !0, t), ge(e, t, 1, !1, !0), _ = e.result), f ? P(e, s, p, g, h, _, r, i, a) : u ? s.push(P(e, null, p, g, h, _, r, i, a)) : s.push(h), I(e, !0, t), v = e.input.charCodeAt(e.position), v === 44 ? (n = !0, v = e.input.charCodeAt(++e.position)) : n = !1;
		}
		E(e, "unexpected end of the stream within a flow collection");
	}
	n(ce, "readFlowCollection");
	function le(t, n) {
		let r, i = 1, a = !1, o = !1, s = n, c = 0, l = !1, u, d = t.input.charCodeAt(t.position);
		if (d === 124) r = !1;
		else if (d === 62) r = !0;
		else return !1;
		for (t.kind = "scalar", t.result = ""; d !== 0;) if (d = t.input.charCodeAt(++t.position), d === 43 || d === 45) i === 1 ? i = d === 43 ? 3 : 2 : E(t, "repeat of a chomping mode identifier");
		else if ((u = v(d)) >= 0) u === 0 ? E(t, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? E(t, "repeat of an indentation width identifier") : (s = n + u - 1, o = !0);
		else break;
		if (p(d)) {
			do
				d = t.input.charCodeAt(++t.position);
			while (p(d));
			if (d === 35) do
				d = t.input.charCodeAt(++t.position);
			while (!f(d) && d !== 0);
		}
		for (; d !== 0;) {
			for (F(t), t.lineIndent = 0, d = t.input.charCodeAt(t.position); (!o || t.lineIndent < s) && d === 32;) t.lineIndent++, d = t.input.charCodeAt(++t.position);
			if (!o && t.lineIndent > s && (s = t.lineIndent), f(d)) {
				c++;
				continue;
			}
			if (!o && s === 0 && E(t, "missing indentation for block scalar"), t.lineIndent < s) {
				i === 3 ? t.result += e.repeat("\n", a ? 1 + c : c) : i === 1 && a && (t.result += "\n");
				break;
			}
			r ? p(d) ? (l = !0, t.result += e.repeat("\n", a ? 1 + c : c)) : l ? (l = !1, t.result += e.repeat("\n", c + 1)) : c === 0 ? a && (t.result += " ") : t.result += e.repeat("\n", c) : t.result += e.repeat("\n", a ? 1 + c : c), a = !0, o = !0, c = 0;
			let n = t.position;
			for (; !f(d) && d !== 0;) d = t.input.charCodeAt(++t.position);
			M(t, n, t.position, !1);
		}
		return !0;
	}
	n(le, "readBlockScalar");
	function ue(e, t) {
		let n = e.tag, r = e.anchor, i = [], a = !1;
		if (e.firstTabInLine !== -1) return !1;
		e.anchor !== null && O(e, e.anchor, i);
		let o = e.input.charCodeAt(e.position);
		for (; o !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, E(e, "tab characters must not be used in indentation")), o === 45 && m(e.input.charCodeAt(e.position + 1)));) {
			if (a = !0, e.position++, I(e, !0, -1) && e.lineIndent <= t) {
				i.push(null), o = e.input.charCodeAt(e.position);
				continue;
			}
			let n = e.line;
			if (ge(e, t, 3, !1, !0), i.push(e.result), I(e, !0, -1), o = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && o !== 0) E(e, "bad indentation of a sequence entry");
			else if (e.lineIndent < t) break;
		}
		return a ? (e.tag = n, e.anchor = r, e.kind = "sequence", e.result = i, !0) : !1;
	}
	n(ue, "readBlockSequence");
	function de(e, t, n) {
		let r, i, a, o, s = e.tag, c = e.anchor, l = {}, u = /* @__PURE__ */ Object.create(null), d = null, f = null, h = null, g = !1, _ = !1;
		if (e.firstTabInLine !== -1) return !1;
		e.anchor !== null && O(e, e.anchor, l);
		let v = e.input.charCodeAt(e.position);
		for (; v !== 0;) {
			!g && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, E(e, "tab characters must not be used in indentation"));
			let y = e.input.charCodeAt(e.position + 1), b = e.line;
			if ((v === 63 || v === 58) && m(y)) v === 63 ? (g && (P(e, l, u, d, f, null, i, a, o), d = f = h = null), _ = !0, g = !0, r = !0) : g ? (g = !1, r = !0) : E(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, v = y;
			else {
				if (i = e.line, a = e.lineStart, o = e.position, !ge(e, n, 2, !1, !0)) break;
				if (e.line === b) {
					for (v = e.input.charCodeAt(e.position); p(v);) v = e.input.charCodeAt(++e.position);
					if (v === 58) v = e.input.charCodeAt(++e.position), m(v) || E(e, "a whitespace character is expected after the key-value separator within a block mapping"), g && (P(e, l, u, d, f, null, i, a, o), d = f = h = null), _ = !0, g = !1, r = !1, d = e.tag, f = e.result;
					else if (_) E(e, "can not read an implicit mapping pair; a colon is missed");
					else return e.tag = s, e.anchor = c, !0;
				} else if (_) E(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
				else return e.tag = s, e.anchor = c, !0;
			}
			if ((e.line === b || e.lineIndent > t) && (g && (i = e.line, a = e.lineStart, o = e.position), ge(e, t, 4, !0, r) && (g ? f = e.result : h = e.result), g || (P(e, l, u, d, f, h, i, a, o), d = f = h = null), I(e, !0, -1), v = e.input.charCodeAt(e.position)), (e.line === b || e.lineIndent > t) && v !== 0) E(e, "bad indentation of a mapping entry");
			else if (e.lineIndent < t) break;
		}
		return g && P(e, l, u, d, f, null, i, a, o), _ && (e.tag = s, e.anchor = c, e.kind = "mapping", e.result = l), _;
	}
	n(de, "readBlockMapping");
	function fe(e) {
		let t = !1, n = !1, r, i, o = e.input.charCodeAt(e.position);
		if (o !== 33) return !1;
		e.tag !== null && E(e, "duplication of a tag property"), o = e.input.charCodeAt(++e.position), o === 60 ? (t = !0, o = e.input.charCodeAt(++e.position)) : o === 33 ? (n = !0, r = "!!", o = e.input.charCodeAt(++e.position)) : r = "!";
		let s = e.position;
		if (t) {
			do
				o = e.input.charCodeAt(++e.position);
			while (o !== 0 && o !== 62);
			e.position < e.length ? (i = e.input.slice(s, e.position), o = e.input.charCodeAt(++e.position)) : E(e, "unexpected end of the stream within a verbatim tag");
		} else {
			for (; o !== 0 && !m(o);) o === 33 && (n ? E(e, "tag suffix cannot contain exclamation marks") : (r = e.input.slice(s - 1, e.position + 1), l.test(r) || E(e, "named tag handle cannot contain such characters"), n = !0, s = e.position + 1)), o = e.input.charCodeAt(++e.position);
			i = e.input.slice(s, e.position), c.test(i) && E(e, "tag suffix cannot contain flow indicator characters");
		}
		i && !u.test(i) && E(e, "tag name cannot contain such characters: " + i);
		try {
			i = decodeURIComponent(i);
		} catch {
			E(e, "tag name is malformed: " + i);
		}
		return t ? e.tag = i : a.call(e.tagMap, r) ? e.tag = e.tagMap[r] + i : r === "!" ? e.tag = "!" + i : r === "!!" ? e.tag = "tag:yaml.org,2002:" + i : E(e, "undeclared tag handle \"" + r + "\""), !0;
	}
	n(fe, "readTagProperty");
	function pe(e) {
		let t = e.input.charCodeAt(e.position);
		if (t !== 38) return !1;
		e.anchor !== null && E(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position);
		let n = e.position;
		for (; t !== 0 && !m(t) && !h(t);) t = e.input.charCodeAt(++e.position);
		return e.position === n && E(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(n, e.position), !0;
	}
	n(pe, "readAnchorProperty");
	function me(e) {
		let t = e.input.charCodeAt(e.position);
		if (t !== 42) return !1;
		t = e.input.charCodeAt(++e.position);
		let n = e.position;
		for (; t !== 0 && !m(t) && !h(t);) t = e.input.charCodeAt(++e.position);
		e.position === n && E(e, "name of an alias node must contain at least one character");
		let r = e.input.slice(n, e.position);
		return a.call(e.anchorMap, r) || E(e, "unidentified alias \"" + r + "\""), e.result = e.anchorMap[r], I(e, !0, -1), !0;
	}
	n(me, "readAlias");
	function he(e, t, n, r) {
		let i = A(e);
		return k(e), j(e, t), e.tag = null, e.anchor = null, e.kind = null, e.result = null, de(e, n, r) && e.kind === "mapping" ? (ee(e), !0) : (te(e), j(e, i), !1);
	}
	n(he, "tryReadBlockMappingFromProperty");
	function ge(e, t, n, r, i) {
		let o, s, c = 1, l = !1, u = !1, d = null, f, p, m;
		e.depth >= e.maxDepth && E(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
		let h = o = s = n === 4 || n === 3;
		if (r && I(e, !0, -1) && (l = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1) for (;;) {
			let n = e.input.charCodeAt(e.position), r = A(e);
			if (l && (n === 33 && e.tag !== null || n === 38 && e.anchor !== null) || !fe(e) && !pe(e)) break;
			d === null && (d = r), I(e, !0, -1) ? (l = !0, s = h, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : s = !1;
		}
		if (s &&= l || i, c === 1 || n === 4) {
			if (p = n === 1 || n === 2 ? t : t + 1, m = e.position - e.lineStart, c === 1) {
				if (s && (ue(e, m) || de(e, m, p)) || ce(e, p)) u = !0;
				else {
					let t = e.input.charCodeAt(e.position);
					d !== null && h && !s && t !== 124 && t !== 62 && he(e, d, d.position - d.lineStart, p) || o && le(e, p) || oe(e, p) || se(e, p) ? u = !0 : me(e) ? (u = !0, (e.tag !== null || e.anchor !== null) && E(e, "alias node should not have any properties")) : ae(e, p, n === 1) && (u = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && O(e, e.anchor, e.result);
				}
			} else c === 0 && (u = s && ue(e, m));
		}
		if (e.tag === null) e.anchor !== null && O(e, e.anchor, e.result);
		else if (e.tag === "?") {
			e.result !== null && e.kind !== "scalar" && E(e, "unacceptable node kind for !<?> tag; it should be \"scalar\", not \"" + e.kind + "\"");
			for (let t = 0, n = e.implicitTypes.length; t < n; t += 1) if (f = e.implicitTypes[t], f.resolve(e.result)) {
				e.result = f.construct(e.result), e.tag = f.tag, e.anchor !== null && O(e, e.anchor, e.result);
				break;
			}
		} else if (e.tag !== "!") {
			if (a.call(e.typeMap[e.kind || "fallback"], e.tag)) f = e.typeMap[e.kind || "fallback"][e.tag];
			else {
				f = null;
				let t = e.typeMap.multi[e.kind || "fallback"];
				for (let n = 0, r = t.length; n < r; n += 1) if (e.tag.slice(0, t[n].tag.length) === t[n].tag) {
					f = t[n];
					break;
				}
			}
			f || E(e, "unknown tag !<" + e.tag + ">"), e.result !== null && f.kind !== e.kind && E(e, "unacceptable node kind for !<" + e.tag + "> tag; it should be \"" + f.kind + "\", not \"" + e.kind + "\""), f.resolve(e.result, e.tag) ? (e.result = f.construct(e.result, e.tag), e.anchor !== null && O(e, e.anchor, e.result)) : E(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
		}
		return e.listener !== null && e.listener("close", e), --e.depth, e.tag !== null || e.anchor !== null || u;
	}
	n(ge, "composeNode");
	function _e(e) {
		let t = e.position, n = !1, r;
		for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (r = e.input.charCodeAt(e.position)) !== 0 && (I(e, !0, -1), r = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || r !== 37));) {
			n = !0, r = e.input.charCodeAt(++e.position);
			let t = e.position;
			for (; r !== 0 && !m(r);) r = e.input.charCodeAt(++e.position);
			let i = e.input.slice(t, e.position), o = [];
			for (i.length < 1 && E(e, "directive name must not be less than one character in length"); r !== 0;) {
				for (; p(r);) r = e.input.charCodeAt(++e.position);
				if (r === 35) {
					do
						r = e.input.charCodeAt(++e.position);
					while (r !== 0 && !f(r));
					break;
				}
				if (f(r)) break;
				for (t = e.position; r !== 0 && !m(r);) r = e.input.charCodeAt(++e.position);
				o.push(e.input.slice(t, e.position));
			}
			r !== 0 && F(e), a.call(ne, i) ? ne[i](e, i, o) : D(e, "unknown document directive \"" + i + "\"");
		}
		I(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, I(e, !0, -1)) : n && E(e, "directives end mark is expected"), ge(e, e.lineIndent - 1, 4, !1, !0), I(e, !0, -1), e.checkLineBreaks && s.test(e.input.slice(t, e.position)) && D(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && re(e) ? e.input.charCodeAt(e.position) === 46 && (e.position += 3, I(e, !0, -1)) : e.position < e.length - 1 && E(e, "end of the stream or a document separator is expected");
	}
	n(_e, "readDocument");
	function ve(e, t) {
		e = String(e), t ||= {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += "\n"), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
		let n = new w(e, t), r = e.indexOf("\0");
		for (r !== -1 && (n.position = r, E(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32;) n.lineIndent += 1, n.position += 1;
		for (; n.position < n.length - 1;) _e(n);
		return n.documents;
	}
	n(ve, "loadDocuments");
	function ye(e, t, n) {
		typeof t == "object" && t && n === void 0 && (n = t, t = null);
		let r = ve(e, n);
		if (typeof t != "function") return r;
		for (let e = 0, n = r.length; e < n; e += 1) t(r[e]);
	}
	n(ye, "loadAll2");
	function be(e, n) {
		let r = ve(e, n);
		if (r.length !== 0) {
			if (r.length === 1) return r[0];
			throw new t("expected a single document in the stream, but found more");
		}
	}
	return n(be, "load2"), En.loadAll = ye, En.load = be, En;
}
n(zr, "requireLoader");
var Br = {}, Vr;
function Hr() {
	if (Vr) return Br;
	Vr = 1;
	let e = kn(), t = Mn(), r = Lr(), i = Object.prototype.toString, a = Object.prototype.hasOwnProperty, o = 65279, s = {};
	s[0] = "\\0", s[7] = "\\a", s[8] = "\\b", s[9] = "\\t", s[10] = "\\n", s[11] = "\\v", s[12] = "\\f", s[13] = "\\r", s[27] = "\\e", s[34] = "\\\"", s[92] = "\\\\", s[133] = "\\N", s[160] = "\\_", s[8232] = "\\L", s[8233] = "\\P";
	let c = [
		"y",
		"Y",
		"yes",
		"Yes",
		"YES",
		"on",
		"On",
		"ON",
		"n",
		"N",
		"no",
		"No",
		"NO",
		"off",
		"Off",
		"OFF"
	], l = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
	function u(e, t) {
		if (t === null) return {};
		let n = {}, r = Object.keys(t);
		for (let i = 0, o = r.length; i < o; i += 1) {
			let o = r[i], s = String(t[o]);
			o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2));
			let c = e.compiledTypeMap.fallback[o];
			c && a.call(c.styleAliases, s) && (s = c.styleAliases[s]), n[o] = s;
		}
		return n;
	}
	n(u, "compileStyleMap");
	function d(n) {
		let r, i, a = n.toString(16).toUpperCase();
		if (n <= 255) r = "x", i = 2;
		else if (n <= 65535) r = "u", i = 4;
		else if (n <= 4294967295) r = "U", i = 8;
		else throw new t("code point within a string may not be greater than 0xFFFFFFFF");
		return "\\" + r + e.repeat("0", i - a.length) + a;
	}
	n(d, "encodeHex");
	function f(t) {
		this.schema = t.schema || r, this.indent = Math.max(1, t.indent || 2), this.noArrayIndent = t.noArrayIndent || !1, this.skipInvalid = t.skipInvalid || !1, this.flowLevel = e.isNothing(t.flowLevel) ? -1 : t.flowLevel, this.styleMap = u(this.schema, t.styles || null), this.sortKeys = t.sortKeys || !1, this.lineWidth = t.lineWidth || 80, this.noRefs = t.noRefs || !1, this.noCompatMode = t.noCompatMode || !1, this.condenseFlow = t.condenseFlow || !1, this.quotingType = t.quotingType === "\"" ? 2 : 1, this.forceQuotes = t.forceQuotes || !1, this.replacer = typeof t.replacer == "function" ? t.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
	}
	n(f, "State");
	function p(t, n) {
		let r = e.repeat(" ", n), i = 0, a = "", o = t.length;
		for (; i < o;) {
			let e, n = t.indexOf("\n", i);
			n === -1 ? (e = t.slice(i), i = o) : (e = t.slice(i, n + 1), i = n + 1), e.length && e !== "\n" && (a += r), a += e;
		}
		return a;
	}
	n(p, "indentString");
	function m(t, n) {
		return "\n" + e.repeat(" ", t.indent * n);
	}
	n(m, "generateNextLine");
	function h(e, t) {
		for (let n = 0, r = e.implicitTypes.length; n < r; n += 1) if (e.implicitTypes[n].resolve(t)) return !0;
		return !1;
	}
	n(h, "testImplicitResolving");
	function g(e) {
		return e === 32 || e === 9;
	}
	n(g, "isWhitespace");
	function _(e) {
		return e >= 32 && e <= 126 || e >= 161 && e <= 55295 && e !== 8232 && e !== 8233 || e >= 57344 && e <= 65533 && e !== o || e >= 65536 && e <= 1114111;
	}
	n(_, "isPrintable");
	function v(e) {
		return _(e) && e !== o && e !== 13 && e !== 10;
	}
	n(v, "isNsCharOrWhitespace");
	function y(e, t, n) {
		let r = v(e), i = r && !g(e);
		return (n ? r : r && e !== 44 && e !== 91 && e !== 93 && e !== 123 && e !== 125) && e !== 35 && !(t === 58 && !i) || v(t) && !g(t) && e === 35 || t === 58 && i;
	}
	n(y, "isPlainSafe");
	function b(e) {
		return _(e) && e !== o && !g(e) && e !== 45 && e !== 63 && e !== 58 && e !== 44 && e !== 91 && e !== 93 && e !== 123 && e !== 125 && e !== 35 && e !== 38 && e !== 42 && e !== 33 && e !== 124 && e !== 61 && e !== 62 && e !== 39 && e !== 34 && e !== 37 && e !== 64 && e !== 96;
	}
	n(b, "isPlainSafeFirst");
	function x(e) {
		return !g(e) && e !== 58;
	}
	n(x, "isPlainSafeLast");
	function S(e, t) {
		let n = e.charCodeAt(t), r;
		return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
	}
	n(S, "codePointAt");
	function C(e) {
		return /^\n* /.test(e);
	}
	n(C, "needIndentIndicator");
	function w(e, t, n, r, i, a, o, s) {
		let c, l = 0, u = null, d = !1, f = !1, p = r !== -1, m = -1, h = b(S(e, 0)) && x(S(e, e.length - 1));
		if (t || o) for (c = 0; c < e.length; l >= 65536 ? c += 2 : c++) {
			if (l = S(e, c), !_(l)) return 5;
			h &&= y(l, u, s), u = l;
		}
		else {
			for (c = 0; c < e.length; l >= 65536 ? c += 2 : c++) {
				if (l = S(e, c), l === 10) d = !0, p && (f ||= c - m - 1 > r && e[m + 1] !== " ", m = c);
				else if (!_(l)) return 5;
				h &&= y(l, u, s), u = l;
			}
			f ||= p && c - m - 1 > r && e[m + 1] !== " ";
		}
		return !d && !f ? h && !o && !i(e) ? 1 : a === 2 ? 5 : 2 : n > 9 && C(e) ? 5 : o ? a === 2 ? 5 : 2 : f ? 4 : 3;
	}
	n(w, "chooseScalarStyle");
	function T(e, r, i, a, o) {
		e.dump = (function() {
			if (r.length === 0) return e.quotingType === 2 ? "\"\"" : "''";
			if (!e.noCompatMode && (c.indexOf(r) !== -1 || l.test(r))) return e.quotingType === 2 ? "\"" + r + "\"" : "'" + r + "'";
			let s = e.indent * Math.max(1, i), u = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - s), d = a || e.flowLevel > -1 && i >= e.flowLevel;
			function f(t) {
				return h(e, t);
			}
			switch (n(f, "testAmbiguity"), w(r, d, e.indent, u, f, e.quotingType, e.forceQuotes && !a, o)) {
				case 1: return r;
				case 2: return "'" + r.replace(/'/g, "''") + "'";
				case 3: return "|" + E(r, e.indent) + D(p(r, s));
				case 4: return ">" + E(r, e.indent) + D(p(O(r, u), s));
				case 5: return "\"" + ee(r) + "\"";
				default: throw new t("impossible error: invalid scalar style");
			}
		})();
	}
	n(T, "writeScalar");
	function E(e, t) {
		let n = C(e) ? String(t) : "", r = e[e.length - 1] === "\n";
		return n + (r && (e[e.length - 2] === "\n" || e === "\n") ? "+" : r ? "" : "-") + "\n";
	}
	n(E, "blockHeader");
	function D(e) {
		return e[e.length - 1] === "\n" ? e.slice(0, -1) : e;
	}
	n(D, "dropEndingNewline");
	function O(e, t) {
		let n = /(\n+)([^\n]*)/g, r = (function() {
			let r = e.indexOf("\n");
			return r = r === -1 ? e.length : r, n.lastIndex = r, k(e.slice(0, r), t);
		})(), i = e[0] === "\n" || e[0] === " ", a, o;
		for (; o = n.exec(e);) {
			let e = o[1], n = o[2];
			a = n[0] === " ", r += e + (!i && !a && n !== "" ? "\n" : "") + k(n, t), i = a;
		}
		return r;
	}
	n(O, "foldString");
	function k(e, t) {
		if (e === "" || e[0] === " ") return e;
		let n = / [^ ]/g, r, i = 0, a, o = 0, s = 0, c = "";
		for (; r = n.exec(e);) s = r.index, s - i > t && (a = o > i ? o : s, c += "\n" + e.slice(i, a), i = a + 1), o = s;
		return c += "\n", e.length - i > t && o > i ? c += e.slice(i, o) + "\n" + e.slice(o + 1) : c += e.slice(i), c.slice(1);
	}
	n(k, "foldLine");
	function ee(e) {
		let t = "", n = 0;
		for (let r = 0; r < e.length; n >= 65536 ? r += 2 : r++) {
			n = S(e, r);
			let i = s[n];
			!i && _(n) ? (t += e[r], n >= 65536 && (t += e[r + 1])) : t += i || d(n);
		}
		return t;
	}
	n(ee, "escapeString");
	function te(e, t, n) {
		let r = "", i = e.tag;
		for (let i = 0, a = n.length; i < a; i += 1) {
			let a = n[i];
			e.replacer && (a = e.replacer.call(n, String(i), a)), (N(e, t, a, !1, !1) || a === void 0 && N(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
		}
		e.tag = i, e.dump = "[" + r + "]";
	}
	n(te, "writeFlowSequence");
	function A(e, t, n, r) {
		let i = "", a = e.tag;
		for (let a = 0, o = n.length; a < o; a += 1) {
			let o = n[a];
			e.replacer && (o = e.replacer.call(n, String(a), o)), (N(e, t + 1, o, !0, !0, !1, !0) || o === void 0 && N(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += m(e, t)), e.dump && e.dump.charCodeAt(0) === 10 ? i += "-" : i += "- ", i += e.dump);
		}
		e.tag = a, e.dump = i || "[]";
	}
	n(A, "writeBlockSequence");
	function j(e, t, n) {
		let r = "", i = e.tag, a = Object.keys(n);
		for (let i = 0, o = a.length; i < o; i += 1) {
			let o = "";
			r !== "" && (o += ", "), e.condenseFlow && (o += "\"");
			let s = a[i], c = n[s];
			e.replacer && (c = e.replacer.call(n, s, c)), N(e, t, s, !1, !1) && (e.dump.length > 1024 && (o += "? "), o += e.dump + (e.condenseFlow ? "\"" : "") + ":" + (e.condenseFlow ? "" : " "), N(e, t, c, !1, !1) && (o += e.dump, r += o));
		}
		e.tag = i, e.dump = "{" + r + "}";
	}
	n(j, "writeFlowMapping");
	function ne(e, n, r, i) {
		let a = "", o = e.tag, s = Object.keys(r);
		if (e.sortKeys === !0) s.sort();
		else if (typeof e.sortKeys == "function") s.sort(e.sortKeys);
		else if (e.sortKeys) throw new t("sortKeys must be a boolean or a function");
		for (let t = 0, o = s.length; t < o; t += 1) {
			let o = "";
			(!i || a !== "") && (o += m(e, n));
			let c = s[t], l = r[c];
			if (e.replacer && (l = e.replacer.call(r, c, l)), !N(e, n + 1, c, !0, !0, !0)) continue;
			let u = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024;
			u && (e.dump && e.dump.charCodeAt(0) === 10 ? o += "?" : o += "? "), o += e.dump, u && (o += m(e, n)), N(e, n + 1, l, !0, u) && (e.dump && e.dump.charCodeAt(0) === 10 ? o += ":" : o += ": ", o += e.dump, a += o);
		}
		e.tag = o, e.dump = a || "{}";
	}
	n(ne, "writeBlockMapping");
	function M(e, n, r) {
		let o = r ? e.explicitTypes : e.implicitTypes;
		for (let s = 0, c = o.length; s < c; s += 1) {
			let c = o[s];
			if ((c.instanceOf || c.predicate) && (!c.instanceOf || typeof n == "object" && n instanceof c.instanceOf) && (!c.predicate || c.predicate(n))) {
				if (e.tag = r ? c.multi && c.representName ? c.representName(n) : c.tag : "?", c.represent) {
					let r = e.styleMap[c.tag] || c.defaultStyle, o;
					if (i.call(c.represent) === "[object Function]") o = c.represent(n, r);
					else if (a.call(c.represent, r)) o = c.represent[r](n, r);
					else throw new t("!<" + c.tag + "> tag resolver accepts not \"" + r + "\" style");
					e.dump = o;
				}
				return !0;
			}
		}
		return !1;
	}
	n(M, "detectType");
	function N(e, n, r, a, o, s, c) {
		e.tag = null, e.dump = r, M(e, r, !1) || M(e, r, !0);
		let l = i.call(e.dump), u = a;
		a &&= e.flowLevel < 0 || e.flowLevel > n;
		let d = l === "[object Object]" || l === "[object Array]", f, p;
		if (d && (f = e.duplicates.indexOf(r), p = f !== -1), (e.tag !== null && e.tag !== "?" || p || e.indent !== 2 && n > 0) && (o = !1), p && e.usedDuplicates[f]) e.dump = "*ref_" + f;
		else {
			if (d && p && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), l === "[object Object]") a && Object.keys(e.dump).length !== 0 ? (ne(e, n, e.dump, o), p && (e.dump = "&ref_" + f + e.dump)) : (j(e, n, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
			else if (l === "[object Array]") a && e.dump.length !== 0 ? (e.noArrayIndent && !c && n > 0 ? A(e, n - 1, e.dump, o) : A(e, n, e.dump, o), p && (e.dump = "&ref_" + f + e.dump)) : (te(e, n, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
			else if (l === "[object String]") e.tag !== "?" && T(e, e.dump, n, s, u);
			else if (l === "[object Undefined]") return !1;
			else {
				if (e.skipInvalid) return !1;
				throw new t("unacceptable kind of an object to dump " + l);
			}
			if (e.tag !== null && e.tag !== "?") {
				let t = encodeURI(e.tag[0] === "!" ? e.tag.slice(1) : e.tag).replace(/!/g, "%21");
				t = e.tag[0] === "!" ? "!" + t : t.slice(0, 18) === "tag:yaml.org,2002:" ? "!!" + t.slice(18) : "!<" + t + ">", e.dump = t + " " + e.dump;
			}
		}
		return !0;
	}
	n(N, "writeNode");
	function P(e, t) {
		let n = [], r = [];
		F(e, n, r);
		let i = r.length;
		for (let e = 0; e < i; e += 1) t.duplicates.push(n[r[e]]);
		t.usedDuplicates = Array(i);
	}
	n(P, "getDuplicateReferences");
	function F(e, t, n) {
		if (typeof e == "object" && e) {
			let r = t.indexOf(e);
			if (r !== -1) n.indexOf(r) === -1 && n.push(r);
			else if (t.push(e), Array.isArray(e)) for (let r = 0, i = e.length; r < i; r += 1) F(e[r], t, n);
			else {
				let r = Object.keys(e);
				for (let i = 0, a = r.length; i < a; i += 1) F(e[r[i]], t, n);
			}
		}
	}
	n(F, "inspectNode");
	function I(e, t) {
		t ||= {};
		let n = new f(t);
		n.noRefs || P(e, n);
		let r = e;
		return n.replacer && (r = n.replacer.call({ "": r }, "", r)), N(n, 0, r, !0, !0) ? n.dump + "\n" : "";
	}
	return n(I, "dump2"), Br.dump = I, Br;
}
n(Hr, "requireDumper");
var Ur;
function Wr() {
	if (Ur) return H;
	Ur = 1;
	let e = zr(), t = Hr();
	function r(e, t) {
		return function() {
			throw Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
		};
	}
	return n(r, "renamed"), H.Type = U(), H.Schema = Bn(), H.FAILSAFE_SCHEMA = Qn(), H.JSON_SCHEMA = pr(), H.CORE_SCHEMA = gr(), H.DEFAULT_SCHEMA = Lr(), H.load = e.load, H.loadAll = e.loadAll, H.dump = t.dump, H.YAMLException = Mn(), H.types = {
		binary: Tr(),
		float: ur(),
		map: Yn(),
		null: tr(),
		pairs: jr(),
		set: Pr(),
		timestamp: yr(),
		bool: ir(),
		int: sr(),
		merge: Sr(),
		omap: Or(),
		seq: Kn(),
		str: Un()
	}, H.safeLoad = r("safeLoad", "load"), H.safeLoadAll = r("safeLoadAll", "loadAll"), H.safeDump = r("safeDump", "dump"), H;
}
n(Wr, "requireJsYaml");
var { Type: Gr, Schema: Kr, FAILSAFE_SCHEMA: qr, JSON_SCHEMA: Jr, CORE_SCHEMA: Yr, DEFAULT_SCHEMA: Xr, load: Zr, loadAll: Qr, dump: $r, YAMLException: ei, types: ti, safeLoad: ni, safeLoadAll: ri, safeDump: ii } = /* @__PURE__ */ Tn(Wr()), ai = {
	common: ee,
	getConfig: x,
	insertCluster: he,
	insertEdge: ye,
	insertEdgeLabel: _e,
	insertMarkers: Ce,
	insertNode: pe,
	interpolateToCurve: N,
	labelHelper: ue,
	log: i,
	positionEdgeLabel: ve
}, oi = {}, si = /* @__PURE__ */ n((e) => {
	for (let t of e) oi[t.name] = t;
}, "registerLayoutLoaders");
(/* @__PURE__ */ n(() => {
	si([
		{
			name: "dagre",
			loader: /* @__PURE__ */ n(async () => await import("./dagre-GXQ25YYZ-7OTXmzdI.mjs"), "loader")
		},
		{
			name: "swimlane",
			loader: /* @__PURE__ */ n(async () => await import("./swimlanes-42K2YHIH-CiUyJVv2.mjs"), "loader")
		},
		{
			name: "cose-bilkent",
			loader: /* @__PURE__ */ n(async () => await import("./cose-bilkent-JH36ORCC-Djhj2cSt.mjs"), "loader")
		}
	]);
}, "registerDefaultLayoutLoaders"))();
var ci = /* @__PURE__ */ n(async (e, t) => {
	if (!(e.layoutAlgorithm in oi)) throw Error(`Unknown layout algorithm: ${e.layoutAlgorithm}`);
	if (e.diagramId) for (let t of e.nodes) {
		let n = t.domId || t.id;
		t.domId = `${e.diagramId}-${n}`;
	}
	let n = oi[e.layoutAlgorithm], r = await n.loader(), { theme: i, themeVariables: a } = e.config, { useGradient: o, gradientStart: s, gradientStop: c } = a, l = t.attr("id");
	if (t.append("defs").append("filter").attr("id", `${l}-drop-shadow`).attr("height", "130%").attr("width", "130%").append("feDropShadow").attr("dx", "4").attr("dy", "4").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${i?.includes("dark") ? "#FFFFFF" : "#000000"}`), t.append("defs").append("filter").attr("id", `${l}-drop-shadow-small`).attr("height", "150%").attr("width", "150%").append("feDropShadow").attr("dx", "2").attr("dy", "2").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${i?.includes("dark") ? "#FFFFFF" : "#000000"}`), o) {
		let e = t.append("linearGradient").attr("id", t.attr("id") + "-gradient").attr("gradientUnits", "objectBoundingBox").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
		e.append("svg:stop").attr("offset", "0%").attr("stop-color", s).attr("stop-opacity", 1), e.append("svg:stop").attr("offset", "100%").attr("stop-color", c).attr("stop-opacity", 1);
	}
	return r.render(e, t, ai, { algorithm: n.algorithm });
}, "render"), li = /* @__PURE__ */ n((e = "", { fallback: t = "dagre" } = {}) => {
	if (e in oi) return e;
	if (t in oi) return i.warn(`Layout algorithm ${e} is not registered. Using ${t} as fallback.`), t;
	throw Error(`Both layout algorithms ${e} and ${t} are not registered.`);
}, "getRegisteredLayoutAlgorithm"), ui = "comm", di = "rule", fi = "decl", pi = "@import", mi = "@namespace", hi = "@keyframes", gi = "@layer", _i = Math.abs, vi = String.fromCharCode;
function yi(e) {
	return e.trim();
}
function bi(e, t, n) {
	return e.replace(t, n);
}
function xi(e, t) {
	return e.charCodeAt(t) | 0;
}
function Si(e, t, n) {
	return e.slice(t, n);
}
function W(e) {
	return e.length;
}
function Ci(e) {
	return e.length;
}
function wi(e, t) {
	return t.push(e), e;
}
//#endregion
//#region node_modules/stylis/src/Tokenizer.js
var Ti = 1, Ei = 1, Di = 0, G = 0, K = 0, Oi = "";
function ki(e, t, n, r, i, a, o, s) {
	return {
		value: e,
		root: t,
		parent: n,
		type: r,
		props: i,
		children: a,
		line: Ti,
		column: Ei,
		length: o,
		return: "",
		siblings: s
	};
}
function Ai() {
	return K;
}
function ji() {
	return K = G > 0 ? xi(Oi, --G) : 0, Ei--, K === 10 && (Ei = 1, Ti--), K;
}
function q() {
	return K = G < Di ? xi(Oi, G++) : 0, Ei++, K === 10 && (Ei = 1, Ti++), K;
}
function Mi() {
	return xi(Oi, G);
}
function Ni() {
	return G;
}
function Pi(e, t) {
	return Si(Oi, e, t);
}
function Fi(e) {
	switch (e) {
		case 0:
		case 9:
		case 10:
		case 13:
		case 32: return 5;
		case 33:
		case 43:
		case 44:
		case 47:
		case 62:
		case 64:
		case 126:
		case 59:
		case 123:
		case 125: return 4;
		case 58: return 3;
		case 34:
		case 39:
		case 40:
		case 91: return 2;
		case 41:
		case 93: return 1;
	}
	return 0;
}
function Ii(e) {
	return Ti = Ei = 1, Di = W(Oi = e), G = 0, [];
}
function Li(e) {
	return Oi = "", e;
}
function Ri(e) {
	return yi(Pi(G - 1, Vi(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function zi(e) {
	for (; (K = Mi()) && K < 33;) q();
	return Fi(e) > 2 || Fi(K) > 3 ? "" : " ";
}
function Bi(e, t) {
	for (; --t && q() && !(K < 48 || K > 102 || K > 57 && K < 65 || K > 70 && K < 97););
	return Pi(e, Ni() + (t < 6 && Mi() == 32 && q() == 32));
}
function Vi(e) {
	for (; q();) switch (K) {
		case e: return G;
		case 34:
		case 39:
			e !== 34 && e !== 39 && Vi(K);
			break;
		case 40:
			e === 41 && Vi(e);
			break;
		case 92: q();
	}
	return G;
}
function Hi(e, t) {
	for (; q() && e + K !== 57 && (e + K !== 84 || Mi() !== 47););
	return "/*" + Pi(t, G - 1) + "*" + vi(e === 47 ? e : q());
}
function Ui(e) {
	for (; !Fi(Mi());) q();
	return Pi(e, G);
}
//#endregion
//#region node_modules/stylis/src/Parser.js
function Wi(e) {
	return Li(Gi("", null, null, null, [""], e = Ii(e), 0, [0], e));
}
function Gi(e, t, n, r, i, a, o, s, c) {
	for (var l = 0, u = 0, d = o, f = 0, p = 0, m = 0, h = 1, g = 1, _ = 1, v = 0, y = 0, b = "", x = i, S = a, C = r, w = b; g;) switch (m = y, y = q()) {
		case 40:
			m != 108 && xi(w, d - 1) == 58 ? (v++, w += "(") : w += Ri(y);
			break;
		case 41:
			v--, w += ")";
			break;
		case 34:
		case 39:
		case 91:
			w += Ri(y);
			break;
		case 9:
		case 10:
		case 13:
		case 32:
			if (v > 0) {
				w += vi(y);
				break;
			}
			w += zi(m);
			break;
		case 92:
			w += Bi(Ni() - 1, 7);
			continue;
		case 47:
			switch (Mi()) {
				case 42:
				case 47:
					wi(qi(Hi(q(), Ni()), t, n, c), c), (Fi(m || 1) == 5 || Fi(Mi() || 1) == 5) && W(w) && Si(w, -1, void 0) !== " " && (w += " ");
					break;
				default: w += "/";
			}
			break;
		case 123 * h: s[l++] = W(w) * _;
		case 125 * h:
		case 59:
		case 0:
			if (v > 0 && y) {
				w += vi(y);
				break;
			}
			switch (y) {
				case 0:
				case 125: g = 0;
				case 59 + u:
					_ == -1 && (w = bi(w, /\f/g, "")), p > 0 && (W(w) - d || h === 0) && wi(p > 32 ? Ji(w + ";", r, n, d - 1, c) : Ji(bi(w, " ", "") + ";", r, n, d - 2, c), c);
					break;
				case 59: w += ";";
				default: if (wi(C = Ki(w, t, n, l, u, i, s, b, x = [], S = [], d, a), a), y === 123) {
					if (u === 0) Gi(w, t, C, C, x, a, d, s, S);
					else {
						switch (f) {
							case 99: if (xi(w, 3) === 110) break;
							case 108: if (xi(w, 2) === 97) break;
							default: u = 0;
							case 100:
							case 109:
							case 115:
						}
						u ? Gi(e, C, C, r && wi(Ki(e, C, C, 0, 0, i, s, b, i, x = [], d, S), S), i, S, d, s, r ? x : S) : Gi(w, C, C, C, [""], S, 0, s, S);
					}
				}
			}
			l = u = p = 0, h = _ = 1, b = w = "", d = o;
			break;
		case 58: d = 1 + W(w), p = m;
		default:
			if (h < 1) {
				if (y == 123) --h;
				else if (y == 125 && h++ == 0 && ji() == 125) continue;
			}
			switch (w += vi(y), y * h) {
				case 38:
					_ = u > 0 ? 1 : (w += "\f", -1);
					break;
				case 44:
					if (v > 0) break;
					s[l++] = (W(w) - 1) * _, _ = 1;
					break;
				case 64:
					Mi() === 45 && (w += Ri(q())), f = Mi(), u = d = W(b = w += Ui(Ni())), y++;
					break;
				case 45: m === 45 && W(w) == 2 && (h = 0);
			}
	}
	return a;
}
function Ki(e, t, n, r, i, a, o, s, c, l, u, d) {
	for (var f = i - 1, p = i === 0 ? a : [""], m = Ci(p), h = 0, g = 0, _ = 0; h < r; ++h) for (var v = 0, y = Si(e, f + 1, f = _i(g = o[h])), b = e; v < m; ++v) (b = yi(g > 0 ? p[v] + " " + y : bi(y, /&\f/g, p[v]))) && (c[_++] = b);
	return ki(e, t, n, i === 0 ? di : s, c, l, u, d);
}
function qi(e, t, n, r) {
	return ki(e, t, n, ui, vi(Ai()), Si(e, 2, -2), 0, r);
}
function Ji(e, t, n, r, i) {
	return ki(e, t, n, fi, Si(e, 0, r), Si(e, r + 1, -1), r, i);
}
//#endregion
//#region node_modules/stylis/src/Serializer.js
function Yi(e, t) {
	for (var n = "", r = 0; r < e.length; r++) n += t(e[r], r, e, t) || "";
	return n;
}
function Xi(e, t, n, r) {
	switch (e.type) {
		case gi: if (e.children.length) break;
		case pi:
		case mi:
		case fi: return e.return = e.return || e.value;
		case ui: return "";
		case hi: return e.return = e.value + "{" + Yi(e.children, r) + "}";
		case di: if (!W(e.value = e.props.join(","))) return "";
	}
	return W(n = Yi(e.children, r)) ? e.return = e.value + "{" + n + "}" : "";
}
//#endregion
//#region node_modules/stylis/src/Middleware.js
function Zi(e) {
	var t = Ci(e);
	return function(n, r, i, a) {
		for (var o = "", s = 0; s < t; s++) o += e[s](n, r, i, a) || "";
		return o;
	};
}
//#endregion
//#region node_modules/mermaid/dist/mermaid.core.mjs
var Qi = "c4", $i = {
	id: Qi,
	detector: /* @__PURE__ */ n((e) => /^\s*C4Context|C4Container|C4Component|C4Dynamic|C4Deployment/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./c4Diagram-7LVT6UL2-BM1lodTI.mjs");
		return {
			id: Qi,
			diagram: e
		};
	}, "loader")
}, ea = "flowchart", ta = {
	id: ea,
	detector: /* @__PURE__ */ n((e, t) => t?.flowchart?.defaultRenderer === "dagre-wrapper" || t?.flowchart?.defaultRenderer === "elk" ? !1 : /^\s*graph/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./flowDiagram-HODETNUW-BE2pqfJt.mjs");
		return {
			id: ea,
			diagram: e
		};
	}, "loader")
}, na = "flowchart-v2", ra = {
	id: na,
	detector: /* @__PURE__ */ n((e, t) => t?.flowchart?.defaultRenderer !== "dagre-d3" && (t?.flowchart?.defaultRenderer === "elk" && (t.layout = "elk"), /^\s*graph/.test(e) && t?.flowchart?.defaultRenderer === "dagre-wrapper" ? !0 : /^\s*flowchart/.test(e)), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./flowDiagram-HODETNUW-BE2pqfJt.mjs");
		return {
			id: na,
			diagram: e
		};
	}, "loader")
}, ia = "swimlane", aa = {
	id: ia,
	detector: /* @__PURE__ */ n((e) => /^\s*swimlane-beta\b/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./swimlanesDiagram-VR7AAH4N-eZx8WEU3.mjs");
		return {
			id: ia,
			diagram: e
		};
	}, "loader")
}, oa = "er", sa = {
	id: oa,
	detector: /* @__PURE__ */ n((e) => /^\s*erDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./erDiagram-RLTQ6QDP-n_Mc8Eu4.mjs");
		return {
			id: oa,
			diagram: e
		};
	}, "loader")
}, ca = "gitGraph", la = {
	id: ca,
	detector: /* @__PURE__ */ n((e) => /^\s*gitGraph/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./gitGraphDiagram-WWUBYQGX-BM1nlsan.mjs");
		return {
			id: ca,
			diagram: e
		};
	}, "loader")
}, ua = "gantt", da = {
	id: ua,
	detector: /* @__PURE__ */ n((e) => /^\s*gantt/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./ganttDiagram-EL5Y4UJY-DonK-sFk.mjs");
		return {
			id: ua,
			diagram: e
		};
	}, "loader")
}, fa = "info", pa = {
	id: fa,
	detector: /* @__PURE__ */ n((e) => /^\s*info/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./infoDiagram-27XIBGKW-Dnq4ZV5V.mjs");
		return {
			id: fa,
			diagram: e
		};
	}, "loader")
}, ma = "pie", ha = {
	id: ma,
	detector: /* @__PURE__ */ n((e) => /^\s*pie/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./pieDiagram-E7YTZNPT-DW7Jev-u.mjs");
		return {
			id: ma,
			diagram: e
		};
	}, "loader")
}, ga = "quadrantChart", _a = {
	id: ga,
	detector: /* @__PURE__ */ n((e) => /^\s*quadrantChart/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./quadrantDiagram-AXDQQJYC-t87lILMD.mjs");
		return {
			id: ga,
			diagram: e
		};
	}, "loader")
}, va = "xychart", ya = {
	id: va,
	detector: /* @__PURE__ */ n((e) => /^\s*xychart(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./xychartDiagram-S5SC5T6Z-CQPQQPhm.mjs");
		return {
			id: va,
			diagram: e
		};
	}, "loader")
}, ba = "requirement", xa = {
	id: ba,
	detector: /* @__PURE__ */ n((e) => /^\s*requirement(Diagram)?/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./requirementDiagram-BXWQKSXE-Ckypx1N9.mjs");
		return {
			id: ba,
			diagram: e
		};
	}, "loader")
}, Sa = "sequence", Ca = {
	id: Sa,
	detector: /* @__PURE__ */ n((e) => /^\s*sequenceDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./sequenceDiagram-WJ2MYXX4-rjNx9K4Z.mjs");
		return {
			id: Sa,
			diagram: e
		};
	}, "loader")
}, wa = "class", Ta = {
	id: wa,
	detector: /* @__PURE__ */ n((e, t) => t?.class?.defaultRenderer !== "dagre-wrapper" && /^\s*classDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./classDiagram-ZZMXUADV-uK2ZrikQ.mjs");
		return {
			id: wa,
			diagram: e
		};
	}, "loader")
}, Ea = "classDiagram", Da = {
	id: Ea,
	detector: /* @__PURE__ */ n((e, t) => /^\s*classDiagram/.test(e) && t?.class?.defaultRenderer === "dagre-wrapper" ? !0 : /^\s*classDiagram-v2/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./classDiagram-v2-VYDZK3BY-Cmzr3yzi.mjs");
		return {
			id: Ea,
			diagram: e
		};
	}, "loader")
}, Oa = "state", ka = {
	id: Oa,
	detector: /* @__PURE__ */ n((e, t) => t?.state?.defaultRenderer !== "dagre-wrapper" && /^\s*stateDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./stateDiagram-D77RDMKH-DdAmivd1.mjs");
		return {
			id: Oa,
			diagram: e
		};
	}, "loader")
}, Aa = "stateDiagram", ja = {
	id: Aa,
	detector: /* @__PURE__ */ n((e, t) => !!(/^\s*stateDiagram-v2/.test(e) || /^\s*stateDiagram/.test(e) && t?.state?.defaultRenderer === "dagre-wrapper"), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./stateDiagram-v2-MP3YSRHH-DF4O7YSF.mjs");
		return {
			id: Aa,
			diagram: e
		};
	}, "loader")
}, Ma = "journey", Na = {
	id: Ma,
	detector: /* @__PURE__ */ n((e) => /^\s*journey/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./journeyDiagram-3NMN7TZE-C0NkwJ41.mjs");
		return {
			id: Ma,
			diagram: e
		};
	}, "loader")
}, Pa = { draw: /* @__PURE__ */ n((e, t, n) => {
	i.debug("rendering svg for syntax error\n");
	let r = Ut(t), a = r.append("g");
	r.attr("viewBox", "0 0 2412 512"), S(r, 100, 512, !0), a.append("path").attr("class", "error-icon").attr("d", "m411.313,123.313c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32-9.375,9.375-20.688-20.688c-12.484-12.5-32.766-12.5-45.25,0l-16,16c-1.261,1.261-2.304,2.648-3.31,4.051-21.739-8.561-45.324-13.426-70.065-13.426-105.867,0-192,86.133-192,192s86.133,192 192,192 192-86.133 192-192c0-24.741-4.864-48.327-13.426-70.065 1.402-1.007 2.79-2.049 4.051-3.31l16-16c12.5-12.492 12.5-32.758 0-45.25l-20.688-20.688 9.375-9.375 32.001-31.999zm-219.313,100.687c-52.938,0-96,43.063-96,96 0,8.836-7.164,16-16,16s-16-7.164-16-16c0-70.578 57.422-128 128-128 8.836,0 16,7.164 16,16s-7.164,16-16,16z"), a.append("path").attr("class", "error-icon").attr("d", "m459.02,148.98c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l16,16c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16.001-16z"), a.append("path").attr("class", "error-icon").attr("d", "m340.395,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16-16c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l15.999,16z"), a.append("path").attr("class", "error-icon").attr("d", "m400,64c8.844,0 16-7.164 16-16v-32c0-8.836-7.156-16-16-16-8.844,0-16,7.164-16,16v32c0,8.836 7.156,16 16,16z"), a.append("path").attr("class", "error-icon").attr("d", "m496,96.586h-32c-8.844,0-16,7.164-16,16 0,8.836 7.156,16 16,16h32c8.844,0 16-7.164 16-16 0-8.836-7.156-16-16-16z"), a.append("path").attr("class", "error-icon").attr("d", "m436.98,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688l32-32c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32c-6.251,6.25-6.251,16.375-0.001,22.625z"), a.append("text").attr("class", "error-text").attr("x", 1440).attr("y", 250).attr("font-size", "150px").style("text-anchor", "middle").text("Syntax error in text"), a.append("text").attr("class", "error-text").attr("x", 1250).attr("y", 400).attr("font-size", "100px").style("text-anchor", "middle").text(`mermaid version ${n}`);
}, "draw") }, Fa = Pa, Ia = {
	db: {},
	renderer: Pa,
	parser: { parse: /* @__PURE__ */ n(() => {}, "parse") }
}, La = "flowchart-elk", Ra = {
	id: La,
	detector: /* @__PURE__ */ n((e, t = {}) => /^\s*flowchart-elk/.test(e) || /^\s*(flowchart|graph)/.test(e) && t?.flowchart?.defaultRenderer === "elk" ? (t.layout = "elk", !0) : !1, "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./flowDiagram-HODETNUW-BE2pqfJt.mjs");
		return {
			id: La,
			diagram: e
		};
	}, "loader")
}, za = "timeline", Ba = {
	id: za,
	detector: /* @__PURE__ */ n((e) => /^\s*timeline/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./timeline-definition-24CTP7MA-BO7bI-LP.mjs");
		return {
			id: za,
			diagram: e
		};
	}, "loader")
}, Va = "mindmap", Ha = {
	id: Va,
	detector: /* @__PURE__ */ n((e) => /^\s*mindmap/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./mindmap-definition-YA3MSWOX-C_jG4rik.mjs");
		return {
			id: Va,
			diagram: e
		};
	}, "loader")
}, Ua = "kanban", Wa = {
	id: Ua,
	detector: /* @__PURE__ */ n((e) => /^\s*kanban/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./kanban-definition-UXKFOSKX-BKsLFdlS.mjs");
		return {
			id: Ua,
			diagram: e
		};
	}, "loader")
}, Ga = "sankey", Ka = {
	id: Ga,
	detector: /* @__PURE__ */ n((e) => /^\s*sankey(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./sankeyDiagram-P5KCCOFB-DSK5NkJB.mjs");
		return {
			id: Ga,
			diagram: e
		};
	}, "loader")
}, qa = "packet", Ja = {
	id: qa,
	detector: /* @__PURE__ */ n((e) => /^\s*packet(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./diagram-Z3DM3KII-B42IzXgh.mjs");
		return {
			id: qa,
			diagram: e
		};
	}, "loader")
}, Ya = "radar", Xa = {
	id: Ya,
	detector: /* @__PURE__ */ n((e) => /^\s*radar-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./diagram-UQ7AKVKN-KGWznria.mjs");
		return {
			id: Ya,
			diagram: e
		};
	}, "loader")
}, Za = "block", Qa = {
	id: Za,
	detector: /* @__PURE__ */ n((e) => /^\s*block(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./blockDiagram-I7D4REHJ-BXKjY8a-.mjs");
		return {
			id: Za,
			diagram: e
		};
	}, "loader")
}, $a = "treeView", eo = {
	id: $a,
	detector: /* @__PURE__ */ n((e) => /^\s*treeView-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./diagram-S7CK7UJ4-By2Ji1YU.mjs");
		return {
			id: $a,
			diagram: e
		};
	}, "loader")
}, to = "architecture", no = {
	id: to,
	detector: /* @__PURE__ */ n((e) => /^\s*architecture/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./architectureDiagram-5GKGNRK7-CYrXSkVk.mjs");
		return {
			id: to,
			diagram: e
		};
	}, "loader")
}, ro = "eventmodeling", io = {
	id: ro,
	detector: /* @__PURE__ */ n((e) => /^\s*eventmodeling/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./diagram-VSXAHHWV-CgdE8ILm.mjs");
		return {
			id: ro,
			diagram: e
		};
	}, "loader")
}, ao = "ishikawa", oo = {
	id: ao,
	detector: /* @__PURE__ */ n((e) => /^\s*ishikawa(-beta)?\b/i.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./ishikawaDiagram-5VMMS53U-B88kbRLX.mjs");
		return {
			id: ao,
			diagram: e
		};
	}, "loader")
}, so = "venn", co = {
	id: so,
	detector: /* @__PURE__ */ n((e) => /^\s*venn-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./vennDiagram-4TSXK5OY-PFHADxe1.mjs");
		return {
			id: so,
			diagram: e
		};
	}, "loader")
}, lo = "treemap", uo = {
	id: lo,
	detector: /* @__PURE__ */ n((e) => /^\s*treemap/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./diagram-VX7I27RA-B7E5_9cz.mjs");
		return {
			id: lo,
			diagram: e
		};
	}, "loader")
}, fo = "wardley", po = {
	id: fo,
	detector: /* @__PURE__ */ n((e) => /^\s*wardley-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./wardleyDiagram-VM6X3IG4-CTQnk-qm.mjs");
		return {
			id: fo,
			diagram: e
		};
	}, "loader")
}, mo = "cynefin", ho = {
	id: mo,
	detector: /* @__PURE__ */ n((e) => /^\s*cynefin-beta(?:[\s:]|$)/.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./cynefinDiagram-5FMLGOSQ-BR9AjV9X.mjs");
		return {
			id: mo,
			diagram: e
		};
	}, "loader")
}, go = "railroad", _o = {
	id: go,
	detector: /* @__PURE__ */ n((e) => /^\s*railroad-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./railroadDiagram-O6MQD6OU-BlE6wKBm.mjs");
		return {
			id: go,
			diagram: e
		};
	}, "loader")
}, vo = "railroadEbnf", yo = {
	id: vo,
	detector: /* @__PURE__ */ n((e) => /^\s*railroad-ebnf-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./ebnfDiagram-PWID7BFC-D5k_zk0i.mjs");
		return {
			id: vo,
			diagram: e
		};
	}, "loader")
}, bo = "railroadAbnf", xo = {
	id: bo,
	detector: /* @__PURE__ */ n((e) => /^\s*railroad-abnf-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./abnfDiagram-VCTEODGH-2O8Vhfsn.mjs");
		return {
			id: bo,
			diagram: e
		};
	}, "loader")
}, So = "railroadPeg", Co = {
	id: So,
	detector: /* @__PURE__ */ n((e) => /^\s*railroad-peg-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ n(async () => {
		let { diagram: e } = await import("./pegDiagram-XKGWAZYB-DmEGgaRY.mjs");
		return {
			id: So,
			diagram: e
		};
	}, "loader")
}, wo = !1, To = /* @__PURE__ */ n(() => {
	wo || (wo = !0, d("error", Ia, (e) => e.toLowerCase().trim() === "error"), d("---", {
		db: { clear: /* @__PURE__ */ n(() => {}, "clear") },
		styles: {},
		renderer: { draw: /* @__PURE__ */ n(() => {}, "draw") },
		parser: { parse: /* @__PURE__ */ n(() => {
			throw Error("Diagrams beginning with --- are not valid. If you were trying to use a YAML front-matter, please ensure that you've correctly opened and closed the YAML front-matter with un-indented `---` blocks");
		}, "parse") },
		init: /* @__PURE__ */ n(() => null, "init")
	}, (e) => e.toLowerCase().trimStart().startsWith("---")), f(Ra, Ha, no), f($i, Wa, Da, Ta, sa, da, pa, ha, xa, Ca, aa, ra, ta, Ba, la, ja, ka, Na, _a, Ka, Ja, ya, Qa, io, eo, Xa, oo, uo, _o, yo, xo, Co, co, po, ho));
}, "addDiagrams"), Eo = /* @__PURE__ */ n(async () => {
	i.debug("Loading registered diagrams");
	let e = (await Promise.allSettled(Object.entries(T).map(async ([e, { detector: t, loader: n }]) => {
		if (n) try {
			m(e);
		} catch {
			try {
				let { diagram: e, id: r } = await n();
				d(r, e, t);
			} catch (t) {
				throw i.error(`Failed to load external diagram with key ${e}. Removing from detectors.`), delete T[e], t;
			}
		}
	}))).filter((e) => e.status === "rejected");
	if (e.length > 0) {
		i.error(`Failed to load ${e.length} external diagrams`);
		for (let t of e) i.error(t);
		throw Error(`Failed to load ${e.length} external diagrams`);
	}
}, "loadRegisteredDiagrams"), Do = "graphics-document document";
function Oo(e, t) {
	e.attr("role", Do), t !== "" && e.attr("aria-roledescription", t);
}
n(Oo, "setA11yDiagramInfo");
function ko(e, t, n, r) {
	if (e.insert !== void 0) {
		if (n) {
			let t = `chart-desc-${r}`;
			e.attr("aria-describedby", t), e.insert("desc", ":first-child").attr("id", t).text(n);
		}
		if (t) {
			let n = `chart-title-${r}`;
			e.attr("aria-labelledby", n), e.insert("title", ":first-child").attr("id", n).text(t);
		}
	}
}
n(ko, "addSVGa11yTitleDescription");
var Ao = class e {
	constructor(e, t, n, r, i) {
		this.type = e, this.text = t, this.db = n, this.parser = r, this.renderer = i;
	}
	static {
		n(this, "Diagram");
	}
	static async fromText(t, n = {}) {
		let r = x(), i = D(t, r);
		t = ie(t) + "\n";
		try {
			m(i);
		} catch {
			let e = s(i);
			if (!e) throw new te(`Diagram ${i} not found.`);
			let { id: t, diagram: n } = await e();
			d(t, n);
		}
		let { db: a, parser: o, renderer: c, init: l } = m(i);
		return o.parser && (o.parser.yy = a), a.clear?.(), l?.(r), n.title && a.setDiagramTitle?.(n.title), await o.parse(t), new e(i, t, a, o, c);
	}
	async render(e, t) {
		await this.renderer.draw(this.text, e, t, this);
	}
	getParser() {
		return this.parser;
	}
	getType() {
		return this.type;
	}
}, jo = [], Mo = /* @__PURE__ */ n(() => {
	jo.forEach((e) => {
		e();
	}), jo = [];
}, "attachFunctions"), No = /* @__PURE__ */ n((e) => e.replace(/^\s*%%(?!{)[^\n]+\n?/gm, "").trimStart(), "cleanupComments");
function Po(e) {
	let t = e.match(b);
	if (!t) return {
		text: e,
		metadata: {}
	};
	let n = t[1], r = Zr(n ? t[2].split("\n").map((e) => e.startsWith(n) ? e.slice(n.length) : e).join("\n") : t[2], { schema: Jr }) ?? {};
	r = typeof r == "object" && !Array.isArray(r) ? r : {};
	let i = {};
	return r.displayMode && (i.displayMode = r.displayMode.toString()), r.title && (i.title = r.title.toString()), r.config && (i.config = r.config), {
		text: e.slice(t[0].length),
		metadata: i
	};
}
n(Po, "extractFrontMatter");
var Fo = /* @__PURE__ */ n((e) => e.replace(/\r\n?/g, "\n").replace(/<(\w+)([^>]*)>/g, (e, t, n) => "<" + t + n.replace(/="([^"]*)"/g, "='$1'") + ">"), "cleanupText"), Io = /* @__PURE__ */ n((e) => {
	let { text: t, metadata: n } = Po(e), { displayMode: r, title: i, config: a = {} } = n;
	return r && (a.gantt ||= {}, a.gantt.displayMode = r), {
		title: i,
		config: a,
		text: t
	};
}, "processFrontmatter"), Lo = /* @__PURE__ */ n((e) => {
	let t = F.detectInit(e) ?? {}, n = F.detectDirective(e, "wrap");
	return Array.isArray(n) ? t.wrap = n.some(({ type: e }) => e === "wrap") : n?.type === "wrap" && (t.wrap = !0), {
		text: I(e),
		directive: t
	};
}, "processDirectives");
function Ro(e) {
	let t = Io(Fo(e)), n = Lo(t.text), r = re(t.config, n.directive);
	return e = No(n.text), {
		code: e,
		title: t.title,
		config: r
	};
}
n(Ro, "preprocessDiagram");
function zo(e) {
	let t = new TextEncoder().encode(e), n = Array.from(t, (e) => String.fromCodePoint(e)).join("");
	return btoa(n);
}
n(zo, "toBase64");
var Bo = 5e4, Vo = "graph TB;a[Maximum text size in diagram exceeded];style a fill:#faa", Ho = "sandbox", Uo = "loose", Wo = "http://www.w3.org/2000/svg", Go = "http://www.w3.org/1999/xlink", Ko = "http://www.w3.org/1999/xhtml", qo = "100%", Jo = "100%", Yo = "border:0;margin:0;", Xo = "margin:0", Zo = "allow-top-navigation-by-user-activation allow-popups", Qo = "The \"iframe\" tag is not supported by your browser.", $o = ["foreignobject"], es = ["dominant-baseline"];
function ts(e) {
	let t = Ro(e);
	return l(), E(t.config ?? {}), t;
}
n(ts, "processAndSetConfigs");
async function ns(e, t) {
	To();
	try {
		let { code: t, config: n } = ts(e);
		return {
			diagramType: (await ms(t)).type,
			config: n
		};
	} catch (e) {
		if (t?.suppressErrors) return !1;
		throw e;
	}
}
n(ns, "parse");
var rs = /* @__PURE__ */ n((e, t, n = []) => `.${e} ${t} ${u(`{ ${n.join(" !important; ")} !important; }`)}`, "cssImportantStyles"), is = /* @__PURE__ */ n((e, t = /* @__PURE__ */ new Map()) => {
	let n = new CSSStyleSheet();
	if (e.fontFamily !== void 0 && n.insertRule(`:root { --mermaid-font-family: ${e.fontFamily}}`, n.cssRules.length), e.altFontFamily !== void 0 && n.insertRule(`:root { --mermaid-alt-font-family: ${e.altFontFamily}}`, n.cssRules.length), t instanceof Map) {
		let r = h(e) ? ["> *", "span"] : [
			"rect",
			"polygon",
			"ellipse",
			"circle",
			"path"
		];
		t.forEach((e) => {
			Gt(e.styles) || r.forEach((t) => {
				n.insertRule(rs(e.id, t, e.styles), n.cssRules.length);
			}), Gt(e.textStyles) || n.insertRule(rs(e.id, "tspan", (e?.textStyles || []).map((e) => e.replace("color", "fill"))), n.cssRules.length);
		});
	}
	let r = "";
	if (e.themeCSS !== void 0) {
		if (typeof n.replaceSync == "function") {
			let t = new CSSStyleSheet();
			t.replaceSync(e.themeCSS), r = w(t) + "\n";
		} else r += `${e.themeCSS}
`;
	}
	return r + w(n);
}, "createCssStyles"), as = /* @__PURE__ */ n((e, t) => Yi(Wi(`${e}{${t}}`), Zi([/* @__PURE__ */ n(function(t, n, r, a) {
	if (t.type === "rule" && Array.isArray(t.props)) {
		if (t.parent && t.parent.type === "@keyframes") return;
		t.props = t.props.map((n) => n === e && Array.isArray(t.children) && t.children.every((e) => e.type === "decl" && (/* @__PURE__ */ new Set([
			"font-family",
			"font-size",
			"fill"
		])).has(e.props)) ? n : !n.startsWith(`${e} `) && !n.startsWith(`${e}>`) || n.startsWith(`${e} ||`) ? `${e} ${n}` : n);
	} else t.type.startsWith("@") && ([
		"@media",
		"@supports",
		"@layer",
		"@scope",
		"@container",
		"@starting-style",
		"@keyframes"
	].includes(t.type) || (i.warn(`Removing unsupported at-rule ${t.type} from CSS`), t.type = ui));
}, "addNamespace"), Xi])), "compileCSS"), os = /* @__PURE__ */ n((e, t, n, r) => {
	let i = is(e, n);
	return as(r, v(t, i, {
		...e.themeVariables,
		theme: e.theme,
		look: e.look
	}, r));
}, "createUserStyles"), ss = /* @__PURE__ */ n((e = "", t, n) => {
	let r = e;
	return !n && !t && (r = r.replace(/marker-end="url\([\d+./:=?A-Za-z-]*?#/g, "marker-end=\"url(#")), r = M(r), r = r.replace(/<br>/g, "<br/>"), r;
}, "cleanUpSvgCode"), cs = /* @__PURE__ */ n((e = "", t) => `<iframe style="width:${qo};height:${t?.viewBox?.baseVal?.height ? t.viewBox.baseVal.height + "px" : Jo};${Yo}" src="data:text/html;charset=UTF-8;base64,${zo(`<body style="${Xo}">${e}</body>`)}" sandbox="${Zo}">
  ${Qo}
</iframe>`, "putIntoIFrame"), ls = /* @__PURE__ */ n((e, t, n, r, i) => {
	let a = e.append("div");
	a.attr("id", n), r && a.attr("style", r);
	let o = a.append("svg").attr("id", t).attr("width", "100%").attr("xmlns", Wo);
	return i && o.attr("xmlns:xlink", i), o.append("g"), e;
}, "appendDivSvgG");
function us(e, t) {
	return e.append("iframe").attr("id", t).attr("style", "width: 100%; height: 100%;").attr("sandbox", "");
}
n(us, "sandboxedIframe");
var ds = /* @__PURE__ */ n((e, t, n, r) => {
	e.getElementById(t)?.remove(), e.getElementById(n)?.remove(), e.getElementById(r)?.remove();
}, "removeExistingElements"), fs = /* @__PURE__ */ n(async function(e, t, r) {
	To();
	let s = ts(t);
	t = s.code;
	let c = x();
	i.debug(c), t.length > (c?.maxTextSize ?? Bo) && (t = Vo);
	let l = `#${e}`, u = "i" + e, d = "#" + u, f = "d" + e, p = "#" + f, m = /* @__PURE__ */ n(() => {
		let e = a(g ? d : p).node();
		e && "remove" in e && e.remove();
	}, "removeTempElements"), h = a(document.body), g = c.securityLevel === Ho, _ = c.securityLevel === Uo, v = c.fontFamily;
	if (r !== void 0) {
		if (r && (r.innerHTML = ""), g) {
			let e = us(a(r), u);
			h = a(e.nodes()[0].contentDocument.body), h.node().style.margin = "0";
		} else h = a(r);
		ls(h, e, f, `font-family: ${v}`, Go);
	} else {
		if (ds(document, e, f, u), g) {
			let e = us(a(document.body), u);
			h = a(e.nodes()[0].contentDocument.body), h.node().style.margin = "0";
		} else h = a("body");
		ls(h, e, f);
	}
	let y, b;
	try {
		y = await Ao.fromText(t, { title: s.title });
	} catch (e) {
		if (c.suppressErrorRendering) throw m(), e;
		y = await Ao.fromText("error"), b = e;
	}
	let S = h.select(p).node(), w = y.type, T = S.firstChild, E = T.firstChild, D = y.renderer.getClasses?.(t, y), O = os(c, w, D, l), k = document.createElement("style");
	k.innerHTML = O, T.insertBefore(k, E);
	try {
		await y.renderer.draw(t, e, "11.17.2", y);
	} catch (n) {
		throw c.suppressErrorRendering ? m() : Fa.draw(t, e, "11.17.2"), n;
	}
	let ee = h.select(`${p} svg`), te = y.db.getAccTitle?.(), A = y.db.getAccDescription?.();
	hs(w, ee, te, A);
	let j = (/* @__PURE__ */ n(() => {
		h.select(`[id="${e}"]`).selectAll("foreignobject > *").attr("xmlns", Ko);
		let t = h.select(p).node().innerHTML;
		if (i.debug("config.arrowMarkerAbsolute", c.arrowMarkerAbsolute), t = ss(t, g, C(c.arrowMarkerAbsolute)), g) {
			let e = h.select(p + " svg").node();
			t = cs(t, e);
		} else _ || (t = o.sanitize(t, {
			ADD_TAGS: $o,
			ADD_ATTR: es,
			HTML_INTEGRATION_POINTS: { foreignobject: !0 }
		}));
		return Mo(), t;
	}, "serializeSvg"))();
	if (b) throw b;
	return m(), {
		diagramType: w,
		svg: j,
		bindFunctions: y.db.bindFunctions
	};
}, "render");
function ps(e = {}) {
	let t = k({}, e);
	t?.fontFamily && !t.themeVariables?.fontFamily && (t.themeVariables ||= {}, t.themeVariables.fontFamily = t.fontFamily), g(t), t?.theme && t.theme in y ? t.themeVariables = y[t.theme].getThemeVariables(t.themeVariables) : t && (t.themeVariables = y.default.getThemeVariables(t.themeVariables));
	let n = typeof t == "object" ? O(t) : c();
	r(n.logLevel), To();
}
n(ps, "initialize");
var ms = /* @__PURE__ */ n((e, t = {}) => {
	let { code: n } = Ro(e);
	return Ao.fromText(n, t);
}, "getDiagramFromText");
function hs(e, t, n, r) {
	Oo(t, e), ko(t, n, r, t.attr("id"));
}
n(hs, "addA11yInfo");
var gs = Object.freeze({
	render: fs,
	parse: ns,
	getDiagramFromText: ms,
	initialize: ps,
	getConfig: x,
	setConfig: _,
	getSiteConfig: c,
	updateSiteConfig: p,
	reset: /* @__PURE__ */ n(() => {
		l();
	}, "reset"),
	globalReset: /* @__PURE__ */ n(() => {
		l(A);
	}, "globalReset"),
	defaultConfig: A
});
r(x().logLevel), l(x());
var _s = /* @__PURE__ */ n((e, t, n) => {
	i.warn(e), P(e) ? (n && n(e.str, e.hash), t.push({
		...e,
		message: e.str,
		error: e
	})) : (n && n(e), e instanceof Error && t.push({
		str: e.message,
		message: e.message,
		hash: e.name,
		error: e
	}));
}, "handleError"), vs = /* @__PURE__ */ n(async function(e = { querySelector: ".mermaid" }) {
	try {
		await ys(e);
	} catch (t) {
		if (P(t) && i.error(t.str), J.parseError && J.parseError(t), !e.suppressErrors) throw i.error("Use the suppressErrors option to suppress these errors"), t;
	}
}, "run"), ys = /* @__PURE__ */ n(async function({ postRenderCallback: e, querySelector: t, nodes: n } = { querySelector: ".mermaid" }) {
	let r = gs.getConfig();
	i.debug(`${e ? "" : "No "}Callback function found`);
	let a;
	if (n) a = n;
	else if (t) a = document.querySelectorAll(t);
	else throw Error("Nodes and querySelector are both undefined");
	i.debug(`Found ${a.length} diagrams`), r?.startOnLoad !== void 0 && (i.debug("Start On Load: " + r?.startOnLoad), gs.updateSiteConfig({ startOnLoad: r?.startOnLoad }));
	let o = new F.InitIDGenerator(r.deterministicIds, r.deterministicIDSeed), s, c = [];
	for (let t of Array.from(a)) {
		if (i.info("Rendering diagram: " + t.id), t.getAttribute("data-processed")) continue;
		t.setAttribute("data-processed", "true");
		let n = `mermaid-${o.next()}`;
		s = t.innerHTML, s = le(F.entityDecode(s)).trim().replace(/<br\s*\/?>/gi, "<br/>");
		let r = F.detectInit(s);
		r && i.debug("Detected early reinit: ", r);
		try {
			let { svg: r, bindFunctions: i } = await ks(n, s, t);
			t.innerHTML = r, e && await e(n), i && i(t);
		} catch (e) {
			_s(e, c, J.parseError);
		}
	}
	if (c.length > 0) throw c[0];
}, "runThrowsErrors"), bs = /* @__PURE__ */ n(function(e) {
	gs.initialize(e);
}, "initialize"), xs = /* @__PURE__ */ n(async function(e, t, n) {
	i.warn("mermaid.init is deprecated. Please use run instead."), e && bs(e);
	let r = {
		postRenderCallback: n,
		querySelector: ".mermaid"
	};
	typeof t == "string" ? r.querySelector = t : t && (r.nodes = t instanceof HTMLElement ? [t] : t), await vs(r);
}, "init"), Ss = /* @__PURE__ */ n(async (e, { lazyLoad: t = !0 } = {}) => {
	To(), f(...e), t === !1 && await Eo();
}, "registerExternalDiagrams"), Cs = /* @__PURE__ */ n(function() {
	if (J.startOnLoad) {
		let { startOnLoad: e } = gs.getConfig();
		e && J.run().catch((e) => i.error("Mermaid failed to initialize", e));
	}
}, "contentLoaded");
typeof document < "u" && window.addEventListener("load", Cs, !1);
var ws = /* @__PURE__ */ n(function(e) {
	J.parseError = e;
}, "setParseErrorHandler"), Ts = [], Es = !1, Ds = /* @__PURE__ */ n(async () => {
	if (!Es) {
		for (Es = !0; Ts.length > 0;) {
			let e = Ts.shift();
			if (e) try {
				await e();
			} catch (e) {
				i.error("Error executing queue", e);
			}
		}
		Es = !1;
	}
}, "executeQueue"), Os = /* @__PURE__ */ n(async (e, t) => new Promise((r, a) => {
	let o = /* @__PURE__ */ n(() => new Promise((n, o) => {
		gs.parse(e, t).then((e) => {
			n(e), r(e);
		}, (e) => {
			i.error("Error parsing", e), J.parseError?.(e), o(e), a(e);
		});
	}), "performCall");
	Ts.push(o), Ds().catch(a);
}), "parse"), ks = /* @__PURE__ */ n((e, t, r) => new Promise((a, o) => {
	let s = /* @__PURE__ */ n(() => new Promise((n, s) => {
		gs.render(e, t, r).then((e) => {
			n(e), a(e);
		}, (e) => {
			i.error("Error parsing", e), J.parseError?.(e), s(e), o(e);
		});
	}), "performCall");
	Ts.push(s), Ds().catch(o);
}), "render"), J = {
	startOnLoad: !0,
	mermaidAPI: gs,
	parse: Os,
	render: ks,
	init: xs,
	run: vs,
	registerExternalDiagrams: Ss,
	registerLayoutLoaders: si,
	initialize: bs,
	parseError: void 0,
	contentLoaded: Cs,
	setParseErrorHandler: ws,
	detectType: D,
	registerIconPacks: ce,
	getRegisteredDiagramsMetadata: /* @__PURE__ */ n(() => Object.keys(T).map((e) => ({ id: e })), "getRegisteredDiagramsMetadata")
}, As = J, Y = (e) => e.replace(/\s*!important\s*$/i, "").trim(), js = (e, t) => {
	let n = t;
	for (; n < e.length && /\s/.test(e[n]);) n += 1;
	let r = n;
	for (; n < e.length && /[a-z-]/i.test(e[n]);) n += 1;
	if (n === r) return !1;
	for (; n < e.length && /\s/.test(e[n]);) n += 1;
	return e[n] === ":";
}, X = (e) => {
	let t = [], n = 0;
	for (; n < e.length;) {
		for (; n < e.length && /[\s;,]/.test(e[n]);) n += 1;
		if (n >= e.length) break;
		let r = n;
		for (; n < e.length && e[n] !== ":" && e[n] !== ";" && e[n] !== ",";) n += 1;
		if (n >= e.length || e[n] !== ":") break;
		let i = e.substring(r, n).trim().toLowerCase();
		n += 1;
		let a = n, o = 0, s = null;
		for (; n < e.length;) {
			let t = e[n];
			if (s) t === s && e[n - 1] !== "\\" && (s = null), n += 1;
			else if (t === "\"" || t === "'") s = t, n += 1;
			else if (t === "(") o += 1, n += 1;
			else if (t === ")") o = Math.max(0, o - 1), n += 1;
			else {
				if (o === 0 && (t === ";" || t === "," || /\s/.test(t) && js(e, n))) break;
				n += 1;
			}
		}
		let c = Y(e.substring(a, n));
		i && c && t.push({
			property: i,
			value: c
		}), n < e.length && (e[n] === ";" || e[n] === ",") && (n += 1);
	}
	return t;
}, Z = (e) => {
	let t = Y(e);
	if (!t) return !1;
	if (typeof CSS < "u" && typeof CSS.supports == "function") return CSS.supports("color", t);
	if (typeof document < "u") {
		let e = document.createElement("div");
		return e.style.color = "", e.style.color = t, e.style.color !== "";
	}
	return !1;
}, Ms = (e, t) => {
	let n = e.getAttribute("style");
	return n && X(n).find((e) => e.property === t)?.value || "";
}, Ns = (...e) => {
	for (let t of e) {
		let e = Y(t || "");
		if (Z(e)) return e;
	}
}, Ps = (e, t) => {
	let n = e.querySelector("text, foreignObject, div, span, p") || e, r = Ns(n.getAttribute?.("fill"), Ms(n, "fill"), n.style?.fill);
	if (r) return r;
	let i = Ns(n.getAttribute?.("color"), Ms(n, "color"), n.style?.color);
	if (i) return i;
	let a = Ns(t);
	if (a) return a;
}, Fs = (e, t, n) => {
	switch (t) {
		case R.FILL:
		case R.STROKE:
			Z(n) && (e[t] = n);
			break;
		case R.STROKE_WIDTH:
		case R.STROKE_DASHARRAY: e[t] = n;
	}
}, Is = (e, t, n) => {
	t === L.COLOR && Z(n) && (e[L.COLOR] = n);
}, Ls = (e, t, n) => {
	e && X(e).forEach(({ property: e, value: r }) => {
		Fs(t, e, r), Is(n, e, r);
	});
}, Rs = (e, t) => {
	e && X(e).forEach(({ property: e, value: n }) => {
		e === "fill" && Z(n) ? t[L.COLOR] = n : Is(t, e, n);
	});
}, zs = (e, t) => {
	e && [
		[R.FILL, e.getAttribute("fill")],
		[R.STROKE, e.getAttribute("stroke")],
		[R.STROKE_WIDTH, e.getAttribute("stroke-width")],
		[R.STROKE_DASHARRAY, e.getAttribute("stroke-dasharray")]
	].forEach(([e, n]) => {
		let r = Y(n || "");
		r && Fs(t, e, r);
	});
}, Bs = (e, t) => {
	if (!e) return;
	let n = Y(e.getAttribute("fill") || e.getAttribute("color") || "");
	Z(n) && (t[L.COLOR] = n);
}, Vs = (e, t, n, r) => {
	if (!(t instanceof Map)) return;
	let i = t.get(e);
	i && (i.styles?.forEach((e) => {
		X(e).forEach(({ property: e, value: t }) => {
			Fs(n, e, t), Is(r, e, t);
		});
	}), i.textStyles?.forEach((e) => {
		X(e).forEach(({ property: e, value: t }) => {
			Is(r, e, t);
		});
	}));
}, Hs = (e, t, n) => {
	let r = e.nodes.map((e) => e.startsWith("flowchart-") ? e.split("-")[1] : e), i = t.querySelector(`[id='${e.id}']`);
	if (!i) throw Error("SubGraph element not found");
	let a = Gs(i, t), o = i.getBBox(), s = {
		width: o.width,
		height: o.height
	}, c = {}, l = {}, u = i.querySelector(":scope > rect, :scope > path, :scope > polygon, :scope > ellipse") || i.querySelector(".cluster > rect, .cluster > path, .cluster > polygon, .cluster > ellipse") || i.querySelector("rect, path, polygon, ellipse");
	Ls(i.getAttribute("style"), c, l), Ls(u?.getAttribute("style"), c, l), zs(u, c);
	let d = i.querySelector(".cluster-label text, .cluster-label tspan") || i.querySelector("text");
	return Rs(d?.getAttribute("style"), l), Bs(d, l), Vs(e.id, n, c, l), e.classes?.forEach((e) => {
		Vs(e, n, c, l);
	}), {
		id: e.id,
		nodeIds: r,
		text: B(e.title),
		labelType: "text",
		...a,
		...s,
		containerStyle: c,
		labelStyle: l
	};
}, Us = (e, t, n) => {
	let r = t.querySelector(`[id*="${e.domId}"]`);
	if (!r) return;
	let i;
	r.parentElement?.tagName.toLowerCase() === "a" && (i = r.parentElement.getAttribute("xlink:href"));
	let a = Gs(i ? r.parentElement : r, t), o = r.getBBox(), s = {
		width: o.width,
		height: o.height
	}, c = {}, l = {};
	e.classes && n instanceof Map && (Array.isArray(e.classes) ? e.classes : [e.classes]).forEach((e) => {
		Vs(e, n, c, l);
	}), e.styles?.forEach((e) => {
		Ls(e, c, l);
	});
	let u = r.querySelector(".label-container");
	return Ls(u?.getAttribute("style"), c, l), zs(u, c), Array.from(r.querySelectorAll(".label, .nodeLabel, .label text, .label tspan, .label span, .label div")).forEach((e) => {
		Rs(e.getAttribute("style"), l), Bs(e, l);
	}), {
		id: e.id,
		labelType: e.labelType,
		text: B(e.text || ""),
		type: e.type,
		link: i || void 0,
		...a,
		...s,
		containerStyle: c,
		labelStyle: l
	};
}, Ws = (e, t, n) => {
	let r = n.querySelector(`[id*="${e.id}"]`);
	if (!r) throw Error("Edge element not found");
	let i = Bt(r, Gs(r, n));
	return e.length = void 0, {
		...e,
		...i,
		text: B(e.text)
	};
}, Gs = (e, t) => {
	if (!e) throw Error("Element not found");
	let n = e.parentElement?.parentElement, r = e.childNodes[0], i = {
		x: 0,
		y: 0
	};
	if (r) {
		let { transformX: e, transformY: t } = Nt(r), n = r.getBBox();
		i = {
			x: Number(r.getAttribute("x")) || e + n.x || 0,
			y: Number(r.getAttribute("y")) || t + n.y || 0
		};
	}
	let { transformX: a, transformY: o } = Nt(e), s = {
		x: a + i.x,
		y: o + i.y
	};
	for (; n && n.id !== t.id;) {
		if (n.classList.value === "root" && n.hasAttribute("transform")) {
			let { transformX: e, transformY: t } = Nt(n);
			s.x += e, s.y += t;
		}
		n = n.parentElement;
	}
	return s;
}, Ks = (e, t) => {
	let n = e.getVertices(), r = e.getEdges(), i = e.getSubGraphs(), a = e.getClasses(), o = {}, s = a instanceof Map ? a : {};
	n instanceof Map ? n.forEach((e, n) => {
		o[n] = Us(e, t, s);
	}) : typeof n == "object" && n && Object.entries(n).forEach(([e, n]) => {
		o[e] = Us(n, t, s);
	});
	let c = /* @__PURE__ */ new Map(), l = (Array.isArray(r) ? r : []).map((e) => {
		if (!t.querySelector(`[id*="${e.id}"]`)) return null;
		let n = `${e.start}-${e.end}`, r = c.get(n) || 0;
		return c.set(n, r + 1), Ws(e, r, t);
	}).filter((e) => e !== null && e.reflectionPoints.length > 1);
	return {
		type: "flowchart",
		subGraphs: (Array.isArray(i) ? i : []).map((e) => Hs(e, t, s)),
		vertices: o,
		edges: l
	};
}, qs = (e, t) => {
	let n = {};
	t?.label && (n.label = {
		text: B(t.label),
		fontSize: 16
	});
	let r = e.tagName;
	if (r === "line") n.startX = Number(e.getAttribute("x1")), n.startY = Number(e.getAttribute("y1")), n.endX = Number(e.getAttribute("x2")), n.endY = Number(e.getAttribute("y2"));
	else if (r === "path") {
		let t = e.getAttribute("d");
		if (!t) throw Error("Path element does not contain a \"d\" attribute");
		let r = t.split(/(?=[LC])/), i = r[0].substring(1).split(",").map((e) => parseFloat(e)), a = [];
		r.forEach((e) => {
			let t = e.substring(1).trim().split(" ").map((e) => {
				let [t, n] = e.split(",");
				return [parseFloat(t) - i[0], parseFloat(n) - i[1]];
			});
			a.push(...t);
		});
		let o = a[a.length - 1];
		n.startX = i[0], n.startY = i[1], n.endX = o[0], n.endY = o[1], n.points = a;
	}
	t?.label && (n.startY -= 10, n.endY -= 10);
	let i = e.getAttribute("stroke"), a = (i && i !== "none" ? i : "") || getComputedStyle(e).stroke || "";
	return n.strokeColor = a ? Y(a) : null, n.strokeWidth = Number(e.getAttribute("stroke-width")), n.type = "arrow", n.strokeStyle = t?.strokeStyle || "solid", n.startArrowhead = t?.startArrowhead || null, n.endArrowhead = t?.endArrowhead || null, n;
}, Js = (e, t, n, r, i) => {
	let a = {};
	return a.type = "arrow", a.startX = e, a.startY = t, a.endX = n, a.endY = r, Object.assign(a, { ...i }), a;
}, Ys = (e, t, n, r) => ({
	type: "text",
	x: e,
	y: t,
	text: n,
	width: r?.width || 20,
	height: r?.height || 20,
	fontSize: r?.fontSize || 20,
	id: r?.id,
	color: r?.color,
	groupId: r?.groupId,
	metadata: r?.metadata
}), Xs = (e, t, n) => {
	let r = {}, i = Number(e.getAttribute("x")), a = Number(e.getAttribute("y"));
	r.type = "text", r.text = B(t), n?.id && (r.id = n.id), n?.groupId && (r.groupId = n.groupId);
	let o = e.getBBox();
	return r.width = o.width, r.height = o.height, r.x = i - o.width / 2, r.y = a, r.fontSize = parseInt(getComputedStyle(e).fontSize), r.color = Ps(e), r;
}, Q = (e, t, n = {}) => {
	let r = {};
	r.type = t;
	let { label: i, subtype: a, id: o, groupId: s } = n;
	r.id = o, s && (r.groupId = s), i && (r.label = {
		text: B(i.text),
		fontSize: 16,
		textAlign: i?.textAlign,
		verticalAlign: i?.verticalAlign
	});
	let c = e.getBBox();
	switch (r.x = c.x, r.y = c.y, r.width = c.width, r.height = c.height, r.subtype = a, a) {
		case "highlight":
			let t = e.getAttribute("fill");
			t && (r.bgColor = Y(t));
			break;
		case "note": r.strokeStyle = "dashed";
	}
	return r;
}, Zs = (e, t, n, r, i, a) => {
	let o = {};
	o.startX = t, o.startY = n, o.endX = r, a?.groupId && (o.groupId = a.groupId), a?.id && (o.id = a.id), o.endY = i;
	let s = e.getAttribute("stroke");
	return o.strokeColor = s ? Y(s) : null, o.strokeWidth = Number(e.getAttribute("stroke-width")), o.type = "line", o;
}, Qs = {
	0: "SOLID",
	1: "DOTTED",
	3: "SOLID_CROSS",
	4: "DOTTED_CROSS",
	5: "SOLID_OPEN",
	6: "DOTTED_OPEN",
	24: "SOLID_POINT",
	25: "DOTTED_POINT"
}, $ = {
	SOLID: 0,
	DOTTED: 1,
	NOTE: 2,
	SOLID_CROSS: 3,
	DOTTED_CROSS: 4,
	SOLID_OPEN: 5,
	DOTTED_OPEN: 6,
	LOOP_START: 10,
	LOOP_END: 11,
	ALT_START: 12,
	ALT_ELSE: 13,
	ALT_END: 14,
	OPT_START: 15,
	OPT_END: 16,
	ACTIVE_START: 17,
	ACTIVE_END: 18,
	PAR_START: 19,
	PAR_AND: 20,
	PAR_END: 21,
	RECT_START: 22,
	RECT_END: 23,
	SOLID_POINT: 24,
	DOTTED_POINT: 25,
	AUTONUMBER: 26,
	CRITICAL_START: 27,
	CRITICAL_OPTION: 28,
	CRITICAL_END: 29,
	BREAK_START: 30,
	BREAK_END: 31,
	PAR_OVER_START: 32
}, $s = (e) => {
	let t;
	switch (e) {
		case $.SOLID:
		case $.SOLID_CROSS:
		case $.SOLID_OPEN:
		case $.SOLID_POINT:
			t = "solid";
			break;
		case $.DOTTED:
		case $.DOTTED_CROSS:
		case $.DOTTED_OPEN:
		case $.DOTTED_POINT:
			t = "dotted";
			break;
		default: t = "solid";
	}
	return t;
}, ec = (e, t) => {
	if (e.nextElementSibling?.classList.contains("sequenceNumber")) {
		let n = e.nextElementSibling?.textContent;
		if (!n) throw Error("sequence number not present");
		let r = {
			type: "rectangle",
			x: t.startX - 10,
			y: t.startY - 15,
			label: {
				text: n,
				fontSize: 14
			},
			bgColor: "#e9ecef",
			height: 30,
			subtype: "sequence"
		};
		Object.assign(t, { sequenceNumber: r });
	}
}, tc = (e, t, n) => {
	if (!e) throw "root node not found";
	let r = z(), i = Array.from(e.children), a = [];
	return i.forEach((e, i) => {
		let o = `${n?.id}-${i}`, s;
		switch (e.tagName) {
			case "line":
				s = Zs(e, Number(e.getAttribute("x1")), Number(e.getAttribute("y1")), Number(e.getAttribute("x2")), Number(e.getAttribute("y2")), {
					groupId: r,
					id: o
				});
				break;
			case "text":
				s = Xs(e, t, {
					groupId: r,
					id: o
				});
				break;
			case "circle": s = Q(e, "ellipse", {
				label: e.textContent ? { text: e.textContent } : void 0,
				groupId: r,
				id: o
			});
			default: s = Q(e, Ee[e.tagName], {
				label: e.textContent ? { text: e.textContent } : void 0,
				groupId: r,
				id: o
			});
		}
		a.push(s);
	}), a;
}, nc = (e, t) => {
	let n = t.getAttribute("fill"), r = t.getAttribute("stroke"), i = t.getAttribute("stroke-width"), a = t.getAttribute("stroke-dasharray");
	n && n !== "none" && (e.bgColor = Y(n)), r && r !== "none" && (e.strokeColor = Y(r)), i && (e.strokeWidth = Number(i)), a && a.trim() && (e.strokeStyle = "dashed");
}, rc = (e, t) => {
	let n = Array.from(t.querySelectorAll(".actor-top")), r = Array.from(t.querySelectorAll(".actor-bottom")), i = [], a = [], o = {}, s = e instanceof Map ? Array.from(e.values()) : Object.values(e), c = Array.from(t.querySelectorAll(".actor-line")), l = (e, t) => {
		let n = e.name, r = c.find((e) => e.getAttribute("name") === n);
		if (r) return r;
		let i = e.type === "participant" ? t.parentElement?.previousElementSibling : t.previousElementSibling;
		return i ? i.tagName === "line" ? i : i.querySelector("line") : null;
	};
	return s.forEach((e) => {
		let t = n.find((t) => t.getAttribute("name") === e.name), s = r.find((t) => t.getAttribute("name") === e.name);
		if (!t || !s) throw "root not found";
		let c = e.description;
		if (e.type === "participant") {
			let n = Q(t, "rectangle", {
				id: `${e.name}-top`,
				label: { text: c },
				subtype: "actor"
			});
			if (nc(n, t), !n) throw "Top Node element not found!";
			i.push([n]);
			let r = Q(s, "rectangle", {
				id: `${e.name}-bottom`,
				label: { text: c },
				subtype: "actor"
			});
			o[e.name] = {
				topId: `${e.name}-top`,
				bottomId: `${e.name}-bottom`,
				bindType: "rectangle"
			}, nc(r, s), i.push([r]);
			let u = l(e, t);
			if (u?.tagName !== "line") throw "Line not found";
			let d = Number(u.getAttribute("x1"));
			if (!n.height) throw "Top node element height is null";
			let f = n.y + n.height, p = r.y, m = Zs(u, d, f, Number(u.getAttribute("x2")), p);
			a.push(m);
		} else if (e.type === "actor") {
			let n = tc(t, c, { id: `${e.name}-top` });
			i.push(n);
			let r = tc(s, c, { id: `${e.name}-bottom` });
			i.push(r);
			let u = l(e, t);
			if (u?.tagName !== "line") throw "Line not found";
			let d = Number(u.getAttribute("x1")), f = Number(u.getAttribute("y1")), p = Number(u.getAttribute("x2")), m = r.find((e) => e.type === "ellipse");
			if (m) {
				let e = m.y, t = Zs(u, d, f, p, e);
				a.push(t);
			}
			let h = n.find((e) => e.type === "ellipse"), g = r.find((e) => e.type === "ellipse");
			h?.id && g?.id && (o[e.name] = {
				topId: h.id,
				bottomId: g.id,
				bindType: "ellipse"
			});
		}
	}), {
		nodes: i,
		lines: a,
		actorMap: o
	};
}, ic = (e, t, n) => {
	let r = [], i = Array.from(t.querySelectorAll("[class*=\"messageLine\"]")), a = Object.keys(Qs), o = e.filter((e) => a.includes(e.type.toString()));
	return i.forEach((e, t) => {
		let i = o[t], a = Qs[i.type], s = qs(e, {
			label: i?.message,
			strokeStyle: $s(i.type),
			endArrowhead: a === "SOLID_OPEN" || a === "DOTTED_OPEN" ? null : "arrow"
		}), c = n[i.from], l = n[i.to];
		c?.topId && l?.topId && (s.start = {
			type: c.bindType || "rectangle",
			id: c.topId
		}, s.end = {
			type: l.bindType || "rectangle",
			id: l.topId
		}), ec(e, s), r.push(s);
	}), r;
}, ac = (e, t) => {
	let n = Array.from(t.querySelectorAll(".note")).map((e) => e.parentElement), r = e.filter((e) => e.type === $.NOTE), i = [];
	return n.forEach((e, t) => {
		if (!e) return;
		let n = e.firstChild, a = r[t].message, o = Q(n, "rectangle", {
			label: { text: a },
			subtype: "note"
		}), s = n.getAttribute("fill"), c = n.getAttribute("stroke"), l = n.getAttribute("stroke-width"), u = n.getAttribute("stroke-dasharray");
		s && s !== "none" && (o.bgColor = Y(s)), c && c !== "none" && (o.strokeColor = Y(c)), l && (o.strokeWidth = Number(l)), u && u.trim() && (o.strokeStyle = "dashed"), i.push(o);
	}), i;
}, oc = (e) => {
	let t = Array.from(e.querySelectorAll("[class*=activation]")), n = [];
	return t.forEach((e) => {
		let t = Q(e, "rectangle", {
			label: { text: "" },
			subtype: "activation"
		});
		(() => {
			let n = e.getAttribute("fill"), r = e.getAttribute("stroke"), i = e.getAttribute("stroke-width"), a = e.getAttribute("stroke-dasharray");
			n && n !== "none" && (t.bgColor = Y(n)), r && r !== "none" && (t.strokeColor = Y(r)), i && (t.strokeWidth = Number(i)), a && a.trim() && (t.strokeStyle = "dashed");
		})(), n.push(t);
	}), n;
}, sc = (e, t) => {
	let n = Array.from(t.querySelectorAll(".loopLine")), r = [], i = [], a = [];
	n.forEach((e) => {
		let t = Zs(e, Number(e.getAttribute("x1")), Number(e.getAttribute("y1")), Number(e.getAttribute("x2")), Number(e.getAttribute("y2")));
		t.strokeStyle = "dotted", t.strokeColor = "#adb5bd", t.strokeWidth = 2, r.push(t);
	});
	let o = Array.from(t.querySelectorAll(".loopText")), s = e.filter((e) => e.type === $.CRITICAL_START).map((e) => e.message);
	o.forEach((e) => {
		let t = e.textContent || "", n = Xs(e, t), r = t.match(/\[(.*?)\]/)?.[1] || "";
		s.includes(r) && (n.x += 16), i.push(n);
	});
	let c = Array.from(t?.querySelectorAll(".labelBox")), l = Array.from(t?.querySelectorAll(".labelText"));
	return c.forEach((e, t) => {
		let n = Q(e, "rectangle", { label: { text: l[t]?.textContent || "" } });
		n.strokeColor = "#adb5bd", n.bgColor = "#e9ecef", n.width = void 0, a.push(n);
	}), {
		lines: r,
		texts: i,
		nodes: a
	};
}, cc = (e) => {
	let t = Array.from(e.querySelectorAll(".rect")).filter((e) => e.parentElement?.tagName !== "g"), n = [];
	return t.forEach((e) => {
		let t = Q(e, "rectangle", {
			label: { text: "" },
			subtype: "highlight"
		});
		n.push(t);
	}), n;
}, lc = (e, t) => {
	let n = e.db, r = [], i = n.getBoxes().map((e) => ({
		...e,
		fill: Y(e.fill || "")
	})), a = cc(t), { nodes: o, lines: s, actorMap: c } = rc(n.getActors(), t), l = n.getMessages(), u = ic(l, t, c), d = ac(l, t), f = oc(t), p = sc(l, t);
	return r.push(a), r.push(...o), r.push(d), r.push(f), {
		type: "sequence",
		lines: s,
		arrows: u,
		nodes: r,
		loops: p,
		groups: i
	};
}, uc = (e) => {
	let t = {};
	return e && e.forEach((e) => {
		X(e).forEach(({ property: e, value: n }) => {
			e && n && (t[e] = Y(n));
		});
	}), t;
}, dc = {
	AGGREGATION: 0,
	EXTENSION: 1,
	COMPOSITION: 2,
	DEPENDENCY: 3,
	LOLLIPOP: 4
}, fc = {
	LINE: 0,
	DOTTED_LINE: 1
}, pc = 16, mc = (e) => {
	let t;
	switch (e) {
		case fc.LINE:
			t = "solid";
			break;
		case fc.DOTTED_LINE:
			t = "dotted";
			break;
		default: t = "solid";
	}
	return t;
}, hc = (e) => {
	let t;
	switch (e) {
		case dc.AGGREGATION:
			t = "diamond_outline";
			break;
		case dc.COMPOSITION:
			t = "diamond";
			break;
		case dc.EXTENSION:
			t = "triangle_outline";
			break;
		case "none":
			t = null;
			break;
		case dc.DEPENDENCY:
		default: t = "arrow";
	}
	return t;
}, gc = (e, t) => {
	let n = 0, r = 0, i = e;
	for (; i && i !== t;) {
		let { transformX: e, transformY: t } = Nt(i);
		n += e, r += t, i = i.parentElement;
	}
	return {
		tx: n,
		ty: r
	};
}, _c = /* @__PURE__ */ new Set([
	"triangle_outline",
	"diamond",
	"diamond_outline"
]), vc = (e, t = .5) => {
	if (e.length <= 2) return [...e];
	let n = [e[0]];
	for (let r = 1; r < e.length - 1; r++) {
		let i = n[n.length - 1], a = e[r], o = e[r + 1], s = o.x - i.x, c = o.y - i.y, l = Math.hypot(s, c);
		if (!l) continue;
		let u = Math.abs(s * (a.y - i.y) - c * (a.x - i.x)) / l, d = ((a.x - i.x) * s + (a.y - i.y) * c) / (l * l);
		u <= t && d >= -t && d <= 1 + t || n.push(a);
	}
	return n.push(e[e.length - 1]), n;
}, yc = (e) => {
	let t = Lt(zt(e).map((e) => [e.x, e.y])).map(([e, t]) => ({
		x: e,
		y: t
	})), n = Rt(e);
	return n && t.length >= 2 && (t[0] = {
		x: n.startX,
		y: n.startY
	}, t[t.length - 1] = {
		x: n.endX,
		y: n.endY
	}), vc(t);
}, bc = (e, t, n) => {
	let r = e.x - t.x, i = e.y - t.y, a = Math.hypot(r, i);
	return a ? {
		x: e.x + r / a * n,
		y: e.y + i / a * n
	} : e;
}, xc = (e, t) => {
	let n = Lt(t.map((e) => [e.x, e.y])).map(([e, t]) => ({
		x: e,
		y: t
	}));
	if (n.length < 2) throw Error("Arrow route must contain at least two points");
	let r = n[0], i = n[n.length - 1];
	e.startX = r.x, e.startY = r.y, e.endX = i.x, e.endY = i.y, e.points = n.map((e) => [e.x - r.x, e.y - r.y]);
}, Sc = (e) => {
	let t = e.points?.map(([t, n]) => ({
		x: e.startX + t,
		y: e.startY + n
	})).filter((e) => Number.isFinite(e.x) && Number.isFinite(e.y));
	if (!t || t.length < 2) return e;
	let n = [...t], r = !!e.startArrowhead && _c.has(e.startArrowhead), i = !!e.endArrowhead && _c.has(e.endArrowhead);
	if (!r && !i) return e;
	if (r && (n[0] = bc(n[0], n[1], pc)), i) {
		let e = n.length - 1;
		n[e] = bc(n[e], n[e - 1], pc);
	}
	return xc(e, n), e;
}, Cc = (e, t) => {
	let n = Y(e.getAttribute("stroke") || getComputedStyle(e).stroke || ""), r = parseFloat(e.getAttribute("stroke-width") || getComputedStyle(e).strokeWidth || "1");
	Z(n) && n !== "none" && (t.strokeColor = n), Number.isFinite(r) && r > 0 && (t.strokeWidth = r);
}, wc = (e) => {
	let t = [];
	return e.forEach((e) => {
		yc(e).forEach((e) => {
			let n = t[t.length - 1];
			n && n.x === e.x && n.y === e.y || t.push(e);
		});
	}), vc(t);
}, Tc = (e, t, n) => {
	if (e.length < 2) throw Error(`Class diagram edge ${t?.id || "<unknown>"} is missing usable path points`);
	let r = e[0], i = e[e.length - 1], a = Js(r.x, r.y, i.x, i.y, {
		id: t?.getAttribute("data-id") || t?.id || void 0,
		...n,
		points: e.map((e) => [e.x - r.x, e.y - r.y])
	});
	return t && Cc(t, a), Sc(a);
}, Ec = (e, t) => Tc(wc(e), e[0], t), Dc = (e, t) => {
	let n = yc(e);
	return Tc([n[0], n[n.length - 1]], e, t);
}, Oc = (e, t) => Ec([e], t), kc = (e, t) => [
	`${e}-cyclic-special-1`,
	`${e}-cyclic-special-mid`,
	`${e}-cyclic-special-2`
].map((e) => t.querySelector(`path[id="${e}"][data-edge="true"]`)).filter((e) => e !== null), Ac = (e) => e.points?.map(([t, n]) => ({
	x: e.startX + t,
	y: e.startY + n
})).filter((e) => Number.isFinite(e.x) && Number.isFinite(e.y)) || [], jc = (e, t) => {
	let n = Ac(e);
	if (n.length < 2) return null;
	let r = t === "start", i = r ? n[0] : n[n.length - 1], a = r ? n[1] : n[n.length - 2], o = a.x === i.x ? r ? -1 : 1 : Math.sign(a.x - i.x), s = a.y === i.y ? 1 : Math.sign(a.y - i.y);
	return {
		x: i.x + o * 20,
		y: i.y + (s >= 0 ? 12 : -28)
	};
}, Mc = (e, t) => {
	let n = e;
	for (; n && n !== t;) {
		if (n.classList.contains("annotation-group") || n.classList.contains("label-group")) return "header";
		if (n.classList.contains("members-group")) return "members";
		if (n.classList.contains("methods-group")) return "methods";
		n = n.parentElement;
	}
	return "other";
}, Nc = (e, t, n) => {
	let r = [], i = [], a = [];
	return Object.values(e).forEach((e) => {
		let { domId: o, id: s } = e, c = z(), l = uc(e.styles || e.cssStyles), u;
		try {
			u = n ? n(s) : void 0;
		} catch {
			u = void 0;
		}
		let d = u && t.querySelector(`#${u}`) || t.querySelector(`#${o}`) || t.querySelector(`[data-id='${s}']`) || ((e) => {
			let n = RegExp(`^classId-${e}(?:-|$)`);
			return Array.from(t.querySelectorAll("[id]")).filter((e) => n.test(e.id))[0];
		})(s);
		if (!d) throw Error(`DOM Node with id ${o} not found`);
		let f = d.querySelector("rect") || d, p = f.getBBox(), { tx: m, ty: h } = gc(f, t), g = {
			type: "rectangle",
			id: s,
			groupId: c,
			x: p.x + m,
			y: p.y + h,
			width: p.width,
			height: p.height,
			metadata: { classId: s }
		}, _ = f.getAttribute("fill"), v = f.getAttribute("stroke"), y = f.getAttribute("stroke-width"), b = f.getAttribute("stroke-dasharray"), x = getComputedStyle(f), S = Y(_ || l.fill || (_ ? x.fill : "")), C = Y(v || l.stroke || (v ? x.stroke : "")), w = y || l["stroke-width"] || (y ? x.strokeWidth : ""), T = b || l["stroke-dasharray"] || (b ? x.strokeDasharray === "none" ? "" : x.strokeDasharray : ""), E = (e) => {
			if (!e || !Z(e)) return !1;
			let t = e.toLowerCase();
			return t !== "none" && t !== "transparent" && t !== "rgba(0, 0, 0, 0)" && t !== "black" && t !== "#000" && t !== "#000000" && t !== "rgb(0, 0, 0)" && t !== "rgba(0, 0, 0, 1)";
		};
		g.bgColor = E(S) ? S : void 0, g.strokeColor = E(C) ? C : void 0, g.strokeWidth = w ? Number(w) : void 0, g.strokeStyle = T && T.trim().length > 0 ? "dashed" : void 0, r.push(g), [...Array.from(d.querySelectorAll("line")), ...Array.from(d.querySelectorAll("g.divider path"))].forEach((e) => {
			let { tx: n, ty: r } = gc(e, t), a, o, l, u;
			if (e.tagName.toLowerCase() === "line") a = Number(e.getAttribute("x1")) + n, o = Number(e.getAttribute("y1")) + r, l = Number(e.getAttribute("x2")) + n, u = Number(e.getAttribute("y2")) + r;
			else {
				let t = e.getBBox();
				a = t.x + n, l = t.x + t.width + n;
				let i = t.y + t.height / 2 + r;
				o = i, u = i;
			}
			if (a === l && o === u) return;
			let d = Zs(e, a, o, l, u, {
				groupId: c,
				id: z()
			});
			d.strokeColor = g.strokeColor ? g.strokeColor : void 0, d.strokeWidth = g.strokeWidth === void 0 ? void 0 : g.strokeWidth, d.strokeStyle = g.strokeStyle ? g.strokeStyle : void 0, d.metadata = { classId: s }, i.push(d);
		});
		let D = Array.from(d.querySelectorAll("text, foreignObject")), O = [];
		D.forEach((e) => {
			let n = e.tagName.toLowerCase() === "foreignobject", r = n ? [] : Array.from(e.querySelectorAll("tspan")), i = r.length ? r.map((e) => e.textContent?.trim()).filter(Boolean).join("\n") : e.textContent?.trim() || "";
			if (!i) return;
			let a = e.getBBox(), { ty: o } = gc(e, t), s = parseFloat(getComputedStyle(e).fontSize || "");
			if (n && (!Number.isFinite(s) || !s)) {
				let t = e.querySelector("div, span, p");
				t && (s = parseFloat(getComputedStyle(t).fontSize || ""));
			}
			(!Number.isFinite(s) || s <= 0) && (s = Math.max(12, a.height * .6)), s *= .9;
			let c = Ps(e, l.color);
			O.push({
				section: Mc(e, d),
				text: B(i),
				x: a.x,
				y: a.y + o,
				width: g && g.width ? Math.max(g.width - 8, a.width) : a.width,
				height: a.height,
				fontSize: s,
				color: c
			});
		});
		let k = O.filter((e) => e.section === "header").sort((e, t) => e.y - t.y || e.x - t.x);
		if (!g.label) {
			let e = k.length === 0 && O.length === 1 ? O : k;
			e.length > 0 && (g.label = {
				text: e.map((e) => e.text).join("\n"),
				fontSize: Math.max(...e.map((e) => e.fontSize)),
				color: e.find((e) => e.color)?.color,
				verticalAlign: "top"
			});
		}
		O.filter((e) => k.length > 0 ? e.section !== "header" : !(g.label && O.length === 1)).forEach((e) => {
			let t = Ys((g?.x || 0) + 4, e.y, e.text, {
				width: e.width,
				height: e.height,
				fontSize: e.fontSize,
				color: e.color,
				id: z(),
				groupId: c,
				metadata: { classId: s }
			});
			a.push(t);
		});
	}), {
		nodes: r,
		lines: i,
		text: a
	};
}, Pc = (e, t, n, r) => {
	let i = Array.from(n.querySelectorAll(".edgePaths path[data-edge=\"true\"]:not([id^=\"edgeNote\"]):not([id*=\"-cyclic-special-\"])"));
	if (e.length === 0) return {
		arrows: [],
		text: []
	};
	let a = [], o = [], s = 0;
	return e.forEach((e) => {
		let { id1: c, id2: l, relation: u } = e, d = t.find((e) => e.id === c), f = t.find((e) => e.id === l);
		if (!d) throw Error(`parseRelations: Cannot find node with id ${c}`);
		if (!f) throw Error(`parseRelations: Cannot find node with id ${l}`);
		let p = mc(u.lineType), m = hc(u.type1), h = hc(u.type2), g;
		if (c === l) {
			let t = kc(c, n);
			if (!t.length) throw Error(`parseRelations: Cannot find rendered SVG edge for relation ${c} -> ${l}`);
			g = Ec(t, {
				strokeStyle: p,
				startArrowhead: m,
				endArrowhead: h,
				label: e.title ? { text: e.title } : void 0,
				start: {
					type: "rectangle",
					id: d.id
				},
				end: {
					type: "rectangle",
					id: f.id
				}
			});
		} else {
			let t = i[s];
			if (!t) throw Error(`parseRelations: Cannot find rendered SVG edge for relation ${c} -> ${l}`);
			s += 1, g = Dc(t, {
				strokeStyle: p,
				startArrowhead: m,
				endArrowhead: h,
				label: e.title ? { text: e.title } : void 0,
				start: {
					type: "rectangle",
					id: d.id
				},
				end: {
					type: "rectangle",
					id: f.id
				}
			});
		}
		a.push(g);
		let { relationTitle1: _, relationTitle2: v } = e, y = c === l, b, x;
		if (_ && _ !== "none") {
			if (y) {
				let e = jc(g, "start");
				e && (b = e.x, x = e.y);
			} else switch (r) {
				case "TB":
					b = g.startX - 20, g.endX < g.startX && (b -= 15), x = g.startY + 15;
					break;
				case "BT":
					b = g.startX + 20, g.endX > g.startX && (b += 15), x = g.startY - 15;
					break;
				case "LR":
					b = g.startX + 20, x = g.startY + 15, g.endY > g.startY && (x += 15);
					break;
				case "RL":
					b = g.startX - 20, x = g.startY - 15, g.startY > g.endY && (x -= 15);
					break;
				default: b = g.startX - 20, x = g.startY + 15;
			}
			b ??= g.startX - 20, x ??= g.startY + 15;
			let e = Ys(b, x, _, { fontSize: 16 });
			o.push(e);
		}
		if (v && v !== "none") {
			if (y) {
				let e = jc(g, "end");
				e && (b = e.x, x = e.y);
			} else switch (r) {
				case "TB":
					b = g.endX + 20, g.endX < g.startX && (b += 15), x = g.endY - 15;
					break;
				case "BT":
					b = g.endX - 20, g.endX > g.startX && (b -= 15), x = g.endY + 15;
					break;
				case "LR":
					b = g.endX - 20, x = g.endY - 15, g.endY > g.startY && (x -= 15);
					break;
				case "RL":
					b = g.endX + 20, x = g.endY + 15, g.startY > g.endY && (x += 15);
					break;
				default: b = g.endX + 20, x = g.endY - 15;
			}
			b ??= g.endX + 20, x ??= g.endY + 15;
			let e = Ys(b, x, v, { fontSize: 16 });
			o.push(e);
		}
	}), {
		arrows: a,
		text: o
	};
}, Fc = (e, t, n) => {
	let r = [], i = [];
	return e.forEach((e, a) => {
		let { id: o, text: s, class: c } = e, l = t.querySelector(`#${o}`);
		if (!l) throw Error(`Node with id ${o} not found!`);
		let { transformX: u, transformY: d } = Nt(l), f = l.firstChild, p = Q(f, "rectangle", {
			id: o,
			subtype: "note",
			label: { text: s }
		});
		if (Object.assign(p, {
			x: p.x + u,
			y: p.y + d
		}), r.push(p), c) {
			let e = n.find((e) => e.id === c);
			if (!e) throw Error(`class node with id ${c} not found!`);
			let r = t.querySelector(`path[id="edgeNote${a + 1}"][data-edge="true"]`);
			if (r) {
				i.push(Oc(r, {
					strokeStyle: "dotted",
					startArrowhead: null,
					endArrowhead: null,
					start: {
						id: p.id,
						type: "rectangle"
					},
					end: {
						id: e.id,
						type: "rectangle"
					}
				}));
				return;
			}
			let o = p.x + (p.width || 0) / 2, s = p.y + (p.height || 0), l = o, u = e.y, d = Js(o, s, l, u, {
				strokeStyle: "dotted",
				startArrowhead: null,
				endArrowhead: null,
				start: {
					id: p.id,
					type: "rectangle"
				},
				end: {
					id: e.id,
					type: "rectangle"
				}
			});
			i.push(d);
		}
	}), {
		notes: r,
		connectors: i
	};
}, Ic = (e, t) => {
	let n = e.db, r = n.getDirection?.() || "TB", i = [], a = [], o = [], s = [], c = n.getNamespaces?.() || [], l = n.getClasses?.() || {}, u = l instanceof Map ? Object.fromEntries(l) : l;
	if (u && Object.keys(u).length) {
		let e = Nc(u, t, typeof n.lookUpDomId == "function" ? n.lookUpDomId.bind(n) : void 0);
		i.push(e.nodes), a.push(...e.lines), o.push(...e.text), s.push(...e.nodes);
	}
	let { arrows: d, text: f } = Pc(n.getRelations?.() || [], s, t, r), { notes: p, connectors: m } = Fc(n.getNotes?.() || [], t, s);
	return i.push(p), d.push(...m), o.push(...f), {
		type: "class",
		nodes: i,
		lines: a,
		arrows: d,
		text: o,
		namespaces: c
	};
}, Lc = 18, Rc = (e) => {
	let t = {};
	return e && e.forEach((e) => {
		X(e).forEach(({ property: e, value: n }) => {
			e && n && (t[e] = Y(n));
		});
	}), t;
}, zc = (e) => {
	if (e == null || e === "") return;
	let t = typeof e == "number" ? e : parseFloat(Y(e));
	if (!(!Number.isFinite(t) || t <= 0)) return t;
}, Bc = (e, t) => {
	let n = 0, r = 0, i = e;
	for (; i && i !== t;) {
		let { transformX: e, transformY: t } = Nt(i);
		n += e, r += t, i = i.parentElement;
	}
	return {
		tx: n,
		ty: r
	};
}, Vc = (e) => {
	let t = Array.from(e.querySelectorAll("tspan"));
	return B(t.length ? t.map((e) => e.textContent?.trim()).filter(Boolean).join("\n") : e.textContent?.trim() || "");
}, Hc = (e) => {
	let t = e.querySelector("text, foreignObject, div, span, p") || e, n = parseFloat(getComputedStyle(t).fontSize || "");
	return (!Number.isFinite(n) || n <= 0) && (n = Math.max(12, e.getBBox().height * .75)), n;
}, Uc = (e, t, n) => {
	let r = Vc(e);
	if (!r) return null;
	let i = e.getBBox(), { tx: a, ty: o } = Bc(e, t);
	return {
		className: e.getAttribute("class") || "",
		text: r,
		x: i.x + a,
		y: i.y + o,
		width: i.width,
		height: i.height,
		fontSize: Hc(e),
		color: Ps(e, n)
	};
}, Wc = (e, t, n, r, i, a, o) => {
	let { tx: s, ty: c } = Bc(e, t), l = 0, u = 0, d = 0, f = 0;
	if (e.tagName.toLowerCase() === "line") l = Number(e.getAttribute("x1")) + s, u = Number(e.getAttribute("y1")) + c, d = Number(e.getAttribute("x2")) + s, f = Number(e.getAttribute("y2")) + c;
	else {
		let t = Rt(e);
		if (!t) return null;
		l = t.startX + s, u = t.startY + c, d = t.endX + s, f = t.endY + c;
	}
	let p = {
		type: "line",
		id: z(),
		groupId: n,
		startX: l,
		startY: u,
		endX: d,
		endY: f,
		metadata: { entityId: r }
	};
	return i && Z(i) && i !== "none" && (p.strokeColor = i), a !== void 0 && (p.strokeWidth = a), o && (p.strokeStyle = o), p;
}, Gc = (e) => {
	switch (e?.toLowerCase()) {
		case "one": return "cardinality_one";
		case "many": return "cardinality_many";
		case "only_one": return "cardinality_exactly_one";
		case "one_or_more": return "cardinality_one_or_many";
		case "zero_or_one": return "cardinality_zero_or_one";
		case "zero_or_more": return "cardinality_zero_or_many";
		default: return null;
	}
}, Kc = (e) => {
	switch (e) {
		case "dotted": return "dotted";
		case "dashed": return "dashed";
		default: return "solid";
	}
}, qc = (e, t) => {
	let n = t.querySelector(`path[id="${e.id}"][data-edge="true"]`);
	return n ? [n] : e.start === e.end ? [
		`${e.start}-cyclic-special-1`,
		`${e.start}-cyclic-special-mid`,
		`${e.start}-cyclic-special-2`
	].map((e) => t.querySelector(`path[id="${e}"][data-edge="true"]`)).filter((e) => e !== null) : [];
}, Jc = (e) => {
	let t = [];
	return e.forEach((e) => {
		zt(e).forEach((e) => {
			let n = t[t.length - 1];
			n && n.x === e.x && n.y === e.y || t.push(e);
		});
	}), t;
}, Yc = (e, t) => {
	let n = t.querySelector(`[id="${e.id}"]`);
	if (!n) throw Error(`ER entity ${e.id} not found in rendered SVG`);
	let r = e.attributes.length ? z() : void 0, i = n.getBBox(), { tx: a, ty: o } = Bc(n, t), s = Rc([...e.cssStyles || [], ...e.cssCompiledStyles || []]), c = Y(s.fill || ""), l = Y(s.stroke || ""), u = zc(s["stroke-width"]), d = Y(s["stroke-dasharray"] || ""), f = Array.from(n.querySelectorAll("g.label")).map((e) => Uc(e, t, s.color)).filter((e) => e !== null), p = f.find((e) => e.className.includes("name")) || f[0], m = f.filter((e) => e !== p), h = p?.text || B(e.alias || e.label || ""), g = {
		type: "rectangle",
		id: e.id,
		groupId: r,
		x: i.x + a,
		y: i.y + o,
		width: i.width,
		height: i.height,
		label: {
			text: h,
			fontSize: e.attributes.length ? Lc : p?.fontSize || 16,
			color: p?.color,
			textAlign: "center",
			verticalAlign: e.attributes.length ? "top" : "middle"
		},
		metadata: {
			entityId: e.id,
			entityLabel: e.label,
			entityAlias: e.alias
		}
	};
	return Z(c) && c !== "none" && (g.bgColor = c), Z(l) && l !== "none" && (g.strokeColor = l), u && Number.isFinite(u) && u > 0 && (g.strokeWidth = u), d && d !== "none" && (g.strokeStyle = "dashed"), {
		container: g,
		lines: Array.from(n.querySelectorAll(".divider path, path.divider, line.divider")).map((n) => Wc(n, t, r, e.id, g.strokeColor, g.strokeWidth, g.strokeStyle)).filter((e) => e !== null),
		text: m.map((t) => Ys(t.x, t.y, t.text, {
			id: z(),
			groupId: r,
			width: t.width,
			height: t.height,
			fontSize: Lc,
			color: t.color,
			metadata: { entityId: e.id }
		}))
	};
}, Xc = (e, t) => {
	let n = qc(e, t);
	if (!n.length) throw Error(`ER relationship ${e.id} not found in rendered SVG`);
	let r = Jc(n);
	if (r.length < 2) throw Error(`ER relationship ${e.id} is missing usable path points`);
	let i = r[0], a = r[r.length - 1], o = n[0], s = Y(o.getAttribute("stroke") || getComputedStyle(o).stroke || ""), c = Number(o.getAttribute("stroke-width") || getComputedStyle(o).strokeWidth || 1), l = Js(i.x, i.y, a.x, a.y, {
		id: e.id,
		label: e.label ? {
			text: B(e.label),
			fontSize: 16,
			textAlign: "center"
		} : void 0,
		strokeStyle: Kc(e.pattern),
		startArrowhead: Gc(e.arrowTypeStart),
		endArrowhead: Gc(e.arrowTypeEnd),
		start: {
			type: "rectangle",
			id: e.start
		},
		end: {
			type: "rectangle",
			id: e.end
		},
		points: r.map((e) => [e.x - i.x, e.y - i.y])
	});
	return Z(s) && s !== "none" && (l.strokeColor = s), Number.isFinite(c) && c > 0 && (l.strokeWidth = c), l;
}, Zc = (e, t) => {
	let n = e.getData(), r = n.nodes, i = n.edges, a = [], o = [], s = [];
	r.forEach((e) => {
		let n = Yc(e, t);
		a.push(n.container), o.push(...n.lines), s.push(...n.text);
	});
	let c = i.map((e) => Xc(e, t));
	return {
		type: "erd",
		nodes: [a],
		lines: o,
		arrows: c,
		text: s
	};
}, Qc = (e) => {
	let t = Y(e || "");
	return !t || t === "none" || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(0,0,0,0)" ? !1 : Z(t);
}, $c = (e, t, n) => {
	switch (t) {
		case R.FILL:
		case R.STROKE:
			Qc(n) && (e[t] = Y(n));
			break;
		case R.STROKE_WIDTH:
		case R.STROKE_DASHARRAY: Y(n) && (e[t] = Y(n));
	}
}, el = (e, t, n) => {
	t === L.COLOR && Qc(n) && (e[L.COLOR] = Y(n));
}, tl = (e, t, n) => {
	e && X(e).forEach(({ property: e, value: r }) => {
		$c(t, e, r), el(n, e, r);
	});
}, nl = (e, t) => {
	e && X(e).forEach(({ property: e, value: n }) => {
		e === R.FILL && Qc(n) ? t[L.COLOR] = Y(n) : el(t, e, n);
	});
}, rl = (e) => {
	let t = /* @__PURE__ */ new Set();
	return e.filter(Boolean).forEach((e) => {
		X(e || "").forEach(({ property: e }) => {
			t.add(e);
		});
	}), t;
}, il = (e, t, n) => {
	e && [
		[R.FILL, e.getAttribute("fill")],
		[R.STROKE, e.getAttribute("stroke")],
		[R.STROKE_WIDTH, e.getAttribute("stroke-width")],
		[R.STROKE_DASHARRAY, e.getAttribute("stroke-dasharray")]
	].forEach(([e, r]) => {
		if (!n.has(e) || t[e]) return;
		let i = Y(r || "");
		i && $c(t, e, i);
	});
}, al = (e, t, n) => {
	if (!e) return;
	let r = [e, ...Array.from(e.querySelectorAll("text, foreignObject, div, span, p"))];
	for (let e of r) {
		if (t[L.COLOR] || (n.has(L.COLOR) || n.has(R.FILL)) && (nl(e.getAttribute("style"), t), t[L.COLOR])) break;
		let r = Y(e.getAttribute("fill") || e.getAttribute("color") || "");
		(n.has(L.COLOR) || n.has(R.FILL)) && Qc(r) && (t[L.COLOR] = r);
	}
}, ol = (e, t) => {
	let n = 0, r = 0, i = e;
	for (; i && i !== t;) {
		let { transformX: e, transformY: t } = Nt(i);
		n += e, r += t, i = i.parentElement;
	}
	return {
		tx: n,
		ty: r
	};
}, sl = (e, t) => {
	let n = e.getBBox(), { tx: r, ty: i } = ol(e, t);
	return {
		x: n.x + r,
		y: n.y + i,
		width: n.width,
		height: n.height
	};
}, cl = (e, t) => {
	let n = e.querySelector("line.divider");
	if (!n) return;
	let { tx: r, ty: i } = ol(n, t);
	return {
		startX: Number(n.getAttribute("x1")) + r,
		startY: Number(n.getAttribute("y1")) + i,
		endX: Number(n.getAttribute("x2")) + r,
		endY: Number(n.getAttribute("y2")) + i
	};
}, ll = (e) => {
	let t = e.getBBox();
	return Math.abs(t.width * t.height);
}, ul = (e, t) => {
	let n = e.getAttribute("style");
	if (!n) return;
	let r = X(n).find((e) => e.property === t);
	if (r) return Y(r.value);
}, dl = (e, t) => {
	let n = e.map((e) => ({
		element: e,
		area: ll(e)
	})).filter(({ area: e }) => Number.isFinite(e) && e > 0);
	return n.length === 0 ? null : n.sort((e, n) => t === "largest" ? n.area - e.area : e.area - n.area)[0].element;
}, fl = (e, t) => {
	if (!e || !t.has(R.FILL) && !t.has(R.STROKE)) return;
	let n = Y(e.getAttribute("fill") || ul(e, R.FILL) || ""), r = Y(e.getAttribute("stroke") || ul(e, R.STROKE) || "");
	if (Qc(n)) return n;
	if (Qc(r)) return r;
}, pl = (e, t) => fl(dl(Array.from(e.querySelectorAll("circle, ellipse, path")), "smallest"), t), ml = (e) => {
	if (e.length < 2) return e;
	let t = e.slice(1), n = t.filter((e) => e.trim().length > 0).reduce((e, t) => {
		let n = t.match(/^\s*/)?.[0].length ?? 0;
		return Math.min(e, n);
	}, Infinity);
	return !Number.isFinite(n) || n <= 0 ? e.map((e) => e.trimEnd()) : [e[0].trimEnd(), ...t.map((e) => e.replace(RegExp(`^\\s{0,${n}}`), "").trimEnd())];
}, hl = (e) => ml(Array.isArray(e.label) ? e.label.map((e) => B(e)) : B(e.label || "").split("\n")).join("\n"), gl = (e) => e.description ? (Array.isArray(e.description) ? e.description : [e.description]).map((e) => B(e)).filter((e) => e.length > 0) : [], _l = (e) => {
	let t = /* @__PURE__ */ new Set(), n = (e) => (e && t.add(e), e), r = (e) => {
		let r = e.find((e) => !t.has(e));
		return n(r || null);
	};
	return (t) => {
		let i = [
			`[id='${t.domId}']`,
			`[id='${t.id}']`,
			`[data-id='${t.id}']`
		];
		for (let t of i) {
			let r = e.querySelector(t);
			if (r) return n(r);
		}
		switch (t.shape) {
			case "divider": return r(Array.from(e.querySelectorAll("g.statediagram-cluster-alt")));
			case "stateStart": return r(Array.from(e.querySelectorAll("g.node.default")).filter((e) => e.querySelector("circle.state-start")));
			case "stateEnd": return r(Array.from(e.querySelectorAll("g.node.default")).filter((e) => !e.querySelector("circle.state-start")));
			default: return null;
		}
	};
}, vl = (e, t) => {
	switch (t) {
		case "roundedWithTitle": return e.querySelector("rect.outer") || e.querySelector("rect") || e;
		case "divider": return e.querySelector("rect.divider") || e.querySelector("rect") || e;
		case "rectWithTitle": return e.querySelector("rect.outer") || e.querySelector("rect") || e;
		case "stateStart": return dl(Array.from(e.querySelectorAll("circle, ellipse, path")), "largest") || e;
		case "stateEnd": return dl(Array.from(e.querySelectorAll("circle, ellipse, path")), "largest") || e;
		default: return e.querySelector("rect, path, circle, ellipse, polygon") || e;
	}
}, yl = (e, t, n) => {
	let r = n(e);
	if (!r) throw Error(`State node element not found for "${e.id}"`);
	let i = vl(r, e.shape), a = {}, o = {}, s = [
		e.labelStyle,
		...e.cssCompiledStyles || [],
		...e.cssStyles || []
	], c = rl(s);
	s.filter(Boolean).forEach((e) => {
		tl(e, a, o);
	}), il(i, a, c), al(r, o, c);
	let l = sl(i, t);
	return {
		id: e.id,
		shape: e.shape,
		text: hl(e),
		description: gl(e),
		x: l.x,
		y: l.y,
		width: l.width,
		height: l.height,
		parentId: e.parentId,
		position: e.position,
		containerStyle: a,
		labelStyle: o,
		dividerLine: e.shape === "rectWithTitle" ? cl(r, t) : void 0,
		endInnerColor: e.shape === "stateEnd" ? pl(r, c) : void 0,
		isRenderable: e.shape !== "noteGroup"
	};
}, bl = (e, t) => {
	let n = t.querySelector(`[id='${e.id}']`);
	if (!n) return null;
	let { tx: r, ty: i } = ol(n, t), a = Bt(n, {
		x: r,
		y: i
	}, "MCL");
	if (a.reflectionPoints.length < 2) return null;
	let o = {}, s = (e, t) => {
		switch (e) {
			case R.STROKE:
				Qc(t) && (o.strokeColor = Y(t));
				break;
			case R.STROKE_WIDTH: {
				let e = parseFloat(Y(t));
				Number.isFinite(e) && e > 0 && (o.strokeWidth = e);
				break;
			}
			case R.STROKE_DASHARRAY: Y(t) && (o.strokeStyle = "dashed");
		}
	};
	[e.style].filter(Boolean).forEach((e) => {
		X(e || "").forEach(({ property: e, value: t }) => {
			s(e, t);
		});
	});
	let c = e.arrowhead === "none" || e.classes?.includes("note-edge");
	return {
		id: e.id,
		start: e.start,
		end: e.end,
		text: B(e.label || ""),
		...a,
		strokeColor: o.strokeColor,
		strokeWidth: o.strokeWidth,
		strokeStyle: c ? "dashed" : o.strokeStyle,
		isNoteEdge: c
	};
}, xl = (e, t) => {
	let { nodes: n, edges: r } = e.getData(), i = _l(t);
	return {
		type: "state",
		nodes: n.map((e) => yl(e, t, i)),
		edges: r.map((e) => bl(e, t)).filter((e) => e !== null)
	};
}, Sl = Promise.resolve(), Cl = (e) => {
	let t = Sl.then(e, e);
	return Sl = t.then(() => void 0, () => void 0), t;
}, wl = null, Tl = 0, El = (e) => JSON.stringify(e), Dl = (e) => {
	let t = e.querySelector("svg");
	if (!t) throw Error("SVG element not found");
	let n = t.getBoundingClientRect(), r = n.width, i = n.height;
	t.setAttribute("width", `${r}`), t.setAttribute("height", `${i}`);
	let a = unescape(encodeURIComponent(t.outerHTML));
	return {
		type: "graphImage",
		mimeType: "image/svg+xml",
		dataURL: `data:image/svg+xml;base64,${btoa(a)}`,
		width: r,
		height: i
	};
}, Ol = async (e, t = De) => Cl(async () => {
	let n = t.themeVariables?.fontSize ?? De.themeVariables.fontSize, r = {
		...De,
		...t,
		fontSize: n,
		themeVariables: {
			...De.themeVariables,
			...t.themeVariables,
			fontSize: n
		}
	}, i = El(r);
	i !== wl && (As.initialize(r), wl = i);
	let a = await As.mermaidAPI.getDiagramFromText(Pt(e)), o = `mermaid-to-excalidraw-${Tl++}`, s = document.createElement("div");
	s.setAttribute("style", "opacity: 0; position: fixed; z-index: -1; left: -99999px; top: -99999px;");
	let c = `${o}-container`;
	s.id = c, document.getElementById(c)?.remove(), document.body.appendChild(s);
	try {
		let { svg: t } = await As.render(o, e, s);
		s.innerHTML = t;
		let n;
		try {
			switch (a.type) {
				case "flowchart-v2":
				case "graph":
					n = Ks(a.db, s);
					break;
				case "sequence":
					n = lc(a, s);
					break;
				case "class":
				case "classDiagram":
					n = Ic(a, s);
					break;
				case "er":
					n = Zc(a.db, s);
					break;
				case "state":
				case "stateDiagram":
					n = xl(a.db, s);
					break;
				default: n = Dl(s);
			}
		} catch (e) {
			console.error("Error processing Mermaid diagram:", e), n = Dl(s);
		}
		return n;
	} finally {
		s.remove();
	}
}), kl = /* @__PURE__ */ e({ parseMermaidToExcalidraw: () => Al }), Al = async (e, t) => {
	let n = t || {}, r = parseInt(n.themeVariables?.fontSize ?? "") || 20;
	return Ht(await Ol(e, {
		...n,
		themeVariables: { ...n.themeVariables }
	}), { fontSize: r });
};
//#endregion
export { Zr as a, pn as c, Jt as d, un as f, Jr as i, Kt as l, li as n, sn as o, Ut as p, Al as parseMermaidToExcalidraw, ci as r, V as s, kl as t, an as u };
