import { o as __toESM } from "../_runtime.mjs";
import { t as API_BASE } from "./api-OZfBBcXI.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { $ as Check, A as Music, B as Flag, C as Plus, D as Pause, F as LoaderCircle, H as EyeOff, J as Clock, K as Copy, L as Heart, M as MapPin, N as LogOut, O as Paintbrush, P as Lock, R as Globe, T as Pin, V as Eye, W as Eraser, Z as CircleAlert, _ as Send, a as UserCheck, b as RefreshCw, d as Square, et as Building2, h as Settings, i as Users, j as Mic, k as PaintBucket, l as Trash2, n as VolumeX, nt as AtSign, o as Undo2, q as Compass, r as Volume2, rt as ArrowLeft, s as Trophy, t as X, v as Search, w as Play, y as RotateCcw, z as Flame } from "../_libs/lucide-react.mjs";
import { t as lookup } from "../_libs/socket.io-client+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C6xeE_y9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
		onDone(canvas.toDataURL("image/png"));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2.5 sm:space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 bg-muted/40 p-2 rounded-md border border-foreground/20 font-hand text-xs sm:text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setActiveTool("pen"),
								className: `sketch flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all ${activeTool === "pen" ? "bg-accent text-accent-foreground shadow-xs" : "bg-white text-foreground hover:bg-secondary"}`,
								title: "Pen / Pencil Tool",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paintbrush, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pen" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setActiveTool("bucket"),
								className: `sketch flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all ${activeTool === "bucket" ? "bg-accent text-accent-foreground shadow-xs" : "bg-white text-foreground hover:bg-secondary"}`,
								title: "Paint Bucket / Flood Fill",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaintBucket, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fill 🪣" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setActiveTool("eraser"),
								className: `sketch flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all ${activeTool === "eraser" ? "bg-accent text-accent-foreground shadow-xs" : "bg-white text-foreground hover:bg-secondary"}`,
								title: "Eraser Tool",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Eraser" })]
							})
						]
					}),
					activeTool !== "bucket" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold text-muted-foreground hidden sm:inline",
							children: "SIZE:"
						}), [
							2,
							4,
							8,
							14
						].map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSelectedWidth(w),
							className: `flex h-6 w-6 items-center justify-center rounded border transition-transform ${selectedWidth === w ? "bg-accent text-accent-foreground font-bold scale-110 shadow-xs" : "bg-white hover:bg-secondary"}`,
							title: `Stroke width ${w}px`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-foreground",
								style: {
									width: `${Math.min(w * 1.3, 14)}px`,
									height: `${Math.min(w * 1.3, 14)}px`
								}
							})
						}, w))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 ml-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleUndo,
							disabled: !canUndo,
							className: "sketch flex items-center gap-1 bg-white px-2.5 py-1 text-xs font-bold text-foreground hover:bg-secondary disabled:opacity-30",
							title: "Undo last stroke or fill",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-3 w-3" }), " Undo"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleClear,
							className: "sketch flex items-center gap-1 bg-white px-2.5 py-1 text-xs font-bold text-destructive hover:bg-destructive/10",
							title: "Clear canvas",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" }), " Clear"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 overflow-x-auto py-1 scrollbar-none px-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-bold text-muted-foreground shrink-0 font-hand",
					children: "INK:"
				}), colors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setSelectedColor(c.value);
						if (activeTool === "eraser") setActiveTool("pen");
					},
					className: `h-6 w-6 sm:h-7 sm:w-7 shrink-0 rounded-full border-2 transition-all ${selectedColor === c.value && activeTool !== "eraser" ? "scale-125 border-foreground shadow-sm ring-2 ring-accent" : "border-foreground/30 hover:scale-110"} ${c.value === "#FFFFFF" ? "border-dashed border-gray-400" : ""}`,
					style: { backgroundColor: c.value },
					title: c.label
				}, c.value))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative rounded-md overflow-hidden border-2 border-foreground bg-white shadow-inner",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "h-60 sm:h-72 md:h-80 w-full touch-none cursor-crosshair block",
					"aria-label": "Notebook Sketchpad"
				}), !canUndo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 text-sm sm:text-base font-hand gap-0.5 p-4 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Draw or fill your clue here... ✏️🪣" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-sans opacity-70",
						children: activeTool === "bucket" ? "Click any enclosed space to fill color" : "Switch to Fill 🪣 to color entire areas"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 pt-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onCancel,
					className: "sketch flex items-center gap-1.5 bg-secondary px-3.5 py-1.5 text-xs sm:text-sm font-bold text-foreground hover:bg-secondary/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to Text"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleDone,
					className: "sketch flex items-center gap-2 bg-accent px-5 sm:px-6 py-2 text-sm sm:text-base font-bold text-accent-foreground hover:brightness-110 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), " Submit Sketch 🎨"]
				})]
			})
		]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sketch flex flex-col h-[400px] sm:h-[480px] w-full rounded-md bg-card/90 overflow-hidden border-2 border-foreground shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-primary px-4 py-2 text-primary-foreground flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl font-bold font-display tracking-wide",
						children: phase === "answer_submission" ? "Secret Guessing" : "Classroom Discussion"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs bg-primary-foreground/20 px-2 py-0.5 rounded font-hand",
					children: phase === "answer_submission" ? `${submissionCount}/${totalEligible} Voted` : "Live Chat"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scrollRef,
				className: "flex-1 overflow-y-auto p-4 space-y-2.5 font-hand text-base",
				children: messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center text-muted-foreground/60 py-10",
					children: "No messages yet. Chat will be lively during discussion! 📝"
				}) : messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex flex-col ${m.isSystem ? "items-center my-1" : m.playerId === currentSocketId ? "items-end" : "items-start"}`,
					children: m.isSystem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full bg-secondary/80 px-3 py-1 text-xs text-foreground font-bold shadow-sm border border-line",
						children: m.content
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `max-w-[85%] rounded-lg px-3 py-1.5 shadow-sm border ${m.playerId === currentSocketId ? "bg-accent text-accent-foreground border-accent-foreground/20 rounded-br-none" : "bg-white text-foreground border-foreground/20 rounded-bl-none"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold opacity-75 mb-0.5",
							children: m.playerName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm leading-snug break-words",
							children: m.content
						})]
					})
				}, m.id))
			}),
			phase === "answer_submission" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t-2 border-foreground bg-highlight/30 p-3 sm:p-4 space-y-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-foreground font-bold text-xs sm:text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Who is the Imposter?" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-mono text-muted-foreground",
						children: "100% Confidential"
					})]
				}), hasSubmittedAnswer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center gap-2 rounded bg-secondary p-3 text-foreground font-bold text-xs sm:text-sm border border-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Secret vote recorded! Waiting for others..." })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-1.5 max-h-40 sm:max-h-48 overflow-y-auto pr-1",
						children: players.filter((p) => p.socketId !== currentSocketId).map((p) => {
							const isSelected = selectedSuspect === p.socketId;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelectedSuspect(p.socketId),
								className: `sketch flex items-center gap-1.5 p-2 text-left text-xs sm:text-sm font-bold transition-all border ${isSelected ? "bg-accent text-accent-foreground border-accent shadow-xs ring-1 ring-accent" : "bg-white text-foreground border-foreground/30 hover:bg-secondary"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm shrink-0",
									children: isSelected ? "🎯" : "🕵️"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: p.displayName
								})]
							}, p.socketId);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: !selectedSuspect,
						onClick: handleSecretSubmit,
						className: "sketch w-full flex items-center justify-center gap-2 bg-accent py-2 text-sm sm:text-base font-bold text-accent-foreground hover:brightness-110 disabled:opacity-40 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), " Cast Confidential Vote 🗳️"]
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSend,
				className: "border-t-2 border-foreground bg-card p-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: inputText,
					onChange: (e) => setInputText(e.target.value),
					placeholder: phase === "discussion" ? "Type your suspicion..." : "Chat during discussion...",
					disabled: phase !== "discussion",
					className: "sketch flex-1 px-3 py-1.5 text-sm bg-white text-foreground focus:outline-none disabled:opacity-50",
					maxLength: 140
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: phase !== "discussion" || !inputText.trim(),
					className: "sketch bg-primary px-4 py-1.5 text-primary-foreground font-bold disabled:opacity-40 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
				})]
			})
		]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "notebook relative w-full max-w-lg max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-sm bg-card p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 rotate-[-2deg]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b-2 border-foreground/30 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-6 w-6 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-display text-foreground",
							children: "Room Settings"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded p-1 hover:bg-secondary text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4 font-hand",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Players (3 - 14):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
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
								].map((num) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: num,
									children: [num, " Players"]
								}, num))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Language:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: language,
								disabled: !isHost,
								onChange: (e) => setLanguage(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "English",
										children: "English"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Hindi",
										children: "Hindi (Beta)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Spanish",
										children: "Spanish"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Drawtime / Hint Time:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
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
								].map((sec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: sec,
									children: [sec, " seconds"]
								}, sec))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Rounds:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
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
								].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: r,
									children: [
										r,
										" ",
										r === 1 ? "Round" : "Rounds"
									]
								}, r))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Game Mode:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: gameMode,
								disabled: !isHost,
								onChange: (e) => setGameMode(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "normal",
										children: "Normal (1 Imposter)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "double_imposter",
										children: "Double Imposter (5+ players)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "word_guess",
										children: "Word Guess Mode"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Word Count:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: wordCount,
								disabled: !isHost,
								onChange: (e) => setWordCount(Number(e.target.value)),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: 1,
									children: "1 Pair"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: 2,
									children: "2 Pairs"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Hints per player:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: hintsCount,
								disabled: !isHost,
								onChange: (e) => setHintsCount(Number(e.target.value)),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: 1,
									children: "1 Hint"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: 2,
									children: "2 Hints"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Word Category:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: category,
								disabled: !isHost,
								onChange: (e) => setCategory(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "All Categories",
										children: "🎲 All Categories (Surprise Mix - 7,800+ words)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Bollywood Actors",
										children: "🎬 Bollywood Actors (275 pairs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Bollywood Actresses",
										children: "💃 Bollywood Actresses (264 pairs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Indian Singers",
										children: "🎤 Indian Singers (264 pairs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Hollywood Actors",
										children: "🌟 Hollywood Actors (220 pairs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Movies",
										children: "🍿 Blockbuster Movies (275 pairs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Web Series",
										children: "📺 Web Series & OTT (220 pairs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Indian Cities",
										children: "🏙️ Indian Cities (330 pairs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Countries",
										children: "🌍 Countries of the World (440 pairs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Landmarks",
										children: "🏛️ Famous Landmarks (220 pairs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Animals",
										children: "🐾 Animals (3,300+ pairs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Food & Drinks",
										children: "🍕 Food & Drinks (2,000+ pairs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Everyday Objects",
										children: "🎒 Everyday Objects"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Transport",
										children: "🚀 Transport & Vehicles"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Nature & Places",
										children: "🏔️ Nature & Places"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Sports & Games",
										children: "⚽ Sports & Games"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Professions",
										children: "👨‍🏫 Professions & Jobs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Music & Art",
										children: "🎨 Music & Art"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-foreground",
								children: "Difficulty:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: difficulty,
								disabled: !isHost,
								onChange: (e) => setDifficulty(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 text-base text-foreground focus:outline-none disabled:opacity-60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "Any / Mixed"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "easy",
										children: "Easy (Casual & Fun)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "medium",
										children: "Medium (Balanced)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "hard",
										children: "Hard (Trickier Clues)"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-foreground block",
								children: "Room Privacy:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: !isHost,
									onClick: () => setIsPublic(true),
									className: `sketch p-2.5 text-left text-sm transition-all ${isPublic ? "bg-accent text-accent-foreground font-bold shadow-sm" : "bg-white text-foreground hover:bg-secondary"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1.5 font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🟢 Public Room" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs opacity-85 pt-0.5",
										children: "Visible in public lobby list. Anyone can join."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: !isHost,
									onClick: () => setIsPublic(false),
									className: `sketch p-2.5 text-left text-sm transition-all ${!isPublic ? "bg-primary text-primary-foreground font-bold shadow-sm" : "bg-white text-foreground hover:bg-secondary"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1.5 font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🔒 Private Room" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs opacity-85 pt-0.5",
										children: "Hidden. Joinable only via secret link or code."
									})]
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sketch bg-white/85 p-3.5 space-y-2.5 border-2 border-foreground/30 font-hand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-base text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-5 w-5 text-primary" }), " Audio & Sound Effects"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onToggleMute,
							className: `sketch px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-2xs ${isMuted ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`,
							children: [isMuted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5" }), isMuted ? "Unmute Sound" : "Mute Sound"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-1 border-t border-foreground/15",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-bold text-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "h-3.5 w-3.5 text-accent" }), " Relaxing Lo-Fi Background Music"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: isBgmActive ? `Playing: ${currentTrackName || "Study Beats"}` : "Soft nostalgic study ambience (Paused)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [isBgmActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onPrevTrack,
								className: "sketch px-2 py-0.5 text-xs bg-card hover:bg-secondary",
								title: "Previous Track",
								children: "⏮️"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onNextTrack,
								className: "sketch px-2 py-0.5 text-xs bg-card hover:bg-secondary",
								title: "Next Track",
								children: "⏭️"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onToggleBgm,
								className: `sketch px-3 py-1 text-xs font-bold shadow-2xs ${isBgmActive ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`,
								children: isBgmActive ? "Pause Music" : "Play Lo-Fi 🎵"
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-3 pt-4 border-t-2 border-foreground/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "sketch bg-secondary px-5 py-2 text-base font-bold text-foreground hover:bg-secondary/80",
						children: "Cancel"
					}), isHost && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleSave,
						className: "sketch flex items-center gap-2 bg-accent px-6 py-2 text-base font-bold text-accent-foreground hover:brightness-110",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Save Settings"]
					})]
				})
			]
		})
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "notebook relative w-full max-w-md max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-sm bg-card p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 rotate-[-1deg]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b-2 border-foreground/30 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl sm:text-3xl font-display text-foreground",
						children: "Detective Dossier"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded p-1 hover:bg-secondary text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center space-y-3 font-hand",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [user?.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: user.avatarUrl,
								alt: user.displayName,
								className: "sketch h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-foreground"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sketch flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-accent/20 border-2 border-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/detective.png",
									alt: "Detective",
									className: "h-14 w-14 sm:h-16 sm:w-16 object-contain"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -bottom-1 -right-1 rounded-full bg-accent p-1 text-accent-foreground text-xs font-bold border border-foreground shadow-xs",
								children: "🕵️"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full space-y-2",
							children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 text-left bg-white/75 p-3 sm:p-4 rounded border border-foreground/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-bold text-foreground block mb-0.5",
										children: "Detective Name:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: nameInput,
										onChange: (e) => setNameInput(e.target.value),
										className: "sketch w-full bg-white px-2.5 py-1 font-bold text-base text-foreground focus:outline-none",
										maxLength: 25,
										placeholder: "e.g. Aadi"
									})] }),
									user?.isGuest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-amber-50/90 border border-amber-300/80 rounded-md p-2.5 sm:p-3 space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between flex-wrap gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "text-xs font-bold text-foreground flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5 text-amber-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Username Handle:" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300",
													children: "🔒 Lock (Unlock using Sign Up)"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-amber-950/80 font-sans leading-tight",
												children: [
													"Apna manpasand custom ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "font-mono",
														children: "@username"
													}),
													" handle claim karne ke liye Google se sign up karein. Abhi guest mode me yeh locked hai."
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: onGoogleLogin,
												className: "sketch w-full flex items-center justify-center gap-2 bg-primary py-1.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
													className: "h-3.5 w-3.5",
													viewBox: "0 0 24 24",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
															fill: "currentColor",
															d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
															fill: "currentColor",
															d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
															fill: "currentColor",
															d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
															fill: "currentColor",
															d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign in with Google to Unlock @username" })]
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between mb-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "text-xs font-bold text-foreground flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtSign, { className: "h-3 w-3 text-accent" }), " Username handle:"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground",
												children: "3-20 chars (a-z, 0-9, ., _)"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "absolute left-2.5 top-1.5 text-sm font-bold text-muted-foreground select-none",
													children: "@"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: username,
													onChange: (e) => setUsername(e.target.value),
													className: "sketch w-full bg-white pl-7 pr-8 py-1 font-mono text-sm text-foreground lowercase focus:outline-none",
													maxLength: 20,
													placeholder: "apna_username",
													autoComplete: "off",
													autoCapitalize: "none",
													spellCheck: false
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "absolute right-2.5 top-1.5",
													children: [
														isChecking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-accent" }),
														!isChecking && usernameStatus === "available" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-600 font-bold" }),
														!isChecking && usernameStatus === "taken" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-rose-600 font-bold" }),
														!isChecking && usernameStatus === "invalid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-amber-600" }),
														!isChecking && usernameStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: retry,
															title: "Click to retry",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 text-rose-500 hover:rotate-180 transition-transform" })
														})
													]
												})
											]
										}),
										usernameMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: `text-[11px] font-sans mt-1 flex items-center gap-1 ${usernameStatus === "available" ? "text-emerald-700 font-semibold" : usernameStatus === "taken" ? "text-rose-700 font-semibold" : usernameStatus === "invalid" ? "text-amber-700" : usernameStatus === "error" ? "text-rose-600" : "text-muted-foreground"}`,
											children: [
												usernameStatus === "available" && "✅ ",
												usernameStatus === "taken" && "❌ ",
												usernameStatus === "invalid" && "⚠️ ",
												usernameMessage
											]
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-foreground block mb-0.5",
											children: "Country:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
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
											children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c,
												children: c
											}, c))
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-foreground block mb-0.5",
											children: "State / Region:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: stateInput,
											onChange: (e) => {
												const newState = e.target.value;
												setStateInput(newState);
												const cities = getCitiesForState(newState);
												if (cities && cities[0]) setCityInput(cities[0]);
											},
											className: "sketch w-full bg-white px-2 py-1 text-xs text-foreground focus:outline-none",
											children: currentStates.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: s,
												children: s
											}, s))
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-foreground block mb-0.5",
											children: "City 🏙️:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											list: "city-suggestions",
											value: cityInput,
											onChange: (e) => setCityInput(e.target.value),
											className: "sketch w-full bg-white px-2.5 py-1 text-xs text-foreground focus:outline-none",
											placeholder: "e.g. Mumbai, Delhi, Bengaluru, Pune",
											maxLength: 35
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
											id: "city-suggestions",
											children: currentCities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: c }, c))
										})
									] }),
									saveError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-rose-700 bg-rose-50 p-1.5 rounded border border-rose-300 font-sans",
										children: saveError
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-2 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setEditing(false);
												setSaveError(null);
											},
											className: "sketch bg-secondary px-3 py-1 text-xs font-bold",
											children: "Cancel"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: handleSaveProfile,
											className: "sketch flex items-center gap-1 bg-accent px-3 py-1 text-xs font-bold text-accent-foreground hover:brightness-105",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Save Changes"]
										})]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-2 flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-2xl font-bold font-display text-foreground",
												children: user?.displayName || "Guest"
											}),
											user?.isGuest && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-sans font-bold bg-muted px-2 py-0.5 rounded border border-foreground/30 text-muted-foreground",
												children: "Guest"
											}),
											user?.username ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-mono font-bold bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full border border-foreground/20",
												children: ["@", user.username]
											}) : user?.isGuest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: onGoogleLogin,
												className: "inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300 transition-colors cursor-pointer shadow-2xs",
												title: "Sign in with Google to unlock custom @username handle",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3 text-amber-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lock (Unlock using Sign Up)" })]
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setEditing(true),
												className: "text-xs text-accent hover:underline font-bold px-1.5 py-0.5 rounded bg-accent/10",
												children: "Edit ✏️"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground flex items-center justify-center gap-1 flex-wrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											user?.city ? `${user.city}, ` : "Mumbai, ",
											user?.state || stateInput || "Maharashtra",
											", ",
											user?.country || countryInput || "India"
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground/80",
										children: user?.email || "guest@imposterworld.local"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 w-full pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-white/75 p-2 sm:p-3 rounded text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl sm:text-2xl font-bold font-display text-primary",
										children: user?.matchesPlayed ?? 0
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] sm:text-xs font-bold text-muted-foreground",
										children: "MATCHES"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-white/75 p-2 sm:p-3 rounded text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl sm:text-2xl font-bold font-display text-accent",
										children: user?.wins ?? 0
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] sm:text-xs font-bold text-muted-foreground",
										children: "WINS"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-white/75 p-2 sm:p-3 rounded text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl sm:text-2xl font-bold font-display text-foreground",
										children: user ? `${user.winRate}%` : "0%"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] sm:text-xs font-bold text-muted-foreground",
										children: "WIN RATE"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sketch bg-[#FFFBEA] p-2.5 sm:p-3 rounded border border-foreground/30 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs font-bold text-foreground flex items-center gap-1.5 truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "h-3.5 w-3.5 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: currentTrack.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-primary/10 text-primary px-1 rounded font-bold",
										children: "Auto-Switching"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: currentTrack.mood
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										sound.nextTrack();
										setCurrentTrack(sound.getCurrentTrack());
									},
									className: "sketch px-2 py-1 text-xs bg-card hover:bg-secondary flex items-center gap-1 font-bold cursor-pointer",
									title: "Skip to next song",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Next" }), " ⏭️"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										const muted = sound.toggleMute();
										setIsMuted(muted);
									},
									className: `sketch px-2.5 py-1 text-xs font-bold flex items-center gap-1 cursor-pointer ${isMuted ? "bg-secondary text-foreground" : "bg-accent text-accent-foreground"}`,
									title: isMuted ? "Unmute Sound" : "Mute Sound",
									children: [isMuted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isMuted ? "Muted" : "On" })]
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 pt-2 border-t-2 border-foreground/30 font-hand",
					children: [
						Boolean(user?.isAdmin) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/admin",
							className: "sketch w-full bg-primary text-primary-foreground py-2 text-sm font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-xs cursor-pointer text-center",
							children: "🎓 Open Principal Admin Console"
						}),
						user?.isGuest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onGoogleLogin,
							className: "sketch w-full flex items-center justify-center gap-2 bg-primary py-2.5 text-sm sm:text-base font-bold text-primary-foreground hover:brightness-110",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								className: "h-4 w-4",
								viewBox: "0 0 24 24",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										fill: "currentColor",
										d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										fill: "currentColor",
										d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										fill: "currentColor",
										d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										fill: "currentColor",
										d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
									})
								]
							}), "Link Verified Google Account"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onLogout,
							className: "sketch w-full flex items-center justify-center gap-2 bg-secondary py-2 text-sm sm:text-base font-bold text-destructive hover:bg-destructive/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sign Out"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "sketch w-full bg-card py-2 text-sm sm:text-base font-bold text-foreground hover:bg-secondary",
							children: "Back to Dashboard"
						})
					]
				})
			]
		})
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "notebook relative w-full max-w-xl max-h-[92vh] flex flex-col overflow-x-hidden rounded-sm bg-card p-4 sm:p-6 md:p-8 space-y-3.5 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 rotate-[1deg]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b-2 border-foreground/30 pb-3 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/trophy-gold.png",
							alt: "Trophy",
							className: "h-9 w-9 sm:h-11 sm:w-11 object-contain drop-shadow-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-accent uppercase font-hand",
							children: "Hall of Fame"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl sm:text-3xl font-display text-foreground leading-none",
							children: "Classroom Rankings"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded p-1 hover:bg-secondary text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative shrink-0 font-hand",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "Search detective name or @username...",
							className: "sketch w-full bg-white pl-9 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
						}),
						searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSearchQuery(""),
							className: "absolute right-2.5 top-2 text-xs text-muted-foreground hover:text-foreground font-bold p-1",
							children: "✕"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-4 gap-1 sm:gap-1.5 bg-white/70 p-1 rounded border border-foreground/30 shrink-0 font-hand",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setScope("global"),
							className: `sketch flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold transition-all ${scope === "global" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Global 🌍" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setScope("country"),
							className: `sketch flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold transition-all ${scope === "country" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Country 🇮🇳" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setScope("state"),
							className: `sketch flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold transition-all ${scope === "state" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "State 🏛️" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setScope("city"),
							className: `sketch flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold transition-all ${scope === "city" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "City 🏙️" })]
						})
					]
				}),
				scope !== "global" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0 font-hand bg-white/50 p-2 rounded border border-foreground/20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[10px] font-bold text-foreground block mb-0.5",
							children: "Country:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
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
							children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))
						})] }),
						(scope === "state" || scope === "city") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[10px] font-bold text-foreground block mb-0.5",
							children: "State / Region:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: selectedState,
							onChange: (e) => {
								const newState = e.target.value;
								setSelectedState(newState);
								const cities = getCitiesForState(newState);
								if (cities && cities.length > 0 && cities[0]) setSelectedCity(cities[0]);
							},
							className: "sketch w-full bg-white px-2 py-1 text-xs text-foreground focus:outline-none",
							children: stateList.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s,
								children: s
							}, s))
						})] }),
						scope === "city" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] font-bold text-foreground block mb-0.5",
								children: "City 🏙️:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								list: "leaderboard-city-suggestions",
								value: selectedCity,
								onChange: (e) => setSelectedCity(e.target.value),
								className: "sketch w-full bg-white px-2 py-1 text-xs text-foreground focus:outline-none",
								placeholder: "e.g. Mumbai"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
								id: "leaderboard-city-suggestions",
								children: cityList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: c }, c))
							})
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 flex-1 overflow-y-auto font-hand pr-1",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center py-10 text-muted-foreground",
						children: "Checking classroom rankings... 📜"
					}) : entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-8 text-muted-foreground space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl",
								children: "🏆"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold",
								children: deferredSearch ? `No detectives found matching "${deferredSearch}"` : "No completed matches recorded yet!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs",
								children: deferredSearch ? "Try checking the spelling or searching another name/handle." : "Play a match and be the #1 ranked detective here!"
							})
						]
					}) : entries.map((entry, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sketch flex items-center justify-between p-2.5 sm:p-3 bg-white/80 hover:bg-white transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-bold shadow-xs ${idx === 0 ? "bg-yellow-400 text-yellow-950 font-display ring-2 ring-yellow-500" : idx === 1 ? "bg-slate-300 text-slate-800 font-display ring-1 ring-slate-400" : idx === 2 ? "bg-amber-600 text-white font-display ring-1 ring-amber-700" : "bg-secondary text-foreground"}`,
								children: idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-sm sm:text-base text-foreground truncate",
											children: entry.displayName
										}),
										entry.username && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono font-bold bg-accent/20 text-accent-foreground px-1.5 py-0.2 rounded-full border border-foreground/15",
											children: ["@", entry.username]
										}),
										!entry.isGuest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono font-bold bg-primary/15 text-primary px-1.5 py-0.2 rounded-full border border-primary/20",
											children: "Verified 🎓"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono font-bold bg-secondary text-muted-foreground px-1.5 py-0.2 rounded-full border border-foreground/15",
											children: "Guest 👤"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap",
									children: [entry.matchesPlayed === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary font-semibold",
										children: "New Detective 🌟"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [entry.matchesPlayed, " matches"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [entry.winRate, "% win rate"] })
									] }), (entry.city || entry.state || entry.country) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-accent font-semibold truncate max-w-[150px]",
										children: [
											"📍 ",
											entry.city ? `${entry.city}, ` : "",
											entry.state ? `${entry.state}, ` : "",
											entry.country || "India"
										]
									})] })]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right shrink-0 pl-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-lg sm:text-xl font-bold text-accent",
								children: [
									entry.wins,
									" ",
									entry.wins === 1 ? "Win" : "Wins"
								]
							}), Boolean(entry.imposterWins) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground font-sans",
								children: [
									"🕵️ ",
									entry.imposterWins,
									" Imposter"
								]
							})]
						})]
					}, entry._id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-2 border-t-2 border-foreground/30 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "sketch w-full bg-secondary py-2 text-sm sm:text-base font-bold text-foreground hover:bg-secondary/80",
						children: "Close"
					})
				})
			]
		})
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "notebook relative w-full max-w-2xl max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-sm bg-card p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rotate-[-1deg]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b-2 border-foreground/30 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-5 w-5 sm:h-6 sm:w-6 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl sm:text-3xl font-display text-foreground",
							children: "Public Classrooms"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sound.playPop();
							onClose();
						},
						className: "rounded p-1 hover:bg-secondary text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 font-hand text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-muted-foreground mr-1",
							children: "MODE:"
						}), [
							"all",
							"normal",
							"double_imposter",
							"word_guess"
						].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								sound.playPop();
								setFilterMode(mode);
							},
							className: `sketch px-2.5 py-1 text-xs capitalize ${filterMode === mode ? "bg-accent text-accent-foreground font-bold" : "bg-white text-foreground hover:bg-secondary"}`,
							children: mode === "all" ? "All" : mode.replace("_", " ")
						}, mode))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleRefresh,
							disabled: refreshing,
							className: "sketch flex items-center gap-1 bg-secondary px-3 py-1 font-bold text-xs hover:bg-secondary/80 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}` }), " Refresh"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								sound.playPop();
								onClose();
								onCreateRoom();
							},
							className: "sketch flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 font-bold text-xs hover:brightness-110",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Host Room"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5 max-h-80 overflow-y-auto pr-1 font-hand",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sketch bg-white/70 p-8 text-center space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xl font-display text-muted-foreground",
								children: "No active public classrooms found right now. 📭"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Be the first teacher! Create a public room and students will join instantly."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									sound.playPop();
									onClose();
									onCreateRoom();
								},
								className: "sketch bg-accent text-accent-foreground px-5 py-2 font-bold text-sm",
								children: "Create Public Room 🚀"
							})
						]
					}) : filtered.map((r) => {
						const hostName = r.players.find((p) => p.isHost)?.displayName || "Host";
						const isFull = r.players.length >= r.settings.capacity;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sketch bg-white/90 p-3.5 flex items-center justify-between gap-3 hover:shadow-md transition-shadow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-10 w-10 shrink-0 rounded-full bg-accent/20 border border-foreground/30 flex items-center justify-center font-bold text-accent font-display text-lg",
									children: hostName.charAt(0).toUpperCase()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-base text-foreground truncate",
											children: r.settings.name || `${hostName}'s Room`
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded bg-secondary px-1.5 text-[10px] font-bold text-muted-foreground uppercase border border-line",
											children: ["#", r.roomCode]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground flex items-center gap-2 pt-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Host: ", hostName] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "capitalize",
												children: r.settings.gameMode.replace("_", " ")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.settings.language })
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-display text-lg font-bold text-primary flex items-center gap-1 justify-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											r.players.length,
											"/",
											r.settings.capacity
										] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground font-bold",
										children: isFull ? "FULL" : "JOINABLE"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: isFull,
									onClick: () => {
										sound.playPop();
										onJoinRoom(r.roomCode);
										onClose();
									},
									className: "sketch bg-accent text-accent-foreground px-4 py-1.5 font-bold text-sm disabled:opacity-40 hover:brightness-110",
									children: isFull ? "Full" : "Join"
								})]
							})]
						}, r.roomCode);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-2 border-t-2 border-foreground/30 flex justify-between items-center text-xs text-muted-foreground font-hand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tip: Private rooms do not appear here and require an invite link." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sound.playPop();
							onClose();
						},
						className: "sketch bg-secondary px-4 py-1.5 text-sm font-bold text-foreground hover:bg-secondary/80",
						children: "Close"
					})]
				})
			]
		})
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "notebook relative w-full max-w-2xl max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-sm bg-[#FAF4E4] p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl border-4 border-[#172C53]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-40 -translate-x-1/2 rotate-[-2deg]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b-2 border-foreground/30 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-5 w-5 sm:h-6 sm:w-6 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl sm:text-4xl font-display text-foreground tracking-wide",
							children: "Classroom Notice Board 📌"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sound.playPop();
							onClose();
						},
						className: "rounded p-1 hover:bg-secondary text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4 font-hand pr-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sketch relative bg-[#FFFBEA] p-4 space-y-2 border-2 border-foreground/40 rotate-[-1deg] shadow-sm overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-3 left-6 h-4 w-12 bg-accent/30 rounded-xs rotate-[3deg]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/lightbulb-idea.svg",
									alt: "Lightbulb idea",
									className: "pointer-events-none absolute -bottom-2 -right-2 h-16 w-16 object-contain opacity-75 rotate-[12deg]"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-2xl font-display text-accent flex items-center gap-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "What Is Imposter World?" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-relaxed text-foreground relative z-10",
									children: "A social deduction party game made for friends and classrooms! Everyone receives the exact same secret word — except the Imposter, who gets a sneaky lookalike word. Clues are given, debates flare up, and secret votes determine who gets caught!"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sketch relative bg-[#EBF3FF] p-4 space-y-2 border-2 border-foreground/40 rotate-[1deg] shadow-sm overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-3 right-6 h-4 w-12 bg-primary/30 rounded-xs rotate-[-3deg]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/paper-plane.svg",
									alt: "Paper airplane",
									className: "pointer-events-none absolute -bottom-2 -right-1 h-16 w-16 object-contain opacity-75 rotate-[-10deg]"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-2xl font-display text-primary",
										children: "Tournament Desk 🏆"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-accent text-accent-foreground px-1.5 py-0.5 text-[10px] font-bold",
										children: "NEW"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-foreground relative z-10",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Next one today (Wed):" }),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"Top detectives clash in the 8-player bracket!"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded bg-white/80 p-2 text-xs font-bold text-accent border border-accent/20 relative z-10",
									children: [
										"👑 ",
										currentBeltHolder,
										" currently holds the championship belt!"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sketch relative bg-[#FFF0ED] p-4 space-y-1.5 border-2 border-foreground/40 rotate-[1deg] shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-3 left-10 h-4 w-14 bg-red-400/30 rounded-xs rotate-[-1deg]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-2xl font-display text-[#C64132]",
									children: "Classroom Code 🤫"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "text-xs space-y-1 text-foreground list-disc pl-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Never say the secret word directly in your clue!" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Imposters: Act natural and pretend you know the common word." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Secret votes are strictly confidential before the reveal." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No phones under the desk cheating! Server anti-cheat is active." })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sketch relative bg-[#F3E8FF] p-4 space-y-2 border-2 border-foreground/40 rotate-[-2deg] shadow-sm flex flex-col justify-between",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-3 right-8 h-4 w-12 bg-purple-400/30 rounded-xs rotate-[2deg]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-2xl font-display text-purple-900 flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last Bench Scribble" }),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4 text-accent fill-accent" })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm italic text-foreground pt-1",
									children: "\"made on the last bench by adi\""
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground pt-2",
									children: "Doodled with blue ink and paper textures. Share with your friends! ✨"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-2 border-t-2 border-foreground/30 flex justify-between items-center font-hand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground italic",
						children: "made on the last bench by adi"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sound.playPop();
							onClose();
						},
						className: "sketch bg-secondary px-5 py-1.5 text-sm font-bold text-foreground hover:bg-secondary/80",
						children: "Close Board"
					})]
				})
			]
		})
	});
}
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
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus") ? "audio/ogg;codecs=opus" : "audio/webm";
			const mediaRecorder = new MediaRecorder(stream, { mimeType });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sketch bg-white/95 p-4 sm:p-5 border-2 border-accent space-y-4 font-hand shadow-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-foreground/20 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-5 w-5 text-accent animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl sm:text-2xl text-foreground font-bold",
						children: "Live Voice Clue 🎙️"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold text-muted-foreground uppercase",
					children: "Max 10s voice hint"
				})]
			}),
			micError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-destructive/15 text-destructive p-3 rounded text-xs sm:text-sm border border-destructive/30",
				children: ["⚠️ ", micError]
			}),
			!audioUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-4 space-y-4",
				children: [!isRecording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled,
					onClick: startRecording,
					className: "sketch group mx-auto flex flex-col items-center justify-center h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-accent text-accent-foreground hover:scale-105 transition-all shadow-md active:scale-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-10 w-10 sm:h-12 sm:w-12 group-hover:scale-110 transition-transform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold pt-1",
						children: "TAP TO SPEAK"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mx-auto flex items-center justify-center h-28 w-28 rounded-full bg-destructive text-white animate-pulse shadow-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {
								className: "h-10 w-10 cursor-pointer",
								onClick: stopRecording
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute -bottom-2 bg-white text-destructive px-2 py-0.5 rounded-full text-xs font-bold border border-destructive shadow-xs",
								children: [
									"0:0",
									recordingSeconds,
									" / 0:10"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-foreground font-bold animate-pulse",
							children: "🎙️ Listening... Speak your subtle hint clearly!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: stopRecording,
							className: "sketch bg-secondary px-4 py-1.5 text-xs font-bold hover:bg-secondary/80",
							children: "⏹️ Done Speaking"
						})
					]
				}), transcript && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sketch bg-highlight/30 p-2.5 text-xs italic text-foreground max-w-sm mx-auto",
					children: [
						"🗣️ \"",
						transcript,
						"\""
					]
				})]
			}),
			audioUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sketch bg-highlight/20 p-4 space-y-3 border border-foreground/30 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: togglePlayback,
							className: "sketch flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 text-sm font-bold shadow-xs hover:brightness-110",
							children: [isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }), isPlaying ? "Pause Preview" : "Listen Preview ▶"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleReset,
							className: "sketch flex items-center gap-1 bg-secondary px-3 py-2 text-xs font-bold hover:bg-secondary/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Re-record"]
						})]
					}),
					transcript && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-bold text-foreground italic pt-1",
						children: [
							"Transcribed: \"",
							transcript,
							"\""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleSubmit,
							className: "sketch w-full max-w-xs bg-accent text-accent-foreground py-2.5 text-base font-bold shadow-sm hover:brightness-110 active:scale-98",
							children: "Submit Voice Clue 🚀"
						})
					})
				]
			})
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sketch bg-highlight/40 p-3 space-y-2 border border-foreground/30 font-hand",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: handleToggle,
				className: `sketch flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold shadow-2xs transition-all ${isPlaying ? "bg-accent text-accent-foreground animate-pulse" : "bg-primary text-primary-foreground"}`,
				children: [isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5" }), isPlaying ? "Playing Voice Clue..." : "Play Voice Clue 🎙️"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] font-bold text-muted-foreground uppercase",
				children: "Voice Hint"
			})]
		}), transcript && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-xs sm:text-sm text-foreground italic bg-white/70 p-2 rounded border border-foreground/20",
			children: [
				"🗣️ \"",
				transcript,
				"\""
			]
		})]
	});
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
			reconnectionAttempts: 20,
			reconnectionDelay: 1e3,
			transports: ["websocket", "polling"],
			withCredentials: true
		});
		socket.on("connect", () => {
			console.log("[Socket Client] Connected to real-time game server:", socket?.id);
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
function Btn({ children, onClick, variant = "primary", disabled, className = "" }) {
	const styles = {
		primary: "bg-primary text-primary-foreground",
		accent: "bg-accent text-accent-foreground",
		ghost: "bg-card text-foreground",
		secondary: "bg-secondary text-foreground"
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		disabled,
		onClick: () => {
			sound.playPop();
			onClick?.();
		},
		className: `sketch ${styles} px-6 py-2.5 text-lg font-bold transition-transform hover:-translate-y-0.5 hover:rotate-[-1deg] active:translate-y-0.5 disabled:opacity-40 ${className}`,
		children
	});
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
	const [user, setUser] = (0, import_react.useState)(null);
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
	(0, import_react.useEffect)(() => {
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
						setUser(data.user);
						window.history.replaceState({}, document.title, window.location.pathname);
					}
				}).catch((err) => console.error("Google code exchange error:", err));
				fetchPublicRooms();
				return;
			}
			if (loginStatus === "success") window.history.replaceState({}, document.title, window.location.pathname);
		}
		fetch(`${API_BASE}/api/auth/me`, { credentials: "include" }).then((res) => res.json()).then((data) => {
			if (data.user) setUser(data.user);
			else fetch(`${API_BASE}/api/auth/guest`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ name: "Detective" })
			}).then((r) => r.json()).then((gData) => {
				if (gData.user) setUser(gData.user);
			}).catch((err) => console.error("Guest login fallback error:", err));
		}).catch(() => {
			fetch(`${API_BASE}/api/auth/guest`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ name: "Detective" })
			}).then((r) => r.json()).then((gData) => {
				if (gData.user) setUser(gData.user);
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
	}, [user]);
	const fetchPublicRooms = () => {
		fetch(`${API_BASE}/api/rooms/public`).then((res) => res.json()).then((data) => {
			if (data.rooms) setPublicRooms(data.rooms);
		}).catch(() => {});
	};
	(0, import_react.useEffect)(() => {
		const socket = socketRef.current;
		socket.on("room:state", (state) => {
			setRoomState(state);
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
		const creatorUser = user || {
			id: socket.id || `guest-${Math.random().toString(36).substring(2, 9)}`,
			displayName: "Detective",
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
		if (roomState && roomState.roomCode === cleanCode) return;
		sound.playPop();
		const socket = socketRef.current;
		if (!socket.connected) socket.connect();
		const joinUser = user || {
			id: socket.id || `guest-${Math.random().toString(36).substring(2, 9)}`,
			displayName: "Detective",
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
				const url = new URL(window.location.href);
				url.searchParams.set("room", res.roomCode);
				window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
			} else if (res && !res.success) {
				toast.error(res.error || "Failed to join room");
				pendingInviteCode.current = null;
			}
		});
	};
	const handleInstantMatch = () => {
		sound.playPop();
		const socket = socketRef.current;
		if (!socket.connected) socket.connect();
		const matchUser = user || {
			id: socket.id || `guest-${Math.random().toString(36).substring(2, 9)}`,
			displayName: "Detective",
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
	const isHost = Boolean(roomState?.players?.find((p) => p.socketId === currentSocketId)?.isHost);
	const isMyTurn = roomState?.phase === "hint_turn" && roomState?.activePlayerSocketId === currentSocketId;
	const hasVotedSkipDiscussion = Boolean(roomState?.skipDiscussionVoters?.includes(currentSocketId));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen px-2.5 sm:px-6 md:px-8 py-3 sm:py-6 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sketch mx-auto mb-4 sm:mb-6 flex max-w-5xl items-center justify-between border-2 border-foreground bg-white/90 backdrop-blur-md px-2.5 sm:px-5 py-2 sm:py-3 shadow-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 sm:gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/detective.png",
						alt: "Detective Mascot",
						className: "h-9 w-9 sm:h-12 sm:w-12 object-contain hover:scale-105 transition-transform drop-shadow-xs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							if (roomState || isLocalMode) {
								if (confirm("Go to homepage? You will leave your current room.")) {
									handleLeaveRoom();
									setIsLocalMode(false);
								}
							}
						},
						className: "text-2xl sm:text-3xl md:text-4xl font-display text-left",
						children: ["Imposter ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-accent",
							children: "World"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center flex-nowrap gap-1 sm:gap-2 ml-auto shrink-0",
					children: [
						roomState && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "sketch bg-highlight px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base font-bold flex items-center gap-1.5 shrink-0",
							children: [
								"#",
								roomState.roomCode,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleCopyLink,
									title: "Copy Room Link",
									className: "hover:text-accent ml-1",
									children: copiedLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
								})
							]
						}),
						isLocalMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sketch bg-secondary px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold flex items-center gap-1 shrink-0",
							children: "📱 Pass & Play"
						}),
						!roomState && !isLocalMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									sound.playPop();
									fetchPublicRooms();
									setShowPublicRooms(true);
								},
								title: "Public Classroom Rooms",
								className: "sketch flex items-center justify-center gap-1 bg-accent text-accent-foreground px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base font-bold hover:brightness-110 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Rooms"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									sound.playPop();
									setShowNoticeBoard(true);
								},
								title: "Classroom Notice Board",
								className: "sketch flex items-center justify-center gap-1 bg-secondary px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base font-bold hover:bg-secondary/80 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Notice"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									sound.playPop();
									setShowLeaderboard(true);
								},
								title: "Classroom Rankings",
								className: "sketch flex items-center justify-center gap-1 bg-secondary px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base font-bold hover:bg-secondary/80 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Rankings"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									sound.playPop();
									setShowAccount(true);
								},
								title: user?.displayName ? `Account: ${user.displayName}` : "Account Profile",
								className: "sketch flex items-center justify-center bg-card px-2 sm:px-2.5 py-1 text-sm sm:text-base font-bold hover:bg-secondary shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm sm:text-base leading-none select-none",
									role: "img",
									"aria-label": "Profile",
									children: "👤"
								})
							})
						] })
					]
				})]
			}),
			!roomState && !isLocalMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "notebook relative mx-auto max-w-4xl rounded-sm py-5 sm:py-10 pl-3.5 sm:pl-12 md:pl-20 pr-3 sm:pr-8 md:pr-12 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-2deg]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-8 space-y-4 sm:space-y-6 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-accent font-bold text-xs sm:text-sm border border-accent/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🕵️ Real-Time Multiplayer Party Game" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-3xl sm:text-5xl md:text-6xl font-display leading-[0.95] text-foreground break-words",
									children: [
										"One Word. Different Secrets. ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "marker text-accent",
											children: "Who's the Imposter?"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "max-w-xl text-base sm:text-lg text-muted-foreground font-hand",
									children: "Everyone gets the same word — except the imposter! Share clues, debate suspects, and vote out the bluffer."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative py-1 space-y-2 font-hand text-sm sm:text-base border-l-2 border-primary/30 pl-3 my-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-bold text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-mono shadow-xs",
												children: "1"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Peek at your secret word 🔍" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-bold text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-mono shadow-xs",
												children: "2"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Give 1 clue (Text, Draw, Voice) 🎨" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-bold text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-mono shadow-xs",
												children: "3"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Debate suspects in chat 🗣️" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-bold text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-mono shadow-xs",
												children: "4"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vote & catch the imposter! 🗳️" })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4 pt-1 max-w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
										onClick: () => handleCreateRoom({ isPublic: true }),
										className: "w-full sm:w-auto text-center justify-center",
										children: "Create Room (3-14 Players)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 w-full sm:w-auto max-w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: roomCodeInput,
											onChange: (e) => setRoomCodeInput(e.target.value.toUpperCase()),
											placeholder: "ENTER CODE",
											maxLength: 6,
											className: "sketch flex-1 min-w-0 sm:w-36 bg-white px-2.5 sm:px-3 py-2 text-center text-base sm:text-lg font-bold uppercase tracking-wider focus:outline-none"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
											variant: "secondary",
											onClick: () => handleJoinRoom(roomCodeInput),
											className: "px-4 sm:px-5 py-2.5 shrink-0 justify-center",
											children: "Join"
										})]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-4 flex flex-col items-center justify-center text-center space-y-3 pt-2 md:pt-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative group cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/detective-waving.png",
									alt: "Imposter World Detective",
									className: "max-h-48 sm:max-h-64 md:max-h-72 w-auto object-contain drop-shadow-xl transition-transform group-hover:scale-105"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 sm:h-5 w-20 sm:w-24 rotate-[2deg]" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] sm:text-xs text-muted-foreground font-hand",
								children: "\"Classroom Detective on duty. 100% Anti-Cheat Server.\""
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-foreground/20 space-y-4 font-hand",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/paper-plane.svg",
								alt: "Paper Airplane",
								className: "pointer-events-none absolute -top-6 right-2 sm:right-6 h-14 w-14 sm:h-18 sm:w-18 object-contain opacity-85 rotate-[-8deg] drop-shadow-xs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-2xl sm:text-3xl font-display text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "h-6 w-6 text-accent" }), " Play Another Way"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground font-bold uppercase tracking-wider hidden sm:inline",
									children: "CHOOSE YOUR MODE"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											sound.playPop();
											handleCreateRoom({ isPublic: false });
										},
										className: "sketch group bg-white/90 p-4 text-left space-y-2 hover:-translate-y-1 hover:shadow-md transition-all border-2 border-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs font-bold text-primary",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "bg-primary/10 px-2 py-0.5 rounded border border-primary/20",
													children: "FRIEND"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-lg group-hover:translate-x-1 transition-transform",
													children: "›"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xl font-display font-bold text-foreground",
												children: "Play with Friends"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "2-14 players invite with a private secret link"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											sound.playPop();
											setShowNoticeBoard(true);
										},
										className: "sketch group bg-white/90 p-4 text-left space-y-2 hover:-translate-y-1 hover:shadow-md transition-all border-2 border-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs font-bold text-accent",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "bg-accent text-accent-foreground px-1.5 py-0.5 rounded font-bold",
													children: "NEW"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-lg group-hover:translate-x-1 transition-transform",
													children: "›"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xl font-display font-bold text-foreground",
												children: "Tournament"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: ["Next one today (wed) • ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [championName, " holds the belt"] })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											sound.playPop();
											setIsLocalMode(true);
										},
										className: "sketch group bg-white/90 p-4 text-left space-y-2 hover:-translate-y-1 hover:shadow-md transition-all border-2 border-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs font-bold text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "bg-highlight px-2 py-0.5 rounded font-bold border border-foreground/30",
													children: "SAVED"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-lg group-hover:translate-x-1 transition-transform",
													children: "›"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xl font-display font-bold text-foreground",
												children: "Local Pass & Play"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "2-10 players on 1 phone • score 1-1"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleInstantMatch,
										className: "sketch group bg-accent text-accent-foreground p-4 text-left space-y-2 hover:-translate-y-1 hover:shadow-md transition-all border-2 border-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs font-bold opacity-95",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "bg-white/20 px-2 py-0.5 rounded font-bold",
													children: "INSTANT"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-lg group-hover:translate-x-1 transition-transform",
													children: "›"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xl font-display font-bold text-accent-foreground",
												children: "Instant Match"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs opacity-90",
												children: "Find someone online and jump into class!"
											})
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "mt-12 text-center space-y-1.5 font-hand border-t border-foreground/15 pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs sm:text-sm text-foreground/75 flex items-center justify-center gap-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["made on the last bench by ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "underline decoration-foreground/40 font-bold",
								children: "adi"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-primary font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/how-to-play",
									className: "underline hover:text-accent",
									children: "How To Play Imposter World"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground/60",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/articles",
									className: "underline hover:text-accent",
									children: "Game Strategy Articles"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground/60",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/notice-board",
									className: "underline hover:text-accent",
									children: "Notice Board"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground/60",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/support",
									className: "underline hover:text-accent",
									children: "Support the Dev"
								})
							]
						})]
					})
				]
			}),
			isLocalMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "notebook relative mx-auto max-w-2xl rounded-sm py-6 sm:py-8 pl-3.5 sm:pl-12 md:pl-20 pr-3 sm:pr-8 md:pr-10 shadow-2xl space-y-4 sm:space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-1deg]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 border-b-2 border-foreground/30 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 sm:gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/secret-folder.svg",
								alt: "Secret Folder",
								className: "h-8 w-8 sm:h-12 sm:w-12 object-contain shrink-0 drop-shadow-xs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] sm:text-xs font-bold text-accent font-hand uppercase block truncate",
									children: "Single Device Mode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl sm:text-3xl font-display text-foreground truncate",
									children: "Local Pass & Play 📱"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								sound.playPop();
								setIsLocalMode(false);
							},
							className: "sketch bg-secondary px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-foreground shrink-0",
							children: "Exit Local"
						})]
					}),
					localPhase === "lobby" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 font-hand",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: "Pass this single phone/laptop around your group. Each player views their secret word in private!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: localPlayers.map((name, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "sketch bg-white px-2.5 sm:px-3 py-1 font-bold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 shadow-2xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate max-w-[120px]",
										children: name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setLocalPlayers(localPlayers.filter((_, idx) => idx !== i)),
										className: "text-xs text-destructive hover:bg-destructive/15 rounded-full h-5 w-5 inline-flex items-center justify-center font-bold transition-colors cursor-pointer shrink-0",
										title: `Remove ${name}`,
										children: "×"
									})]
								}, `${name}-${i}`))
							}),
							localPlayers.length < 12 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row gap-2 w-full max-w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
									variant: "secondary",
									className: "w-full sm:w-auto shrink-0 justify-center",
									onClick: () => {
										if (localNewPlayerName.trim()) {
											setLocalPlayers([...localPlayers, localNewPlayerName.trim()]);
											setLocalNewPlayerName("");
										}
									},
									children: "Add Player +"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-line space-y-2",
								children: [localPlayers.length < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-300 font-bold",
									children: [
										"⚠️ Add at least 3 players to start (currently ",
										localPlayers.length,
										"/3)"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
									className: "w-full sm:w-auto justify-center",
									onClick: startLocalGame,
									disabled: localPlayers.length < 3,
									children: "Start Pass & Play Round 🚀"
								})]
							})
						]
					}),
					localPhase === "reveal" && localRound && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center space-y-6 font-hand py-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-bold text-muted-foreground uppercase",
								children: [
									"PLAYER ",
									localTurn + 1,
									" OF ",
									localPlayers.length
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-4xl font-display text-foreground",
								children: ["Pass phone to: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-accent underline",
									children: localPlayers[localTurn]
								})]
							}),
							!localWordRevealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sketch max-w-sm mx-auto bg-card p-6 border-2 border-foreground space-y-4 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative mx-auto flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/detective-covering-eyes.png",
											alt: "Detective Covering Eyes",
											className: "h-32 sm:h-36 w-auto object-contain drop-shadow-md transition-transform hover:scale-105"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-2xl font-display text-foreground",
											children: [
												"Only ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-accent underline font-bold",
													children: localPlayers[localTurn]
												}),
												" should look!"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: "Detective has his eyes covered tight with both hands! Tap below to open eyes."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											sound.playPop();
											setLocalWordRevealed(true);
										},
										className: "sketch w-full flex items-center justify-center gap-2 bg-accent py-3 text-lg font-bold text-accent-foreground hover:brightness-110 shadow-sm animate-pulse",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-5 w-5" }), " Open Eyes & Reveal Secret Word 👁️"]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sketch max-w-sm mx-auto bg-white p-6 border-2 border-accent space-y-4 shadow-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative mx-auto flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/detective-eyes-open.png",
											alt: "Detective Eyes Wide Open",
											className: "h-32 sm:h-36 w-auto object-contain drop-shadow-md transition-transform scale-105"
										})
									}),
									localRound.category && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-block bg-highlight px-3 py-1 rounded text-xs font-bold border border-foreground/30",
										children: ["📁 Category: ", localRound.category]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground block font-bold tracking-wider uppercase",
										children: "CONFIDENTIAL SECRET WORD"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-4xl font-display text-accent font-bold",
										children: localTurn === localRound.imposterIdx ? localRound.fake : localRound.word
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-muted-foreground",
										children: localTurn === localRound.imposterIdx ? "🕵️ You are the Imposter! (Blend in and pretend you know the common word)" : "🔎 You are a Detective! (Spot the player whose clue sounds off)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												sound.playPop();
												setLocalWordRevealed(false);
												if (localTurn + 1 < localPlayers.length) setLocalTurn(localTurn + 1);
												else setLocalPhase("discuss");
											},
											className: "sketch w-full flex items-center justify-center gap-2 bg-primary py-2.5 text-base font-bold text-primary-foreground hover:brightness-110 shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }), localTurn + 1 < localPlayers.length ? `Cover Eyes & Pass to ${localPlayers[localTurn + 1]} 🔒` : "Cover Eyes & Start Discussion! 🗣️"]
										})
									})
								]
							})
						]
					}),
					localPhase === "discuss" && localRound && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 text-center font-hand py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-3xl sm:text-4xl font-display text-foreground",
								children: "Classroom Discussion! 🗣️"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base text-muted-foreground max-w-md mx-auto",
								children: "Each player speaks 1 clue out loud around the circle. Debate suspicious hints before casting your votes!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sketch bg-highlight/30 p-4 border border-foreground/30 max-w-sm mx-auto space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-muted-foreground block uppercase",
									children: "Finished Debate?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm",
									children: "Proceed to interrogate and vote on who the imposter is!"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								onClick: () => {
									sound.playDing();
									setLocalVotes({});
									setLocalPhase("vote");
								},
								children: "Proceed to Vote 🗳️"
							})
						]
					}),
					localPhase === "vote" && localRound && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5 text-center font-hand py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-accent uppercase font-mono",
										children: "Phase 3: Interrogation"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-3xl sm:text-4xl font-display text-foreground",
										children: "Cast Classroom Votes! 🗳️"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm sm:text-base text-muted-foreground max-w-md mx-auto",
										children: [
											"Every player in the circle gets ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "1 vote" }),
											". Tap ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-accent",
												children: "+ Vote"
											}),
											" on the player you suspect!"
										]
									})
								]
							}),
							(() => {
								const totalVotes = Object.values(localVotes).reduce((a, b) => a + b, 0);
								const maxVotesAllowed = localPlayers.length;
								const votesRemaining = Math.max(0, maxVotesAllowed - totalVotes);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sketch inline-flex items-center gap-2 bg-white px-3.5 py-1.5 border border-foreground/30 shadow-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-mono font-bold text-muted-foreground uppercase",
												children: "Classroom Votes:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-display text-lg font-bold text-accent",
												children: [
													totalVotes,
													" / ",
													maxVotesAllowed
												]
											}),
											votesRemaining === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "bg-emerald-100 text-emerald-800 text-[11px] px-2 py-0.5 rounded font-bold",
												children: "✅ All Voted"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-amber-800 font-bold",
												children: [
													"(",
													votesRemaining,
													" ",
													votesRemaining === 1 ? "vote" : "votes",
													" left)"
												]
											})
										]
									}), totalVotes > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											sound.playPop();
											setLocalVotes({});
										},
										className: "text-xs text-muted-foreground hover:text-destructive underline font-bold cursor-pointer",
										children: "Reset 🔄"
									})]
								});
							})(),
							(() => {
								const totalVotes = Object.values(localVotes).reduce((a, b) => a + b, 0);
								const maxVotesAllowed = localPlayers.length;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-xl mx-auto",
									children: localPlayers.map((player) => {
										const voteCount = localVotes[player] || 0;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `sketch p-3 text-center transition-all ${voteCount > 0 ? "bg-amber-100/90 border-2 border-accent shadow-sm" : "bg-white/80 border border-foreground/30"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-display text-lg font-bold text-foreground truncate",
													children: player
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs font-bold my-1",
													children: voteCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-block bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-mono",
														children: [
															"🗳️ ",
															voteCount,
															" ",
															voteCount === 1 ? "Vote" : "Votes"
														]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "0 votes"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-center gap-1.5 pt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
													}), voteCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
													})]
												})
											]
										}, player);
									})
								});
							})(),
							(() => {
								const totalVotes = Object.values(localVotes).reduce((a, b) => a + b, 0);
								const maxVotesAllowed = localPlayers.length;
								const topSuspect = Object.entries(localVotes).sort((a, b) => b[1] - a[1])[0];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 max-w-sm mx-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sketch bg-highlight/40 p-2.5 border border-foreground/30 text-xs sm:text-sm",
										children: totalVotes >= maxVotesAllowed && topSuspect && topSuspect[1] > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"🎯 All ",
											maxVotesAllowed,
											" votes are in! Prime Suspect: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-accent underline font-display text-base",
												children: topSuspect[0]
											}),
											" (",
											topSuspect[1],
											" votes)"
										] }) : totalVotes > 0 && topSuspect && topSuspect[1] > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"🎯 Leading Suspect: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-accent underline font-display text-base",
												children: topSuspect[0]
											}),
											" with ",
											topSuspect[1],
											" votes (",
											totalVotes,
											"/",
											maxVotesAllowed,
											" cast)"
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Each player taps ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "+ Vote" }),
											" once for their main suspect!"
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-center gap-2 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
											variant: "secondary",
											onClick: () => setLocalPhase("discuss"),
											children: "Back to Discuss"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
											onClick: () => {
												sound.playVictory();
												setLocalPhase("result");
											},
											children: "Reveal the Imposter 🕵️"
										})]
									})]
								});
							})()
						]
					}),
					localPhase === "result" && localRound && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center space-y-5 font-hand py-4",
						children: [
							(() => {
								const actualImposter = localPlayers[localRound.imposterIdx];
								const topSuspect = Object.entries(localVotes).sort((a, b) => b[1] - a[1])[0];
								const caughtImposter = Boolean(topSuspect && topSuspect[1] > 0 && topSuspect[0] === actualImposter);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/trophy-gold.png",
											alt: "Trophy",
											className: "h-20 w-20 object-contain drop-shadow-md animate-bounce"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/detective-jumping-win.png",
											alt: "Detective Jumping Celebration",
											className: "h-24 w-auto object-contain drop-shadow-md"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `p-3 rounded-lg border-2 max-w-md mx-auto ${caughtImposter ? "bg-emerald-50 border-emerald-500 text-emerald-950" : "bg-rose-50 border-rose-400 text-rose-950"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-2xl sm:text-3xl font-display font-bold",
											children: caughtImposter ? "🎉 BUSTED! Classroom Caught the Imposter!" : "🤫 ESCAPED! The Imposter Fooled Everyone!"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs sm:text-sm font-hand mt-1",
											children: caughtImposter ? `Great deduction! ${actualImposter} was correctly voted out.` : `${actualImposter} was the real imposter and fooled the class!`
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-3xl font-display text-accent font-bold",
										children: [
											"The Real Imposter was: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "underline",
												children: actualImposter
											}),
											"!"
										]
									}),
									Object.keys(localVotes).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sketch bg-white/70 p-3 max-w-sm mx-auto border border-foreground/20 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-muted-foreground uppercase mb-1",
											children: "Classroom Vote Tally:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap justify-center gap-2",
											children: localPlayers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "sketch bg-white px-2 py-0.5 text-xs font-mono",
												children: [
													p,
													": ",
													localVotes[p] || 0,
													" votes"
												]
											}, p))
										})]
									})
								] });
							})(),
							localRound.category && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-block bg-highlight px-3 py-1 rounded text-sm font-bold border border-foreground/30",
								children: ["📁 Category: ", localRound.category]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 max-w-sm mx-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-white p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground block font-bold",
										children: "COMMON WORD"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl font-display text-primary font-bold",
										children: localRound.word
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-white p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground block font-bold",
										children: "IMPOSTER WORD"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl font-display text-accent font-bold",
										children: localRound.fake
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-center gap-3 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
									onClick: startLocalGame,
									children: "Next Round 🚀"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
									variant: "secondary",
									onClick: () => setLocalPhase("lobby"),
									children: "Back to Setup"
								})]
							})
						]
					})
				]
			}),
			roomState && roomState.phase === "lobby" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "notebook relative mx-auto max-w-4xl rounded-sm py-6 sm:py-10 pl-5 sm:pl-12 md:pl-20 pr-4 sm:pr-8 md:pr-12 shadow-2xl space-y-4 sm:space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-1deg]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4 border-b-2 border-foreground/30 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-bold px-2 py-0.5 rounded uppercase font-hand ${roomState.settings.isPublic ? "bg-accent/20 text-accent border border-accent/30" : "bg-primary/20 text-primary border border-primary/30"}`,
									children: roomState.settings.isPublic ? "🟢 Public Room" : "🔒 Private Room"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold text-accent font-hand uppercase",
									children: "Classroom Lobby"
								}),
								lobbyTimeLeft !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded uppercase font-hand bg-amber-100 text-amber-900 border border-amber-400/60 shadow-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 animate-pulse text-amber-700" }),
										"Auto-closes in ",
										Math.floor(lobbyTimeLeft / 60),
										":",
										(lobbyTimeLeft % 60).toString().padStart(2, "0")
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-4xl md:text-5xl font-display text-foreground",
							children: ["Room #", roomState.roomCode]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleCopyLink,
									className: "sketch flex items-center gap-1.5 bg-secondary px-4 py-2 font-bold text-base hover:bg-secondary/80",
									children: [copiedLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), copiedLink ? "Link Copied!" : "Copy Invite Link"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										sound.playPop();
										setShowSettings(true);
									},
									className: "sketch flex items-center gap-1.5 bg-card px-4 py-2 font-bold text-base hover:bg-secondary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4 text-accent" }), "Settings"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleLeaveRoom,
									className: "sketch bg-secondary px-4 py-2 font-bold text-base text-destructive hover:bg-destructive/10",
									children: "Leave"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3 font-hand text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sketch bg-white/70 p-2.5 rounded",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground block font-bold",
									children: "CAPACITY"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xl font-bold font-display text-primary",
									children: [
										roomState.players.length,
										" / ",
										roomState.settings.capacity
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sketch bg-white/70 p-2.5 rounded",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground block font-bold",
									children: "HINT / DRAW TIME"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xl font-bold font-display text-accent",
									children: [roomState.settings.drawTime, "s"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sketch bg-white/70 p-2.5 rounded",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground block font-bold",
									children: "ROUNDS"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl font-bold font-display text-foreground",
									children: roomState.settings.rounds
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sketch bg-white/70 p-2.5 rounded",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground block font-bold",
									children: "MODE"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg font-bold font-display text-foreground capitalize",
									children: roomState.settings.gameMode.replace("_", " ")
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sketch bg-white/80 p-3 sm:p-4 flex items-center gap-3 sm:gap-4 border-2 border-foreground shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/detective-waving.png",
							alt: "Detective Waving",
							className: "h-16 w-16 sm:h-20 sm:w-20 object-contain shrink-0 drop-shadow-xs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-hand space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xl sm:text-2xl font-display text-primary font-bold",
								children: "Welcome to Class! 👋"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-foreground",
								children: roomState.players.length < 3 ? "Share room code or invite link with friends. Match can start once 3 detectives arrive!" : "All desks are ready! Host can start the round anytime."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between font-hand",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-2xl font-display text-foreground flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5 text-primary" }),
									" Who's in Class? (",
									roomState.players.length,
									")"
								]
							}), roomState.players.length < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-destructive",
								children: "⚠️ Need at least 3 players to start"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3",
							children: roomState.players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sketch bg-white/90 p-3 flex items-center justify-between gap-3 shadow-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 overflow-hidden",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 shrink-0 rounded-full bg-secondary border border-foreground/30 flex items-center justify-center font-bold text-primary font-display text-lg",
										children: p.displayName.charAt(0).toUpperCase()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "truncate",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-bold text-base truncate flex items-center gap-1.5 flex-wrap",
											children: [
												p.displayName,
												p.isHost && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-accent/20 px-1 text-[11px] font-bold text-accent border border-accent/30",
													children: "HOST"
												}),
												p.userId?.startsWith("guest_") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-muted px-1 text-[10px] font-bold text-muted-foreground border border-foreground/20",
													children: "GUEST"
												}),
												p.socketId === currentSocketId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground font-normal",
													children: "(You)"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: "Ready to play ✏️"
										})]
									})]
								})
							}, p.socketId))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t-2 border-foreground/30 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground font-hand",
							children: isHost ? "You are the host. Configure settings above and start when ready." : "Waiting for the host to start the match..."
						}), isHost && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
							disabled: roomState.players.length < 3,
							onClick: handleStartGame,
							className: "w-full sm:w-auto",
							children: [
								"Start Game 🚀 (",
								roomState.players.length,
								"/3 Min)"
							]
						})]
					})
				]
			}),
			roomState && roomState.phase !== "lobby" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "notebook relative mx-auto max-w-5xl rounded-sm py-6 sm:py-8 pl-5 sm:pl-12 md:pl-20 pr-4 sm:pr-8 md:pr-12 shadow-2xl space-y-4 sm:space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-1deg]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground/30 pb-3 font-hand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 sm:gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "sketch bg-secondary px-2.5 sm:px-3 py-1 text-sm sm:text-base font-bold text-foreground",
								children: [
									"Round ",
									roomState.currentRound,
									" of ",
									roomState.totalRounds
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "sketch bg-highlight px-2.5 sm:px-3 py-1 text-sm sm:text-base font-bold text-foreground capitalize",
								children: [
									roomState.phase === "hint_turn" && "Clue Phase",
									roomState.phase === "discussion" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Discussion (",
										remainingTime,
										"s)",
										roomState.skipDiscussionVotesCount > 0 && ` • ${roomState.skipDiscussionVotesCount}/${roomState.skipDiscussionRequired} Skip`
									] }),
									roomState.phase === "answer_submission" && "Secret Vote",
									roomState.phase === "results" && "Round Results"
								]
							})]
						}), remainingTime > 0 && roomState.phase !== "results" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sketch bg-accent px-3 sm:px-4 py-1 text-accent-foreground font-bold text-base sm:text-lg flex items-center gap-1.5 sm:gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 sm:h-5 sm:w-5 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [remainingTime, "s"] })]
						})]
					}),
					secretInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sketch bg-white/95 px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 border-2 border-foreground shadow-xs font-hand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 sm:gap-3.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: showSecretWord ? "/detective-eyes-open.png" : "/detective-covering-eyes.png",
								alt: "Detective Mascot",
								className: "h-9 w-9 sm:h-11 sm:w-11 object-contain shrink-0 drop-shadow-xs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 sm:gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] sm:text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider",
										children: showSecretWord ? "YOUR WORD:" : "SECRET WORD:"
									}), showSecretWord && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${secretInfo.role === "imposter" ? "bg-accent/20 text-accent border border-accent/30" : "bg-primary/20 text-primary border border-primary/30"}`,
										children: secretInfo.role === "imposter" ? "🕵️ IMPOSTER" : "🔎 DETECTIVE"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xl sm:text-2xl md:text-3xl font-display text-accent font-bold truncate leading-tight",
									children: showSecretWord ? secretInfo.word : "🔒 • • • • • • 🔒"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									sound.playPop();
									setShowSecretWord(!showSecretWord);
								},
								className: `sketch flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold transition-all shadow-xs ${showSecretWord ? "bg-secondary text-foreground hover:bg-secondary/80" : "bg-accent text-accent-foreground hover:brightness-110"}`,
								children: [showSecretWord ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showSecretWord ? "Hide 🔒" : "Peek 👁️" })]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-5 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-7 space-y-5",
							children: [
								roomState.phase === "hint_turn" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: isMyTurn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-white/95 p-3 sm:p-4 border-2 border-accent space-y-3 shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-foreground/15 pb-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-bold text-accent flex items-center gap-1.5 font-display text-lg sm:text-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 sm:h-5 sm:w-5 text-accent animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Your Turn to Give a Clue!" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 bg-muted/60 p-0.5 rounded border border-foreground/20 font-hand",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														sound.playPop();
														setClueType("text");
													},
													className: `sketch px-2.5 py-1 text-xs font-bold transition-all ${clueType === "text" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
													children: "✏️ Text"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														sound.playPop();
														setClueType("draw");
													},
													className: `sketch px-2.5 py-1 text-xs font-bold transition-all ${clueType === "draw" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
													children: "🎨 Sketch"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														sound.playPop();
														setClueType("voice");
													},
													className: `sketch px-2.5 py-1 text-xs font-bold transition-all ${clueType === "voice" ? "bg-accent text-accent-foreground shadow-xs" : "bg-transparent text-foreground hover:bg-secondary"}`,
													children: "🎙️ Voice"
												})
											]
										})]
									}), clueType === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3 font-hand pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: textClueInput,
											onChange: (e) => setTextClueInput(e.target.value),
											placeholder: "Type a clever subtle clue without saying the secret word...",
											className: "sketch w-full bg-card px-3.5 py-2 text-sm sm:text-base focus:outline-none",
											maxLength: 100
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex justify-end",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
												onClick: handleSubmitTextClue,
												disabled: !textClueInput.trim(),
												children: "Submit Clue ✏️"
											})
										})]
									}) : clueType === "draw" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawPad, {
										onDone: handleSubmitDrawingClue,
										onCancel: () => setClueType("text")
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceClueRecorder, { onSubmit: (audioUrl, transcript) => {
										handleSubmitVoiceClue(audioUrl, transcript);
									} })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-white/90 p-5 sm:p-6 text-center space-y-2.5 font-hand flex flex-col items-center justify-center border-2 border-foreground/30 shadow-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/detective-drawing.png",
											alt: "Detective Drawing",
											className: "h-20 sm:h-24 w-auto object-contain drop-shadow-xs animate-pulse"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xl sm:text-2xl font-display text-foreground",
											children: [
												"Waiting for ",
												roomState.activePlayerName,
												"'s clue... ✏️"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground text-xs sm:text-sm max-w-sm mx-auto leading-relaxed",
											children: "Watch closely or inspect their drawing to determine if their clue fits the secret word!"
										})
									]
								}) }),
								roomState.phase === "discussion" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-white/95 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-primary shadow-xs font-hand",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/detective-magnifier.png",
											alt: "Detective Investigating Clues",
											className: "h-12 w-auto object-contain shrink-0 drop-shadow-xs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-base sm:text-lg font-display text-primary flex items-center gap-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Classroom Debate & Discussion! 🗣️" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs sm:text-sm text-foreground/90",
												children: "Debate clues in chat, or vote to skip to start secret voting immediately!"
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-2 shrink-0 self-start sm:self-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: handleVoteSkipDiscussion,
											disabled: hasVotedSkipDiscussion,
											className: `sketch flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all shadow-xs ${hasVotedSkipDiscussion ? "bg-secondary text-foreground/60 border-foreground/30 cursor-not-allowed" : "bg-accent text-accent-foreground hover:brightness-110 animate-pulse"}`,
											title: hasVotedSkipDiscussion ? "You have already voted to skip discussion." : "Vote to skip discussion (requires majority of players)",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hasVotedSkipDiscussion ? "✓ Voted to Skip" : "⏭️ Skip Discussion" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "bg-black/15 text-[11px] px-2 py-0.5 rounded-full font-mono font-bold",
												children: [
													roomState.skipDiscussionVotesCount || 0,
													"/",
													roomState.skipDiscussionRequired || Math.floor((roomState.players?.filter((p) => p.isConnected).length || 3) / 2) + 1
												]
											})]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 font-hand",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-2xl font-display text-foreground flex items-center gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"📌 Clue Pinboard (",
											roomState.hints?.length || 0,
											")"
										] })
									}), !roomState.hints || roomState.hints.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sketch bg-card/40 p-6 text-center text-muted-foreground text-sm",
										children: "No clues shared yet. The first clue will appear here! 📋"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: roomState.hints.map((hint, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sketch relative bg-white/95 p-3.5 space-y-2 border border-foreground/30 shadow-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-2 left-4 h-4 w-16 rotate-[-2deg]" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs font-bold text-primary pt-1",
													children: hint.playerName
												}),
												hint.type === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-lg font-bold text-foreground italic",
													children: [
														"\"",
														hint.content,
														"\""
													]
												}) : hint.type === "voice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceCluePlayer, {
													audioUrl: hint.content,
													transcript: hint.transcript
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "rounded border bg-white p-1",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: hint.content,
														alt: "Player sketch",
														className: "h-32 w-full object-contain"
													})
												})
											]
										}, idx))
									})]
								}),
								roomState.phase === "results" && roomState.lastResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch relative bg-highlight/40 p-6 border-2 border-accent space-y-4 text-center font-hand overflow-hidden",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: "/trophy-gold.png",
												alt: "Trophy",
												className: "h-20 sm:h-24 w-auto object-contain drop-shadow-md hover:scale-110 transition-transform"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: "/detective-jumping-win.png",
												alt: "Detective Celebrating Win",
												className: "h-24 sm:h-28 w-auto object-contain drop-shadow-md hover:scale-110 transition-transform animate-bounce"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-3xl md:text-4xl font-display font-bold text-accent",
											children: roomState.lastResult.banner
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-3 max-w-md mx-auto pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sketch bg-white p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground block font-bold",
													children: "COMMON WORD"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-2xl font-display text-primary font-bold",
													children: roomState.lastResult.commonWord
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sketch bg-white p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground block font-bold",
													children: "IMPOSTER WORD"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-2xl font-display text-accent font-bold",
													children: roomState.lastResult.imposterWord
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-sm font-bold text-foreground",
											children: [
												"Imposter: ",
												roomState.lastResult.imposterNames?.join(", ") || "Unknown",
												" 🕵️"
											]
										}),
										isHost && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pt-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
												onClick: handleNextRound,
												children: roomState.currentRound >= roomState.totalRounds ? "Finish Match & View Rankings 🏆" : "Start Next Round 🚀"
											})
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:col-span-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, {
								messages: roomState.chatMessages || [],
								onSendMessage: handleSendChatMessage,
								phase: roomState.phase,
								players: roomState.players || [],
								currentSocketId,
								hasSubmittedAnswer,
								onSubmitAnswer: handleSubmitSecretAnswer,
								submissionCount: roomState.answerSubmissionCount || 0,
								totalEligible: roomState.totalEligibleAnswers || roomState.players?.length || 0
							})
						})]
					})
				]
			}),
			showSettings && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomSettingsModal, {
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
			}),
			showPublicRooms && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicRoomsModal, {
				rooms: publicRooms,
				onJoinRoom: (code) => handleJoinRoom(code),
				onCreateRoom: () => handleCreateRoom({ isPublic: true }),
				onRefresh: fetchPublicRooms,
				onClose: () => setShowPublicRooms(false)
			}),
			showNoticeBoard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoticeBoardModal, {
				onClose: () => setShowNoticeBoard(false),
				championName
			}),
			showAccount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountModal, {
				user,
				onClose: () => setShowAccount(false),
				onLogout: () => {
					fetch(`${API_BASE}/api/auth/logout`, { method: "POST" }).then(() => {
						setUser(null);
						setShowAccount(false);
					});
				},
				onGoogleLogin: handleGoogleLogin,
				onUpdateProfile: (profileData) => {
					if (user) fetch(`${API_BASE}/api/user/update`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							userId: user.id,
							displayName: profileData.displayName,
							username: profileData.username,
							country: profileData.country,
							state: profileData.state,
							city: profileData.city
						})
					}).then((res) => res.json()).then((data) => {
						if (data.user) setUser(data.user);
					});
				}
			}),
			showLeaderboard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderboardModal, { onClose: () => setShowLeaderboard(false) })
		]
	});
}
//#endregion
export { Index as component };
