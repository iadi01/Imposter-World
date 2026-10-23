import { useEffect, useRef, useState, useCallback } from "react";
import { Undo2, Trash2, ArrowLeft, Send, Paintbrush, PaintBucket, Eraser } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface StrokeAction {
  type: "stroke";
  points: Point[];
  color: string;
  width: number;
}

interface FillAction {
  type: "fill";
  snapshot: ImageData;
}

type DrawAction = StrokeAction | FillAction;

function hexToRgba(hex: string): [number, number, number, number] {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
}

export function DrawPad({
  onDone,
  onCancel,
}: {
  onDone: (dataUrl: string) => void;
  onCancel: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const currentStroke = useRef<Point[]>([]);

  // Tool Modes: pen | bucket | eraser
  const [activeTool, setActiveTool] = useState<"pen" | "bucket" | "eraser">("pen");
  const [selectedColor, setSelectedColor] = useState("#234A91"); // Ballpoint Blue
  const [selectedWidth, setSelectedWidth] = useState(3);

  // History stack for 100% reliable Undo
  const historyRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const colors = [
    { label: "Blue Ink", value: "#234A91" },
    { label: "Pencil Lead", value: "#1E293B" },
    { label: "Red Pen", value: "#DC2626" },
    { label: "Marker Orange", value: "#EA580C" },
    { label: "Highlighter Yellow", value: "#FACC15" },
    { label: "Chalk Green", value: "#16A34A" },
    { label: "Purple Ink", value: "#7C3AED" },
    { label: "Clay Brown", value: "#854D0E" },
    { label: "White Eraser", value: "#FFFFFF" },
  ];

  // Save current canvas state to history stack
  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current.push(snap);
      if (historyRef.current.length > 25) {
        historyRef.current.shift(); // Limit memory to 25 undo steps
      }
      setCanUndo(true);
    } catch {
      // Ignore security/size errors
    }
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.scale(dpr, dpr);

    // Initial white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  // Flood fill algorithm
  const performFloodFill = useCallback(
    (canvasX: number, canvasY: number) => {
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

      // Save snapshot before flood fill
      saveSnapshot();

      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const startIndex = (startY * width + startX) * 4;
      const targetR = data[startIndex]!;
      const targetG = data[startIndex + 1]!;
      const targetB = data[startIndex + 2]!;
      const targetA = data[startIndex + 3]!;

      const fillColor = activeTool === "eraser" ? "#FFFFFF" : selectedColor;
      const [fillR, fillG, fillB, fillA] = hexToRgba(fillColor);

      // Same color check
      if (
        Math.abs(targetR - fillR) <= 8 &&
        Math.abs(targetG - fillG) <= 8 &&
        Math.abs(targetB - fillB) <= 8 &&
        Math.abs(targetA - fillA) <= 8
      ) {
        return;
      }

      const tolerance = 42; // Anti-aliasing threshold for smooth sketch lines
      const matches = (idx: number): boolean => {
        const dr = Math.abs(data[idx]! - targetR);
        const dg = Math.abs(data[idx + 1]! - targetG);
        const db = Math.abs(data[idx + 2]! - targetB);
        const da = Math.abs(data[idx + 3]! - targetA);
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
        const x = queueX[head]!;
        const y = queueY[head]!;
        head++;

        const idx = (y * width + x) * 4;
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = fillA;

        // 4-way neighbors
        const neighbors: [number, number][] = [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const pos = ny * width + nx;
            if (!visited[pos]) {
              visited[pos] = 1;
              const nIdx = pos * 4;
              if (matches(nIdx)) {
                queueX[tail] = nx;
                queueY[tail] = ny;
                tail++;
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
    },
    [activeTool, selectedColor, saveSnapshot]
  );

  // Pointer event handlers for drawing and bucket fill
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const getPos = (e: PointerEvent): Point => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const handleDown = (e: PointerEvent) => {
      const pt = getPos(e);

      if (activeTool === "bucket") {
        performFloodFill(pt.x, pt.y);
        return;
      }

      // Pen or Eraser tool
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

    const handleMove = (e: PointerEvent) => {
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
  }, [activeTool, selectedColor, selectedWidth, performFloodFill, saveSnapshot]);

  // Handle Undo (Peeche 1 bar)
  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length === 0) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const previous = historyRef.current.pop();
    if (previous) {
      ctx.putImageData(previous, 0, 0);
    }
    setCanUndo(historyRef.current.length > 0);
  };

  // Clear Canvas
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
      // Normalize to optimal dimensions (max 640px) for millisecond websocket transmission (< 18KB vs 600KB PNG)
      const maxDim = 640;
      let targetW = canvas.width;
      let targetH = canvas.height;
      if (targetW > maxDim || targetH > maxDim) {
        if (targetW > targetH) {
          targetH = Math.round((targetH * maxDim) / targetW);
          targetW = maxDim;
        } else {
          targetW = Math.round((targetW * maxDim) / targetH);
          targetH = maxDim;
        }
      }

      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = targetW;
      exportCanvas.height = targetH;
      const exportCtx = exportCanvas.getContext("2d");
      if (exportCtx) {
        exportCtx.fillStyle = "#FFFFFF";
        exportCtx.fillRect(0, 0, targetW, targetH);
        exportCtx.drawImage(canvas, 0, 0, targetW, targetH);
        let dataUrl = exportCanvas.toDataURL("image/webp", 0.72);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = exportCanvas.toDataURL("image/jpeg", 0.72);
        }
        onDone(dataUrl);
        return;
      }
    } catch {
      // Fallback if canvas manipulation fails
    }

    const fallbackUrl = canvas.toDataURL("image/jpeg", 0.72);
    onDone(fallbackUrl);
  };

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {/* Sleek Studio Toolbar — Clean Single Row Desk Organizer */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 p-2 rounded-md border border-foreground/20 font-hand text-xs sm:text-sm">
        {/* Tools: Pen / Bucket / Eraser */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTool("pen")}
            className={`sketch flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all ${
              activeTool === "pen"
                ? "bg-accent text-accent-foreground shadow-xs"
                : "bg-white text-foreground hover:bg-secondary"
            }`}
            title="Pen / Pencil Tool"
          >
            <Paintbrush className="h-3.5 w-3.5" />
            <span>Pen</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool("bucket")}
            className={`sketch flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all ${
              activeTool === "bucket"
                ? "bg-accent text-accent-foreground shadow-xs"
                : "bg-white text-foreground hover:bg-secondary"
            }`}
            title="Paint Bucket / Flood Fill"
          >
            <PaintBucket className="h-3.5 w-3.5" />
            <span>Fill 🪣</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool("eraser")}
            className={`sketch flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all ${
              activeTool === "eraser"
                ? "bg-accent text-accent-foreground shadow-xs"
                : "bg-white text-foreground hover:bg-secondary"
            }`}
            title="Eraser Tool"
          >
            <Eraser className="h-3.5 w-3.5" />
            <span>Eraser</span>
          </button>
        </div>

        {/* Brush Sizes (Pen/Eraser only) */}
        {activeTool !== "bucket" && (
          <div className="flex items-center gap-1 px-1">
            <span className="text-[10px] font-bold text-muted-foreground hidden sm:inline">SIZE:</span>
            {[2, 4, 8, 14].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setSelectedWidth(w)}
                className={`flex h-6 w-6 items-center justify-center rounded border transition-transform ${
                  selectedWidth === w ? "bg-accent text-accent-foreground font-bold scale-110 shadow-xs" : "bg-white hover:bg-secondary"
                }`}
                title={`Stroke width ${w}px`}
              >
                <span
                  className="rounded-full bg-foreground"
                  style={{ width: `${Math.min(w * 1.3, 14)}px`, height: `${Math.min(w * 1.3, 14)}px` }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Undo and Clear */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="sketch flex items-center gap-1 bg-white px-2.5 py-1 text-xs font-bold text-foreground hover:bg-secondary disabled:opacity-30"
            title="Undo last stroke or fill"
          >
            <Undo2 className="h-3 w-3" /> Undo
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="sketch flex items-center gap-1 bg-white px-2.5 py-1 text-xs font-bold text-destructive hover:bg-destructive/10"
            title="Clear canvas"
          >
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        </div>
      </div>

      {/* Color Palette Row */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none px-1">
        <span className="text-[11px] font-bold text-muted-foreground shrink-0 font-hand">INK:</span>
        {colors.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => {
              setSelectedColor(c.value);
              if (activeTool === "eraser") setActiveTool("pen");
            }}
            className={`h-6 w-6 sm:h-7 sm:w-7 shrink-0 rounded-full border-2 transition-all ${
              selectedColor === c.value && activeTool !== "eraser"
                ? "scale-125 border-foreground shadow-sm ring-2 ring-accent"
                : "border-foreground/30 hover:scale-110"
            } ${c.value === "#FFFFFF" ? "border-dashed border-gray-400" : ""}`}
            style={{ backgroundColor: c.value }}
            title={c.label}
          />
        ))}
      </div>

      {/* Canvas Box */}
      <div className="relative rounded-md overflow-hidden border-2 border-foreground bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          className="h-60 sm:h-72 md:h-80 w-full touch-none cursor-crosshair block"
          aria-label="Notebook Sketchpad"
        />
        {!canUndo && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 text-sm sm:text-base font-hand gap-0.5 p-4 text-center">
            <span>Draw or fill your clue here... ✏️🪣</span>
            <span className="text-[11px] font-sans opacity-70">
              {activeTool === "bucket" ? "Click any enclosed space to fill color" : "Switch to Fill 🪣 to color entire areas"}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Action Row */}
      <div className="flex items-center justify-between gap-3 pt-0.5">
        <button
          type="button"
          onClick={onCancel}
          className="sketch flex items-center gap-1.5 bg-secondary px-3.5 py-1.5 text-xs sm:text-sm font-bold text-foreground hover:bg-secondary/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Text
        </button>

        <button
          type="button"
          onClick={handleDone}
          className="sketch flex items-center gap-2 bg-accent px-5 sm:px-6 py-2 text-sm sm:text-base font-bold text-accent-foreground hover:brightness-110 shadow-sm"
        >
          <Send className="h-4 w-4" /> Submit Sketch 🎨
        </button>
      </div>
    </div>
  );
}
