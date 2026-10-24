import { o as __toESM } from "../_runtime.mjs";
import { t as API_BASE } from "./api-OZfBBcXI.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { $ as CircleCheck, A as Music, B as Globe, C as Plus, D as Pause, F as Lock, G as EyeOff, H as Flag, I as LoaderCircle, M as MicOff, N as MapPin, O as Paintbrush, P as LogOut, R as Heart, T as Pin, U as FastForward, V as Flame, W as Eye, X as Compass, Y as Copy, Z as Clock, _ as Send, a as UserCheck, at as AtSign, b as RefreshCw, d as Square, et as CircleAlert, h as Settings, i as Users, j as Mic, k as PaintBucket, l as Trash2, n as VolumeX, nt as Check, o as Undo2, ot as ArrowLeft, q as Eraser, r as Volume2, rt as Building2, s as Trophy, t as X, v as Search, w as Play, y as RotateCcw, z as Hand } from "../_libs/lucide-react.mjs";
import { t as lookup } from "../_libs/socket.io-client+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-meT7ZuZe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$10 = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/components/DrawPad.tsx";
function hexToRgba(hex) {
	let c = hex.replace("#", "");
	if (c.length === 3) c = c.split("").map((x) => x + x).join("");
	const num = parseInt(c, 16);
	return [
		num >> 16 & 255,
		num >> 8 & 255,
		num & 255,
		255
	];
}
function DrawPad({ onDone, onCancel }) {
	const canvasRef = (0, import_react.useRef)(null);
	const isDrawing = (0, import_react.useRef)(false);
	const currentStroke = (0, import_react.useRef)([]);
	const [activeTool, setActiveTool] = (0, import_react.useState)("pen");
	const [selectedColor, setSelectedColor] = (0, import_react.useState)("#234A91");
	const [selectedWidth, setSelectedWidth] = (0, import_react.useState)(3);
	const historyRef = (0, import_react.useRef)([]);
	const [canUndo, setCanUndo] = (0, import_react.useState)(false);
	const colors = [
		{
			label: "Blue Ink",
			value: "#234A91"
		},
		{
			label: "Pencil Lead",
			value: "#1E293B"
		},
		{
			label: "Red Pen",
			value: "#DC2626"
		},
		{
			label: "Marker Orange",
			value: "#EA580C"
		},
		{
			label: "Highlighter Yellow",
			value: "#FACC15"
		},
		{
			label: "Chalk Green",
			value: "#16A34A"
		},
		{
			label: "Purple Ink",
			value: "#7C3AED"
		},
		{
			label: "Clay Brown",
			value: "#854D0E"
		},
		{
			label: "White Eraser",
			value: "#FFFFFF"
		}
	];
	const saveSnapshot = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		try {
			const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
			historyRef.current.push(snap);
			if (historyRef.current.length > 25) historyRef.current.shift();
			setCanUndo(true);
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		const rect = canvas.getBoundingClientRect();
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.floor(rect.width * dpr);
		canvas.height = Math.floor(rect.height * dpr);
		ctx.scale(dpr, dpr);
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, rect.width, rect.height);
	}, []);
	const performFloodFill = (0, import_react.useCallback)((canvasX, canvasY) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const startX = Math.floor(canvasX * dpr);
		const startY = Math.floor(canvasY * dpr);
		const width = canvas.width;
		const height = canvas.height;
		if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;
		saveSnapshot();
		const imgData = ctx.getImageData(0, 0, width, height);
		const data = imgData.data;
		const startIndex = (startY * width + startX) * 4;
		const targetR = data[startIndex];
		const targetG = data[startIndex + 1];
		const targetB = data[startIndex + 2];
		const targetA = data[startIndex + 3];
		const [fillR, fillG, fillB, fillA] = hexToRgba(activeTool === "eraser" ? "#FFFFFF" : selectedColor);
		if (Math.abs(targetR - fillR) <= 8 && Math.abs(targetG - fillG) <= 8 && Math.abs(targetB - fillB) <= 8 && Math.abs(targetA - fillA) <= 8) return;
		const tolerance = 42;
		const matches = (idx) => {
			const dr = Math.abs(data[idx] - targetR);
			const dg = Math.abs(data[idx + 1] - targetG);
			const db = Math.abs(data[idx + 2] - targetB);
			const da = Math.abs(data[idx + 3] - targetA);
			return dr <= tolerance && dg <= tolerance && db <= tolerance && da <= tolerance;
		};
		const queueX = new Int32Array(width * height);
		const queueY = new Int32Array(width * height);
		let head = 0;
		let tail = 0;
		queueX[tail] = startX;
		queueY[tail] = startY;
		tail++;
		const visited = new Uint8Array(width * height);
		visited[startY * width + startX] = 1;
		while (head < tail) {
			const x = queueX[head];
			const y = queueY[head];
			head++;
			const idx = (y * width + x) * 4;
			data[idx] = fillR;
			data[idx + 1] = fillG;
			data[idx + 2] = fillB;
			data[idx + 3] = fillA;
			const neighbors = [
				[x + 1, y],
				[x - 1, y],
				[x, y + 1],
				[x, y - 1]
			];
			for (const [nx, ny] of neighbors) if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
				const pos = ny * width + nx;
				if (!visited[pos]) {
					visited[pos] = 1;
					if (matches(pos * 4)) {
						queueX[tail] = nx;
						queueY[tail] = ny;
						tail++;
					}
				}
			}
		}
		ctx.putImageData(imgData, 0, 0);
	}, [
		activeTool,
		selectedColor,
		saveSnapshot
	]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		const getPos = (e) => {
			const r = canvas.getBoundingClientRect();
			return {
				x: e.clientX - r.left,
				y: e.clientY - r.top
			};
		};
		const handleDown = (e) => {
			const pt = getPos(e);
			if (activeTool === "bucket") {
				performFloodFill(pt.x, pt.y);
				return;
			}
			saveSnapshot();
			isDrawing.current = true;
			canvas.setPointerCapture(e.pointerId);
			currentStroke.current = [pt];
			ctx.beginPath();
			ctx.strokeStyle = activeTool === "eraser" ? "#FFFFFF" : selectedColor;
			ctx.lineWidth = activeTool === "eraser" ? selectedWidth * 3 : selectedWidth;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.moveTo(pt.x, pt.y);
		};
		const handleMove = (e) => {
			if (!isDrawing.current || activeTool === "bucket") return;
			const pt = getPos(e);
			currentStroke.current.push(pt);
			ctx.lineTo(pt.x, pt.y);
			ctx.stroke();
		};
		const handleUp = () => {
			if (!isDrawing.current) return;
			isDrawing.current = false;
			currentStroke.current = [];
		};
		canvas.addEventListener("pointerdown", handleDown);
		canvas.addEventListener("pointermove", handleMove);
		canvas.addEventListener("pointerup", handleUp);
		canvas.addEventListener("pointercancel", handleUp);
		return () => {
			canvas.removeEventListener("pointerdown", handleDown);
			canvas.removeEventListener("pointermove", handleMove);
			canvas.removeEventListener("pointerup", handleUp);
			canvas.removeEventListener("pointercancel", handleUp);
		};
	}, [
		activeTool,
		selectedColor,
		selectedWidth,
		performFloodFill,
		saveSnapshot
	]);
	const handleUndo = () => {
		const canvas = canvasRef.current;
		if (!canvas || historyRef.current.length === 0) return;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		const previous = historyRef.current.pop();
		if (previous) ctx.putImageData(previous, 0, 0);
		setCanUndo(historyRef.current.length > 0);
	};
	const handleClear = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		saveSnapshot();
		const rect = canvas.getBoundingClientRect();
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, rect.width, rect.height);
	};
	const handleDone = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		try {
			const maxDim = 640;
			let targetW = canvas.width;
			let targetH = canvas.height;
			if (targetW > maxDim || targetH > maxDim) if (targetW > targetH) {
				targetH = Math.round(targetH * maxDim / targetW);
				targetW = maxDim;
			} else {
				targetW = Math.round(targetW * maxDim / targetH);
				targetH = maxDim;
			}
			const exportCanvas = document.createElement("canvas");
			exportCanvas.width = targetW;
			exportCanvas.height = targetH;
			const exportCtx = exportCanvas.getContext("2d");
			if (exportCtx) {
				exportCtx.fillStyle = "#FFFFFF";
				exportCtx.fillRect(0, 0, targetW, targetH);
				exportCtx.drawImage(canvas, 0, 0, targetW, targetH);
				let dataUrl = exportCanvas.toDataURL("image/webp", .72);
				if (!dataUrl.startsWith("data:image/webp")) dataUrl = exportCanvas.toDataURL("image/jpeg", .72);
				onDone(dataUrl);
				return;
			}
		} catch {}
		onDone(canvas.toDataURL("image/jpeg", .72));
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-2.5 sm:space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 bg-muted/40 p-2 rounded-md border border-foreground/20 font-hand text-xs sm:text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setActiveTool("pen"),
								className: `sketch flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all ${activeTool === "pen" ? "bg-accent text-accent-foreground shadow-xs" : "bg-white text-foreground hover:bg-secondary"}`,
								title: "Pen / Pencil Tool",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Paintbrush, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName$10,
									lineNumber: 348,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Pen" }, void 0, false, {
									fileName: _jsxFileName$10,
									lineNumber: 349,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$10,
								lineNumber: 338,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setActiveTool("bucket"),
								className: `sketch flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all ${activeTool === "bucket" ? "bg-accent text-accent-foreground shadow-xs" : "bg-white text-foreground hover:bg-secondary"}`,
								title: "Paint Bucket / Flood Fill",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PaintBucket, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName$10,
									lineNumber: 362,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Fill 🪣" }, void 0, false, {
									fileName: _jsxFileName$10,
									lineNumber: 363,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$10,
								lineNumber: 352,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setActiveTool("eraser"),
								className: `sketch flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all ${activeTool === "eraser" ? "bg-accent text-accent-foreground shadow-xs" : "bg-white text-foreground hover:bg-secondary"}`,
								title: "Eraser Tool",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eraser, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName$10,
									lineNumber: 376,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Eraser" }, void 0, false, {
									fileName: _jsxFileName$10,
									lineNumber: 377,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$10,
								lineNumber: 366,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$10,
						lineNumber: 337,
						columnNumber: 9
					}, this),
					activeTool !== "bucket" && /* @__PURE__ */ (void 0)("div", {
						className: "flex items-center gap-1 px-1",
						children: [/* @__PURE__ */ (void 0)("span", {
							className: "text-[10px] font-bold text-muted-foreground hidden sm:inline",
							children: "SIZE:"
						}, void 0, false, {
							fileName: _jsxFileName$10,
							lineNumber: 384,
							columnNumber: 13
						}, this), [
							2,
							4,
							8,
							14
						].map((w) => /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => setSelectedWidth(w),
							className: `flex h-6 w-6 items-center justify-center rounded border transition-transform ${selectedWidth === w ? "bg-accent text-accent-foreground font-bold scale-110 shadow-xs" : "bg-white hover:bg-secondary"}`,
							title: `Stroke width ${w}px`,
							children: /* @__PURE__ */ (void 0)("span", {
								className: "rounded-full bg-foreground",
								style: {
									width: `${Math.min(w * 1.3, 14)}px`,
									height: `${Math.min(w * 1.3, 14)}px`
								}
							}, void 0, false, {
								fileName: _jsxFileName$10,
								lineNumber: 395,
								columnNumber: 17
							}, this)
						}, w, false, {
							fileName: _jsxFileName$10,
							lineNumber: 386,
							columnNumber: 15
						}, this))]
					}, void 0, true, {
						fileName: _jsxFileName$10,
						lineNumber: 383,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-1.5 ml-auto",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: handleUndo,
							disabled: !canUndo,
							className: "sketch flex items-center gap-1 bg-white px-2.5 py-1 text-xs font-bold text-foreground hover:bg-secondary disabled:opacity-30",
							title: "Undo last stroke or fill",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Undo2, { className: "h-3 w-3" }, void 0, false, {
								fileName: _jsxFileName$10,
								lineNumber: 413,
								columnNumber: 13
							}, this), " Undo"]
						}, void 0, true, {
							fileName: _jsxFileName$10,
							lineNumber: 406,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: handleClear,
							className: "sketch flex items-center gap-1 bg-white px-2.5 py-1 text-xs font-bold text-destructive hover:bg-destructive/10",
							title: "Clear canvas",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3 w-3" }, void 0, false, {
								fileName: _jsxFileName$10,
								lineNumber: 421,
								columnNumber: 13
							}, this), " Clear"]
						}, void 0, true, {
							fileName: _jsxFileName$10,
							lineNumber: 415,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$10,
						lineNumber: 405,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$10,
				lineNumber: 335,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-2 overflow-x-auto py-1 scrollbar-none px-1",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-[11px] font-bold text-muted-foreground shrink-0 font-hand",
					children: "INK:"
				}, void 0, false, {
					fileName: _jsxFileName$10,
					lineNumber: 428,
					columnNumber: 9
				}, this), colors.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => {
						setSelectedColor(c.value);
						if (activeTool === "eraser") setActiveTool("pen");
					},
					className: `h-6 w-6 sm:h-7 sm:w-7 shrink-0 rounded-full border-2 transition-all ${selectedColor === c.value && activeTool !== "eraser" ? "scale-125 border-foreground shadow-sm ring-2 ring-accent" : "border-foreground/30 hover:scale-110"} ${c.value === "#FFFFFF" ? "border-dashed border-gray-400" : ""}`,
					style: { backgroundColor: c.value },
					title: c.label
				}, c.value, false, {
					fileName: _jsxFileName$10,
					lineNumber: 430,
					columnNumber: 11
				}, this))]
			}, void 0, true, {
				fileName: _jsxFileName$10,
				lineNumber: 427,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative rounded-md overflow-hidden border-2 border-foreground bg-white shadow-inner",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("canvas", {
					ref: canvasRef,
					className: "h-60 sm:h-72 md:h-80 w-full touch-none cursor-crosshair block",
					"aria-label": "Notebook Sketchpad"
				}, void 0, false, {
					fileName: _jsxFileName$10,
					lineNumber: 450,
					columnNumber: 9
				}, this), !canUndo && /* @__PURE__ */ (void 0)("div", {
					className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 text-sm sm:text-base font-hand gap-0.5 p-4 text-center",
					children: [/* @__PURE__ */ (void 0)("span", { children: "Draw or fill your clue here... ✏️🪣" }, void 0, false, {
						fileName: _jsxFileName$10,
						lineNumber: 457,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("span", {
						className: "text-[11px] font-sans opacity-70",
						children: activeTool === "bucket" ? "Click any enclosed space to fill color" : "Switch to Fill 🪣 to color entire areas"
					}, void 0, false, {
						fileName: _jsxFileName$10,
						lineNumber: 458,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$10,
					lineNumber: 456,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$10,
				lineNumber: 449,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center justify-between gap-3 pt-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: onCancel,
					className: "sketch flex items-center gap-1.5 bg-secondary px-3.5 py-1.5 text-xs sm:text-sm font-bold text-foreground hover:bg-secondary/80",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "h-3.5 w-3.5" }, void 0, false, {
						fileName: _jsxFileName$10,
						lineNumber: 472,
						columnNumber: 11
					}, this), " Back to Text"]
				}, void 0, true, {
					fileName: _jsxFileName$10,
					lineNumber: 467,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: handleDone,
					className: "sketch flex items-center gap-2 bg-accent px-5 sm:px-6 py-2 text-sm sm:text-base font-bold text-accent-foreground hover:brightness-110 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName$10,
						lineNumber: 480,
						columnNumber: 11
					}, this), " Submit Sketch 🎨"]
				}, void 0, true, {
					fileName: _jsxFileName$10,
					lineNumber: 475,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$10,
				lineNumber: 466,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$10,
		lineNumber: 333,
		columnNumber: 5
	}, this);
}
var _jsxFileName$9 = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/components/ChatPanel.tsx";
function ChatPanel({ messages, onSendMessage, phase, players, currentSocketId, hasSubmittedAnswer, onSubmitAnswer, submissionCount, totalEligible }) {
	const [inputText, setInputText] = (0, import_react.useState)("");
	const [selectedSuspect, setSelectedSuspect] = (0, import_react.useState)(null);
	const scrollRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	}, [messages]);
	const handleSend = (e) => {
		e.preventDefault();
		if (!inputText.trim()) return;
		onSendMessage(inputText.trim());
		setInputText("");
	};
	const handleSecretSubmit = () => {
		if (!selectedSuspect) return;
		onSubmitAnswer(selectedSuspect);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "sketch flex flex-col h-[400px] sm:h-[480px] w-full rounded-md bg-card/90 overflow-hidden border-2 border-foreground shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "bg-primary px-4 py-2 text-primary-foreground flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xl font-bold font-display tracking-wide",
						children: phase === "answer_submission" ? "Secret Guessing" : "Classroom Discussion"
					}, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 67,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$9,
					lineNumber: 66,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-xs bg-primary-foreground/20 px-2 py-0.5 rounded font-hand",
					children: phase === "answer_submission" ? `${submissionCount}/${totalEligible} Voted` : "Live Chat"
				}, void 0, false, {
					fileName: _jsxFileName$9,
					lineNumber: 71,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$9,
				lineNumber: 65,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				ref: scrollRef,
				className: "flex-1 overflow-y-auto p-4 space-y-2.5 font-hand text-base",
				children: messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-center text-muted-foreground/60 py-10",
					children: "No messages yet. Chat will be lively during discussion! 📝"
				}, void 0, false, {
					fileName: _jsxFileName$9,
					lineNumber: 81,
					columnNumber: 11
				}, this) : messages.map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: `flex flex-col ${m.isSystem ? "items-center my-1" : m.playerId === currentSocketId ? "items-end" : "items-start"}`,
					children: m.isSystem ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-full bg-secondary/80 px-3 py-1 text-xs text-foreground font-bold shadow-sm border border-line",
						children: m.content
					}, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 97,
						columnNumber: 17
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: `max-w-[85%] rounded-lg px-3 py-1.5 shadow-sm border ${m.playerId === currentSocketId ? "bg-accent text-accent-foreground border-accent-foreground/20 rounded-br-none" : "bg-white text-foreground border-foreground/20 rounded-bl-none"}`,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs font-bold opacity-75 mb-0.5",
							children: m.playerName
						}, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 108,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-sm leading-snug break-words",
							children: m.content
						}, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 109,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$9,
						lineNumber: 101,
						columnNumber: 17
					}, this)
				}, m.id, false, {
					fileName: _jsxFileName$9,
					lineNumber: 86,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$9,
				lineNumber: 79,
				columnNumber: 7
			}, this),
			phase === "answer_submission" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "border-t-2 border-foreground bg-highlight/30 p-3 sm:p-4 space-y-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between text-foreground font-bold text-xs sm:text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-1.5 text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 122,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Who is the Imposter?" }, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 123,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$9,
						lineNumber: 121,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-[11px] font-mono text-muted-foreground",
						children: "100% Confidential"
					}, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 125,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$9,
					lineNumber: 120,
					columnNumber: 11
				}, this), hasSubmittedAnswer ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-center gap-2 rounded bg-secondary p-3 text-foreground font-bold text-xs sm:text-sm border border-line",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserCheck, { className: "h-4 w-4 text-accent" }, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 130,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Secret vote recorded! Waiting for others..." }, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 131,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$9,
					lineNumber: 129,
					columnNumber: 13
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid grid-cols-2 gap-1.5 max-h-40 sm:max-h-48 overflow-y-auto pr-1",
						children: players.filter((p) => p.socketId !== currentSocketId).map((p) => {
							const isSelected = selectedSuspect === p.socketId;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setSelectedSuspect(p.socketId),
								className: `sketch flex items-center gap-1.5 p-2 text-left text-xs sm:text-sm font-bold transition-all border ${isSelected ? "bg-accent text-accent-foreground border-accent shadow-xs ring-1 ring-accent" : "bg-white text-foreground border-foreground/30 hover:bg-secondary"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-sm shrink-0",
									children: isSelected ? "🎯" : "🕵️"
								}, void 0, false, {
									fileName: _jsxFileName$9,
									lineNumber: 151,
									columnNumber: 25
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "truncate",
									children: p.displayName
								}, void 0, false, {
									fileName: _jsxFileName$9,
									lineNumber: 152,
									columnNumber: 25
								}, this)]
							}, p.socketId, true, {
								fileName: _jsxFileName$9,
								lineNumber: 141,
								columnNumber: 23
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 135,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						disabled: !selectedSuspect,
						onClick: handleSecretSubmit,
						className: "sketch w-full flex items-center justify-center gap-2 bg-accent py-2 text-sm sm:text-base font-bold text-accent-foreground hover:brightness-110 disabled:opacity-40 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 164,
							columnNumber: 17
						}, this), " Cast Confidential Vote 🗳️"]
					}, void 0, true, {
						fileName: _jsxFileName$9,
						lineNumber: 158,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$9,
					lineNumber: 134,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$9,
				lineNumber: 119,
				columnNumber: 9
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
				onSubmit: handleSend,
				className: "border-t-2 border-foreground bg-card p-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					type: "text",
					value: inputText,
					onChange: (e) => setInputText(e.target.value),
					placeholder: phase === "discussion" ? "Type your suspicion..." : "Chat during discussion...",
					disabled: phase !== "discussion",
					className: "sketch flex-1 px-3 py-1.5 text-sm bg-white text-foreground focus:outline-none disabled:opacity-50",
					maxLength: 140
				}, void 0, false, {
					fileName: _jsxFileName$9,
					lineNumber: 171,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "submit",
					disabled: phase !== "discussion" || !inputText.trim(),
					className: "sketch bg-primary px-4 py-1.5 text-primary-foreground font-bold disabled:opacity-40 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 185,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$9,
					lineNumber: 180,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$9,
				lineNumber: 170,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$9,
		lineNumber: 63,
		columnNumber: 5
	}, this);
}
var _jsxFileName$8 = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/components/RoomSettingsModal.tsx";
function RoomSettingsModal({ initialSettings, isHost, onSave, onClose, isMuted, isBgmActive, currentTrackName, onToggleMute, onToggleBgm, onNextTrack, onPrevTrack }) {
	const [capacity, setCapacity] = (0, import_react.useState)(initialSettings.capacity);
	const [language, setLanguage] = (0, import_react.useState)(initialSettings.language);
	const [drawTime, setDrawTime] = (0, import_react.useState)(initialSettings.drawTime);
	const [rounds, setRounds] = (0, import_react.useState)(initialSettings.rounds);
	const [gameMode, setGameMode] = (0, import_react.useState)(initialSettings.gameMode);
	const [wordCount, setWordCount] = (0, import_react.useState)(initialSettings.wordCount);
	const [hintsCount, setHintsCount] = (0, import_react.useState)(initialSettings.hintsCount);
	const [isPublic, setIsPublic] = (0, import_react.useState)(initialSettings.isPublic ?? true);
	const [category, setCategory] = (0, import_react.useState)(initialSettings.category ?? "All Categories");
	const [difficulty, setDifficulty] = (0, import_react.useState)(initialSettings.difficulty ?? "all");
	const handleSave = () => {
		onSave({
			capacity,
			language,
			drawTime,
			rounds,
			gameMode,
			wordCount,
			hintsCount,
			isPublic,
			category,
			difficulty
		});
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "notebook relative w-full max-w-lg max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-sm bg-card p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 rotate-[-2deg]" }, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 73,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between border-b-2 border-foreground/30 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Settings, { className: "h-6 w-6 text-accent" }, void 0, false, {
							fileName: _jsxFileName$8,
							lineNumber: 78,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-3xl font-display text-foreground",
							children: "Room Settings"
						}, void 0, false, {
							fileName: _jsxFileName$8,
							lineNumber: 79,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$8,
						lineNumber: 77,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: onClose,
						className: "rounded p-1 hover:bg-secondary text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-6 w-6" }, void 0, false, {
							fileName: _jsxFileName$8,
							lineNumber: 85,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 81,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 76,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4 font-hand",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Players (3 - 14):"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 93,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: capacity,
								disabled: !isHost,
								onChange: (e) => setCapacity(Number(e.target.value)),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [
									3,
									4,
									5,
									6,
									7,
									8,
									9,
									10,
									11,
									12,
									13,
									14
								].map((num) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
									value: num,
									children: [num, " Players"]
								}, num, true, {
									fileName: _jsxFileName$8,
									lineNumber: 101,
									columnNumber: 17
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 94,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 92,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Language:"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 110,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: language,
								disabled: !isHost,
								onChange: (e) => setLanguage(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "English",
										children: "English"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 117,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Hindi",
										children: "Hindi (Beta)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 118,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Spanish",
										children: "Spanish"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 119,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$8,
								lineNumber: 111,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 109,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Drawtime / Hint Time:"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 125,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: drawTime,
								disabled: !isHost,
								onChange: (e) => setDrawTime(Number(e.target.value)),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [
									30,
									45,
									60,
									80,
									100,
									120
								].map((sec) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
									value: sec,
									children: [sec, " seconds"]
								}, sec, true, {
									fileName: _jsxFileName$8,
									lineNumber: 133,
									columnNumber: 17
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 126,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 124,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Rounds:"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 142,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: rounds,
								disabled: !isHost,
								onChange: (e) => setRounds(Number(e.target.value)),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [
									1,
									2,
									3,
									4,
									5
								].map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
									value: r,
									children: [
										r,
										" ",
										r === 1 ? "Round" : "Rounds"
									]
								}, r, true, {
									fileName: _jsxFileName$8,
									lineNumber: 150,
									columnNumber: 17
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 143,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 141,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Game Mode:"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 159,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: gameMode,
								disabled: !isHost,
								onChange: (e) => setGameMode(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "normal",
										children: "Normal (1 Imposter)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 166,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "double_imposter",
										children: "Double Imposter (5+ players)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 167,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "word_guess",
										children: "Word Guess Mode"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 168,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$8,
								lineNumber: 160,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 158,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Word Count:"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 174,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: wordCount,
								disabled: !isHost,
								onChange: (e) => setWordCount(Number(e.target.value)),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
									value: 1,
									children: "1 Pair"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 181,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
									value: 2,
									children: "2 Pairs"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 182,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$8,
								lineNumber: 175,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 173,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Hints per player:"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 188,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: hintsCount,
								disabled: !isHost,
								onChange: (e) => setHintsCount(Number(e.target.value)),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
									value: 1,
									children: "1 Hint"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 195,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
									value: 2,
									children: "2 Hints"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 196,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$8,
								lineNumber: 189,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 187,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Word Category:"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 202,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: category,
								disabled: !isHost,
								onChange: (e) => setCategory(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "All Categories",
										children: "🎲 All Categories (Surprise Mix - 7,800+ words)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 209,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Bollywood Actors",
										children: "🎬 Bollywood Actors (275 pairs)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 210,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Bollywood Actresses",
										children: "💃 Bollywood Actresses (264 pairs)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 211,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Indian Singers",
										children: "🎤 Indian Singers (264 pairs)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 212,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Hollywood Actors",
										children: "🌟 Hollywood Actors (220 pairs)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 213,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Movies",
										children: "🍿 Blockbuster Movies (275 pairs)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 214,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Web Series",
										children: "📺 Web Series & OTT (220 pairs)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 215,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Indian Cities",
										children: "🏙️ Indian Cities (330 pairs)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 216,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Countries",
										children: "🌍 Countries of the World (440 pairs)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 217,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Landmarks",
										children: "🏛️ Famous Landmarks (220 pairs)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 218,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Animals",
										children: "🐾 Animals (3,300+ pairs)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 219,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Food & Drinks",
										children: "🍕 Food & Drinks (2,000+ pairs)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 220,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Everyday Objects",
										children: "🎒 Everyday Objects"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 221,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Transport",
										children: "🚀 Transport & Vehicles"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 222,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Nature & Places",
										children: "🏔️ Nature & Places"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 223,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Sports & Games",
										children: "⚽ Sports & Games"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 224,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Professions",
										children: "👨‍🏫 Professions & Jobs"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 225,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "Music & Art",
										children: "🎨 Music & Art"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 226,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$8,
								lineNumber: 203,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 201,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Difficulty:"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 232,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: difficulty,
								disabled: !isHost,
								onChange: (e) => setDifficulty(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "all",
										children: "Any / Mixed"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 239,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "easy",
										children: "Easy (Casual & Fun)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 240,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "medium",
										children: "Medium (Balanced)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 241,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "hard",
										children: "Hard (Trickier Clues)"
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 242,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$8,
								lineNumber: 233,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 231,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-sm font-bold text-foreground block",
								children: "Room Privacy:"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 248,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									disabled: !isHost,
									onClick: () => setIsPublic(true),
									className: `sketch p-2.5 text-left text-sm transition-all ${isPublic ? "bg-accent text-accent-foreground font-bold shadow-sm" : "bg-white text-foreground hover:bg-secondary"}`,
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-1.5 font-bold",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "🟢 Public Room" }, void 0, false, {
											fileName: _jsxFileName$8,
											lineNumber: 261,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 260,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs opacity-85 pt-0.5",
										children: "Visible in public lobby list. Anyone can join."
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 263,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 250,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									disabled: !isHost,
									onClick: () => setIsPublic(false),
									className: `sketch p-2.5 text-left text-sm transition-all ${!isPublic ? "bg-primary text-primary-foreground font-bold shadow-sm" : "bg-white text-foreground hover:bg-secondary"}`,
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-1.5 font-bold",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "🔒 Private Room" }, void 0, false, {
											fileName: _jsxFileName$8,
											lineNumber: 279,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 278,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs opacity-85 pt-0.5",
										children: "Hidden. Joinable only via secret link or code."
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 281,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 268,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$8,
								lineNumber: 249,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 247,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 90,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "sketch bg-white/85 p-3.5 space-y-2.5 border-2 border-foreground/30 font-hand",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-bold text-base text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Volume2, { className: "h-5 w-5 text-primary" }, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 293,
								columnNumber: 15
							}, this), " Audio & Sound Effects"]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 292,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: onToggleMute,
							className: `sketch px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-2xs ${isMuted ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`,
							children: [isMuted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(VolumeX, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 302,
								columnNumber: 26
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Volume2, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 302,
								columnNumber: 64
							}, this), isMuted ? "Unmute Sound" : "Mute Sound"]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 295,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$8,
						lineNumber: 291,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between pt-1 border-t border-foreground/15",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs font-bold text-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Music, { className: "h-3.5 w-3.5 text-accent" }, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 310,
									columnNumber: 17
								}, this), " Relaxing Lo-Fi Background Music"]
							}, void 0, true, {
								fileName: _jsxFileName$8,
								lineNumber: 309,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-[11px] text-muted-foreground",
								children: isBgmActive ? `Playing: ${currentTrackName || "Study Beats"}` : "Soft nostalgic study ambience (Paused)"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 312,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 308,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-1.5",
							children: [isBgmActive && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: onPrevTrack,
								className: "sketch px-2 py-0.5 text-xs bg-card hover:bg-secondary",
								title: "Previous Track",
								children: "⏮️"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 320,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: onNextTrack,
								className: "sketch px-2 py-0.5 text-xs bg-card hover:bg-secondary",
								title: "Next Track",
								children: "⏭️"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 328,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$8,
								lineNumber: 319,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: onToggleBgm,
								className: `sketch px-3 py-1 text-xs font-bold shadow-2xs ${isBgmActive ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`,
								children: isBgmActive ? "Pause Music" : "Play Lo-Fi 🎵"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 338,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 317,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$8,
						lineNumber: 307,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 290,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-end gap-3 pt-4 border-t-2 border-foreground/30",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: onClose,
						className: "sketch bg-secondary px-5 py-2 text-base font-bold text-foreground hover:bg-secondary/80",
						children: "Cancel"
					}, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 353,
						columnNumber: 11
					}, this), isHost && /* @__PURE__ */ (void 0)("button", {
						type: "button",
						onClick: handleSave,
						className: "sketch flex items-center gap-2 bg-accent px-6 py-2 text-base font-bold text-accent-foreground hover:brightness-110",
						children: [/* @__PURE__ */ (void 0)(Check, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$8,
							lineNumber: 366,
							columnNumber: 15
						}, this), " Save Settings"]
					}, void 0, true, {
						fileName: _jsxFileName$8,
						lineNumber: 361,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 352,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$8,
			lineNumber: 71,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$8,
		lineNumber: 70,
		columnNumber: 5
	}, this);
}
var RELAXING_TRACKS = [
	{
		id: 1,
		name: "Lo-Fi Study Lounge",
		artist: "Notebook Beats",
		mood: "☕ Warm Rhodes 7th Chords",
		bpm: 72,
		scale: [
			261.63,
			293.66,
			329.63,
			349.23,
			392,
			440,
			493.88
		],
		chords: [
			[
				261.63,
				329.63,
				392,
				493.88
			],
			[
				220,
				261.63,
				329.63,
				392
			],
			[
				293.66,
				349.23,
				440,
				523.25
			],
			[
				196,
				261.63,
				293.66,
				392
			]
		],
		type: "sine"
	},
	{
		id: 2,
		name: "Rainy Afternoon Kalimba",
		artist: "Window Rain",
		mood: "🌧️ Soft Pentatonic Bells",
		bpm: 64,
		scale: [
			174.61,
			196,
			220,
			261.63,
			293.66
		],
		chords: [
			[
				174.61,
				261.63,
				349.23,
				440
			],
			[
				220,
				261.63,
				329.63,
				440
			],
			[
				146.83,
				220,
				293.66,
				349.23
			],
			[
				196,
				246.94,
				293.66,
				392
			]
		],
		type: "triangle"
	},
	{
		id: 3,
		name: "Classroom Daydream",
		artist: "Last Bench Vibes",
		mood: "☁️ Ambient Warm Pads",
		bpm: 60,
		scale: [
			196,
			220,
			246.94,
			293.66,
			329.63,
			370
		],
		chords: [
			[
				196,
				246.94,
				293.66,
				370
			],
			[
				164.81,
				196,
				246.94,
				293.66
			],
			[
				246.94,
				293.66,
				370,
				440
			],
			[
				130.81,
				196,
				246.94,
				329.63
			]
		],
		type: "sine"
	},
	{
		id: 4,
		name: "Midnight Notebook",
		artist: "Sleepy Detective",
		mood: "🌙 Gentle Plucks & Breeze",
		bpm: 68,
		scale: [
			220,
			246.94,
			261.63,
			293.66,
			329.63,
			349.23
		],
		chords: [
			[
				220,
				261.63,
				329.63,
				392
			],
			[
				174.61,
				220,
				261.63,
				329.63
			],
			[
				146.83,
				220,
				261.63,
				349.23
			],
			[
				164.81,
				220,
				246.94,
				329.63
			]
		],
		type: "triangle"
	}
];
var SoundEngine = class {
	ctx = null;
	bgmGain = null;
	sfxGain = null;
	filterNode = null;
	isBgmPlaying = false;
	bgmTimer = null;
	isMuted = false;
	currentTrackIndex = 0;
	trackListeners = [];
	barCount = 0;
	constructor() {
		if (typeof window !== "undefined") {
			this.isMuted = localStorage.getItem("imposter_sound_muted") === "true";
			const savedTrack = parseInt(localStorage.getItem("imposter_bgm_track") || "0", 10);
			if (!isNaN(savedTrack) && savedTrack >= 0 && savedTrack < RELAXING_TRACKS.length) this.currentTrackIndex = savedTrack;
		}
	}
	onTrackChange(callback) {
		this.trackListeners.push(callback);
		const track = RELAXING_TRACKS[this.currentTrackIndex];
		if (track) callback(this.currentTrackIndex, track);
		return () => {
			this.trackListeners = this.trackListeners.filter((cb) => cb !== callback);
		};
	}
	notifyTrackChange() {
		const track = RELAXING_TRACKS[this.currentTrackIndex];
		if (!track) return;
		for (const listener of this.trackListeners) try {
			listener(this.currentTrackIndex, track);
		} catch {}
	}
	initContext() {
		if (!this.ctx && typeof window !== "undefined") {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if (AudioCtx) {
				this.ctx = new AudioCtx();
				this.bgmGain = this.ctx.createGain();
				this.sfxGain = this.ctx.createGain();
				this.filterNode = this.ctx.createBiquadFilter();
				this.filterNode.type = "lowpass";
				this.filterNode.frequency.value = 1600;
				this.filterNode.Q.value = .7;
				this.bgmGain.gain.value = this.isMuted ? 0 : .085;
				this.sfxGain.gain.value = this.isMuted ? 0 : .32;
				this.bgmGain.connect(this.filterNode);
				this.filterNode.connect(this.ctx.destination);
				this.sfxGain.connect(this.ctx.destination);
			}
		}
		if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
	}
	toggleMute() {
		this.isMuted = !this.isMuted;
		if (typeof window !== "undefined") localStorage.setItem("imposter_sound_muted", String(this.isMuted));
		if (this.bgmGain && this.sfxGain) {
			this.bgmGain.gain.value = this.isMuted ? 0 : .085;
			this.sfxGain.gain.value = this.isMuted ? 0 : .32;
		}
		if (this.isMuted) this.stopBgm();
		else this.startBgm();
		return this.isMuted;
	}
	nextTrack() {
		this.currentTrackIndex = (this.currentTrackIndex + 1) % RELAXING_TRACKS.length;
		this.saveTrackPreference();
		this.notifyTrackChange();
		if (this.isBgmPlaying) this.restartBgm();
	}
	prevTrack() {
		this.currentTrackIndex = (this.currentTrackIndex - 1 + RELAXING_TRACKS.length) % RELAXING_TRACKS.length;
		this.saveTrackPreference();
		this.notifyTrackChange();
		if (this.isBgmPlaying) this.restartBgm();
	}
	setTrack(idx) {
		if (idx >= 0 && idx < RELAXING_TRACKS.length) {
			this.currentTrackIndex = idx;
			this.saveTrackPreference();
			this.notifyTrackChange();
			if (this.isBgmPlaying) this.restartBgm();
		}
	}
	saveTrackPreference() {
		if (typeof window !== "undefined") localStorage.setItem("imposter_bgm_track", String(this.currentTrackIndex));
	}
	getCurrentTrack() {
		return RELAXING_TRACKS[this.currentTrackIndex] || RELAXING_TRACKS[0];
	}
	playPop() {
		if (this.isMuted) return;
		this.initContext();
		if (!this.ctx || !this.sfxGain) return;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(420, this.ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(840, this.ctx.currentTime + .07);
		gain.gain.setValueAtTime(.28, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.01, this.ctx.currentTime + .07);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start();
		osc.stop(this.ctx.currentTime + .07);
	}
	playPencil() {
		if (this.isMuted) return;
		this.initContext();
		if (!this.ctx || !this.sfxGain) return;
		for (let i = 0; i < 3; i++) setTimeout(() => {
			if (!this.ctx || !this.sfxGain) return;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();
			osc.type = "triangle";
			osc.frequency.setValueAtTime(1100 + Math.random() * 400, this.ctx.currentTime);
			osc.frequency.linearRampToValueAtTime(750, this.ctx.currentTime + .05);
			gain.gain.setValueAtTime(.12, this.ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(.01, this.ctx.currentTime + .05);
			osc.connect(gain);
			gain.connect(this.sfxGain);
			osc.start();
			osc.stop(this.ctx.currentTime + .05);
		}, i * 55);
	}
	playDing() {
		if (this.isMuted) return;
		this.initContext();
		if (!this.ctx || !this.sfxGain) return;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(880, this.ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + .05);
		gain.gain.setValueAtTime(.25, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .5);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start();
		osc.stop(this.ctx.currentTime + .5);
	}
	playTick() {
		if (this.isMuted) return;
		this.initContext();
		if (!this.ctx || !this.sfxGain) return;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "triangle";
		osc.frequency.setValueAtTime(900, this.ctx.currentTime);
		gain.gain.setValueAtTime(.08, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .03);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start();
		osc.stop(this.ctx.currentTime + .03);
	}
	playLock() {
		if (this.isMuted) return;
		this.initContext();
		if (!this.ctx || !this.sfxGain) return;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "square";
		osc.frequency.setValueAtTime(320, this.ctx.currentTime);
		osc.frequency.setValueAtTime(480, this.ctx.currentTime + .06);
		gain.gain.setValueAtTime(.18, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.01, this.ctx.currentTime + .14);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start();
		osc.stop(this.ctx.currentTime + .14);
	}
	playVictory() {
		if (this.isMuted) return;
		this.initContext();
		if (!this.ctx || !this.sfxGain) return;
		[
			523.25,
			659.25,
			783.99,
			1046.5
		].forEach((freq, i) => {
			setTimeout(() => {
				if (!this.ctx || !this.sfxGain) return;
				const osc = this.ctx.createOscillator();
				const gain = this.ctx.createGain();
				osc.type = "triangle";
				osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
				gain.gain.setValueAtTime(.28, this.ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .5);
				osc.connect(gain);
				gain.connect(this.sfxGain);
				osc.start();
				osc.stop(this.ctx.currentTime + .5);
			}, i * 130);
		});
	}
	playImposterWin() {
		if (this.isMuted) return;
		this.initContext();
		if (!this.ctx || !this.sfxGain) return;
		[
			392,
			370,
			349.23,
			311.13
		].forEach((freq, i) => {
			setTimeout(() => {
				if (!this.ctx || !this.sfxGain) return;
				const osc = this.ctx.createOscillator();
				const gain = this.ctx.createGain();
				osc.type = "sawtooth";
				osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
				gain.gain.setValueAtTime(.18, this.ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .6);
				osc.connect(gain);
				gain.connect(this.sfxGain);
				osc.start();
				osc.stop(this.ctx.currentTime + .6);
			}, i * 150);
		});
	}
	startBgm() {
		if (this.isMuted || this.isBgmPlaying) return;
		this.initContext();
		if (!this.ctx || !this.bgmGain) return;
		this.isBgmPlaying = true;
		this.barCount = 0;
		this.scheduleNextBar();
	}
	scheduleNextBar() {
		if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
		const track = this.getCurrentTrack();
		const chordIndex = this.barCount % track.chords.length;
		const chord = track.chords[chordIndex] || [
			261.63,
			329.63,
			392
		];
		const beatSec = 60 / track.bpm;
		const barSec = beatSec * 4;
		chord.forEach((freq, nIdx) => {
			const delay = nIdx * (beatSec * .45);
			setTimeout(() => {
				if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
				const osc = this.ctx.createOscillator();
				const gain = this.ctx.createGain();
				osc.type = track.type;
				osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
				const now = this.ctx.currentTime;
				gain.gain.setValueAtTime(.001, now);
				gain.gain.linearRampToValueAtTime(.065, now + .12);
				gain.gain.exponentialRampToValueAtTime(.001, now + barSec * .9);
				osc.connect(gain);
				gain.connect(this.bgmGain);
				osc.start(now);
				osc.stop(now + barSec * .9);
			}, delay * 1e3);
		});
		const sparkleScale = track.scale;
		const highNote = sparkleScale[Math.floor(Math.random() * sparkleScale.length)] * 2;
		setTimeout(() => {
			if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(highNote, this.ctx.currentTime);
			gain.gain.setValueAtTime(.035, this.ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(1e-4, this.ctx.currentTime + .6);
			osc.connect(gain);
			gain.connect(this.bgmGain);
			osc.start();
			osc.stop(this.ctx.currentTime + .6);
		}, barSec * .6 * 1e3);
		this.barCount++;
		if (this.barCount >= 8) {
			this.barCount = 0;
			this.currentTrackIndex = (this.currentTrackIndex + 1) % RELAXING_TRACKS.length;
			this.saveTrackPreference();
			this.notifyTrackChange();
		}
		this.bgmTimer = setTimeout(() => {
			this.scheduleNextBar();
		}, barSec * 1e3);
	}
	restartBgm() {
		this.stopBgm();
		this.startBgm();
	}
	stopBgm() {
		this.isBgmPlaying = false;
		if (this.bgmTimer) {
			clearTimeout(this.bgmTimer);
			this.bgmTimer = null;
		}
		this.notifyTrackChange();
	}
	getBgmStatus() {
		return this.isBgmPlaying && !this.isMuted;
	}
};
var sound = new SoundEngine();
function validateUsernameFormat(username) {
	const normalized = username.trim().toLowerCase();
	if (!normalized) return {
		valid: false,
		error: "Username cannot be empty."
	};
	if (normalized.length < 3 || normalized.length > 20) return {
		valid: false,
		error: "Username must be between 3 and 20 characters."
	};
	if (!/^[a-z0-9._]+$/.test(normalized)) return {
		valid: false,
		error: "Only lowercase letters, numbers, dots (.), and underscores (_) are allowed."
	};
	if (!/^[a-z0-9]/.test(normalized) || !/[a-z0-9]$/.test(normalized)) return {
		valid: false,
		error: "Username cannot start or end with a dot (.) or underscore (_)."
	};
	if (normalized.includes("..") || normalized.includes("__") || normalized.includes("._") || normalized.includes("_.")) return {
		valid: false,
		error: "Username cannot contain consecutive dots or underscores."
	};
	return { valid: true };
}
function useUsernameCheck(initialUsername = "", currentUserId = "") {
	const [username, setUsername] = (0, import_react.useState)(initialUsername);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [message, setMessage] = (0, import_react.useState)("");
	const abortControllerRef = (0, import_react.useRef)(null);
	const debounceTimerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (initialUsername) {
			setUsername(initialUsername);
			setStatus("available");
			setMessage("Your current username");
		}
	}, [initialUsername]);
	const checkAvailability = (0, import_react.useCallback)((uname) => {
		const normalized = uname.trim().toLowerCase();
		if (!normalized) {
			setStatus("idle");
			setMessage("");
			return;
		}
		const formatCheck = validateUsernameFormat(normalized);
		if (!formatCheck.valid) {
			setStatus("invalid");
			setMessage(formatCheck.error || "Invalid username format");
			return;
		}
		if (initialUsername && normalized === initialUsername.trim().toLowerCase()) {
			setStatus("available");
			setMessage("Your current username");
			return;
		}
		setStatus("checking");
		setMessage("Checking availability...");
		if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
		if (abortControllerRef.current) abortControllerRef.current.abort();
		const controller = new AbortController();
		abortControllerRef.current = controller;
		debounceTimerRef.current = setTimeout(async () => {
			try {
				const params = new URLSearchParams({
					username: normalized,
					currentUserId: currentUserId || ""
				});
				const res = await fetch(`${API_BASE}/api/username/check?${params.toString()}`, { signal: controller.signal });
				if (!res.ok) throw new Error("Server error");
				const data = await res.json();
				if (data.invalidFormat) {
					setStatus("invalid");
					setMessage(data.message || "Invalid format");
				} else if (data.available) {
					setStatus("available");
					setMessage(data.message || "Username is available!");
				} else {
					setStatus("taken");
					setMessage(data.message || "Username is already taken");
				}
			} catch (err) {
				if (err.name === "AbortError") return;
				setStatus("error");
				setMessage("Could not check availability. Click to retry.");
			}
		}, 300);
	}, [initialUsername, currentUserId]);
	const handleUsernameChange = (newVal) => {
		const cleaned = newVal.toLowerCase().replace(/\s+/g, "");
		setUsername(cleaned);
		checkAvailability(cleaned);
	};
	const retry = () => {
		checkAvailability(username);
	};
	return {
		username,
		setUsername: handleUsernameChange,
		status,
		message,
		isValid: status === "available",
		isChecking: status === "checking",
		retry
	};
}
var COUNTRIES = [
	"India",
	"United States",
	"United Kingdom",
	"Canada",
	"Australia",
	"United Arab Emirates",
	"Oman",
	"Germany",
	"France",
	"Japan",
	"Singapore",
	"Saudi Arabia",
	"Pakistan",
	"Bangladesh",
	"Nepal",
	"Sri Lanka",
	"Brazil",
	"Mexico",
	"Indonesia",
	"Malaysia",
	"Philippines",
	"South Africa",
	"New Zealand",
	"Italy",
	"Spain",
	"Netherlands",
	"Switzerland",
	"Ireland",
	"Russia",
	"South Korea",
	"Turkey",
	"Argentina",
	"Thailand",
	"Vietnam",
	"Egypt",
	"Nigeria"
];
var STATES_BY_COUNTRY = {
	India: [
		"Maharashtra",
		"Delhi",
		"Karnataka",
		"Uttar Pradesh",
		"Tamil Nadu",
		"Gujarat",
		"West Bengal",
		"Rajasthan",
		"Punjab",
		"Bihar",
		"Telangana",
		"Kerala",
		"Madhya Pradesh",
		"Jharkhand",
		"Haryana",
		"Andhra Pradesh",
		"Odisha",
		"Assam",
		"Goa",
		"Uttarakhand",
		"Himachal Pradesh",
		"Chhattisgarh",
		"Jammu and Kashmir",
		"Chandigarh",
		"Ladakh",
		"Puducherry",
		"Tripura",
		"Meghalaya",
		"Manipur",
		"Nagaland",
		"Mizoram",
		"Arunachal Pradesh",
		"Sikkim",
		"Andaman and Nicobar Islands",
		"Dadra and Nagar Haveli and Daman and Diu",
		"Lakshadweep"
	],
	"United States": [
		"California",
		"Texas",
		"Florida",
		"New York",
		"Pennsylvania",
		"Illinois",
		"Ohio",
		"Georgia",
		"North Carolina",
		"Michigan",
		"New Jersey",
		"Virginia",
		"Washington",
		"Arizona",
		"Tennessee",
		"Massachusetts",
		"Indiana",
		"Missouri",
		"Maryland",
		"Wisconsin",
		"Colorado",
		"Minnesota",
		"South Carolina",
		"Alabama",
		"Louisiana",
		"Kentucky",
		"Oregon",
		"Oklahoma",
		"Connecticut",
		"Utah",
		"Iowa",
		"Nevada",
		"Arkansas",
		"Mississippi",
		"Kansas",
		"New Mexico",
		"Nebraska",
		"Idaho",
		"West Virginia",
		"Hawaii",
		"New Hampshire",
		"Maine",
		"Montana",
		"Rhode Island",
		"Delaware",
		"South Dakota",
		"North Dakota",
		"Alaska",
		"District of Columbia",
		"Vermont",
		"Wyoming"
	],
	"United Kingdom": [
		"England",
		"Scotland",
		"Wales",
		"Northern Ireland",
		"Greater London",
		"Greater Manchester",
		"West Midlands",
		"West Yorkshire",
		"Merseyside",
		"South Yorkshire",
		"Tyne and Wear"
	],
	Canada: [
		"Ontario",
		"Quebec",
		"British Columbia",
		"Alberta",
		"Manitoba",
		"Saskatchewan",
		"Nova Scotia",
		"New Brunswick",
		"Newfoundland and Labrador",
		"Prince Edward Island",
		"Northwest Territories",
		"Nunavut",
		"Yukon"
	],
	Australia: [
		"New South Wales",
		"Victoria",
		"Queensland",
		"Western Australia",
		"South Australia",
		"Tasmania",
		"Australian Capital Territory",
		"Northern Territory"
	],
	"United Arab Emirates": [
		"Dubai",
		"Abu Dhabi",
		"Sharjah",
		"Ajman",
		"Ras Al Khaimah",
		"Fujairah",
		"Umm Al Quwain"
	],
	Oman: [
		"Muscat",
		"Dhofar",
		"Musandam",
		"Al Buraimi",
		"Ad Dakhiliyah",
		"Al Batinah North",
		"Al Batinah South",
		"Ash Sharqiyah North",
		"Ash Sharqiyah South",
		"Ad Dhahirah",
		"Al Wusta"
	],
	Germany: [
		"Bavaria",
		"North Rhine-Westphalia",
		"Baden-Württemberg",
		"Lower Saxony",
		"Hesse",
		"Saxony",
		"Rhineland-Palatinate",
		"Berlin",
		"Schleswig-Holstein",
		"Brandenburg",
		"Saxony-Anhalt",
		"Thuringia",
		"Hamburg",
		"Mecklenburg-Vorpommern",
		"Saarland",
		"Bremen"
	],
	France: [
		"Île-de-France (Paris)",
		"Auvergne-Rhône-Alpes",
		"Nouvelle-Aquitaine",
		"Occitanie",
		"Provence-Alpes-Côte d'Azur",
		"Hauts-de-France",
		"Grand Est",
		"Pays de la Loire",
		"Brittany",
		"Normandy",
		"Bourgogne-Franche-Comté",
		"Centre-Val de Loire",
		"Corsica"
	],
	Japan: [
		"Tokyo",
		"Osaka",
		"Kanagawa",
		"Aichi",
		"Saitama",
		"Chiba",
		"Hyogo",
		"Hokkaido",
		"Fukuoka",
		"Shizuoka",
		"Kyoto",
		"Hiroshima",
		"Miyagi",
		"Niigata",
		"Nagano",
		"Okinawa"
	],
	Singapore: [
		"Central Region",
		"East Region",
		"North Region",
		"North-East Region",
		"West Region",
		"Downtown Core",
		"Jurong",
		"Woodlands",
		"Tampines",
		"Bedok"
	],
	"Saudi Arabia": [
		"Riyadh",
		"Makkah",
		"Eastern Province",
		"Madinah",
		"Asir",
		"Tabuk",
		"Al Qassim",
		"Hail",
		"Jazan",
		"Najran",
		"Northern Borders",
		"Al Jawf",
		"Al Bahah"
	],
	Pakistan: [
		"Punjab",
		"Sindh",
		"Khyber Pakhtunkhwa",
		"Balochistan",
		"Islamabad Capital Territory",
		"Gilgit-Baltistan",
		"Azad Kashmir"
	],
	Bangladesh: [
		"Dhaka",
		"Chittagong",
		"Rajshahi",
		"Khulna",
		"Barisal",
		"Sylhet",
		"Rangpur",
		"Mymensingh"
	],
	Nepal: [
		"Bagmati",
		"Gandaki",
		"Koshi",
		"Lumbini",
		"Madhesh",
		"Karnali",
		"Sudurpashchim"
	],
	"Sri Lanka": [
		"Western",
		"Central",
		"Southern",
		"Northern",
		"Eastern",
		"North Western",
		"North Central",
		"Uva",
		"Sabaragamuwa"
	],
	Brazil: [
		"São Paulo",
		"Rio de Janeiro",
		"Minas Gerais",
		"Bahia",
		"Paraná",
		"Rio Grande do Sul",
		"Santa Catarina",
		"Pernambuco",
		"Ceará",
		"Federal District"
	],
	Mexico: [
		"Mexico City",
		"Jalisco",
		"Nuevo León",
		"Puebla",
		"State of Mexico",
		"Guanajuato",
		"Veracruz",
		"Yucatán",
		"Baja California"
	],
	Indonesia: [
		"Jakarta",
		"West Java",
		"East Java",
		"Central Java",
		"Bali",
		"North Sumatra",
		"Banten",
		"South Sulawesi",
		"Special Region of Yogyakarta"
	],
	Malaysia: [
		"Kuala Lumpur",
		"Selangor",
		"Penang",
		"Johor",
		"Sabah",
		"Sarawak",
		"Perak",
		"Kedah",
		"Pahang",
		"Melaka"
	],
	Philippines: [
		"Metro Manila (NCR)",
		"Calabarzon",
		"Central Luzon",
		"Central Visayas",
		"Western Visayas",
		"Davao Region",
		"Ilocos Region"
	],
	"South Africa": [
		"Gauteng",
		"Western Cape",
		"KwaZulu-Natal",
		"Eastern Cape",
		"Limpopo",
		"Mpumalanga",
		"Free State",
		"North West"
	],
	"New Zealand": [
		"Auckland",
		"Canterbury",
		"Wellington",
		"Waikato",
		"Bay of Plenty",
		"Otago",
		"Hawke's Bay",
		"Taranaki"
	],
	Italy: [
		"Lombardy",
		"Lazio (Rome)",
		"Campania (Naples)",
		"Sicily",
		"Veneto",
		"Piedmont",
		"Emilia-Romagna",
		"Tuscany",
		"Puglia"
	],
	Spain: [
		"Madrid",
		"Catalonia (Barcelona)",
		"Andalusia",
		"Valencia",
		"Galicia",
		"Basque Country",
		"Canary Islands",
		"Balearic Islands"
	],
	Netherlands: [
		"North Holland (Amsterdam)",
		"South Holland (Rotterdam)",
		"Utrecht",
		"North Brabant",
		"Gelderland",
		"Overijssel",
		"Limburg"
	],
	Switzerland: [
		"Zurich",
		"Geneva",
		"Vaud",
		"Bern",
		"Basel-Stadt",
		"Lucerne",
		"St. Gallen",
		"Ticino"
	],
	Ireland: [
		"Dublin",
		"Cork",
		"Galway",
		"Limerick",
		"Waterford",
		"Kildare",
		"Meath",
		"Wicklow"
	],
	Russia: [
		"Moscow",
		"Saint Petersburg",
		"Novosibirsk",
		"Sverdlovsk",
		"Tatarstan",
		"Krasnodar",
		"Nizhny Novgorod",
		"Samara"
	],
	"South Korea": [
		"Seoul",
		"Gyeonggi",
		"Busan",
		"Incheon",
		"Daegu",
		"Daejeon",
		"Gwangju",
		"Jeju"
	],
	Turkey: [
		"Istanbul",
		"Ankara",
		"Izmir",
		"Bursa",
		"Antalya",
		"Adana",
		"Konya",
		"Gaziantep"
	],
	Argentina: [
		"Buenos Aires",
		"Cordoba",
		"Santa Fe",
		"Mendoza",
		"Tucuman",
		"Salta"
	],
	Thailand: [
		"Bangkok",
		"Chiang Mai",
		"Phuket",
		"Chonburi",
		"Nonthaburi",
		"Khon Kaen"
	],
	Vietnam: [
		"Ho Chi Minh City",
		"Hanoi",
		"Da Nang",
		"Hai Phong",
		"Can Tho",
		"Binh Duong"
	],
	Egypt: [
		"Cairo",
		"Alexandria",
		"Giza",
		"Dakahlia",
		"Red Sea",
		"Luxor",
		"Aswan"
	],
	Nigeria: [
		"Lagos",
		"Kano",
		"Abuja (FCT)",
		"Rivers (Port Harcourt)",
		"Oyo (Ibadan)",
		"Kaduna"
	]
};
var CITIES_BY_STATE = {
	Maharashtra: [
		"Mumbai",
		"Pune",
		"Nagpur",
		"Nashik",
		"Thane",
		"Aurangabad",
		"Navi Mumbai",
		"Kolhapur",
		"Solapur"
	],
	Delhi: [
		"New Delhi",
		"North Delhi",
		"South Delhi",
		"West Delhi",
		"East Delhi",
		"Dwarka",
		"Rohini"
	],
	Karnataka: [
		"Bengaluru",
		"Mysuru",
		"Mangaluru",
		"Hubballi",
		"Belagavi",
		"Dharwad",
		"Kalaburagi"
	],
	"Uttar Pradesh": [
		"Lucknow",
		"Noida",
		"Greater Noida",
		"Kanpur",
		"Varanasi",
		"Agra",
		"Prayagraj",
		"Ghaziabad",
		"Meerut"
	],
	"Tamil Nadu": [
		"Chennai",
		"Coimbatore",
		"Madurai",
		"Tiruchirappalli",
		"Salem",
		"Tirunelveli",
		"Vellore"
	],
	Gujarat: [
		"Ahmedabad",
		"Surat",
		"Vadodara",
		"Rajkot",
		"Bhavnagar",
		"Jamnagar",
		"Gandhinagar"
	],
	"West Bengal": [
		"Kolkata",
		"Howrah",
		"Siliguri",
		"Durgapur",
		"Asansol",
		"Kalyani"
	],
	Rajasthan: [
		"Jaipur",
		"Jodhpur",
		"Udaipur",
		"Kota",
		"Bikaner",
		"Ajmer",
		"Bhilwara"
	],
	Punjab: [
		"Chandigarh",
		"Amritsar",
		"Ludhiana",
		"Jalandhar",
		"Patiala",
		"Bathinda"
	],
	Bihar: [
		"Patna",
		"Gaya",
		"Bhagalpur",
		"Muzaffarpur",
		"Darbhanga",
		"Purnia"
	],
	Telangana: [
		"Hyderabad",
		"Warangal",
		"Nizamabad",
		"Khammam",
		"Karimnagar",
		"Secunderabad"
	],
	Kerala: [
		"Kochi",
		"Thiruvananthapuram",
		"Kozhikode",
		"Thrissur",
		"Kollam",
		"Kannur"
	],
	"Madhya Pradesh": [
		"Indore",
		"Bhopal",
		"Jabalpur",
		"Gwalior",
		"Ujjain",
		"Sagar"
	],
	Jharkhand: [
		"Jamshedpur",
		"Ranchi",
		"Dhanbad",
		"Bokaro Steel City",
		"Deoghar",
		"Hazaribagh"
	],
	Haryana: [
		"Gurugram",
		"Faridabad",
		"Panipat",
		"Ambala",
		"Karnal",
		"Hisar",
		"Rohtak"
	],
	"Andhra Pradesh": [
		"Visakhapatnam",
		"Vijayawada",
		"Guntur",
		"Nellore",
		"Kurnool",
		"Tirupati"
	],
	Odisha: [
		"Bhubaneswar",
		"Cuttack",
		"Rourkela",
		"Puri",
		"Sambalpur",
		"Berhampur"
	],
	Assam: [
		"Guwahati",
		"Silchar",
		"Dibrugarh",
		"Jorhat",
		"Nagaon",
		"Tezpur"
	],
	Goa: [
		"Panaji",
		"Margao",
		"Vasco da Gama",
		"Mapusa",
		"Ponda"
	],
	Uttarakhand: [
		"Dehradun",
		"Haridwar",
		"Rishikesh",
		"Haldwani",
		"Roorkee",
		"Nainital"
	],
	"Himachal Pradesh": [
		"Shimla",
		"Dharamshala",
		"Mandi",
		"Solan",
		"Kullu",
		"Manali"
	],
	Chhattisgarh: [
		"Raipur",
		"Bhilai",
		"Bilaspur",
		"Korba",
		"Durg"
	],
	"Jammu and Kashmir": [
		"Srinagar",
		"Jammu",
		"Anantnag",
		"Baramulla"
	],
	Chandigarh: [
		"Chandigarh City",
		"Sector 17",
		"Sector 35",
		"Manimajra"
	],
	Ladakh: ["Leh", "Kargil"],
	Puducherry: [
		"Puducherry City",
		"Karaikal",
		"Mahe",
		"Yanam"
	],
	California: [
		"San Francisco",
		"Los Angeles",
		"San Jose",
		"San Diego",
		"Sacramento",
		"Oakland",
		"Long Beach",
		"Fresno"
	],
	Texas: [
		"Austin",
		"Houston",
		"Dallas",
		"San Antonio",
		"Fort Worth",
		"El Paso",
		"Arlington"
	],
	"New York": [
		"New York City",
		"Buffalo",
		"Rochester",
		"Yonkers",
		"Syracuse",
		"Albany"
	],
	Florida: [
		"Miami",
		"Orlando",
		"Tampa",
		"Jacksonville",
		"Fort Lauderdale",
		"St. Petersburg"
	],
	Washington: [
		"Seattle",
		"Spokane",
		"Tacoma",
		"Vancouver",
		"Bellevue"
	],
	Illinois: [
		"Chicago",
		"Aurora",
		"Naperville",
		"Rockford",
		"Joliet"
	],
	Georgia: [
		"Atlanta",
		"Augusta",
		"Savannah",
		"Columbus",
		"Athens"
	],
	"North Carolina": [
		"Charlotte",
		"Raleigh",
		"Greensboro",
		"Durham",
		"Winston-Salem"
	],
	Pennsylvania: [
		"Philadelphia",
		"Pittsburgh",
		"Allentown",
		"Erie",
		"Reading"
	],
	Massachusetts: [
		"Boston",
		"Cambridge",
		"Worcester",
		"Springfield",
		"Lowell"
	],
	Colorado: [
		"Denver",
		"Colorado Springs",
		"Aurora",
		"Fort Collins",
		"Boulder"
	],
	Nevada: [
		"Las Vegas",
		"Reno",
		"Henderson",
		"North Las Vegas"
	],
	"District of Columbia": [
		"Washington D.C.",
		"Capitol Hill",
		"Georgetown"
	],
	England: [
		"London",
		"Manchester",
		"Birmingham",
		"Leeds",
		"Liverpool",
		"Bristol",
		"Newcastle",
		"Sheffield"
	],
	Scotland: [
		"Edinburgh",
		"Glasgow",
		"Aberdeen",
		"Dundee",
		"Inverness"
	],
	Wales: [
		"Cardiff",
		"Swansea",
		"Newport",
		"Bangor"
	],
	"Northern Ireland": [
		"Belfast",
		"Derry",
		"Lisburn",
		"Newry"
	],
	"Greater London": [
		"City of London",
		"Westminster",
		"Camden",
		"Greenwich",
		"Kensington"
	],
	Ontario: [
		"Toronto",
		"Ottawa",
		"Mississauga",
		"Brampton",
		"Hamilton",
		"London",
		"Markham"
	],
	Quebec: [
		"Montreal",
		"Quebec City",
		"Laval",
		"Gatineau",
		"Longueuil"
	],
	"British Columbia": [
		"Vancouver",
		"Victoria",
		"Surrey",
		"Burnaby",
		"Richmond",
		"Kelowna"
	],
	Alberta: [
		"Calgary",
		"Edmonton",
		"Red Deer",
		"Lethbridge"
	],
	"New South Wales": [
		"Sydney",
		"Newcastle",
		"Wollongong",
		"Central Coast"
	],
	Victoria: [
		"Melbourne",
		"Geelong",
		"Ballarat",
		"Bendigo"
	],
	Queensland: [
		"Brisbane",
		"Gold Coast",
		"Sunshine Coast",
		"Cairns",
		"Townsville"
	],
	"Western Australia": [
		"Perth",
		"Fremantle",
		"Mandurah",
		"Bunbury"
	],
	Dubai: [
		"Downtown Dubai",
		"Dubai Marina",
		"Deira",
		"Jumeirah",
		"Business Bay",
		"Palm Jumeirah"
	],
	"Abu Dhabi": [
		"Abu Dhabi City",
		"Al Ain",
		"Al Dhafra",
		"Yas Island",
		"Saadiyat"
	],
	Sharjah: [
		"Sharjah City",
		"Khor Fakkan",
		"Kalba"
	],
	Muscat: [
		"Muscat City",
		"Seeb",
		"Bawshar",
		"Muttrah",
		"Al Amrat"
	],
	Dhofar: [
		"Salalah",
		"Taqah",
		"Mirbat",
		"Thumrait"
	],
	"Al Batinah North": [
		"Sohar",
		"Shinas",
		"Saham",
		"Liwa"
	],
	"Ad Dakhiliyah": [
		"Nizwa",
		"Bahla",
		"Samail",
		"Izki"
	],
	"Ash Sharqiyah South": ["Sur", "Jalan Bani Bu Ali"],
	"Al Buraimi": ["Al Buraimi City", "Mahdah"],
	Musandam: ["Khasab", "Dibba Al-Baya"],
	Bavaria: [
		"Munich",
		"Nuremberg",
		"Augsburg",
		"Regensburg",
		"Würzburg"
	],
	"North Rhine-Westphalia": [
		"Cologne",
		"Düsseldorf",
		"Dortmund",
		"Essen",
		"Bonn"
	],
	Berlin: [
		"Berlin Mitte",
		"Charlottenburg",
		"Kreuzberg",
		"Pankow"
	],
	Hesse: [
		"Frankfurt",
		"Wiesbaden",
		"Kassel",
		"Darmstadt"
	],
	Hamburg: [
		"Hamburg Central",
		"Altona",
		"Harburg"
	],
	"Île-de-France (Paris)": [
		"Paris",
		"Boulogne-Billancourt",
		"Saint-Denis",
		"Versailles"
	],
	"Auvergne-Rhône-Alpes": [
		"Lyon",
		"Grenoble",
		"Saint-Étienne",
		"Clermont-Ferrand"
	],
	"Provence-Alpes-Côte d'Azur": [
		"Marseille",
		"Nice",
		"Toulon",
		"Aix-en-Provence",
		"Cannes"
	],
	Tokyo: [
		"Shinjuku",
		"Shibuya",
		"Chiyoda",
		"Minato",
		"Ginza",
		"Akihabara"
	],
	Osaka: [
		"Osaka City",
		"Sakai",
		"Higashiosaka"
	],
	Kanagawa: [
		"Yokohama",
		"Kawasaki",
		"Kamakura"
	],
	Kyoto: [
		"Kyoto City",
		"Uji",
		"Kameoka"
	],
	"Central Region": [
		"Marina Bay",
		"Orchard",
		"Bugis",
		"Tanjong Pagar"
	],
	"East Region": [
		"Tampines",
		"Bedok",
		"Pasir Ris",
		"Changi"
	],
	"West Region": [
		"Jurong East",
		"Jurong West",
		"Clementi",
		"Bukit Batok"
	]
};
function getStatesForCountry(country) {
	return STATES_BY_COUNTRY[country] || ["Central Region", "State / Province"];
}
function getCitiesForState(state) {
	return CITIES_BY_STATE[state] || ["City Center", "Capital District"];
}
var _jsxFileName$7 = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/components/AccountModal.tsx";
function AccountModal({ user, onClose, onLogout, onGoogleLogin, onUpdateProfile }) {
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [nameInput, setNameInput] = (0, import_react.useState)(user?.displayName || "Aadi");
	const [countryInput, setCountryInput] = (0, import_react.useState)(user?.country || "India");
	const [stateInput, setStateInput] = (0, import_react.useState)(user?.state || "Maharashtra");
	const [cityInput, setCityInput] = (0, import_react.useState)(user?.city || "Mumbai");
	const [saveError, setSaveError] = (0, import_react.useState)(null);
	const [currentTrack, setCurrentTrack] = (0, import_react.useState)(sound.getCurrentTrack());
	const [isMuted, setIsMuted] = (0, import_react.useState)(sound.isMuted);
	(0, import_react.useEffect)(() => {
		return sound.onTrackChange((_idx, track) => {
			setCurrentTrack(track);
		});
	}, []);
	const { username, setUsername, status: usernameStatus, message: usernameMessage, isValid: isUsernameValid, isChecking, retry } = useUsernameCheck(user?.username || "", user?.id || "");
	const handleSaveProfile = () => {
		setSaveError(null);
		if (!nameInput.trim()) {
			setSaveError("Detective name cannot be empty");
			return;
		}
		if (user?.isGuest) {
			onUpdateProfile({
				displayName: nameInput.trim(),
				country: countryInput,
				state: stateInput,
				city: cityInput.trim() || void 0
			});
			setEditing(false);
			return;
		}
		if (username && username !== user?.username && !isUsernameValid) {
			setSaveError("Please pick a valid, available username before saving.");
			return;
		}
		onUpdateProfile({
			displayName: nameInput.trim(),
			username: username.trim() || void 0,
			country: countryInput,
			state: stateInput,
			city: cityInput.trim() || void 0
		});
		setEditing(false);
	};
	const currentStates = getStatesForCountry(countryInput);
	const currentCities = getCitiesForState(stateInput);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "notebook relative w-full max-w-md max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-sm bg-card p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 rotate-[-1deg]" }, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 111,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between border-b-2 border-foreground/30 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "text-2xl sm:text-3xl font-display text-foreground",
						children: "Detective Dossier"
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 115,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: onClose,
						className: "rounded p-1 hover:bg-secondary text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-6 w-6" }, void 0, false, {
							fileName: _jsxFileName$7,
							lineNumber: 117,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 116,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$7,
					lineNumber: 114,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col items-center text-center space-y-3 font-hand",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative",
							children: [user?.avatarUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: user.avatarUrl,
								alt: user.displayName,
								className: "sketch h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-foreground"
							}, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 126,
								columnNumber: 15
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "sketch flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-accent/20 border-2 border-foreground",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
									src: "/detective.png",
									alt: "Detective",
									className: "h-14 w-14 sm:h-16 sm:w-16 object-contain"
								}, void 0, false, {
									fileName: _jsxFileName$7,
									lineNumber: 133,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 132,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "absolute -bottom-1 -right-1 rounded-full bg-accent p-1 text-accent-foreground text-xs font-bold border border-foreground shadow-xs",
								children: "🕵️"
							}, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 136,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$7,
							lineNumber: 124,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "w-full space-y-2",
							children: editing ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-3 text-left bg-white/75 p-3 sm:p-4 rounded border border-foreground/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "text-xs font-bold text-foreground block mb-0.5",
										children: "Detective Name:"
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 147,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										type: "text",
										value: nameInput,
										onChange: (e) => setNameInput(e.target.value),
										className: "sketch w-full bg-white px-2.5 py-1 font-bold text-base text-foreground focus:outline-none",
										maxLength: 25,
										placeholder: "e.g. Aadi"
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 148,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 146,
										columnNumber: 17
									}, this),
									user?.isGuest ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "bg-amber-50/90 border border-amber-300/80 rounded-md p-2.5 sm:p-3 space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center justify-between flex-wrap gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
													className: "text-xs font-bold text-foreground flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "h-3.5 w-3.5 text-amber-700" }, void 0, false, {
														fileName: _jsxFileName$7,
														lineNumber: 163,
														columnNumber: 25
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Username Handle:" }, void 0, false, {
														fileName: _jsxFileName$7,
														lineNumber: 164,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName$7,
													lineNumber: 162,
													columnNumber: 23
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-[10px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300",
													children: "🔒 Lock (Unlock using Sign Up)"
												}, void 0, false, {
													fileName: _jsxFileName$7,
													lineNumber: 166,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$7,
												lineNumber: 161,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-[11px] text-amber-950/80 font-sans leading-tight",
												children: [
													"Apna manpasand custom ",
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
														className: "font-mono",
														children: "@username"
													}, void 0, false, {
														fileName: _jsxFileName$7,
														lineNumber: 171,
														columnNumber: 45
													}, this),
													" handle claim karne ke liye Google se sign up karein. Abhi guest mode me yeh locked hai."
												]
											}, void 0, true, {
												fileName: _jsxFileName$7,
												lineNumber: 170,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
												type: "button",
												onClick: onGoogleLogin,
												className: "sketch w-full flex items-center justify-center gap-2 bg-primary py-1.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
													className: "h-3.5 w-3.5",
													viewBox: "0 0 24 24",
													children: [
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
															fill: "currentColor",
															d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
														}, void 0, false, {
															fileName: _jsxFileName$7,
															lineNumber: 179,
															columnNumber: 25
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
															fill: "currentColor",
															d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
														}, void 0, false, {
															fileName: _jsxFileName$7,
															lineNumber: 183,
															columnNumber: 25
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
															fill: "currentColor",
															d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
														}, void 0, false, {
															fileName: _jsxFileName$7,
															lineNumber: 187,
															columnNumber: 25
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
															fill: "currentColor",
															d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
														}, void 0, false, {
															fileName: _jsxFileName$7,
															lineNumber: 191,
															columnNumber: 25
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName$7,
													lineNumber: 178,
													columnNumber: 23
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Sign in with Google to Unlock @username" }, void 0, false, {
													fileName: _jsxFileName$7,
													lineNumber: 196,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$7,
												lineNumber: 173,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 160,
										columnNumber: 19
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-between mb-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
												className: "text-xs font-bold text-foreground flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AtSign, { className: "h-3 w-3 text-accent" }, void 0, false, {
													fileName: _jsxFileName$7,
													lineNumber: 203,
													columnNumber: 25
												}, this), " Username handle:"]
											}, void 0, true, {
												fileName: _jsxFileName$7,
												lineNumber: 202,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-muted-foreground",
												children: "3-20 chars (a-z, 0-9, ., _)"
											}, void 0, false, {
												fileName: _jsxFileName$7,
												lineNumber: 205,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$7,
											lineNumber: 201,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "relative",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "absolute left-2.5 top-1.5 text-sm font-bold text-muted-foreground select-none",
													children: "@"
												}, void 0, false, {
													fileName: _jsxFileName$7,
													lineNumber: 208,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
													type: "text",
													value: username,
													onChange: (e) => setUsername(e.target.value),
													className: "sketch w-full bg-white pl-7 pr-8 py-1 font-mono text-sm text-foreground lowercase focus:outline-none",
													maxLength: 20,
													placeholder: "apna_username",
													autoComplete: "off",
													autoCapitalize: "none",
													spellCheck: false
												}, void 0, false, {
													fileName: _jsxFileName$7,
													lineNumber: 211,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "absolute right-2.5 top-1.5",
													children: [
														isChecking && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 animate-spin text-accent" }, void 0, false, {
															fileName: _jsxFileName$7,
															lineNumber: 225,
															columnNumber: 40
														}, this),
														!isChecking && usernameStatus === "available" && /* @__PURE__ */ (void 0)(Check, { className: "h-4 w-4 text-emerald-600 font-bold" }, void 0, false, {
															fileName: _jsxFileName$7,
															lineNumber: 227,
															columnNumber: 27
														}, this),
														!isChecking && usernameStatus === "taken" && /* @__PURE__ */ (void 0)(X, { className: "h-4 w-4 text-rose-600 font-bold" }, void 0, false, {
															fileName: _jsxFileName$7,
															lineNumber: 230,
															columnNumber: 27
														}, this),
														!isChecking && usernameStatus === "invalid" && /* @__PURE__ */ (void 0)(CircleAlert, { className: "h-4 w-4 text-amber-600" }, void 0, false, {
															fileName: _jsxFileName$7,
															lineNumber: 233,
															columnNumber: 27
														}, this),
														!isChecking && usernameStatus === "error" && /* @__PURE__ */ (void 0)("button", {
															type: "button",
															onClick: retry,
															title: "Click to retry",
															children: /* @__PURE__ */ (void 0)(RefreshCw, { className: "h-4 w-4 text-rose-500 hover:rotate-180 transition-transform" }, void 0, false, {
																fileName: _jsxFileName$7,
																lineNumber: 237,
																columnNumber: 29
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName$7,
															lineNumber: 236,
															columnNumber: 27
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName$7,
													lineNumber: 224,
													columnNumber: 23
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$7,
											lineNumber: 207,
											columnNumber: 21
										}, this),
										usernameMessage && /* @__PURE__ */ (void 0)("p", {
											className: `text-[11px] font-sans mt-1 flex items-center gap-1 ${usernameStatus === "available" ? "text-emerald-700 font-semibold" : usernameStatus === "taken" ? "text-rose-700 font-semibold" : usernameStatus === "invalid" ? "text-amber-700" : usernameStatus === "error" ? "text-rose-600" : "text-muted-foreground"}`,
											children: [
												usernameStatus === "available" && "✅ ",
												usernameStatus === "taken" && "❌ ",
												usernameStatus === "invalid" && "⚠️ ",
												usernameMessage
											]
										}, void 0, true, {
											fileName: _jsxFileName$7,
											lineNumber: 245,
											columnNumber: 23
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 200,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "text-xs font-bold text-foreground block mb-0.5",
											children: "Country:"
										}, void 0, false, {
											fileName: _jsxFileName$7,
											lineNumber: 270,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
											value: countryInput,
											onChange: (e) => {
												const newCountry = e.target.value;
												setCountryInput(newCountry);
												const states = getStatesForCountry(newCountry);
												if (states && states[0]) {
													setStateInput(states[0]);
													const cities = getCitiesForState(states[0]);
													if (cities && cities[0]) setCityInput(cities[0]);
												}
											},
											className: "sketch w-full bg-white px-2 py-1 text-xs text-foreground focus:outline-none",
											children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
												value: c,
												children: c
											}, c, false, {
												fileName: _jsxFileName$7,
												lineNumber: 286,
												columnNumber: 25
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName$7,
											lineNumber: 271,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName$7,
											lineNumber: 269,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "text-xs font-bold text-foreground block mb-0.5",
											children: "State / Region:"
										}, void 0, false, {
											fileName: _jsxFileName$7,
											lineNumber: 294,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
											value: stateInput,
											onChange: (e) => {
												const newState = e.target.value;
												setStateInput(newState);
												const cities = getCitiesForState(newState);
												if (cities && cities[0]) setCityInput(cities[0]);
											},
											className: "sketch w-full bg-white px-2 py-1 text-xs text-foreground focus:outline-none",
											children: currentStates.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
												value: s,
												children: s
											}, s, false, {
												fileName: _jsxFileName$7,
												lineNumber: 306,
												columnNumber: 25
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName$7,
											lineNumber: 295,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName$7,
											lineNumber: 293,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 268,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "text-xs font-bold text-foreground block mb-0.5",
											children: "City 🏙️:"
										}, void 0, false, {
											fileName: _jsxFileName$7,
											lineNumber: 316,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											type: "text",
											list: "city-suggestions",
											value: cityInput,
											onChange: (e) => setCityInput(e.target.value),
											className: "sketch w-full bg-white px-2.5 py-1 text-xs text-foreground focus:outline-none",
											placeholder: "e.g. Mumbai, Delhi, Bengaluru, Pune",
											maxLength: 35
										}, void 0, false, {
											fileName: _jsxFileName$7,
											lineNumber: 317,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("datalist", {
											id: "city-suggestions",
											children: currentCities.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: c }, c, false, {
												fileName: _jsxFileName$7,
												lineNumber: 328,
												columnNumber: 23
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName$7,
											lineNumber: 326,
											columnNumber: 19
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 315,
										columnNumber: 17
									}, this),
									saveError && /* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-rose-700 bg-rose-50 p-1.5 rounded border border-rose-300 font-sans",
										children: saveError
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 334,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex justify-end gap-2 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => {
												setEditing(false);
												setSaveError(null);
											},
											className: "sketch bg-secondary px-3 py-1 text-xs font-bold",
											children: "Cancel"
										}, void 0, false, {
											fileName: _jsxFileName$7,
											lineNumber: 340,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: handleSaveProfile,
											className: "sketch flex items-center gap-1 bg-accent px-3 py-1 text-xs font-bold text-accent-foreground hover:brightness-105",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-3.5 w-3.5" }, void 0, false, {
												fileName: _jsxFileName$7,
												lineNumber: 355,
												columnNumber: 21
											}, this), " Save Changes"]
										}, void 0, true, {
											fileName: _jsxFileName$7,
											lineNumber: 350,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 339,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$7,
								lineNumber: 144,
								columnNumber: 15
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-center gap-2 flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
												className: "text-2xl font-bold font-display text-foreground",
												children: user?.displayName || "Guest"
											}, void 0, false, {
												fileName: _jsxFileName$7,
												lineNumber: 362,
												columnNumber: 19
											}, this),
											user?.isGuest && /* @__PURE__ */ (void 0)("span", {
												className: "text-[10px] font-sans font-bold bg-muted px-2 py-0.5 rounded border border-foreground/30 text-muted-foreground",
												children: "Guest"
											}, void 0, false, {
												fileName: _jsxFileName$7,
												lineNumber: 366,
												columnNumber: 21
											}, this),
											user?.username ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-xs font-mono font-bold bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full border border-foreground/20",
												children: ["@", user.username]
											}, void 0, true, {
												fileName: _jsxFileName$7,
												lineNumber: 371,
												columnNumber: 21
											}, this) : user?.isGuest ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
												type: "button",
												onClick: onGoogleLogin,
												className: "inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300 transition-colors cursor-pointer shadow-2xs",
												title: "Sign in with Google to unlock custom @username handle",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "h-3 w-3 text-amber-700" }, void 0, false, {
													fileName: _jsxFileName$7,
													lineNumber: 381,
													columnNumber: 23
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Lock (Unlock using Sign Up)" }, void 0, false, {
													fileName: _jsxFileName$7,
													lineNumber: 382,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$7,
												lineNumber: 375,
												columnNumber: 21
											}, this) : null,
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
												onClick: () => setEditing(true),
												className: "text-xs text-accent hover:underline font-bold px-1.5 py-0.5 rounded bg-accent/10",
												children: "Edit ✏️"
											}, void 0, false, {
												fileName: _jsxFileName$7,
												lineNumber: 385,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 361,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs text-muted-foreground flex items-center justify-center gap-1 flex-wrap",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "h-3.5 w-3.5 text-accent" }, void 0, false, {
											fileName: _jsxFileName$7,
											lineNumber: 393,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
											user?.city ? `${user.city}, ` : "Mumbai, ",
											user?.state || stateInput || "Maharashtra",
											", ",
											user?.country || countryInput || "India"
										] }, void 0, true, {
											fileName: _jsxFileName$7,
											lineNumber: 394,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 392,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-muted-foreground/80",
										children: user?.email || "guest@imposterworld.local"
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 399,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$7,
								lineNumber: 360,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$7,
							lineNumber: 142,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-3 gap-2 w-full pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "sketch bg-white/75 p-2 sm:p-3 rounded text-center",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xl sm:text-2xl font-bold font-display text-primary",
										children: user?.matchesPlayed ?? 0
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 407,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[10px] sm:text-xs font-bold text-muted-foreground",
										children: "MATCHES"
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 410,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$7,
									lineNumber: 406,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "sketch bg-white/75 p-2 sm:p-3 rounded text-center",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xl sm:text-2xl font-bold font-display text-accent",
										children: user?.wins ?? 0
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 414,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[10px] sm:text-xs font-bold text-muted-foreground",
										children: "WINS"
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 417,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$7,
									lineNumber: 413,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "sketch bg-white/75 p-2 sm:p-3 rounded text-center",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xl sm:text-2xl font-bold font-display text-foreground",
										children: user ? `${user.winRate}%` : "0%"
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 421,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[10px] sm:text-xs font-bold text-muted-foreground",
										children: "WIN RATE"
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 424,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$7,
									lineNumber: 420,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$7,
							lineNumber: 405,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "sketch bg-[#FFFBEA] p-2.5 sm:p-3 rounded border border-foreground/30 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-xs font-bold text-foreground flex items-center gap-1.5 truncate",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Music, { className: "h-3.5 w-3.5 text-accent shrink-0" }, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 432,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "truncate",
										children: currentTrack.name
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 433,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$7,
									lineNumber: 431,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "bg-primary/10 text-primary px-1 rounded font-bold",
										children: "Auto-Switching"
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 436,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "truncate",
										children: currentTrack.mood
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 437,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$7,
									lineNumber: 435,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$7,
								lineNumber: 430,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-1 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => {
										sound.nextTrack();
										setCurrentTrack(sound.getCurrentTrack());
									},
									className: "sketch px-2 py-1 text-xs bg-card hover:bg-secondary flex items-center gap-1 font-bold cursor-pointer",
									title: "Skip to next song",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Next" }, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 451,
										columnNumber: 17
									}, this), " ⏭️"]
								}, void 0, true, {
									fileName: _jsxFileName$7,
									lineNumber: 442,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => {
										const muted = sound.toggleMute();
										setIsMuted(muted);
									},
									className: `sketch px-2.5 py-1 text-xs font-bold flex items-center gap-1 cursor-pointer ${isMuted ? "bg-secondary text-foreground" : "bg-accent text-accent-foreground"}`,
									title: isMuted ? "Unmute Sound" : "Mute Sound",
									children: [isMuted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(VolumeX, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 464,
										columnNumber: 28
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Volume2, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 464,
										columnNumber: 66
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: isMuted ? "Muted" : "On" }, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 465,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$7,
									lineNumber: 453,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$7,
								lineNumber: 441,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$7,
							lineNumber: 429,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$7,
					lineNumber: 122,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2 pt-2 border-t-2 border-foreground/30 font-hand",
					children: [
						Boolean(user?.isAdmin) && /* @__PURE__ */ (void 0)("a", {
							href: "/admin",
							className: "sketch w-full bg-primary text-primary-foreground py-2 text-sm font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-xs cursor-pointer text-center",
							children: "🎓 Open Principal Admin Console"
						}, void 0, false, {
							fileName: _jsxFileName$7,
							lineNumber: 474,
							columnNumber: 13
						}, this),
						user?.isGuest ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: onGoogleLogin,
							className: "sketch w-full flex items-center justify-center gap-2 bg-primary py-2.5 text-sm sm:text-base font-bold text-primary-foreground hover:brightness-110",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
								className: "h-4 w-4",
								viewBox: "0 0 24 24",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
										fill: "currentColor",
										d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 487,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
										fill: "currentColor",
										d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 491,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
										fill: "currentColor",
										d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 495,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
										fill: "currentColor",
										d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 499,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$7,
								lineNumber: 486,
								columnNumber: 15
							}, this), "Link Verified Google Account"]
						}, void 0, true, {
							fileName: _jsxFileName$7,
							lineNumber: 482,
							columnNumber: 13
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: onLogout,
							className: "sketch w-full flex items-center justify-center gap-2 bg-secondary py-2 text-sm sm:text-base font-bold text-destructive hover:bg-destructive/10",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 511,
								columnNumber: 15
							}, this), " Sign Out"]
						}, void 0, true, {
							fileName: _jsxFileName$7,
							lineNumber: 507,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: onClose,
							className: "sketch w-full bg-card py-2 text-sm sm:text-base font-bold text-foreground hover:bg-secondary",
							children: "Back to Dashboard"
						}, void 0, false, {
							fileName: _jsxFileName$7,
							lineNumber: 515,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$7,
					lineNumber: 472,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$7,
			lineNumber: 110,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$7,
		lineNumber: 109,
		columnNumber: 5
	}, this);
}
var _jsxFileName$6 = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/components/LeaderboardModal.tsx";
function LeaderboardModal({ onClose }) {
	const [scope, setScope] = (0, import_react.useState)("global");
	const [selectedCountry, setSelectedCountry] = (0, import_react.useState)("India");
	const [selectedState, setSelectedState] = (0, import_react.useState)("Maharashtra");
	const [selectedCity, setSelectedCity] = (0, import_react.useState)("Mumbai");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const deferredSearch = (0, import_react.useDeferredValue)(searchQuery);
	const [entries, setEntries] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const fetchRankings = (0, import_react.useCallback)(() => {
		setLoading(true);
		const params = new URLSearchParams();
		params.set("scope", scope);
		if (scope === "country" || scope === "state" || scope === "city") params.set("country", selectedCountry);
		if (scope === "state" || scope === "city") params.set("state", selectedState);
		if (scope === "city") params.set("city", selectedCity);
		if (deferredSearch.trim()) params.set("search", deferredSearch.trim());
		fetch(`${API_BASE}/api/leaderboard?${params.toString()}`).then((res) => res.json()).then((data) => {
			if (data.leaderboard) setEntries(data.leaderboard);
		}).catch((err) => console.error("Leaderboard fetch error:", err)).finally(() => setLoading(false));
	}, [
		scope,
		selectedCountry,
		selectedState,
		selectedCity,
		deferredSearch
	]);
	(0, import_react.useEffect)(() => {
		fetchRankings();
	}, [fetchRankings]);
	const stateList = getStatesForCountry(selectedCountry);
	const cityList = getCitiesForState(selectedState);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "notebook relative w-full max-w-xl max-h-[92vh] flex flex-col overflow-x-hidden rounded-sm bg-card p-4 sm:p-6 md:p-8 space-y-3.5 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 rotate-[1deg]" }, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 71,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between border-b-2 border-foreground/30 pb-3 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
							src: "/trophy-gold.png",
							alt: "Trophy",
							className: "h-9 w-9 sm:h-11 sm:w-11 object-contain drop-shadow-sm"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 76,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-xs font-bold text-accent uppercase font-hand",
							children: "Hall of Fame"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 82,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-2xl sm:text-3xl font-display text-foreground leading-none",
							children: "Classroom Rankings"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 83,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 81,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 75,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: onClose,
						className: "rounded p-1 hover:bg-secondary text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-6 w-6" }, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 89,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 88,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 74,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative shrink-0 font-hand",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 95,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "Search detective name or @username...",
							className: "sketch w-full bg-white pl-9 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 96,
							columnNumber: 11
						}, this),
						searchQuery && /* @__PURE__ */ (void 0)("button", {
							onClick: () => setSearchQuery(""),
							className: "absolute right-2.5 top-2 text-xs text-muted-foreground hover:text-foreground font-bold p-1",
							children: "✕"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 104,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 94,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-4 gap-1 sm:gap-1.5 bg-white/70 p-1 rounded border border-foreground/30 shrink-0 font-hand",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setScope("global"),
							className: `sketch flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold transition-all ${scope === "global" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Globe, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 124,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Global 🌍" }, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 125,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 115,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setScope("country"),
							className: `sketch flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold transition-all ${scope === "country" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Flag, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 137,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Country 🇮🇳" }, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 138,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 128,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setScope("state"),
							className: `sketch flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold transition-all ${scope === "state" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 150,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "State 🏛️" }, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 151,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 141,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setScope("city"),
							className: `sketch flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold transition-all ${scope === "city" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Building2, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 163,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "City 🏙️" }, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 164,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 154,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 114,
					columnNumber: 9
				}, this),
				scope !== "global" && /* @__PURE__ */ (void 0)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0 font-hand bg-white/50 p-2 rounded border border-foreground/20",
					children: [
						/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
							className: "text-[10px] font-bold text-foreground block mb-0.5",
							children: "Country:"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 172,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("select", {
							value: selectedCountry,
							onChange: (e) => {
								const newCountry = e.target.value;
								setSelectedCountry(newCountry);
								const states = getStatesForCountry(newCountry);
								if (states && states.length > 0 && states[0]) {
									setSelectedState(states[0]);
									const cities = getCitiesForState(states[0]);
									if (cities && cities.length > 0 && cities[0]) setSelectedCity(cities[0]);
								}
							},
							className: "sketch w-full bg-white px-2 py-1 text-xs text-foreground focus:outline-none",
							children: COUNTRIES.map((c) => /* @__PURE__ */ (void 0)("option", {
								value: c,
								children: c
							}, c, false, {
								fileName: _jsxFileName$6,
								lineNumber: 190,
								columnNumber: 19
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 173,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 171,
							columnNumber: 13
						}, this),
						(scope === "state" || scope === "city") && /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
							className: "text-[10px] font-bold text-foreground block mb-0.5",
							children: "State / Region:"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 199,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("select", {
							value: selectedState,
							onChange: (e) => {
								const newState = e.target.value;
								setSelectedState(newState);
								const cities = getCitiesForState(newState);
								if (cities && cities.length > 0 && cities[0]) setSelectedCity(cities[0]);
							},
							className: "sketch w-full bg-white px-2 py-1 text-xs text-foreground focus:outline-none",
							children: stateList.map((s) => /* @__PURE__ */ (void 0)("option", {
								value: s,
								children: s
							}, s, false, {
								fileName: _jsxFileName$6,
								lineNumber: 213,
								columnNumber: 21
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 200,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 198,
							columnNumber: 15
						}, this),
						scope === "city" && /* @__PURE__ */ (void 0)("div", { children: [
							/* @__PURE__ */ (void 0)("label", {
								className: "text-[10px] font-bold text-foreground block mb-0.5",
								children: "City 🏙️:"
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 223,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("input", {
								type: "text",
								list: "leaderboard-city-suggestions",
								value: selectedCity,
								onChange: (e) => setSelectedCity(e.target.value),
								className: "sketch w-full bg-white px-2 py-1 text-xs text-foreground focus:outline-none",
								placeholder: "e.g. Mumbai"
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 224,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("datalist", {
								id: "leaderboard-city-suggestions",
								children: cityList.map((c) => /* @__PURE__ */ (void 0)("option", { value: c }, c, false, {
									fileName: _jsxFileName$6,
									lineNumber: 234,
									columnNumber: 21
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 232,
								columnNumber: 17
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 222,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 170,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2 flex-1 overflow-y-auto font-hand pr-1",
					children: loading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-center py-10 text-muted-foreground",
						children: "Checking classroom rankings... 📜"
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 245,
						columnNumber: 13
					}, this) : entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-center py-8 text-muted-foreground space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-2xl",
								children: "🏆"
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 248,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-bold",
								children: deferredSearch ? `No detectives found matching "${deferredSearch}"` : "No completed matches recorded yet!"
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 249,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs",
								children: deferredSearch ? "Try checking the spelling or searching another name/handle." : "Play a match and be the #1 ranked detective here!"
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 252,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 247,
						columnNumber: 13
					}, this) : entries.map((entry, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "sketch flex items-center justify-between p-2.5 sm:p-3 bg-white/80 hover:bg-white transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: `flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-bold shadow-xs ${idx === 0 ? "bg-yellow-400 text-yellow-950 font-display ring-2 ring-yellow-500" : idx === 1 ? "bg-slate-300 text-slate-800 font-display ring-1 ring-slate-400" : idx === 2 ? "bg-amber-600 text-white font-display ring-1 ring-amber-700" : "bg-secondary text-foreground"}`,
								children: idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 265,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-1.5 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-bold text-sm sm:text-base text-foreground truncate",
											children: entry.displayName
										}, void 0, false, {
											fileName: _jsxFileName$6,
											lineNumber: 280,
											columnNumber: 23
										}, this),
										entry.username && /* @__PURE__ */ (void 0)("span", {
											className: "text-[10px] font-mono font-bold bg-accent/20 text-accent-foreground px-1.5 py-0.2 rounded-full border border-foreground/15",
											children: ["@", entry.username]
										}, void 0, true, {
											fileName: _jsxFileName$6,
											lineNumber: 284,
											columnNumber: 25
										}, this),
										!entry.isGuest ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] font-mono font-bold bg-primary/15 text-primary px-1.5 py-0.2 rounded-full border border-primary/20",
											children: "Verified 🎓"
										}, void 0, false, {
											fileName: _jsxFileName$6,
											lineNumber: 289,
											columnNumber: 25
										}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] font-mono font-bold bg-secondary text-muted-foreground px-1.5 py-0.2 rounded-full border border-foreground/15",
											children: "Guest 👤"
										}, void 0, false, {
											fileName: _jsxFileName$6,
											lineNumber: 293,
											columnNumber: 25
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$6,
									lineNumber: 279,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap",
									children: [entry.matchesPlayed === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-primary font-semibold",
										children: "New Detective 🌟"
									}, void 0, false, {
										fileName: _jsxFileName$6,
										lineNumber: 300,
										columnNumber: 25
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [entry.matchesPlayed, " matches"] }, void 0, true, {
											fileName: _jsxFileName$6,
											lineNumber: 303,
											columnNumber: 27
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
											fileName: _jsxFileName$6,
											lineNumber: 304,
											columnNumber: 27
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [entry.winRate, "% win rate"] }, void 0, true, {
											fileName: _jsxFileName$6,
											lineNumber: 305,
											columnNumber: 27
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName$6,
										lineNumber: 302,
										columnNumber: 25
									}, this), (entry.city || entry.state || entry.country) && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("span", { children: "•" }, void 0, false, {
										fileName: _jsxFileName$6,
										lineNumber: 310,
										columnNumber: 27
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "text-accent font-semibold truncate max-w-[150px]",
										children: [
											"📍 ",
											entry.city ? `${entry.city}, ` : "",
											entry.state ? `${entry.state}, ` : "",
											entry.country || "India"
										]
									}, void 0, true, {
										fileName: _jsxFileName$6,
										lineNumber: 311,
										columnNumber: 27
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$6,
										lineNumber: 309,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$6,
									lineNumber: 298,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$6,
								lineNumber: 278,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 264,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-right shrink-0 pl-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-display text-lg sm:text-xl font-bold text-accent",
								children: [
									entry.wins,
									" ",
									entry.wins === 1 ? "Win" : "Wins"
								]
							}, void 0, true, {
								fileName: _jsxFileName$6,
								lineNumber: 323,
								columnNumber: 19
							}, this), Boolean(entry.imposterWins) && /* @__PURE__ */ (void 0)("div", {
								className: "text-[10px] text-muted-foreground font-sans",
								children: [
									"🕵️ ",
									entry.imposterWins,
									" Imposter"
								]
							}, void 0, true, {
								fileName: _jsxFileName$6,
								lineNumber: 327,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 322,
							columnNumber: 17
						}, this)]
					}, entry._id, true, {
						fileName: _jsxFileName$6,
						lineNumber: 260,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 243,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pt-2 border-t-2 border-foreground/30 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: onClose,
						className: "sketch w-full bg-secondary py-2 text-sm sm:text-base font-bold text-foreground hover:bg-secondary/80",
						children: "Close"
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 339,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 338,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$6,
			lineNumber: 70,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$6,
		lineNumber: 69,
		columnNumber: 5
	}, this);
}
var _jsxFileName$5 = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/components/PublicRoomsModal.tsx";
function PublicRoomsModal({ rooms, onJoinRoom, onCreateRoom, onRefresh, onClose }) {
	const [filterMode, setFilterMode] = (0, import_react.useState)("all");
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const handleRefresh = () => {
		sound.playPop();
		setRefreshing(true);
		onRefresh();
		setTimeout(() => setRefreshing(false), 500);
	};
	const filtered = rooms.filter((r) => {
		if (filterMode === "all") return true;
		return r.settings.gameMode === filterMode;
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "notebook relative w-full max-w-2xl max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-sm bg-card p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" }, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 52,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between border-b-2 border-foreground/30 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Globe, { className: "h-5 w-5 sm:h-6 sm:w-6 text-accent" }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 57,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-2xl sm:text-3xl font-display text-foreground",
							children: "Public Classrooms"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 58,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 56,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							sound.playPop();
							onClose();
						},
						className: "rounded p-1 hover:bg-secondary text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-6 w-6" }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 67,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 60,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 55,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 font-hand text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-bold text-muted-foreground mr-1",
							children: "MODE:"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 75,
							columnNumber: 13
						}, this), [
							"all",
							"normal",
							"double_imposter",
							"word_guess"
						].map((mode) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => {
								sound.playPop();
								setFilterMode(mode);
							},
							className: `sketch px-2.5 py-1 text-xs capitalize ${filterMode === mode ? "bg-accent text-accent-foreground font-bold" : "bg-white text-foreground hover:bg-secondary"}`,
							children: mode === "all" ? "All" : mode.replace("_", " ")
						}, mode, false, {
							fileName: _jsxFileName$5,
							lineNumber: 77,
							columnNumber: 15
						}, this))]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 74,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: handleRefresh,
							disabled: refreshing,
							className: "sketch flex items-center gap-1 bg-secondary px-3 py-1 font-bold text-xs hover:bg-secondary/80 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: `h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}` }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 101,
								columnNumber: 15
							}, this), " Refresh"]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 96,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => {
								sound.playPop();
								onClose();
								onCreateRoom();
							},
							className: "sketch flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 font-bold text-xs hover:brightness-110",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 111,
								columnNumber: 15
							}, this), " Host Room"]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 103,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 95,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 72,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2.5 max-h-80 overflow-y-auto pr-1 font-hand",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "sketch bg-white/70 p-8 text-center space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xl font-display text-muted-foreground",
								children: "No active public classrooms found right now. 📭"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 120,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: "Be the first teacher! Create a public room and students will join instantly."
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 123,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => {
									sound.playPop();
									onClose();
									onCreateRoom();
								},
								className: "sketch bg-accent text-accent-foreground px-5 py-2 font-bold text-sm",
								children: "Create Public Room 🚀"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 126,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 119,
						columnNumber: 13
					}, this) : filtered.map((r) => {
						const hostName = r.players.find((p) => p.isHost)?.displayName || "Host";
						const isFull = r.players.length >= r.settings.capacity;
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "sketch bg-white/90 p-3.5 flex items-center justify-between gap-3 hover:shadow-md transition-shadow",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-3 overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "h-10 w-10 shrink-0 rounded-full bg-accent/20 border border-foreground/30 flex items-center justify-center font-bold text-accent font-display text-lg",
									children: hostName.charAt(0).toUpperCase()
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 148,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "truncate",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-bold text-base text-foreground truncate",
											children: r.settings.name || `${hostName}'s Room`
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 153,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "rounded bg-secondary px-1.5 text-[10px] font-bold text-muted-foreground uppercase border border-line",
											children: ["#", r.roomCode]
										}, void 0, true, {
											fileName: _jsxFileName$5,
											lineNumber: 156,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 152,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs text-muted-foreground flex items-center gap-2 pt-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Host: ", hostName] }, void 0, true, {
												fileName: _jsxFileName$5,
												lineNumber: 161,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
												fileName: _jsxFileName$5,
												lineNumber: 162,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "capitalize",
												children: r.settings.gameMode.replace("_", " ")
											}, void 0, false, {
												fileName: _jsxFileName$5,
												lineNumber: 163,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
												fileName: _jsxFileName$5,
												lineNumber: 164,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: r.settings.language }, void 0, false, {
												fileName: _jsxFileName$5,
												lineNumber: 165,
												columnNumber: 25
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 160,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 151,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 147,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-3 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "font-display text-lg font-bold text-primary flex items-center gap-1 justify-end",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 173,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
											r.players.length,
											"/",
											r.settings.capacity
										] }, void 0, true, {
											fileName: _jsxFileName$5,
											lineNumber: 174,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 172,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[10px] text-muted-foreground font-bold",
										children: isFull ? "FULL" : "JOINABLE"
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 178,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 171,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									disabled: isFull,
									onClick: () => {
										sound.playPop();
										onJoinRoom(r.roomCode);
										onClose();
									},
									className: "sketch bg-accent text-accent-foreground px-4 py-1.5 font-bold text-sm disabled:opacity-40 hover:brightness-110",
									children: isFull ? "Full" : "Join"
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 183,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 170,
								columnNumber: 19
							}, this)]
						}, r.roomCode, true, {
							fileName: _jsxFileName$5,
							lineNumber: 143,
							columnNumber: 17
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 117,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pt-2 border-t-2 border-foreground/30 flex justify-between items-center text-xs text-muted-foreground font-hand",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Tip: Private rooms do not appear here and require an invite link." }, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 203,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							sound.playPop();
							onClose();
						},
						className: "sketch bg-secondary px-4 py-1.5 text-sm font-bold text-foreground hover:bg-secondary/80",
						children: "Close"
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 204,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 202,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$5,
			lineNumber: 51,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$5,
		lineNumber: 50,
		columnNumber: 5
	}, this);
}
var _jsxFileName$4 = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/components/NoticeBoardModal.tsx";
function NoticeBoardModal({ onClose, championName }) {
	const [currentBeltHolder, setCurrentBeltHolder] = (0, import_react.useState)(championName || "Loading...");
	(0, import_react.useEffect)(() => {
		if (championName) {
			setCurrentBeltHolder(championName);
			return;
		}
		fetch(`${API_BASE}/api/leaderboard/champion`).then((r) => r.json()).then((d) => {
			if (d && d.success && d.champion) setCurrentBeltHolder(d.champion.name);
			else setCurrentBeltHolder("Top Detective");
		}).catch(() => {
			setCurrentBeltHolder("Top Detective");
		});
	}, [championName]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "notebook relative w-full max-w-2xl max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-sm bg-[#FAF4E4] p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl border-4 border-[#172C53]",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-40 -translate-x-1/2 rotate-[-2deg]" }, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 39,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between border-b-2 border-foreground/30 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pin, { className: "h-5 w-5 sm:h-6 sm:w-6 text-accent" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 44,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-3xl sm:text-4xl font-display text-foreground tracking-wide",
							children: "Classroom Notice Board 📌"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 45,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 43,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							sound.playPop();
							onClose();
						},
						className: "rounded p-1 hover:bg-secondary text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-6 w-6" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 56,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 49,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 42,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4 font-hand pr-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "sketch relative bg-[#FFFBEA] p-4 space-y-2 border-2 border-foreground/40 rotate-[-1deg] shadow-sm overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute -top-3 left-6 h-4 w-12 bg-accent/30 rounded-xs rotate-[3deg]" }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 64,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
									src: "/lightbulb-idea.svg",
									alt: "Lightbulb idea",
									className: "pointer-events-none absolute -bottom-2 -right-2 h-16 w-16 object-contain opacity-75 rotate-[12deg]"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 65,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "text-2xl font-display text-accent flex items-center gap-1.5",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "What Is Imposter World?" }, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 71,
										columnNumber: 15
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 70,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm leading-relaxed text-foreground relative z-10",
									children: "A social deduction party game made for friends and classrooms! Everyone receives the exact same secret word — except the Imposter, who gets a sneaky lookalike word. Clues are given, debates flare up, and secret votes determine who gets caught!"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 73,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 63,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "sketch relative bg-[#EBF3FF] p-4 space-y-2 border-2 border-foreground/40 rotate-[1deg] shadow-sm overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute -top-3 right-6 h-4 w-12 bg-primary/30 rounded-xs rotate-[-3deg]" }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 80,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
									src: "/paper-plane.svg",
									alt: "Paper airplane",
									className: "pointer-events-none absolute -bottom-2 -right-1 h-16 w-16 object-contain opacity-75 rotate-[-10deg]"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 81,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-2xl font-display text-primary",
										children: "Tournament Desk 🏆"
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 87,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "rounded bg-accent text-accent-foreground px-1.5 py-0.5 text-[10px] font-bold",
										children: "NEW"
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 88,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 86,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm text-foreground relative z-10",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Next one today (Wed):" }, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 93,
											columnNumber: 15
										}, this),
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 93,
											columnNumber: 54
										}, this),
										"Top detectives clash in the 8-player bracket!"
									]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 92,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded bg-white/80 p-2 text-xs font-bold text-accent border border-accent/20 relative z-10",
									children: [
										"👑 ",
										currentBeltHolder,
										" currently holds the championship belt!"
									]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 96,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 79,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "sketch relative bg-[#FFF0ED] p-4 space-y-1.5 border-2 border-foreground/40 rotate-[1deg] shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute -top-3 left-10 h-4 w-14 bg-red-400/30 rounded-xs rotate-[-1deg]" }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 103,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "text-2xl font-display text-[#C64132]",
									children: "Classroom Code 🤫"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 104,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
									className: "text-xs space-y-1 text-foreground list-disc pl-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Never say the secret word directly in your clue!" }, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 106,
											columnNumber: 15
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Imposters: Act natural and pretend you know the common word." }, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 107,
											columnNumber: 15
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Secret votes are strictly confidential before the reveal." }, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 108,
											columnNumber: 15
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "No phones under the desk cheating! Server anti-cheat is active." }, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 109,
											columnNumber: 15
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 105,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 102,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "sketch relative bg-[#F3E8FF] p-4 space-y-2 border-2 border-foreground/40 rotate-[-2deg] shadow-sm flex flex-col justify-between",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute -top-3 right-8 h-4 w-12 bg-purple-400/30 rounded-xs rotate-[2deg]" }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 115,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "text-2xl font-display text-purple-900 flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Last Bench Scribble" }, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 118,
											columnNumber: 17
										}, this),
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: "h-4 w-4 text-accent fill-accent" }, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 118,
											columnNumber: 50
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 117,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm italic text-foreground pt-1",
									children: "\"made on the last bench by adi\""
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 120,
									columnNumber: 15
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 116,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-[11px] text-muted-foreground pt-2",
									children: "Doodled with blue ink and paper textures. Share with your friends! ✨"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 124,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 114,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 61,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pt-2 border-t-2 border-foreground/30 flex justify-between items-center font-hand",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs text-muted-foreground italic",
						children: "made on the last bench by adi"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 132,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							sound.playPop();
							onClose();
						},
						className: "sketch bg-secondary px-5 py-1.5 text-sm font-bold text-foreground hover:bg-secondary/80",
						children: "Close Board"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 135,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 131,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 37,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 36,
		columnNumber: 5
	}, this);
}
var _jsxFileName$3 = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/components/VoiceClue.tsx";
function VoiceClueRecorder({ onSubmit, disabled }) {
	const [isRecording, setIsRecording] = (0, import_react.useState)(false);
	const [recordingSeconds, setRecordingSeconds] = (0, import_react.useState)(0);
	const [audioUrl, setAudioUrl] = (0, import_react.useState)(null);
	const [transcript, setTranscript] = (0, import_react.useState)("");
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [micError, setMicError] = (0, import_react.useState)(null);
	const mediaRecorderRef = (0, import_react.useRef)(null);
	const audioChunksRef = (0, import_react.useRef)([]);
	const timerRef = (0, import_react.useRef)(null);
	const audioPlayerRef = (0, import_react.useRef)(null);
	const recognitionRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (SpeechRecognition) try {
			const recognition = new SpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = true;
			recognition.lang = "en-US";
			recognition.onresult = (event) => {
				let currentTranscript = "";
				for (let i = 0; i < event.results.length; i++) currentTranscript += event.results[i][0].transcript + " ";
				setTranscript(currentTranscript.trim());
			};
			recognition.onerror = () => {};
			recognitionRef.current = recognition;
		} catch (e) {}
	}, []);
	const startRecording = async () => {
		try {
			setMicError(null);
			audioChunksRef.current = [];
			setTranscript("");
			setAudioUrl(null);
			const stream = await navigator.mediaDevices.getUserMedia({ audio: {
				channelCount: 1,
				echoCancellation: true,
				noiseSuppression: true
			} });
			const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus") ? "audio/ogg;codecs=opus" : "audio/webm";
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType,
				audioBitsPerSecond: 24e3
			});
			mediaRecorderRef.current = mediaRecorder;
			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) audioChunksRef.current.push(event.data);
			};
			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
				const reader = new FileReader();
				reader.readAsDataURL(audioBlob);
				reader.onloadend = () => {
					const base64data = reader.result;
					setAudioUrl(base64data);
				};
				stream.getTracks().forEach((track) => track.stop());
			};
			mediaRecorder.start(200);
			setIsRecording(true);
			setRecordingSeconds(0);
			timerRef.current = setInterval(() => {
				setRecordingSeconds((prev) => {
					if (prev >= 9) {
						stopRecording();
						return 10;
					}
					return prev + 1;
				});
			}, 1e3);
			try {
				recognitionRef.current?.start();
			} catch (err) {}
		} catch (err) {
			console.error("[VoiceClue] Microphone access error:", err);
			setMicError("Microphone permission denied. Please allow microphone access in your browser.");
		}
	};
	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		try {
			recognitionRef.current?.stop();
		} catch (err) {}
	};
	const togglePlayback = () => {
		if (!audioPlayerRef.current && audioUrl) {
			const audio = new Audio(audioUrl);
			audio.onended = () => setIsPlaying(false);
			audioPlayerRef.current = audio;
		}
		if (audioPlayerRef.current) if (isPlaying) {
			audioPlayerRef.current.pause();
			setIsPlaying(false);
		} else {
			audioPlayerRef.current.play();
			setIsPlaying(true);
		}
	};
	const handleReset = () => {
		if (audioPlayerRef.current) {
			audioPlayerRef.current.pause();
			audioPlayerRef.current = null;
		}
		setAudioUrl(null);
		setTranscript("");
		setIsPlaying(false);
		setRecordingSeconds(0);
	};
	const handleSubmit = () => {
		if (audioUrl) onSubmit(audioUrl, transcript);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "sketch bg-white/95 p-4 sm:p-5 border-2 border-accent space-y-4 font-hand shadow-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center justify-between border-b border-foreground/20 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mic, { className: "h-5 w-5 text-accent animate-pulse" }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 172,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-display text-xl sm:text-2xl text-foreground font-bold",
						children: "Live Voice Clue 🎙️"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 173,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 171,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-xs font-bold text-muted-foreground uppercase",
					children: "Max 10s voice hint"
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 177,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 170,
				columnNumber: 7
			}, this),
			micError && /* @__PURE__ */ (void 0)("div", {
				className: "bg-destructive/15 text-destructive p-3 rounded text-xs sm:text-sm border border-destructive/30",
				children: ["⚠️ ", micError]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 183,
				columnNumber: 9
			}, this),
			!audioUrl && /* @__PURE__ */ (void 0)("div", {
				className: "text-center py-4 space-y-4",
				children: [!isRecording ? /* @__PURE__ */ (void 0)("button", {
					type: "button",
					disabled,
					onClick: startRecording,
					className: "sketch group mx-auto flex flex-col items-center justify-center h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-accent text-accent-foreground hover:scale-105 transition-all shadow-md active:scale-95",
					children: [/* @__PURE__ */ (void 0)(Mic, { className: "h-10 w-10 sm:h-12 sm:w-12 group-hover:scale-110 transition-transform" }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 198,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)("span", {
						className: "text-xs font-bold pt-1",
						children: "TAP TO SPEAK"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 199,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 192,
					columnNumber: 13
				}, this) : /* @__PURE__ */ (void 0)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "relative mx-auto flex items-center justify-center h-28 w-28 rounded-full bg-destructive text-white animate-pulse shadow-lg",
							children: [/* @__PURE__ */ (void 0)(Square, {
								className: "h-10 w-10 cursor-pointer",
								onClick: stopRecording
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 204,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "absolute -bottom-2 bg-white text-destructive px-2 py-0.5 rounded-full text-xs font-bold border border-destructive shadow-xs",
								children: [
									"0:0",
									recordingSeconds,
									" / 0:10"
								]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 205,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 203,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-foreground font-bold animate-pulse",
							children: "🎙️ Listening... Speak your subtle hint clearly!"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 209,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: stopRecording,
							className: "sketch bg-secondary px-4 py-1.5 text-xs font-bold hover:bg-secondary/80",
							children: "⏹️ Done Speaking"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 212,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 202,
					columnNumber: 13
				}, this), transcript && /* @__PURE__ */ (void 0)("div", {
					className: "sketch bg-highlight/30 p-2.5 text-xs italic text-foreground max-w-sm mx-auto",
					children: [
						"🗣️ \"",
						transcript,
						"\""
					]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 223,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 190,
				columnNumber: 9
			}, this),
			audioUrl && /* @__PURE__ */ (void 0)("div", {
				className: "sketch bg-highlight/20 p-4 space-y-3 border border-foreground/30 text-center",
				children: [
					/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-center gap-3",
						children: [/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: togglePlayback,
							className: "sketch flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 text-sm font-bold shadow-xs hover:brightness-110",
							children: [isPlaying ? /* @__PURE__ */ (void 0)(Pause, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 239,
								columnNumber: 28
							}, this) : /* @__PURE__ */ (void 0)(Play, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 239,
								columnNumber: 60
							}, this), isPlaying ? "Pause Preview" : "Listen Preview ▶"]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 234,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: handleReset,
							className: "sketch flex items-center gap-1 bg-secondary px-3 py-2 text-xs font-bold hover:bg-secondary/80",
							children: [/* @__PURE__ */ (void 0)(RotateCcw, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 247,
								columnNumber: 15
							}, this), " Re-record"]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 242,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 233,
						columnNumber: 11
					}, this),
					transcript && /* @__PURE__ */ (void 0)("div", {
						className: "text-sm font-bold text-foreground italic pt-1",
						children: [
							"Transcribed: \"",
							transcript,
							"\""
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 252,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "pt-2 flex justify-center",
						children: /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: handleSubmit,
							className: "sketch w-full max-w-xs bg-accent text-accent-foreground py-2.5 text-base font-bold shadow-sm hover:brightness-110 active:scale-98",
							children: "Submit Voice Clue 🚀"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 258,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 257,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 232,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 169,
		columnNumber: 5
	}, this);
}
function VoiceCluePlayer({ audioUrl, transcript }) {
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const audioRef = (0, import_react.useRef)(null);
	const handleToggle = () => {
		if (!audioRef.current) {
			const audio = new Audio(audioUrl);
			audio.onended = () => setIsPlaying(false);
			audioRef.current = audio;
		}
		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			audioRef.current.play();
			setIsPlaying(true);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "sketch bg-highlight/40 p-3 space-y-2 border border-foreground/30 font-hand",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				type: "button",
				onClick: handleToggle,
				className: `sketch flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold shadow-2xs transition-all ${isPlaying ? "bg-accent text-accent-foreground animate-pulse" : "bg-primary text-primary-foreground"}`,
				children: [isPlaying ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pause, { className: "h-3.5 w-3.5" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 302,
					columnNumber: 24
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Play, { className: "h-3.5 w-3.5" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 302,
					columnNumber: 60
				}, this), isPlaying ? "Playing Voice Clue..." : "Play Voice Clue 🎙️"]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 295,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-[11px] font-bold text-muted-foreground uppercase",
				children: "Voice Hint"
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 305,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 294,
			columnNumber: 7
		}, this), transcript && /* @__PURE__ */ (void 0)("div", {
			className: "text-xs sm:text-sm text-foreground italic bg-white/70 p-2 rounded border border-foreground/20",
			children: [
				"🗣️ \"",
				transcript,
				"\""
			]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 311,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 293,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/components/VoiceDiscussionFloor.tsx";
var ICE_SERVERS = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }] };
function VoiceDiscussionFloor({ socket, roomCode, myPlayer, players, speakerFloor, remainingTime, skipDiscussionVotesCount, skipDiscussionRequired, hasVotedSkip, onVoteSkip }) {
	const [isMicOn, setIsMicOn] = (0, import_react.useState)(false);
	const [isSpeakingLocally, setIsSpeakingLocally] = (0, import_react.useState)(false);
	const [activeSpeakers, setActiveSpeakers] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const localStreamRef = (0, import_react.useRef)(null);
	const peerConnectionsRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const audioContextRef = (0, import_react.useRef)(null);
	const analyserRef = (0, import_react.useRef)(null);
	const animFrameRef = (0, import_react.useRef)(null);
	const remoteAudiosRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const [speakerTimeRemaining, setSpeakerTimeRemaining] = (0, import_react.useState)(35);
	const isMyFloor = Boolean(speakerFloor && speakerFloor.currentSpeakerSocketId && myPlayer && speakerFloor.currentSpeakerSocketId === myPlayer.socketId);
	const isHandRaised = Boolean(speakerFloor && myPlayer && speakerFloor.handsRaised?.includes(myPlayer.socketId));
	(0, import_react.useEffect)(() => {
		if (!speakerFloor?.speakerDeadline) {
			setSpeakerTimeRemaining(0);
			return;
		}
		const updateTimer = () => {
			const msLeft = Math.max(0, (speakerFloor.speakerDeadline || 0) - Date.now());
			setSpeakerTimeRemaining(Math.ceil(msLeft / 1e3));
		};
		updateTimer();
		const interval = setInterval(updateTimer, 500);
		return () => clearInterval(interval);
	}, [speakerFloor?.speakerDeadline]);
	const createPeerConnection = (0, import_react.useCallback)((targetSocketId) => {
		if (peerConnectionsRef.current.has(targetSocketId)) return peerConnectionsRef.current.get(targetSocketId);
		const pc = new RTCPeerConnection(ICE_SERVERS);
		if (localStreamRef.current) localStreamRef.current.getAudioTracks().forEach((track) => {
			pc.addTrack(track, localStreamRef.current);
		});
		pc.onicecandidate = (event) => {
			if (event.candidate) socket.emit("voice:signal", {
				to: targetSocketId,
				signal: event.candidate,
				type: "candidate"
			});
		};
		pc.ontrack = (event) => {
			const stream = event.streams[0];
			let audioEl = remoteAudiosRef.current.get(targetSocketId);
			if (!audioEl) {
				audioEl = new Audio();
				audioEl.autoplay = true;
				audioEl.playsInline = true;
				remoteAudiosRef.current.set(targetSocketId, audioEl);
			}
			audioEl.srcObject = stream;
			audioEl.play().catch(() => {});
		};
		peerConnectionsRef.current.set(targetSocketId, pc);
		return pc;
	}, [socket]);
	const toggleMic = async () => {
		sound.playPop();
		if (isMicOn) {
			if (localStreamRef.current) localStreamRef.current.getAudioTracks().forEach((track) => {
				track.enabled = false;
			});
			setIsMicOn(false);
			setIsSpeakingLocally(false);
			socket.emit("voice:speaking", { isSpeaking: false });
			socket.emit("voice:state-change", { isMuted: true });
			toast.info("Mic Muted 🔇");
		} else try {
			if (!localStreamRef.current) {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true
				} });
				localStreamRef.current = stream;
				const AudioContextClass = window.AudioContext || window.webkitAudioContext;
				if (AudioContextClass) {
					const audioCtx = new AudioContextClass();
					const analyser = audioCtx.createAnalyser();
					analyser.fftSize = 256;
					audioCtx.createMediaStreamSource(stream).connect(analyser);
					audioContextRef.current = audioCtx;
					analyserRef.current = analyser;
					const dataArray = new Uint8Array(analyser.frequencyBinCount);
					let speakingState = false;
					const checkVolume = () => {
						if (analyserRef.current && localStreamRef.current?.getAudioTracks()[0]?.enabled) {
							analyserRef.current.getByteFrequencyData(dataArray);
							const isNowSpeaking = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length > 14;
							if (isNowSpeaking !== speakingState) {
								speakingState = isNowSpeaking;
								setIsSpeakingLocally(isNowSpeaking);
								socket.emit("voice:speaking", { isSpeaking: isNowSpeaking });
							}
						}
						animFrameRef.current = requestAnimationFrame(checkVolume);
					};
					animFrameRef.current = requestAnimationFrame(checkVolume);
				}
				peerConnectionsRef.current.forEach((pc) => {
					stream.getAudioTracks().forEach((track) => {
						pc.addTrack(track, stream);
					});
				});
				players.filter((p) => p.socketId !== myPlayer?.socketId && p.isConnected).forEach(async (peer) => {
					const pc = createPeerConnection(peer.socketId);
					try {
						const offer = await pc.createOffer();
						await pc.setLocalDescription(offer);
						socket.emit("voice:signal", {
							to: peer.socketId,
							signal: offer,
							type: "offer"
						});
					} catch (err) {}
				});
			} else localStreamRef.current.getAudioTracks().forEach((track) => {
				track.enabled = true;
			});
			setIsMicOn(true);
			socket.emit("voice:state-change", { isMuted: false });
			toast.success("Mic Live 🎙️");
		} catch (err) {
			toast.error("Microphone permission required");
		}
	};
	(0, import_react.useEffect)(() => {
		if (!socket) return;
		const handleSignal = async ({ from, signal, type }) => {
			const pc = createPeerConnection(from);
			try {
				if (type === "offer") {
					await pc.setRemoteDescription(new RTCSessionDescription(signal));
					const answer = await pc.createAnswer();
					await pc.setLocalDescription(answer);
					socket.emit("voice:signal", {
						to: from,
						signal: answer,
						type: "answer"
					});
				} else if (type === "answer") await pc.setRemoteDescription(new RTCSessionDescription(signal));
				else if (type === "candidate") await pc.addIceCandidate(new RTCIceCandidate(signal));
			} catch (err) {}
		};
		const handleSpeaking = ({ socketId, isSpeaking }) => {
			setActiveSpeakers((prev) => {
				const next = new Set(prev);
				if (isSpeaking) next.add(socketId);
				else next.delete(socketId);
				return next;
			});
		};
		socket.on("voice:signal", handleSignal);
		socket.on("voice:speaking", handleSpeaking);
		return () => {
			socket.off("voice:signal", handleSignal);
			socket.off("voice:speaking", handleSpeaking);
		};
	}, [socket, createPeerConnection]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
			if (localStreamRef.current) localStreamRef.current.getTracks().forEach((t) => t.stop());
			peerConnectionsRef.current.forEach((pc) => pc.close());
			peerConnectionsRef.current.clear();
			remoteAudiosRef.current.forEach((audio) => {
				audio.srcObject = null;
				audio.remove();
			});
			remoteAudiosRef.current.clear();
			if (audioContextRef.current && audioContextRef.current.state !== "closed") audioContextRef.current.close().catch(() => {});
		};
	}, []);
	const handlePassFloor = () => {
		sound.playDing();
		socket.emit("game:pass-speaker-floor", {}, (res) => {
			if (res && res.success) toast.success("Floor passed 🎙️");
			else if (res && res.error) toast.error(res.error);
		});
	};
	const handleToggleRaiseHand = () => {
		sound.playPop();
		socket.emit("game:raise-hand", {}, (res) => {
			if (res && res.success) if (res.raised) toast.info("Hand raised 🙋");
			else toast.info("Hand lowered");
		});
	};
	const currentSpeakerIsTalking = Boolean(speakerFloor?.currentSpeakerSocketId && activeSpeakers.has(speakerFloor.currentSpeakerSocketId) || isMyFloor && isSpeakingLocally);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "font-hand",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `sketch relative p-2.5 sm:p-3.5 border-2 shadow-xs transition-all ${isMyFloor ? "bg-amber-50/95 border-amber-500 ring-2 ring-amber-400/40" : speakerFloor?.isOpenFloor ? "bg-emerald-50/95 border-emerald-500" : "bg-white/95 border-primary shadow-xs"}`,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-2.5 left-6 h-4 w-16 rotate-[-1deg]" }, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 348,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: `h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-lg font-bold border ${isMyFloor ? "bg-amber-400 text-amber-950 border-amber-600 animate-pulse" : speakerFloor?.isOpenFloor ? "bg-emerald-400 text-emerald-950 border-emerald-600" : "bg-primary/15 text-primary border-primary/40"}`,
							children: isMyFloor ? "🌟" : speakerFloor?.isOpenFloor ? "🗣️" : "🎙️"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 355,
							columnNumber: 15
						}, this), currentSpeakerIsTalking && /* @__PURE__ */ (void 0)("span", {
							className: "absolute -top-0.5 -right-0.5 flex h-3 w-3",
							children: [/* @__PURE__ */ (void 0)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 369,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-emerald-500" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 370,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 368,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 354,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "min-w-0 leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-1.5 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: `text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded font-mono ${isMyFloor ? "bg-amber-500 text-white" : speakerFloor?.isOpenFloor ? "bg-emerald-600 text-white" : "bg-secondary text-foreground"}`,
								children: isMyFloor ? "YOUR TURN" : speakerFloor?.isOpenFloor ? "OPEN FLOOR" : `TURN ${(speakerFloor?.speakerIndex || 0) + 1}/${speakerFloor?.totalSpeakers || players.length}`
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 378,
								columnNumber: 17
							}, this), !speakerFloor?.isOpenFloor && speakerTimeRemaining > 0 && /* @__PURE__ */ (void 0)("span", {
								className: "text-[10px] sm:text-xs font-mono font-bold text-accent",
								children: [speakerTimeRemaining, "s"]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 395,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 377,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-sm sm:text-base font-display font-bold text-foreground truncate mt-0.5",
							children: isMyFloor ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-amber-800",
								children: "You are speaking"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 403,
								columnNumber: 19
							}, this) : speakerFloor?.isOpenFloor ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-emerald-800",
								children: "Open Debate"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 405,
								columnNumber: 19
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
								"Speaking:",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-primary",
									children: speakerFloor?.currentSpeakerName || "Classmate"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 409,
									columnNumber: 21
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 407,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 401,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 376,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 352,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: toggleMic,
							className: `sketch px-2.5 py-1 text-xs font-bold font-mono flex items-center gap-1 transition-all ${isMicOn ? "bg-emerald-600 text-white animate-pulse" : "bg-secondary text-foreground hover:bg-secondary/80"}`,
							title: isMicOn ? "Mute Microphone" : "Turn on Microphone",
							children: [isMicOn ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mic, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 431,
								columnNumber: 26
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MicOff, { className: "h-3.5 w-3.5 text-muted-foreground" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 431,
								columnNumber: 60
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: isMicOn ? "Mic ON" : "Mic" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 432,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 421,
							columnNumber: 13
						}, this),
						isMyFloor && /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: handlePassFloor,
							className: "sketch bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 font-bold text-xs sm:text-sm flex items-center gap-1 shadow-xs transition-transform active:scale-95 animate-pulse",
							children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 442,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", { children: "Done ➔" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 443,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 437,
							columnNumber: 15
						}, this),
						!isMyFloor && !speakerFloor?.isOpenFloor && /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: handleToggleRaiseHand,
							className: `sketch px-2.5 py-1 text-xs font-bold flex items-center gap-1 transition-all ${isHandRaised ? "bg-amber-400 text-amber-950 border-amber-600 ring-1 ring-amber-300" : "bg-secondary text-foreground hover:bg-secondary/80"}`,
							title: isHandRaised ? "Lower Hand" : "Raise Hand to Speak",
							children: [/* @__PURE__ */ (void 0)(Hand, { className: `h-3.5 w-3.5 ${isHandRaised ? "animate-bounce" : ""}` }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 459,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", { children: isHandRaised ? "✋ Hand" : "Hand" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 460,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 449,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: onVoteSkip,
							disabled: hasVotedSkip,
							className: `sketch px-2.5 py-1 text-xs font-bold flex items-center gap-1 transition-all ${hasVotedSkip ? "bg-secondary text-foreground/50 border-foreground/30 cursor-not-allowed" : "bg-accent/80 hover:bg-accent text-accent-foreground"}`,
							title: "Skip debate and start secret voting",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FastForward, { className: "h-3 w-3" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 476,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: hasVotedSkip ? "Voted" : "Skip" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 477,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "bg-black/15 text-[9px] px-1 py-0.2 rounded font-mono font-bold",
									children: [
										skipDiscussionVotesCount,
										"/",
										skipDiscussionRequired
									]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 478,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 465,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 419,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 350,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 339,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 337,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/components/ClassroomJoiningOverlay.tsx";
var CLASSROOM_QUOTES = [
	"🎒 'May I come in, Teacher?' 🏃‍♂️",
	"✏️ Sharpening detective pencils and opening notebook...",
	"🪑 Finding an empty front-row desk...",
	"🔔 Waiting for the school bell to ring...",
	"📋 Checking attendance register..."
];
function ClassroomJoiningOverlay({ roomCode, onCancel }) {
	const [quoteIndex, setQuoteIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const interval = setInterval(() => {
			setQuoteIndex((prev) => (prev + 1) % CLASSROOM_QUOTES.length);
		}, 1200);
		return () => clearInterval(interval);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "notebook relative max-w-md w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl border-2 border-foreground/30 bg-background animate-in zoom-in-95 duration-200",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-32 rotate-[-1deg]" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 30,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative mx-auto w-24 h-24 flex items-center justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 bg-primary/10 rounded-full animate-ping" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 34,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-6xl animate-bounce select-none",
							children: "🎒"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 35,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-2xl absolute -bottom-1 -right-1 animate-pulse select-none",
							children: "🏃‍♂️"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 36,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 33,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "sketch inline-block bg-accent text-accent-foreground px-3.5 py-1 text-xs font-bold font-mono uppercase tracking-wider shadow-xs",
							children: ["Classroom Room #", roomCode]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 41,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-2xl sm:text-3xl font-display font-bold text-foreground",
							children: "\"May I come in, Teacher?\" 🙋‍♂️"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 44,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-sm font-hand text-muted-foreground font-bold transition-all duration-300 min-h-[24px]",
							children: CLASSROOM_QUOTES[quoteIndex]
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 47,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 40,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "sketch bg-white/95 p-3.5 text-xs font-mono space-y-2 border border-foreground/20 text-left shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between text-primary font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "animate-spin text-sm",
								children: "⏳"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 56,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Connecting to classroom desk..." }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 57,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 55,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[11px] font-mono text-muted-foreground",
							children: "< 20ms join"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 59,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 54,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "w-full bg-muted h-2.5 rounded-full overflow-hidden relative",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "bg-accent h-full rounded-full transition-all duration-500 animate-pulse",
							style: { width: "90%" }
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 62,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 61,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 53,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => {
						sound.playPop();
						onCancel();
					},
					className: "text-xs font-hand text-muted-foreground underline hover:text-foreground font-bold transition-colors",
					children: "Wrong classroom? Return to Hallway 🚪"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 71,
					columnNumber: 11
				}, this) }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 70,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 29,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 28,
		columnNumber: 5
	}, this);
}
var getSocketUrl = () => {
	if (typeof window !== "undefined") {
		if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
			if (window.location.hostname.includes("vercel.app")) return "https://imposter-world.onrender.com";
			return window.location.origin;
		}
		if (window.location.port === "8080" || window.location.port === "4002") return "http://localhost:4001";
		return window.location.origin;
	}
	return "http://localhost:4001";
};
var socket = null;
function getSocket() {
	if (!socket) {
		const socketUrl = getSocketUrl();
		socket = lookup(socketUrl, {
			autoConnect: true,
			reconnection: true,
			reconnectionAttempts: 25,
			reconnectionDelay: 400,
			reconnectionDelayMax: 1500,
			timeout: 4e3,
			transports: ["websocket", "polling"],
			upgrade: true,
			withCredentials: true
		});
		socket.on("connect", () => {
			console.log("[Socket Client] Ultra-fast WebSocket connected:", socket?.id);
		});
		socket.on("disconnect", (reason) => {
			console.warn("[Socket Client] Disconnected:", reason);
		});
		socket.on("connect_error", (err) => {
			console.error("[Socket Client] Connection error:", err.message);
		});
	}
	return socket;
}
if (typeof window !== "undefined") try {
	getSocket();
} catch {}
var _jsxFileName = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/routes/index.tsx?tsr-split=component";
function Btn({ children, onClick, variant = "primary", disabled, className = "" }) {
	const styles = {
		primary: "bg-primary text-primary-foreground",
		accent: "bg-accent text-accent-foreground",
		ghost: "bg-card text-foreground",
		secondary: "bg-secondary text-foreground"
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		disabled,
		onClick: () => {
			sound.playPop();
			onClick?.();
		},
		className: `sketch ${styles} px-6 py-2.5 text-lg font-bold transition-transform hover:-translate-y-0.5 hover:rotate-[-1deg] active:translate-y-0.5 disabled:opacity-40 ${className}`,
		children
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 37,
		columnNumber: 10
	}, this);
}
function getInitialUser() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem("imposter_user");
		if (raw) return JSON.parse(raw);
	} catch {}
	return null;
}
function getInstantGuestId() {
	if (typeof window === "undefined") return "";
	try {
		return localStorage.getItem("imposter_guest_id") || "";
	} catch {}
	return "";
}
function getInstantGuestName() {
	if (typeof window === "undefined") return "Detective";
	try {
		return localStorage.getItem("imposter_guest_name") || "Detective";
	} catch {}
	return "Detective";
}
function Index() {
	const [showSettings, setShowSettings] = (0, import_react.useState)(false);
	const [showAccount, setShowAccount] = (0, import_react.useState)(false);
	const [showLeaderboard, setShowLeaderboard] = (0, import_react.useState)(false);
	const [showPublicRooms, setShowPublicRooms] = (0, import_react.useState)(false);
	const [showNoticeBoard, setShowNoticeBoard] = (0, import_react.useState)(false);
	const [copiedLink, setCopiedLink] = (0, import_react.useState)(false);
	const [isMuted, setIsMuted] = (0, import_react.useState)(sound.isMuted);
	const [isBgmActive, setIsBgmActive] = (0, import_react.useState)(!sound.isMuted);
	const [championName, setChampionName] = (0, import_react.useState)("Loading...");
	const [user, setUser] = (0, import_react.useState)(getInitialUser);
	const [roomCodeInput, setRoomCodeInput] = (0, import_react.useState)("");
	const [roomState, setRoomState] = (0, import_react.useState)(null);
	const [secretInfo, setSecretInfo] = (0, import_react.useState)(null);
	const [showSecretWord, setShowSecretWord] = (0, import_react.useState)(true);
	const [clueType, setClueType] = (0, import_react.useState)("text");
	const [textClueInput, setTextClueInput] = (0, import_react.useState)("");
	const [hasSubmittedAnswer, setHasSubmittedAnswer] = (0, import_react.useState)(false);
	const [publicRooms, setPublicRooms] = (0, import_react.useState)([]);
	const [isLocalMode, setIsLocalMode] = (0, import_react.useState)(false);
	const [localPlayers, setLocalPlayers] = (0, import_react.useState)([
		"Aarav",
		"Riya",
		"Kabir"
	]);
	const [localNewPlayerName, setLocalNewPlayerName] = (0, import_react.useState)("");
	const [localRound, setLocalRound] = (0, import_react.useState)(null);
	const [localTurn, setLocalTurn] = (0, import_react.useState)(0);
	const [localWordRevealed, setLocalWordRevealed] = (0, import_react.useState)(false);
	const [localPhase, setLocalPhase] = (0, import_react.useState)("lobby");
	const [localVotes, setLocalVotes] = (0, import_react.useState)({});
	const [localScores, setLocalScores] = (0, import_react.useState)({
		Aarav: 0,
		Riya: 0,
		Kabir: 0
	});
	const [localClueMode, setLocalClueMode] = (0, import_react.useState)("text");
	const [localDrawing, setLocalDrawing] = (0, import_react.useState)(null);
	const [localClues, setLocalClues] = (0, import_react.useState)([]);
	const [localTextClue, setLocalTextClue] = (0, import_react.useState)("");
	const [remainingTime, setRemainingTime] = (0, import_react.useState)(0);
	const [currentTrack, setCurrentTrack] = (0, import_react.useState)(sound.getCurrentTrack());
	(0, import_react.useEffect)(() => {
		return sound.onTrackChange((_idx, track) => {
			setCurrentTrack(track);
			setIsBgmActive(sound.getBgmStatus());
		});
	}, []);
	(0, import_react.useEffect)(() => {
		fetch(`${API_BASE}/api/leaderboard/champion`).then((r) => r.json()).then((d) => {
			if (d && d.success && d.champion) setChampionName(d.champion.name);
			else setChampionName("Top Detective");
		}).catch(() => setChampionName("Top Detective"));
	}, []);
	(0, import_react.useEffect)(() => {
		const handleFirstGesture = () => {
			if (!sound.isMuted) {
				sound.startBgm();
				setIsBgmActive(true);
			}
			window.removeEventListener("pointerdown", handleFirstGesture);
			window.removeEventListener("keydown", handleFirstGesture);
		};
		window.addEventListener("pointerdown", handleFirstGesture, { once: true });
		window.addEventListener("keydown", handleFirstGesture, { once: true });
		return () => {
			window.removeEventListener("pointerdown", handleFirstGesture);
			window.removeEventListener("keydown", handleFirstGesture);
		};
	}, []);
	const socketRef = (0, import_react.useRef)(getSocket());
	const autoJoinAttempted = (0, import_react.useRef)(false);
	const pendingInviteCode = (0, import_react.useRef)(typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("room")?.trim().toUpperCase() || null : null);
	const [joiningCode, setJoiningCode] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") return new URLSearchParams(window.location.search).get("room")?.trim().toUpperCase() || null;
		return null;
	});
	const [lobbyTimeLeft, setLobbyTimeLeft] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const url = new URL(window.location.href);
		if (roomState?.roomCode) {
			if (url.searchParams.get("room") !== roomState.roomCode) {
				url.searchParams.set("room", roomState.roomCode);
				window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
			}
		}
	}, [roomState?.roomCode]);
	(0, import_react.useEffect)(() => {
		if (!roomState || roomState.phase !== "lobby" || !roomState.lobbyDeadline) {
			setLobbyTimeLeft(null);
			return;
		}
		const updateTimer = () => {
			const diff = Math.max(0, Math.ceil((roomState.lobbyDeadline - Date.now()) / 1e3));
			setLobbyTimeLeft(diff);
		};
		updateTimer();
		const interval = setInterval(updateTimer, 1e3);
		return () => clearInterval(interval);
	}, [roomState?.lobbyDeadline, roomState?.phase]);
	const syncUserToStorage = (u) => {
		try {
			setUser(u);
			localStorage.setItem("imposter_user", JSON.stringify(u));
			if (u.isGuest) {
				localStorage.setItem("imposter_guest_id", u.id);
				localStorage.setItem("imposter_guest_name", u.displayName);
			}
			if (socketRef.current?.connected && roomState) socketRef.current.emit("player:update", {
				displayName: u.displayName,
				avatarUrl: u.avatarUrl
			});
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		const savedGuestId = getInstantGuestId();
		const savedGuestName = getInstantGuestName();
		if (typeof window !== "undefined") {
			const searchParams = new URLSearchParams(window.location.search);
			const googleCode = searchParams.get("code");
			const loginStatus = searchParams.get("login");
			if (googleCode) {
				fetch(`${API_BASE}/api/auth/google/callback`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ code: googleCode })
				}).then((res) => res.json()).then((data) => {
					if (data.user) {
						syncUserToStorage(data.user);
						window.history.replaceState({}, document.title, window.location.pathname);
					}
				}).catch((err) => console.error("Google code exchange error:", err));
				fetchPublicRooms();
				return;
			}
			if (loginStatus === "success") window.history.replaceState({}, document.title, window.location.pathname);
		}
		fetch(`${API_BASE}/api/auth/me`, { credentials: "include" }).then((res) => res.json()).then((data) => {
			if (data.user) syncUserToStorage(data.user);
			else fetch(`${API_BASE}/api/auth/guest`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					guestId: savedGuestId || void 0,
					name: savedGuestName
				})
			}).then((r) => r.json()).then((gData) => {
				if (gData.user) syncUserToStorage(gData.user);
			}).catch((err) => console.error("Guest login fallback error:", err));
		}).catch(() => {
			fetch(`${API_BASE}/api/auth/guest`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					guestId: savedGuestId || void 0,
					name: savedGuestName
				})
			}).then((r) => r.json()).then((gData) => {
				if (gData.user) syncUserToStorage(gData.user);
			}).catch((err) => console.error("Guest login fallback error:", err));
		});
		fetchPublicRooms();
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || autoJoinAttempted.current) return;
		const cleanCode = new URLSearchParams(window.location.search).get("room")?.trim().toUpperCase();
		if (!cleanCode) return;
		if (roomState && roomState.roomCode === cleanCode) return;
		autoJoinAttempted.current = true;
		setRoomCodeInput(cleanCode);
		toast.info(`Connecting to Classroom Room #${cleanCode}...`);
		handleJoinRoom(cleanCode);
	}, []);
	const fetchPublicRooms = () => {
		fetch(`${API_BASE}/api/rooms/public`).then((res) => res.json()).then((data) => {
			if (data.rooms) setPublicRooms(data.rooms);
		}).catch(() => {});
	};
	(0, import_react.useEffect)(() => {
		const socket = socketRef.current;
		socket.on("room:state", (state) => {
			setRoomState(state);
			setJoiningCode(null);
			if (state.phase === "hint_turn") setHasSubmittedAnswer(false);
		});
		socket.on("game:secret-word", (data) => {
			setSecretInfo(data);
			setShowSecretWord(true);
			sound.playDing();
		});
		socket.on("game:answer-confirmed", () => {
			setHasSubmittedAnswer(true);
			sound.playLock();
		});
		socket.on("chat:new-message", (msg) => {
			setRoomState((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					chatMessages: [...prev.chatMessages || [], msg]
				};
			});
		});
		socket.on("rooms:public-updated", (rooms) => {
			setPublicRooms(rooms);
		});
		socket.on("classroom:announcement", (data) => {
			sound.playDing();
			toast(`📢 ${data.from || "Principal Office"}: ${data.message}`, { duration: 8e3 });
		});
		socket.on("room:disbanded", (data) => {
			toast.error(data.reason || "This room was closed.");
			setRoomState(null);
			pendingInviteCode.current = null;
			if (typeof window !== "undefined") {
				const url = new URL(window.location.href);
				if (url.searchParams.has("room")) {
					url.searchParams.delete("room");
					const remaining = url.searchParams.toString();
					window.history.replaceState({}, "", remaining ? `${url.pathname}?${remaining}` : url.pathname);
				}
			}
			sound.playError();
		});
		return () => {
			socket.off("room:state");
			socket.off("game:secret-word");
			socket.off("game:answer-confirmed");
			socket.off("chat:new-message");
			socket.off("rooms:public-updated");
			socket.off("classroom:announcement");
			socket.off("room:disbanded");
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!roomState?.phaseDeadline) {
			setRemainingTime(0);
			return;
		}
		const interval = setInterval(() => {
			const remaining = Math.max(0, Math.ceil((roomState.phaseDeadline - Date.now()) / 1e3));
			setRemainingTime(remaining);
			if (remaining > 0 && remaining <= 5) sound.playTick();
		}, 1e3);
		return () => clearInterval(interval);
	}, [roomState?.phaseDeadline]);
	(0, import_react.useEffect)(() => {
		if (roomState?.phase === "results" && roomState?.lastResult) if (roomState.lastResult.winnerTeam === "detectives") sound.playVictory();
		else sound.playImposterWin();
		else if (roomState?.phase === "hint_turn") sound.playDing();
	}, [roomState?.phase]);
	const handleToggleMute = () => {
		const muted = sound.toggleMute();
		setIsMuted(muted);
		setIsBgmActive(!muted);
	};
	const handleToggleBgm = () => {
		if (isBgmActive) {
			sound.stopBgm();
			setIsBgmActive(false);
		} else {
			sound.startBgm();
			setIsBgmActive(true);
			setIsMuted(false);
		}
	};
	const handleNextTrack = () => {
		sound.playPop();
		sound.nextTrack();
		if (!isBgmActive) {
			sound.startBgm();
			setIsBgmActive(true);
			setIsMuted(false);
		}
	};
	const handlePrevTrack = () => {
		sound.playPop();
		sound.prevTrack();
		if (!isBgmActive) {
			sound.startBgm();
			setIsBgmActive(true);
			setIsMuted(false);
		}
	};
	const handleCreateRoom = (customSettings) => {
		sound.playPop();
		const socket = socketRef.current;
		if (!socket.connected) socket.connect();
		const creatorUser = user || getInitialUser() || {
			id: getInstantGuestId() || socket.id || `guest-${Math.random().toString(36).substring(2, 9)}`,
			displayName: getInstantGuestName(),
			avatarUrl: ""
		};
		socket.emit("room:create", {
			user: {
				id: creatorUser.id,
				displayName: creatorUser.displayName,
				avatarUrl: creatorUser.avatarUrl
			},
			settings: customSettings
		}, (res) => {
			if (res && res.success && res.roomCode) {
				if (res.roomState) setRoomState(res.roomState);
				const url = new URL(window.location.href);
				url.searchParams.set("room", res.roomCode);
				window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
			} else if (res && !res.success) alert(res.error || "Failed to create room");
		});
	};
	const handleJoinRoom = (code) => {
		if (!code || !code.trim()) return;
		const cleanCode = code.trim().toUpperCase();
		if (roomState && roomState.roomCode === cleanCode) {
			setJoiningCode(null);
			return;
		}
		sound.playPop();
		setJoiningCode(cleanCode);
		const socket = socketRef.current;
		const emitJoin = () => {
			const joinUser = user || getInitialUser() || {
				id: getInstantGuestId() || socket.id || `guest-${Math.random().toString(36).substring(2, 9)}`,
				displayName: getInstantGuestName(),
				avatarUrl: ""
			};
			socket.emit("room:join", {
				roomCode: cleanCode,
				user: {
					id: joinUser.id,
					displayName: joinUser.displayName,
					avatarUrl: joinUser.avatarUrl
				}
			}, (res) => {
				if (res && res.success && res.roomCode) {
					if (res.roomState) setRoomState(res.roomState);
					setJoiningCode(null);
					const url = new URL(window.location.href);
					url.searchParams.set("room", res.roomCode);
					window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
				} else if (res && !res.success) {
					setJoiningCode(null);
					toast.error(res.error || "Failed to join room");
					pendingInviteCode.current = null;
				}
			});
		};
		if (!socket.connected) {
			socket.connect();
			socket.once("connect", emitJoin);
		} else emitJoin();
	};
	const handleInstantMatch = () => {
		sound.playPop();
		const socket = socketRef.current;
		if (!socket.connected) socket.connect();
		const matchUser = user || getInitialUser() || {
			id: getInstantGuestId() || socket.id || `guest-${Math.random().toString(36).substring(2, 9)}`,
			displayName: getInstantGuestName(),
			avatarUrl: ""
		};
		socket.emit("room:instant-match", { user: {
			id: matchUser.id,
			displayName: matchUser.displayName,
			avatarUrl: matchUser.avatarUrl
		} }, (res) => {
			if (res && res.success && res.roomCode) {
				if (res.roomState) setRoomState(res.roomState);
				const url = new URL(window.location.href);
				url.searchParams.set("room", res.roomCode);
				window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
			} else if (res && !res.success) alert(res.error || "Instant match failed");
		});
	};
	const handleStartGame = () => {
		sound.playDing();
		socketRef.current.emit("room:start", {}, (res) => {
			if (!res.success) alert(res.error || "Cannot start game");
		});
	};
	const handleSubmitTextClue = () => {
		if (!textClueInput.trim()) return;
		sound.playPencil();
		socketRef.current.emit("game:submit-hint", {
			type: "text",
			content: textClueInput.trim()
		}, (res) => {
			if (res.success) setTextClueInput("");
			else alert(res.error || "Failed to submit clue");
		});
	};
	const handleSubmitDrawingClue = (dataUrl) => {
		sound.playPencil();
		socketRef.current.emit("game:submit-hint", {
			type: "drawing",
			content: dataUrl
		}, (res) => {
			if (res.success) setClueType("text");
			else alert(res.error || "Failed to submit drawing");
		});
	};
	const handleSubmitVoiceClue = (audioUrl, transcript) => {
		sound.playDing();
		socketRef.current.emit("game:submit-hint", {
			type: "voice",
			content: audioUrl,
			transcript
		}, (res) => {
			if (res.success) setClueType("text");
			else alert(res.error || "Failed to submit voice clue");
		});
	};
	const handleSendChatMessage = (text) => {
		socketRef.current.emit("chat:send", { content: text });
	};
	const handleSubmitSecretAnswer = (suspectSocketId) => {
		sound.playLock();
		socketRef.current.emit("game:submit-answer", { suspectSocketId }, (res) => {
			if (!res.success) alert(res.error || "Failed to submit secret answer");
		});
	};
	const handleVoteSkipDiscussion = () => {
		sound.playPop();
		socketRef.current.emit("game:vote-skip-discussion", {}, (res) => {
			if (res && res.success) if (res.skipped) toast.success("Majority voted! Moving to secret vote 🗳️");
			else toast.info("Voted to skip discussion! Waiting for majority ⏭️");
			else if (res && res.error) toast.error(res.error);
		});
	};
	const handleNextRound = () => {
		sound.playPop();
		socketRef.current.emit("game:next-round", {}, (res) => {
			if (!res.success) alert(res.error || "Cannot advance round");
		});
	};
	const handleLeaveRoom = () => {
		sound.playPop();
		socketRef.current.emit("room:leave");
		setRoomState(null);
		setSecretInfo(null);
		pendingInviteCode.current = null;
		if (typeof window !== "undefined") {
			const url = new URL(window.location.href);
			url.searchParams.delete("room");
			const remaining = url.searchParams.toString();
			window.history.replaceState({}, "", remaining ? `${url.pathname}?${remaining}` : url.pathname);
		}
	};
	const handleCopyLink = () => {
		if (roomState?.roomCode) {
			sound.playPop();
			navigator.clipboard.writeText(`${window.location.origin}/?room=${roomState.roomCode}`);
			setCopiedLink(true);
			setTimeout(() => setCopiedLink(false), 2e3);
		}
	};
	const handleGoogleLogin = () => {
		fetch(`${API_BASE}/api/auth/google/url`).then((res) => res.json()).then((data) => {
			if (data.url) window.location.href = data.url;
		}).catch((err) => console.error(err));
	};
	const startLocalGame = async () => {
		sound.playDing();
		let word = "Pizza";
		let fake = "Burger";
		let cat = "Food & Drinks";
		try {
			const res = await fetch(`${API_BASE}/api/words/random`);
			if (res.ok) {
				const data = await res.json();
				if (data.common && data.imposter) {
					word = data.common;
					fake = data.imposter;
					cat = data.category || "Classroom Secret";
				}
			}
		} catch {
			const fallbackPairs = [
				[
					"Dog",
					"Cat",
					"Animals"
				],
				[
					"Elephant",
					"Giraffe",
					"Animals"
				],
				[
					"Tiger",
					"Lion",
					"Animals"
				],
				[
					"Pizza",
					"Burger",
					"Food & Drinks"
				],
				[
					"Coffee",
					"Tea",
					"Food & Drinks"
				],
				[
					"Doctor",
					"Nurse",
					"Professions"
				],
				[
					"Cricket",
					"Baseball",
					"Sports & Games"
				],
				[
					"Guitar",
					"Violin",
					"Music & Art"
				],
				[
					"Notebook",
					"Diary",
					"Everyday Objects"
				]
			];
			const pick = fallbackPairs[Math.floor(Math.random() * fallbackPairs.length)];
			word = pick[0];
			fake = pick[1];
			cat = pick[2];
		}
		const imposterIdx = Math.floor(Math.random() * localPlayers.length);
		setLocalRound({
			word,
			fake,
			category: cat,
			imposterIdx
		});
		setLocalTurn(0);
		setLocalWordRevealed(false);
		setLocalClues([]);
		setLocalVotes({});
		setLocalPhase("reveal");
	};
	const currentSocketId = socketRef.current?.id || "";
	const myPlayer = roomState?.players?.find((p) => p.socketId === currentSocketId);
	const isHost = Boolean(myPlayer?.isHost);
	const isMyTurn = roomState?.phase === "hint_turn" && roomState?.activePlayerSocketId === currentSocketId;
	const hasVotedSkipDiscussion = Boolean(roomState?.skipDiscussionVoters?.includes(currentSocketId));
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "min-h-screen px-2.5 sm:px-6 md:px-8 py-3 sm:py-6 md:py-10",
		children: [
			joiningCode && !roomState && /* @__PURE__ */ (void 0)(ClassroomJoiningOverlay, {
				roomCode: joiningCode,
				onCancel: () => {
					setJoiningCode(null);
					if (typeof window !== "undefined") {
						const url = new URL(window.location.href);
						url.searchParams.delete("room");
						window.history.replaceState({}, "", url.pathname);
					}
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 718,
				columnNumber: 37
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "sketch mx-auto mb-4 sm:mb-6 flex max-w-5xl items-center justify-between border-2 border-foreground bg-white/90 backdrop-blur-md px-2.5 sm:px-5 py-2 sm:py-3 shadow-lg",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 sm:gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: "/detective.png",
						alt: "Detective Mascot",
						className: "h-9 w-9 sm:h-12 sm:w-12 object-contain hover:scale-105 transition-transform drop-shadow-xs"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 730,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							if (roomState || isLocalMode) {
								if (confirm("Go to homepage? You will leave your current room.")) {
									handleLeaveRoom();
									setIsLocalMode(false);
								}
							}
						},
						className: "text-2xl sm:text-3xl md:text-4xl font-display text-left",
						children: ["Imposter ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-accent",
							children: "World"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 739,
							columnNumber: 22
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 731,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 729,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center flex-nowrap gap-1 sm:gap-2 ml-auto shrink-0",
					children: [
						roomState && /* @__PURE__ */ (void 0)("span", {
							className: "sketch bg-highlight px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base font-bold flex items-center gap-1.5 shrink-0",
							children: [
								"#",
								roomState.roomCode,
								/* @__PURE__ */ (void 0)("button", {
									onClick: handleCopyLink,
									title: "Copy Room Link",
									className: "hover:text-accent ml-1",
									children: copiedLink ? /* @__PURE__ */ (void 0)(Check, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 749,
										columnNumber: 31
									}, this) : /* @__PURE__ */ (void 0)(Copy, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 749,
										columnNumber: 67
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 748,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 746,
							columnNumber: 25
						}, this),
						isLocalMode && /* @__PURE__ */ (void 0)("span", {
							className: "sketch bg-secondary px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold flex items-center gap-1 shrink-0",
							children: "📱 Pass & Play"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 754,
							columnNumber: 27
						}, this),
						!roomState && !isLocalMode && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
							/* @__PURE__ */ (void 0)("button", {
								onClick: () => {
									sound.playPop();
									fetchPublicRooms();
									setShowPublicRooms(true);
								},
								title: "Public Classroom Rooms",
								className: "sketch flex items-center justify-center gap-1 bg-accent text-accent-foreground px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base font-bold hover:brightness-110 shrink-0",
								children: [/* @__PURE__ */ (void 0)(Globe, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 766,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "hidden sm:inline",
									children: "Rooms"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 767,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 761,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("button", {
								onClick: () => {
									sound.playPop();
									setShowNoticeBoard(true);
								},
								title: "Classroom Notice Board",
								className: "sketch flex items-center justify-center gap-1 bg-secondary px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base font-bold hover:bg-secondary/80 shrink-0",
								children: [/* @__PURE__ */ (void 0)(Pin, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 775,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "hidden sm:inline",
									children: "Notice"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 776,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 771,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("button", {
								onClick: () => {
									sound.playPop();
									setShowLeaderboard(true);
								},
								title: "Classroom Rankings",
								className: "sketch flex items-center justify-center gap-1 bg-secondary px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base font-bold hover:bg-secondary/80 shrink-0",
								children: [/* @__PURE__ */ (void 0)(Trophy, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 784,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "hidden sm:inline",
									children: "Rankings"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 785,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 780,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("button", {
								onClick: () => {
									sound.playPop();
									setShowAccount(true);
								},
								title: user?.displayName ? `Account: ${user.displayName}` : "Account Profile",
								className: "sketch flex items-center justify-center bg-card px-2 sm:px-2.5 py-1 text-sm sm:text-base font-bold hover:bg-secondary shrink-0",
								children: /* @__PURE__ */ (void 0)("span", {
									className: "text-sm sm:text-base leading-none select-none",
									role: "img",
									"aria-label": "Profile",
									children: "👤"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 793,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 789,
								columnNumber: 15
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 759,
							columnNumber: 42
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 744,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 727,
				columnNumber: 7
			}, this),
			!roomState && !isLocalMode && /* @__PURE__ */ (void 0)("section", {
				className: "notebook relative mx-auto max-w-4xl rounded-sm py-5 sm:py-10 pl-3.5 sm:pl-12 md:pl-20 pr-3 sm:pr-8 md:pr-12 shadow-2xl",
				children: [
					/* @__PURE__ */ (void 0)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-2deg]" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 803,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "md:col-span-8 space-y-4 sm:space-y-6 min-w-0",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-accent font-bold text-xs sm:text-sm border border-accent/30",
									children: /* @__PURE__ */ (void 0)("span", { children: "🕵️ Real-Time Multiplayer Party Game" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 809,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 808,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("h1", {
									className: "text-3xl sm:text-5xl md:text-6xl font-display leading-[0.95] text-foreground break-words",
									children: [
										"One Word. Different Secrets. ",
										/* @__PURE__ */ (void 0)("br", {}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 813,
											columnNumber: 46
										}, this),
										/* @__PURE__ */ (void 0)("span", {
											className: "marker text-accent",
											children: "Who's the Imposter?"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 814,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 812,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("p", {
									className: "max-w-xl text-base sm:text-lg text-muted-foreground font-hand",
									children: "Everyone gets the same word — except the imposter! Share clues, debate suspects, and vote out the bluffer."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 817,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "relative py-1 space-y-2 font-hand text-sm sm:text-base border-l-2 border-primary/30 pl-3 my-2",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-2 font-bold text-foreground",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-mono shadow-xs",
												children: "1"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 824,
												columnNumber: 19
											}, this), /* @__PURE__ */ (void 0)("span", { children: "Peek at your secret word 🔍" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 827,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 823,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-2 font-bold text-foreground",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-mono shadow-xs",
												children: "2"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 830,
												columnNumber: 19
											}, this), /* @__PURE__ */ (void 0)("span", { children: "Give 1 clue (Text, Draw, Voice) 🎨" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 833,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 829,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-2 font-bold text-foreground",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-mono shadow-xs",
												children: "3"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 836,
												columnNumber: 19
											}, this), /* @__PURE__ */ (void 0)("span", { children: "Debate suspects in chat 🗣️" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 839,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 835,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-2 font-bold text-foreground",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-mono shadow-xs",
												children: "4"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 842,
												columnNumber: 19
											}, this), /* @__PURE__ */ (void 0)("span", { children: "Vote & catch the imposter! 🗳️" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 845,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 841,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 822,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4 pt-1 max-w-full",
									children: [/* @__PURE__ */ (void 0)(Btn, {
										onClick: () => handleCreateRoom({ isPublic: true }),
										className: "w-full sm:w-auto text-center justify-center",
										children: "Create Room (3-14 Players)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 851,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-2 w-full sm:w-auto max-w-full",
										children: [/* @__PURE__ */ (void 0)("input", {
											type: "text",
											value: roomCodeInput,
											onChange: (e) => setRoomCodeInput(e.target.value.toUpperCase()),
											placeholder: "ENTER CODE",
											maxLength: 6,
											className: "sketch flex-1 min-w-0 sm:w-36 bg-white px-2.5 sm:px-3 py-2 text-center text-base sm:text-lg font-bold uppercase tracking-wider focus:outline-none"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 857,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)(Btn, {
											variant: "secondary",
											onClick: () => handleJoinRoom(roomCodeInput),
											className: "px-4 sm:px-5 py-2.5 shrink-0 justify-center",
											children: "Join"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 858,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 856,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 850,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 807,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "md:col-span-4 flex flex-col items-center justify-center text-center space-y-3 pt-2 md:pt-0",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "relative group cursor-pointer",
								children: [/* @__PURE__ */ (void 0)("img", {
									src: "/detective-waving.png",
									alt: "Imposter World Detective",
									className: "max-h-48 sm:max-h-64 md:max-h-72 w-auto object-contain drop-shadow-xl transition-transform group-hover:scale-105"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 868,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", { className: "tape absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 sm:h-5 w-20 sm:w-24 rotate-[2deg]" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 869,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 867,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "text-[11px] sm:text-xs text-muted-foreground font-hand",
								children: "\"Classroom Detective on duty. 100% Anti-Cheat Server.\""
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 871,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 866,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 805,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "relative mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-foreground/20 space-y-4 font-hand",
						children: [
							/* @__PURE__ */ (void 0)("img", {
								src: "/paper-plane.svg",
								alt: "Paper Airplane",
								className: "pointer-events-none absolute -top-6 right-2 sm:right-6 h-14 w-14 sm:h-18 sm:w-18 object-contain opacity-85 rotate-[-8deg] drop-shadow-xs"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 879,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (void 0)("h3", {
									className: "text-2xl sm:text-3xl font-display text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (void 0)(Compass, { className: "h-6 w-6 text-accent" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 882,
										columnNumber: 17
									}, this), " Play Another Way"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 881,
									columnNumber: 15
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-xs text-muted-foreground font-bold uppercase tracking-wider hidden sm:inline",
									children: "CHOOSE YOUR MODE"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 884,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 880,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
								children: [
									/* @__PURE__ */ (void 0)("button", {
										onClick: () => {
											sound.playPop();
											handleCreateRoom({ isPublic: false });
										},
										className: "sketch group bg-white/90 p-4 text-left space-y-2 hover:-translate-y-1 hover:shadow-md transition-all border-2 border-foreground",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between text-xs font-bold text-primary",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "bg-primary/10 px-2 py-0.5 rounded border border-primary/20",
													children: "FRIEND"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 898,
													columnNumber: 19
												}, this), /* @__PURE__ */ (void 0)("span", {
													className: "text-lg group-hover:translate-x-1 transition-transform",
													children: "›"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 901,
													columnNumber: 19
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 897,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "text-xl font-display font-bold text-foreground",
												children: "Play with Friends"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 903,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("p", {
												className: "text-xs text-muted-foreground",
												children: "2-14 players invite with a private secret link"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 904,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 891,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (void 0)("button", {
										onClick: () => {
											sound.playPop();
											setShowNoticeBoard(true);
										},
										className: "sketch group bg-white/90 p-4 text-left space-y-2 hover:-translate-y-1 hover:shadow-md transition-all border-2 border-foreground",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between text-xs font-bold text-accent",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "bg-accent text-accent-foreground px-1.5 py-0.5 rounded font-bold",
													children: "NEW"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 915,
													columnNumber: 19
												}, this), /* @__PURE__ */ (void 0)("span", {
													className: "text-lg group-hover:translate-x-1 transition-transform",
													children: "›"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 918,
													columnNumber: 19
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 914,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "text-xl font-display font-bold text-foreground",
												children: "Tournament"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 920,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("p", {
												className: "text-xs text-muted-foreground",
												children: ["Next one today (wed) • ", /* @__PURE__ */ (void 0)("strong", { children: [championName, " holds the belt"] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 922,
													columnNumber: 42
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 921,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 910,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (void 0)("button", {
										onClick: () => {
											sound.playPop();
											setIsLocalMode(true);
										},
										className: "sketch group bg-white/90 p-4 text-left space-y-2 hover:-translate-y-1 hover:shadow-md transition-all border-2 border-foreground",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between text-xs font-bold text-foreground",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "bg-highlight px-2 py-0.5 rounded font-bold border border-foreground/30",
													children: "SAVED"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 932,
													columnNumber: 19
												}, this), /* @__PURE__ */ (void 0)("span", {
													className: "text-lg group-hover:translate-x-1 transition-transform",
													children: "›"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 935,
													columnNumber: 19
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 931,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "text-xl font-display font-bold text-foreground",
												children: "Local Pass & Play"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 937,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("p", {
												className: "text-xs text-muted-foreground",
												children: "2-10 players on 1 phone • score 1-1"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 938,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 927,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (void 0)("button", {
										onClick: handleInstantMatch,
										className: "sketch group bg-accent text-accent-foreground p-4 text-left space-y-2 hover:-translate-y-1 hover:shadow-md transition-all border-2 border-foreground",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between text-xs font-bold opacity-95",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "bg-white/20 px-2 py-0.5 rounded font-bold",
													children: "INSTANT"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 946,
													columnNumber: 19
												}, this), /* @__PURE__ */ (void 0)("span", {
													className: "text-lg group-hover:translate-x-1 transition-transform",
													children: "›"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 947,
													columnNumber: 19
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 945,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "text-xl font-display font-bold text-accent-foreground",
												children: "Instant Match"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 949,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("p", {
												className: "text-xs opacity-90",
												children: "Find someone online and jump into class!"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 950,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 944,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 889,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 878,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("footer", {
						className: "mt-12 text-center space-y-1.5 font-hand border-t border-foreground/15 pt-5",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "text-xs sm:text-sm text-foreground/75 flex items-center justify-center gap-1",
							children: /* @__PURE__ */ (void 0)("span", { children: ["made on the last bench by ", /* @__PURE__ */ (void 0)("span", {
								className: "underline decoration-foreground/40 font-bold",
								children: "adi"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 960,
								columnNumber: 47
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 960,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 959,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-primary font-bold",
							children: [
								/* @__PURE__ */ (void 0)(Link, {
									to: "/how-to-play",
									className: "underline hover:text-accent",
									children: "How To Play Imposter World"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 964,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("span", {
									className: "text-muted-foreground/60",
									children: "·"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 967,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)(Link, {
									to: "/articles",
									className: "underline hover:text-accent",
									children: "Game Strategy Articles"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 968,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("span", {
									className: "text-muted-foreground/60",
									children: "·"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 971,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)(Link, {
									to: "/notice-board",
									className: "underline hover:text-accent",
									children: "Notice Board"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 972,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("span", {
									className: "text-muted-foreground/60",
									children: "·"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 975,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)(Link, {
									to: "/support",
									className: "underline hover:text-accent",
									children: "Support the Dev"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 976,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 963,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 958,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 802,
				columnNumber: 38
			}, this),
			isLocalMode && /* @__PURE__ */ (void 0)("section", {
				className: "notebook relative mx-auto max-w-2xl rounded-sm py-6 sm:py-8 pl-3.5 sm:pl-12 md:pl-20 pr-3 sm:pr-8 md:pr-10 shadow-2xl space-y-4 sm:space-y-6",
				children: [
					/* @__PURE__ */ (void 0)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-1deg]" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 985,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-between gap-2 border-b-2 border-foreground/30 pb-3",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2 sm:gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (void 0)("img", {
								src: "/secret-folder.svg",
								alt: "Secret Folder",
								className: "h-8 w-8 sm:h-12 sm:w-12 object-contain shrink-0 drop-shadow-xs"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 989,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "text-[10px] sm:text-xs font-bold text-accent font-hand uppercase block truncate",
									children: "Single Device Mode"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 991,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("h2", {
									className: "text-xl sm:text-3xl font-display text-foreground truncate",
									children: "Local Pass & Play 📱"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 992,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 990,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 988,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("button", {
							onClick: () => {
								sound.playPop();
								setIsLocalMode(false);
							},
							className: "sketch bg-secondary px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-foreground shrink-0",
							children: "Exit Local"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 995,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 987,
						columnNumber: 11
					}, this),
					localPhase === "lobby" && /* @__PURE__ */ (void 0)("div", {
						className: "space-y-4 font-hand",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "text-sm text-muted-foreground",
								children: "Pass this single phone/laptop around your group. Each player views their secret word in private!"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1004,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "flex flex-wrap gap-2",
								children: localPlayers.map((name, i) => /* @__PURE__ */ (void 0)("span", {
									className: "sketch bg-white px-2.5 sm:px-3 py-1 font-bold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 shadow-2xs",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "truncate max-w-[120px]",
										children: name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1011,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => setLocalPlayers(localPlayers.filter((_, idx) => idx !== i)),
										className: "text-xs text-destructive hover:bg-destructive/15 rounded-full h-5 w-5 inline-flex items-center justify-center font-bold transition-colors cursor-pointer shrink-0",
										title: `Remove ${name}`,
										children: "×"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1012,
										columnNumber: 21
									}, this)]
								}, `${name}-${i}`, true, {
									fileName: _jsxFileName,
									lineNumber: 1010,
									columnNumber: 48
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1009,
								columnNumber: 15
							}, this),
							localPlayers.length < 12 && /* @__PURE__ */ (void 0)("div", {
								className: "flex flex-col sm:flex-row gap-2 w-full max-w-full",
								children: [/* @__PURE__ */ (void 0)("input", {
									type: "text",
									value: localNewPlayerName,
									onChange: (e) => setLocalNewPlayerName(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter" && localNewPlayerName.trim()) {
											setLocalPlayers([...localPlayers, localNewPlayerName.trim()]);
											setLocalNewPlayerName("");
										}
									},
									placeholder: "New player name...",
									className: "sketch flex-1 min-w-0 w-full bg-white px-3 py-2 text-base focus:outline-none",
									maxLength: 15
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1020,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)(Btn, {
									variant: "secondary",
									className: "w-full sm:w-auto shrink-0 justify-center",
									onClick: () => {
										if (localNewPlayerName.trim()) {
											setLocalPlayers([...localPlayers, localNewPlayerName.trim()]);
											setLocalNewPlayerName("");
										}
									},
									children: "Add Player +"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1026,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1019,
								columnNumber: 44
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "pt-4 border-t border-line space-y-2",
								children: [localPlayers.length < 3 && /* @__PURE__ */ (void 0)("div", {
									className: "text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-300 font-bold",
									children: [
										"⚠️ Add at least 3 players to start (currently ",
										localPlayers.length,
										"/3)"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1037,
									columnNumber: 45
								}, this), /* @__PURE__ */ (void 0)(Btn, {
									className: "w-full sm:w-auto justify-center",
									onClick: startLocalGame,
									disabled: localPlayers.length < 3,
									children: "Start Pass & Play Round 🚀"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1040,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1036,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1003,
						columnNumber: 38
					}, this),
					localPhase === "reveal" && localRound && /* @__PURE__ */ (void 0)("div", {
						className: "text-center space-y-6 font-hand py-6",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "text-xs font-bold text-muted-foreground uppercase",
								children: [
									"PLAYER ",
									localTurn + 1,
									" OF ",
									localPlayers.length
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1047,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("h3", {
								className: "text-4xl font-display text-foreground",
								children: ["Pass phone to: ", /* @__PURE__ */ (void 0)("span", {
									className: "text-accent underline",
									children: localPlayers[localTurn]
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1051,
									columnNumber: 32
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1050,
								columnNumber: 15
							}, this),
							!localWordRevealed ? /* @__PURE__ */ (void 0)("div", {
								className: "sketch max-w-sm mx-auto bg-card p-6 border-2 border-foreground space-y-4 shadow-sm",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "relative mx-auto flex items-center justify-center",
										children: /* @__PURE__ */ (void 0)("img", {
											src: "/detective-covering-eyes.png",
											alt: "Detective Covering Eyes",
											className: "h-32 sm:h-36 w-auto object-contain drop-shadow-md transition-transform hover:scale-105"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1057,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1056,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "text-2xl font-display text-foreground",
											children: [
												"Only ",
												/* @__PURE__ */ (void 0)("span", {
													className: "text-accent underline font-bold",
													children: localPlayers[localTurn]
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1061,
													columnNumber: 28
												}, this),
												" should look!"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1060,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "text-xs text-muted-foreground",
											children: "Detective has his eyes covered tight with both hands! Tap below to open eyes."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1063,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1059,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => {
											sound.playPop();
											setLocalWordRevealed(true);
										},
										className: "sketch w-full flex items-center justify-center gap-2 bg-accent py-3 text-lg font-bold text-accent-foreground hover:brightness-110 shadow-sm animate-pulse",
										children: [/* @__PURE__ */ (void 0)(Eye, { className: "h-5 w-5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1072,
											columnNumber: 21
										}, this), " Open Eyes & Reveal Secret Word 👁️"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1068,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1055,
								columnNumber: 9
							}, this) : /* @__PURE__ */ (void 0)("div", {
								className: "sketch max-w-sm mx-auto bg-white p-6 border-2 border-accent space-y-4 shadow-md",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "relative mx-auto flex items-center justify-center",
										children: /* @__PURE__ */ (void 0)("img", {
											src: "/detective-eyes-open.png",
											alt: "Detective Eyes Wide Open",
											className: "h-32 sm:h-36 w-auto object-contain drop-shadow-md transition-transform scale-105"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1077,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1076,
										columnNumber: 19
									}, this),
									localRound.category && /* @__PURE__ */ (void 0)("div", {
										className: "inline-block bg-highlight px-3 py-1 rounded text-xs font-bold border border-foreground/30",
										children: ["📁 Category: ", localRound.category]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1079,
										columnNumber: 43
									}, this),
									/* @__PURE__ */ (void 0)("span", {
										className: "text-xs text-muted-foreground block font-bold tracking-wider uppercase",
										children: "CONFIDENTIAL SECRET WORD"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1082,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "text-4xl font-display text-accent font-bold",
										children: localTurn === localRound.imposterIdx ? localRound.fake : localRound.word
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1085,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "text-xs font-bold text-muted-foreground",
										children: localTurn === localRound.imposterIdx ? "🕵️ You are the Imposter! (Blend in and pretend you know the common word)" : "🔎 You are a Detective! (Spot the player whose clue sounds off)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1088,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "pt-2",
										children: /* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => {
												sound.playPop();
												setLocalWordRevealed(false);
												if (localTurn + 1 < localPlayers.length) setLocalTurn(localTurn + 1);
												else setLocalPhase("discuss");
											},
											className: "sketch w-full flex items-center justify-center gap-2 bg-primary py-2.5 text-base font-bold text-primary-foreground hover:brightness-110 shadow-sm",
											children: [/* @__PURE__ */ (void 0)(EyeOff, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1102,
												columnNumber: 23
											}, this), localTurn + 1 < localPlayers.length ? `Cover Eyes & Pass to ${localPlayers[localTurn + 1]} 🔒` : "Cover Eyes & Start Discussion! 🗣️"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1093,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1092,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1075,
								columnNumber: 9
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1046,
						columnNumber: 53
					}, this),
					localPhase === "discuss" && localRound && /* @__PURE__ */ (void 0)("div", {
						className: "space-y-6 text-center font-hand py-4",
						children: [
							/* @__PURE__ */ (void 0)("h3", {
								className: "text-3xl sm:text-4xl font-display text-foreground",
								children: "Classroom Discussion! 🗣️"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1110,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("p", {
								className: "text-base text-muted-foreground max-w-md mx-auto",
								children: "Each player speaks 1 clue out loud around the circle. Debate suspicious hints before casting your votes!"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1111,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "sketch bg-highlight/30 p-4 border border-foreground/30 max-w-sm mx-auto space-y-1",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "text-xs font-bold text-muted-foreground block uppercase",
									children: "Finished Debate?"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1116,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "text-sm",
									children: "Proceed to interrogate and vote on who the imposter is!"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1117,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1115,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)(Btn, {
								onClick: () => {
									sound.playDing();
									setLocalVotes({});
									setLocalPhase("vote");
								},
								children: "Proceed to Vote 🗳️"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1120,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1109,
						columnNumber: 54
					}, this),
					localPhase === "vote" && localRound && /* @__PURE__ */ (void 0)("div", {
						className: "space-y-5 text-center font-hand py-4",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (void 0)("span", {
										className: "text-xs font-bold text-accent uppercase font-mono",
										children: "Phase 3: Interrogation"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1131,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("h3", {
										className: "text-3xl sm:text-4xl font-display text-foreground",
										children: "Cast Classroom Votes! 🗳️"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1132,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "text-sm sm:text-base text-muted-foreground max-w-md mx-auto",
										children: [
											"Every player in the circle gets ",
											/* @__PURE__ */ (void 0)("strong", { children: "1 vote" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1134,
												columnNumber: 51
											}, this),
											". Tap ",
											/* @__PURE__ */ (void 0)("strong", {
												className: "text-accent",
												children: "+ Vote"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1134,
												columnNumber: 80
											}, this),
											" on the player you suspect!"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1133,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1130,
								columnNumber: 15
							}, this),
							(() => {
								const totalVotes = Object.values(localVotes).reduce((a, b) => a + b, 0);
								const maxVotesAllowed = localPlayers.length;
								const votesRemaining = Math.max(0, maxVotesAllowed - totalVotes);
								return /* @__PURE__ */ (void 0)("div", {
									className: "flex items-center justify-center gap-3",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "sketch inline-flex items-center gap-2 bg-white px-3.5 py-1.5 border border-foreground/30 shadow-xs",
										children: [
											/* @__PURE__ */ (void 0)("span", {
												className: "text-xs font-mono font-bold text-muted-foreground uppercase",
												children: "Classroom Votes:"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1145,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)("span", {
												className: "font-display text-lg font-bold text-accent",
												children: [
													totalVotes,
													" / ",
													maxVotesAllowed
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1146,
												columnNumber: 23
											}, this),
											votesRemaining === 0 ? /* @__PURE__ */ (void 0)("span", {
												className: "bg-emerald-100 text-emerald-800 text-[11px] px-2 py-0.5 rounded font-bold",
												children: "✅ All Voted"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1149,
												columnNumber: 47
											}, this) : /* @__PURE__ */ (void 0)("span", {
												className: "text-xs text-amber-800 font-bold",
												children: [
													"(",
													votesRemaining,
													" ",
													votesRemaining === 1 ? "vote" : "votes",
													" left)"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1151,
												columnNumber: 35
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1144,
										columnNumber: 21
									}, this), totalVotes > 0 && /* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => {
											sound.playPop();
											setLocalVotes({});
										},
										className: "text-xs text-muted-foreground hover:text-destructive underline font-bold cursor-pointer",
										children: "Reset 🔄"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1155,
										columnNumber: 40
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1143,
									columnNumber: 18
								}, this);
							})(),
							(() => {
								const totalVotes = Object.values(localVotes).reduce((a, b) => a + b, 0);
								const maxVotesAllowed = localPlayers.length;
								return /* @__PURE__ */ (void 0)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-xl mx-auto",
									children: localPlayers.map((player) => {
										const voteCount = localVotes[player] || 0;
										return /* @__PURE__ */ (void 0)("div", {
											className: `sketch p-3 text-center transition-all ${voteCount > 0 ? "bg-amber-100/90 border-2 border-accent shadow-sm" : "bg-white/80 border border-foreground/30"}`,
											children: [
												/* @__PURE__ */ (void 0)("div", {
													className: "font-display text-lg font-bold text-foreground truncate",
													children: player
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1172,
													columnNumber: 27
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "text-xs font-bold my-1",
													children: voteCount > 0 ? /* @__PURE__ */ (void 0)("span", {
														className: "inline-block bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-mono",
														children: [
															"🗳️ ",
															voteCount,
															" ",
															voteCount === 1 ? "Vote" : "Votes"
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1176,
														columnNumber: 46
													}, this) : /* @__PURE__ */ (void 0)("span", {
														className: "text-muted-foreground",
														children: "0 votes"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1178,
														columnNumber: 41
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1175,
													columnNumber: 27
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-center gap-1.5 pt-1",
													children: [/* @__PURE__ */ (void 0)("button", {
														type: "button",
														disabled: totalVotes >= maxVotesAllowed,
														onClick: () => {
															if (totalVotes >= maxVotesAllowed) return;
															sound.playPop();
															setLocalVotes((prev) => ({
																...prev,
																[player]: (prev[player] || 0) + 1
															}));
														},
														className: "sketch bg-accent text-accent-foreground px-2.5 py-1 text-xs font-bold hover:brightness-105 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer",
														title: totalVotes >= maxVotesAllowed ? "All votes have been cast!" : "+1 Vote",
														children: "+ Vote"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1181,
														columnNumber: 29
													}, this), voteCount > 0 && /* @__PURE__ */ (void 0)("button", {
														type: "button",
														onClick: () => {
															sound.playPop();
															setLocalVotes((prev) => ({
																...prev,
																[player]: Math.max(0, (prev[player] || 0) - 1)
															}));
														},
														className: "sketch bg-secondary text-foreground px-2 py-1 text-xs font-bold hover:bg-secondary/80 cursor-pointer",
														title: "-1 Vote",
														children: "-"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1191,
														columnNumber: 47
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1180,
													columnNumber: 27
												}, this)
											]
										}, player, true, {
											fileName: _jsxFileName,
											lineNumber: 1171,
											columnNumber: 22
										}, this);
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1168,
									columnNumber: 18
								}, this);
							})(),
							(() => {
								const totalVotes = Object.values(localVotes).reduce((a, b) => a + b, 0);
								const maxVotesAllowed = localPlayers.length;
								const topSuspect = Object.entries(localVotes).sort((a, b) => b[1] - a[1])[0];
								return /* @__PURE__ */ (void 0)("div", {
									className: "space-y-3 max-w-sm mx-auto",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "sketch bg-highlight/40 p-2.5 border border-foreground/30 text-xs sm:text-sm",
										children: totalVotes >= maxVotesAllowed && topSuspect && topSuspect[1] > 0 ? /* @__PURE__ */ (void 0)("span", { children: [
											"🎯 All ",
											maxVotesAllowed,
											" votes are in! Prime Suspect: ",
											/* @__PURE__ */ (void 0)("strong", {
												className: "text-accent underline font-display text-base",
												children: topSuspect[0]
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1216,
												columnNumber: 81
											}, this),
											" (",
											topSuspect[1],
											" votes)"
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1215,
											columnNumber: 70
										}, this) : totalVotes > 0 && topSuspect && topSuspect[1] > 0 ? /* @__PURE__ */ (void 0)("span", { children: [
											"🎯 Leading Suspect: ",
											/* @__PURE__ */ (void 0)("strong", {
												className: "text-accent underline font-display text-base",
												children: topSuspect[0]
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1218,
												columnNumber: 47
											}, this),
											" with ",
											topSuspect[1],
											" votes (",
											totalVotes,
											"/",
											maxVotesAllowed,
											" cast)"
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1217,
											columnNumber: 87
										}, this) : /* @__PURE__ */ (void 0)("span", { children: [
											"Each player taps ",
											/* @__PURE__ */ (void 0)("strong", { children: "+ Vote" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1219,
												columnNumber: 58
											}, this),
											" once for their main suspect!"
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1219,
											columnNumber: 35
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1214,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex justify-center gap-2 pt-1",
										children: [/* @__PURE__ */ (void 0)(Btn, {
											variant: "secondary",
											onClick: () => setLocalPhase("discuss"),
											children: "Back to Discuss"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1223,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Btn, {
											onClick: () => {
												sound.playVictory();
												setLocalPhase("result");
											},
											children: "Reveal the Imposter 🕵️"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1226,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1222,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1213,
									columnNumber: 18
								}, this);
							})()
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1129,
						columnNumber: 51
					}, this),
					localPhase === "result" && localRound && /* @__PURE__ */ (void 0)("div", {
						className: "text-center space-y-5 font-hand py-4",
						children: [
							(() => {
								const actualImposter = localPlayers[localRound.imposterIdx];
								const topSuspect = Object.entries(localVotes).sort((a, b) => b[1] - a[1])[0];
								const caughtImposter = Boolean(topSuspect && topSuspect[1] > 0 && topSuspect[0] === actualImposter);
								return /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-center gap-4",
										children: [/* @__PURE__ */ (void 0)("img", {
											src: "/trophy-gold.png",
											alt: "Trophy",
											className: "h-20 w-20 object-contain drop-shadow-md animate-bounce"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1245,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("img", {
											src: "/detective-jumping-win.png",
											alt: "Detective Jumping Celebration",
											className: "h-24 w-auto object-contain drop-shadow-md"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1246,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1244,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: `p-3 rounded-lg border-2 max-w-md mx-auto ${caughtImposter ? "bg-emerald-50 border-emerald-500 text-emerald-950" : "bg-rose-50 border-rose-400 text-rose-950"}`,
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "text-2xl sm:text-3xl font-display font-bold",
											children: caughtImposter ? "🎉 BUSTED! Classroom Caught the Imposter!" : "🤫 ESCAPED! The Imposter Fooled Everyone!"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1250,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "text-xs sm:text-sm font-hand mt-1",
											children: caughtImposter ? `Great deduction! ${actualImposter} was correctly voted out.` : `${actualImposter} was the real imposter and fooled the class!`
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1253,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1249,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "text-3xl font-display text-accent font-bold",
										children: [
											"The Real Imposter was: ",
											/* @__PURE__ */ (void 0)("span", {
												className: "underline",
												children: actualImposter
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1259,
												columnNumber: 46
											}, this),
											"!"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1258,
										columnNumber: 21
									}, this),
									Object.keys(localVotes).length > 0 && /* @__PURE__ */ (void 0)("div", {
										className: "sketch bg-white/70 p-3 max-w-sm mx-auto border border-foreground/20 text-xs",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "font-bold text-muted-foreground uppercase mb-1",
											children: "Classroom Vote Tally:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1264,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "flex flex-wrap justify-center gap-2",
											children: localPlayers.map((p) => /* @__PURE__ */ (void 0)("span", {
												className: "sketch bg-white px-2 py-0.5 text-xs font-mono",
												children: [
													p,
													": ",
													localVotes[p] || 0,
													" votes"
												]
											}, p, true, {
												fileName: _jsxFileName,
												lineNumber: 1266,
												columnNumber: 50
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1265,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1263,
										columnNumber: 60
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1243,
									columnNumber: 18
								}, this);
							})(),
							localRound.category && /* @__PURE__ */ (void 0)("div", {
								className: "inline-block bg-highlight px-3 py-1 rounded text-sm font-bold border border-foreground/30",
								children: ["📁 Category: ", localRound.category]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1274,
								columnNumber: 39
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "grid grid-cols-2 gap-3 max-w-sm mx-auto",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-white p-3",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-xs text-muted-foreground block font-bold",
										children: "COMMON WORD"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1280,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "text-2xl font-display text-primary font-bold",
										children: localRound.word
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1281,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1279,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-white p-3",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-xs text-muted-foreground block font-bold",
										children: "IMPOSTER WORD"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1284,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "text-2xl font-display text-accent font-bold",
										children: localRound.fake
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1285,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1283,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1278,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "flex justify-center gap-3 pt-2",
								children: [/* @__PURE__ */ (void 0)(Btn, {
									onClick: startLocalGame,
									children: "Next Round 🚀"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1290,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)(Btn, {
									variant: "secondary",
									onClick: () => setLocalPhase("lobby"),
									children: "Back to Setup"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1291,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1289,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1237,
						columnNumber: 53
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 984,
				columnNumber: 23
			}, this),
			roomState && roomState.phase === "lobby" && /* @__PURE__ */ (void 0)("section", {
				className: "notebook relative mx-auto max-w-4xl rounded-sm py-6 sm:py-10 pl-5 sm:pl-12 md:pl-20 pr-4 sm:pr-8 md:pr-12 shadow-2xl space-y-4 sm:space-y-6",
				children: [
					/* @__PURE__ */ (void 0)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-1deg]" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1300,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "flex flex-wrap items-center justify-between gap-4 border-b-2 border-foreground/30 pb-4",
						children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (void 0)("span", {
									className: `text-xs font-bold px-2 py-0.5 rounded uppercase font-hand ${roomState.settings.isPublic ? "bg-accent/20 text-accent border border-accent/30" : "bg-primary/20 text-primary border border-primary/30"}`,
									children: roomState.settings.isPublic ? "🟢 Public Room" : "🔒 Private Room"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1306,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("span", {
									className: "text-sm font-bold text-accent font-hand uppercase",
									children: "Classroom Lobby"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1309,
									columnNumber: 17
								}, this),
								lobbyTimeLeft !== null && /* @__PURE__ */ (void 0)("span", {
									className: "flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded uppercase font-hand bg-amber-100 text-amber-900 border border-amber-400/60 shadow-xs",
									children: [
										/* @__PURE__ */ (void 0)(Clock, { className: "h-3.5 w-3.5 animate-pulse text-amber-700" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1311,
											columnNumber: 21
										}, this),
										"Auto-closes in ",
										Math.floor(lobbyTimeLeft / 60),
										":",
										(lobbyTimeLeft % 60).toString().padStart(2, "0")
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1310,
									columnNumber: 44
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1305,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("h2", {
							className: "text-4xl md:text-5xl font-display text-foreground",
							children: ["Room #", roomState.roomCode]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1315,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1304,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "flex flex-wrap items-center gap-3",
							children: [
								/* @__PURE__ */ (void 0)("button", {
									onClick: handleCopyLink,
									className: "sketch flex items-center gap-1.5 bg-secondary px-4 py-2 font-bold text-base hover:bg-secondary/80",
									children: [copiedLink ? /* @__PURE__ */ (void 0)(Check, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1322,
										columnNumber: 31
									}, this) : /* @__PURE__ */ (void 0)(Copy, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1322,
										columnNumber: 63
									}, this), copiedLink ? "Link Copied!" : "Copy Invite Link"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1321,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("button", {
									onClick: () => {
										sound.playPop();
										setShowSettings(true);
									},
									className: "sketch flex items-center gap-1.5 bg-card px-4 py-2 font-bold text-base hover:bg-secondary",
									children: [/* @__PURE__ */ (void 0)(Settings, { className: "h-4 w-4 text-accent" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1330,
										columnNumber: 17
									}, this), "Settings"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1326,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("button", {
									onClick: handleLeaveRoom,
									className: "sketch bg-secondary px-4 py-2 font-bold text-base text-destructive hover:bg-destructive/10",
									children: "Leave"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1334,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1320,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1303,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3 font-hand text-center",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "sketch bg-white/70 p-2.5 rounded",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "text-xs text-muted-foreground block font-bold",
									children: "CAPACITY"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1343,
									columnNumber: 15
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-xl font-bold font-display text-primary",
									children: [
										roomState.players.length,
										" / ",
										roomState.settings.capacity
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1344,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1342,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "sketch bg-white/70 p-2.5 rounded",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "text-xs text-muted-foreground block font-bold",
									children: "HINT / DRAW TIME"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1349,
									columnNumber: 15
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-xl font-bold font-display text-accent",
									children: [roomState.settings.drawTime, "s"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1350,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1348,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "sketch bg-white/70 p-2.5 rounded",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "text-xs text-muted-foreground block font-bold",
									children: "ROUNDS"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1355,
									columnNumber: 15
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-xl font-bold font-display text-foreground",
									children: roomState.settings.rounds
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1356,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1354,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "sketch bg-white/70 p-2.5 rounded",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "text-xs text-muted-foreground block font-bold",
									children: "MODE"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1361,
									columnNumber: 15
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-lg font-bold font-display text-foreground capitalize",
									children: roomState.settings.gameMode.replace("_", " ")
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1362,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1360,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1341,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "sketch bg-white/80 p-3 sm:p-4 flex items-center gap-3 sm:gap-4 border-2 border-foreground shadow-xs",
						children: [/* @__PURE__ */ (void 0)("img", {
							src: "/detective-waving.png",
							alt: "Detective Waving",
							className: "h-16 w-16 sm:h-20 sm:w-20 object-contain shrink-0 drop-shadow-xs"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1370,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "font-hand space-y-0.5",
							children: [/* @__PURE__ */ (void 0)("h4", {
								className: "text-xl sm:text-2xl font-display text-primary font-bold",
								children: "Welcome to Class! 👋"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1372,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-xs sm:text-sm text-foreground",
								children: roomState.players.length < 3 ? "Share room code or invite link with friends. Match can start once 3 detectives arrive!" : "All desks are ready! Host can start the round anytime."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1375,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1371,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1369,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center justify-between font-hand",
							children: [/* @__PURE__ */ (void 0)("h3", {
								className: "text-2xl font-display text-foreground flex items-center gap-2",
								children: [
									/* @__PURE__ */ (void 0)(Users, { className: "h-5 w-5 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1385,
										columnNumber: 17
									}, this),
									" Who's in Class? (",
									roomState.players.length,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1384,
								columnNumber: 15
							}, this), roomState.players.length < 3 && /* @__PURE__ */ (void 0)("span", {
								className: "text-sm font-bold text-destructive",
								children: "⚠️ Need at least 3 players to start"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1387,
								columnNumber: 48
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1383,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3",
							children: roomState.players.map((p) => /* @__PURE__ */ (void 0)("div", {
								className: "sketch bg-white/90 p-3 flex items-center justify-between gap-3 shadow-xs",
								children: /* @__PURE__ */ (void 0)("div", {
									className: "flex items-center gap-2.5 overflow-hidden",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "h-10 w-10 shrink-0 rounded-full bg-secondary border border-foreground/30 flex items-center justify-center font-bold text-primary font-display text-lg",
										children: p.displayName.charAt(0).toUpperCase()
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1395,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "truncate",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "font-bold text-base truncate flex items-center gap-1.5 flex-wrap",
											children: [
												p.displayName,
												p.isHost && /* @__PURE__ */ (void 0)("span", {
													className: "rounded bg-accent/20 px-1 text-[11px] font-bold text-accent border border-accent/30",
													children: "HOST"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1401,
													columnNumber: 38
												}, this),
												p.userId?.startsWith("guest_") && /* @__PURE__ */ (void 0)("span", {
													className: "rounded bg-muted px-1 text-[10px] font-bold text-muted-foreground border border-foreground/20",
													children: "GUEST"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1404,
													columnNumber: 60
												}, this),
												p.socketId === currentSocketId && /* @__PURE__ */ (void 0)("span", {
													className: "text-xs text-muted-foreground font-normal",
													children: "(You)"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1407,
													columnNumber: 60
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1399,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "text-xs text-muted-foreground",
											children: "Ready to play ✏️"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1409,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1398,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1394,
									columnNumber: 19
								}, this)
							}, p.socketId, false, {
								fileName: _jsxFileName,
								lineNumber: 1393,
								columnNumber: 50
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1392,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1382,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "pt-4 border-t-2 border-foreground/30 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "text-sm text-muted-foreground font-hand",
							children: isHost ? "You are the host. Configure settings above and start when ready." : "Waiting for the host to start the match..."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1418,
							columnNumber: 13
						}, this), isHost && /* @__PURE__ */ (void 0)(Btn, {
							disabled: roomState.players.length < 3,
							onClick: handleStartGame,
							className: "w-full sm:w-auto",
							children: [
								"Start Game 🚀 (",
								roomState.players.length,
								"/3 Min)"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1422,
							columnNumber: 24
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1417,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1299,
				columnNumber: 52
			}, this),
			roomState && roomState.phase !== "lobby" && /* @__PURE__ */ (void 0)("section", {
				className: "notebook relative mx-auto max-w-5xl rounded-sm py-6 sm:py-8 pl-5 sm:pl-12 md:pl-20 pr-4 sm:pr-8 md:pr-12 shadow-2xl space-y-4 sm:space-y-6",
				children: [
					/* @__PURE__ */ (void 0)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-1deg]" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1430,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground/30 pb-3 font-hand",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2 sm:gap-3",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "sketch bg-secondary px-2.5 sm:px-3 py-1 text-sm sm:text-base font-bold text-foreground",
								children: [
									"Round ",
									roomState.currentRound,
									" of ",
									roomState.totalRounds
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1435,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "sketch bg-highlight px-2.5 sm:px-3 py-1 text-sm sm:text-base font-bold text-foreground capitalize",
								children: [
									roomState.phase === "hint_turn" && "Clue Phase",
									roomState.phase === "discussion" && /* @__PURE__ */ (void 0)("span", { children: [
										"Discussion (",
										remainingTime,
										"s)",
										roomState.skipDiscussionVotesCount > 0 && ` • ${roomState.skipDiscussionVotesCount}/${roomState.skipDiscussionRequired} Skip`
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1441,
										columnNumber: 54
									}, this),
									roomState.phase === "answer_submission" && "Secret Vote",
									roomState.phase === "results" && "Round Results"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1439,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1434,
							columnNumber: 13
						}, this), remainingTime > 0 && roomState.phase !== "results" && /* @__PURE__ */ (void 0)("div", {
							className: "sketch bg-accent px-3 sm:px-4 py-1 text-accent-foreground font-bold text-base sm:text-lg flex items-center gap-1.5 sm:gap-2",
							children: [/* @__PURE__ */ (void 0)(Clock, { className: "h-4 w-4 sm:h-5 sm:w-5 animate-pulse" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1452,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", { children: [remainingTime, "s"] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1453,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1451,
							columnNumber: 68
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1433,
						columnNumber: 11
					}, this),
					secretInfo && /* @__PURE__ */ (void 0)("div", {
						className: "sketch bg-white/95 px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 border-2 border-foreground shadow-xs font-hand",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2.5 sm:gap-3.5 min-w-0",
							children: [/* @__PURE__ */ (void 0)("img", {
								src: showSecretWord ? "/detective-eyes-open.png" : "/detective-covering-eyes.png",
								alt: "Detective Mascot",
								className: "h-9 w-9 sm:h-11 sm:w-11 object-contain shrink-0 drop-shadow-xs"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1460,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center gap-1.5 sm:gap-2 flex-wrap",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-[10px] sm:text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider",
										children: showSecretWord ? "YOUR WORD:" : "SECRET WORD:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1463,
										columnNumber: 21
									}, this), showSecretWord && /* @__PURE__ */ (void 0)("span", {
										className: `text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${secretInfo.role === "imposter" ? "bg-accent/20 text-accent border border-accent/30" : "bg-primary/20 text-primary border border-primary/30"}`,
										children: secretInfo.role === "imposter" ? "🕵️ IMPOSTER" : "🔎 DETECTIVE"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1466,
										columnNumber: 40
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1462,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "text-xl sm:text-2xl md:text-3xl font-display text-accent font-bold truncate leading-tight",
									children: showSecretWord ? secretInfo.word : "🔒 • • • • • • 🔒"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1470,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1461,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1459,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "shrink-0",
							children: /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => {
									sound.playPop();
									setShowSecretWord(!showSecretWord);
								},
								className: `sketch flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold transition-all shadow-xs ${showSecretWord ? "bg-secondary text-foreground hover:bg-secondary/80" : "bg-accent text-accent-foreground hover:brightness-110"}`,
								children: [showSecretWord ? /* @__PURE__ */ (void 0)(EyeOff, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1481,
									columnNumber: 37
								}, this) : /* @__PURE__ */ (void 0)(Eye, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1481,
									columnNumber: 74
								}, this), /* @__PURE__ */ (void 0)("span", { children: showSecretWord ? "Hide 🔒" : "Peek 👁️" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1482,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1477,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1476,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1458,
						columnNumber: 26
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-5 items-start",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "lg:col-span-7 space-y-5",
							children: [
								roomState.phase === "hint_turn" && /* @__PURE__ */ (void 0)("div", { children: isMyTurn ? /* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-white/95 p-3 sm:p-4 border-2 border-accent space-y-3 shadow-sm",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-foreground/15 pb-2.5",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "font-bold text-accent flex items-center gap-1.5 font-display text-lg sm:text-xl",
											children: [/* @__PURE__ */ (void 0)(Flame, { className: "h-4 w-4 sm:h-5 sm:w-5 text-accent animate-pulse" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1496,
												columnNumber: 27
											}, this), /* @__PURE__ */ (void 0)("span", { children: "Your Turn to Give a Clue!" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1497,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1495,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-1 bg-muted/60 p-0.5 rounded border border-foreground/20 font-hand",
											children: [
												/* @__PURE__ */ (void 0)("button", {
													type: "button",
													onClick: () => {
														sound.playPop();
														setClueType("text");
													},
													className: `sketch px-2.5 py-1 text-xs font-bold transition-all ${clueType === "text" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
													children: "✏️ Text"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1502,
													columnNumber: 27
												}, this),
												/* @__PURE__ */ (void 0)("button", {
													type: "button",
													onClick: () => {
														sound.playPop();
														setClueType("draw");
													},
													className: `sketch px-2.5 py-1 text-xs font-bold transition-all ${clueType === "draw" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
													children: "🎨 Sketch"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1508,
													columnNumber: 27
												}, this),
												/* @__PURE__ */ (void 0)("button", {
													type: "button",
													onClick: () => {
														sound.playPop();
														setClueType("voice");
													},
													className: `sketch px-2.5 py-1 text-xs font-bold transition-all ${clueType === "voice" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
													children: "🎙️ Voice"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1514,
													columnNumber: 27
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1501,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1494,
										columnNumber: 23
									}, this), clueType === "text" ? /* @__PURE__ */ (void 0)("div", {
										className: "space-y-3 font-hand pt-1",
										children: [/* @__PURE__ */ (void 0)("input", {
											type: "text",
											value: textClueInput,
											onChange: (e) => setTextClueInput(e.target.value),
											placeholder: "Type a clever subtle clue without saying the secret word...",
											className: "sketch w-full bg-card px-3.5 py-2 text-sm sm:text-base focus:outline-none",
											maxLength: 100
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1524,
											columnNumber: 27
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "flex justify-end",
											children: /* @__PURE__ */ (void 0)(Btn, {
												onClick: handleSubmitTextClue,
												disabled: !textClueInput.trim(),
												children: "Submit Clue ✏️"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1526,
												columnNumber: 29
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1525,
											columnNumber: 27
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1523,
										columnNumber: 46
									}, this) : clueType === "draw" ? /* @__PURE__ */ (void 0)(DrawPad, {
										onDone: handleSubmitDrawingClue,
										onCancel: () => setClueType("text")
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1530,
										columnNumber: 56
									}, this) : /* @__PURE__ */ (void 0)(VoiceClueRecorder, { onSubmit: (audioUrl, transcript) => {
										handleSubmitVoiceClue(audioUrl, transcript);
									} }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1530,
										columnNumber: 140
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1492,
									columnNumber: 31
								}, this) : /* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-white/90 p-5 sm:p-6 text-center space-y-2.5 font-hand flex flex-col items-center justify-center border-2 border-foreground/30 shadow-xs",
									children: [
										/* @__PURE__ */ (void 0)("img", {
											src: "/detective-drawing.png",
											alt: "Detective Drawing",
											className: "h-20 sm:h-24 w-auto object-contain drop-shadow-xs animate-pulse"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1534,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "text-xl sm:text-2xl font-display text-foreground",
											children: [
												"Waiting for ",
												roomState.activePlayerName,
												"'s clue... ✏️"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1535,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("p", {
											className: "text-muted-foreground text-xs sm:text-sm max-w-sm mx-auto leading-relaxed",
											children: "Watch closely or inspect their drawing to determine if their clue fits the secret word!"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1538,
											columnNumber: 23
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1533,
									columnNumber: 30
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1491,
									columnNumber: 51
								}, this),
								roomState.phase === "discussion" && /* @__PURE__ */ (void 0)(VoiceDiscussionFloor, {
									socket: socketRef.current,
									roomCode: roomState.roomCode,
									myPlayer,
									players: roomState.players || [],
									speakerFloor: roomState.speakerFloor,
									remainingTime,
									skipDiscussionVotesCount: roomState.skipDiscussionVotesCount || 0,
									skipDiscussionRequired: roomState.skipDiscussionRequired || Math.floor((roomState.players?.filter((p) => p.isConnected).length || 3) / 2 + 1),
									hasVotedSkip: hasVotedSkipDiscussion,
									onVoteSkip: handleVoteSkipDiscussion
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1545,
									columnNumber: 52
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "space-y-3 font-hand",
									children: [/* @__PURE__ */ (void 0)("h4", {
										className: "text-2xl font-display text-foreground flex items-center gap-2",
										children: /* @__PURE__ */ (void 0)("span", { children: [
											"📌 Clue Pinboard (",
											roomState.hints?.length || 0,
											")"
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1550,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1549,
										columnNumber: 17
									}, this), !roomState.hints || roomState.hints.length === 0 ? /* @__PURE__ */ (void 0)("div", {
										className: "sketch bg-card/40 p-6 text-center text-muted-foreground text-sm",
										children: "No clues shared yet. The first clue will appear here! 📋"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1553,
										columnNumber: 69
									}, this) : /* @__PURE__ */ (void 0)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: roomState.hints.map((hint, idx) => /* @__PURE__ */ (void 0)("div", {
											className: "sketch relative bg-white/95 p-3.5 space-y-2 border border-foreground/30 shadow-xs",
											children: [
												/* @__PURE__ */ (void 0)("div", { className: "tape absolute -top-2 left-4 h-4 w-16 rotate-[-2deg]" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1557,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "text-xs font-bold text-primary pt-1",
													children: hint.playerName
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1558,
													columnNumber: 25
												}, this),
												hint.type === "text" ? /* @__PURE__ */ (void 0)("div", {
													className: "text-lg font-bold text-foreground italic",
													children: [
														"\"",
														hint.content,
														"\""
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1560,
													columnNumber: 49
												}, this) : hint.type === "voice" ? /* @__PURE__ */ (void 0)(VoiceCluePlayer, {
													audioUrl: hint.content,
													transcript: hint.transcript
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1562,
													columnNumber: 60
												}, this) : /* @__PURE__ */ (void 0)("div", {
													className: "rounded border bg-white p-1",
													children: /* @__PURE__ */ (void 0)("img", {
														src: hint.content,
														alt: "Player sketch",
														className: "h-32 w-full object-contain"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1563,
														columnNumber: 29
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1562,
													columnNumber: 135
												}, this)
											]
										}, idx, true, {
											fileName: _jsxFileName,
											lineNumber: 1556,
											columnNumber: 70
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1555,
										columnNumber: 28
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1548,
									columnNumber: 15
								}, this),
								roomState.phase === "results" && roomState.lastResult && /* @__PURE__ */ (void 0)("div", {
									className: "sketch relative bg-highlight/40 p-6 border-2 border-accent space-y-4 text-center font-hand overflow-hidden",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center justify-center gap-3",
											children: [/* @__PURE__ */ (void 0)("img", {
												src: "/trophy-gold.png",
												alt: "Trophy",
												className: "h-20 sm:h-24 w-auto object-contain drop-shadow-md hover:scale-110 transition-transform"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1572,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("img", {
												src: "/detective-jumping-win.png",
												alt: "Detective Celebrating Win",
												className: "h-24 sm:h-28 w-auto object-contain drop-shadow-md hover:scale-110 transition-transform animate-bounce"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1573,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1571,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "text-3xl md:text-4xl font-display font-bold text-accent",
											children: roomState.lastResult.banner
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1576,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "grid grid-cols-2 gap-3 max-w-md mx-auto pt-2",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "sketch bg-white p-3",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "text-xs text-muted-foreground block font-bold",
													children: "COMMON WORD"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1582,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("span", {
													className: "text-2xl font-display text-primary font-bold",
													children: roomState.lastResult.commonWord
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1583,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1581,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("div", {
												className: "sketch bg-white p-3",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "text-xs text-muted-foreground block font-bold",
													children: "IMPOSTER WORD"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1589,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("span", {
													className: "text-2xl font-display text-accent font-bold",
													children: roomState.lastResult.imposterWord
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1590,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1588,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1580,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "text-sm font-bold text-foreground",
											children: [
												"Imposter: ",
												roomState.lastResult.imposterNames?.join(", ") || "Unknown",
												" 🕵️"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1596,
											columnNumber: 19
										}, this),
										isHost && /* @__PURE__ */ (void 0)("div", {
											className: "pt-2",
											children: /* @__PURE__ */ (void 0)(Btn, {
												onClick: handleNextRound,
												children: roomState.currentRound >= roomState.totalRounds ? "Finish Match & View Rankings 🏆" : "Start Next Round 🚀"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1601,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1600,
											columnNumber: 30
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1570,
									columnNumber: 73
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1490,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "lg:col-span-5",
							children: /* @__PURE__ */ (void 0)(ChatPanel, {
								messages: roomState.chatMessages || [],
								onSendMessage: handleSendChatMessage,
								phase: roomState.phase,
								players: roomState.players || [],
								currentSocketId,
								hasSubmittedAnswer,
								onSubmitAnswer: handleSubmitSecretAnswer,
								submissionCount: roomState.answerSubmissionCount || 0,
								totalEligible: roomState.totalEligibleAnswers || roomState.players?.length || 0
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1610,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1609,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1488,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1429,
				columnNumber: 52
			}, this),
			showSettings && /* @__PURE__ */ (void 0)(RoomSettingsModal, {
				initialSettings: roomState?.settings || {
					capacity: 8,
					language: "English",
					drawTime: 80,
					rounds: 3,
					gameMode: "normal",
					wordCount: 1,
					hintsCount: 1,
					isPublic: true,
					category: "All Categories",
					difficulty: "all"
				},
				isHost: isHost || !roomState,
				isMuted,
				isBgmActive,
				currentTrackName: currentTrack.name,
				onToggleMute: handleToggleMute,
				onToggleBgm: handleToggleBgm,
				onNextTrack: handleNextTrack,
				onPrevTrack: handlePrevTrack,
				onSave: (newSettings) => {
					if (roomState && isHost) socketRef.current.emit("room:update-settings", { settings: newSettings });
				},
				onClose: () => setShowSettings(false)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1616,
				columnNumber: 24
			}, this),
			showPublicRooms && /* @__PURE__ */ (void 0)(PublicRoomsModal, {
				rooms: publicRooms,
				onJoinRoom: (code) => handleJoinRoom(code),
				onCreateRoom: () => handleCreateRoom({ isPublic: true }),
				onRefresh: fetchPublicRooms,
				onClose: () => setShowPublicRooms(false)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1635,
				columnNumber: 27
			}, this),
			showNoticeBoard && /* @__PURE__ */ (void 0)(NoticeBoardModal, {
				onClose: () => setShowNoticeBoard(false),
				championName
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1639,
				columnNumber: 27
			}, this),
			showAccount && /* @__PURE__ */ (void 0)(AccountModal, {
				user,
				onClose: () => setShowAccount(false),
				onLogout: () => {
					const savedGuestId = getInstantGuestId();
					fetch(`${API_BASE}/api/auth/logout`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({ guestId: savedGuestId || void 0 })
					}).then((res) => res.json()).then((data) => {
						if (data.guestUser) {
							syncUserToStorage(data.guestUser);
							toast.success(`Logged out! Switched back to Guest: ${data.guestUser.displayName}`);
						} else fetch(`${API_BASE}/api/auth/guest`, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							credentials: "include",
							body: JSON.stringify({
								guestId: savedGuestId || void 0,
								name: getInstantGuestName()
							})
						}).then((r) => r.json()).then((gData) => {
							if (gData.user) syncUserToStorage(gData.user);
						});
						setShowAccount(false);
					}).catch(() => {
						setUser(null);
						setShowAccount(false);
					});
				},
				onGoogleLogin: handleGoogleLogin,
				onUpdateProfile: (profileData) => {
					if (user) fetch(`${API_BASE}/api/user/update`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({
							userId: user.id,
							displayName: profileData.displayName,
							username: profileData.username,
							country: profileData.country,
							state: profileData.state,
							city: profileData.city
						})
					}).then((res) => res.json()).then((data) => {
						if (data.user) {
							syncUserToStorage(data.user);
							toast.success("Detective Profile updated!");
						}
					});
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1641,
				columnNumber: 23
			}, this),
			showLeaderboard && /* @__PURE__ */ (void 0)(LeaderboardModal, { onClose: () => setShowLeaderboard(false) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1702,
				columnNumber: 27
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 716,
		columnNumber: 10
	}, this);
}
//#endregion
export { Index as component };
