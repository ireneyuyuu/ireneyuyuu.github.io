import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { resolveImage } from "../lib/images";
import type { NumberedFigure } from "../lib/portfolio";
import type { Figure } from "../lib/types";

/* ──────────────────────────────────────────────────────────────
   High-resolution drawing viewer
   • click any drawing to open · wheel / pinch / buttons to zoom
   • drag to pan · ← → to move between drawings · Esc to close
   • loads the full-resolution file; keeps the drawing's proportions
   ────────────────────────────────────────────────────────────── */

interface ViewerApi {
  open: (fig: Figure) => void;
  numberOf: (fig: Figure) => NumberedFigure | undefined;
}
const ViewerContext = createContext<ViewerApi>({ open: () => {}, numberOf: () => undefined });
export const useViewer = () => useContext(ViewerContext);

export function ViewerProvider({ figures, byFigure, children }: { figures: NumberedFigure[]; byFigure: Map<Figure, NumberedFigure>; children: ReactNode }) {
  const viewable = useMemo(() => figures.filter((f) => f.image && !f.placeholder), [figures]);
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const api = useMemo<ViewerApi>(
    () => ({
      open: (fig) => {
        const nf = byFigure.get(fig);
        const i = viewable.findIndex((v) => v.code === nf?.code);
        if (i >= 0) {
          opener.current = document.activeElement as HTMLElement;
          setIndex(i);
        }
      },
      numberOf: (fig) => byFigure.get(fig),
    }),
    [byFigure, viewable],
  );

  const close = useCallback(() => {
    setIndex(null);
    window.setTimeout(() => opener.current?.focus({ preventScroll: true }), 0);
  }, []);

  return (
    <ViewerContext.Provider value={api}>
      {children}
      {index !== null &&
        viewable[index] &&
        // Portal to <body> so no transformed ancestor can trap the fixed overlay.
        createPortal(<DrawingViewer figures={viewable} index={index} onIndex={setIndex} onClose={close} />, document.body)}
    </ViewerContext.Provider>
  );
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface View { z: number; x: number; y: number }

export function DrawingViewer({ figures, index, onIndex, onClose }: { figures: NumberedFigure[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const fig = figures[index];
  const img = resolveImage(fig.image, fig)!;
  const stageRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<View>({ z: 1, x: 0, y: 0 });
  const [animate, setAnimate] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [src, setSrc] = useState(img.src);
  const [loadingFull, setLoadingFull] = useState(true);
  const count = figures.length;

  // Fit scale: the whole drawing visible with a small margin.
  const fit = box.w && box.h ? Math.min((box.w * 0.94) / img.width, (box.h * 0.94) / img.height) : 0;
  const baseW = img.width * fit;
  const baseH = img.height * fit;
  const maxZ = fit ? Math.max(3, 2 / fit) : 3; // up to 200 % of the file's pixels

  const constrain = useCallback(
    (v: View): View => {
      const z = clamp(v.z, 1, maxZ);
      const mx = Math.max(0, (baseW * z - box.w) / 2 + 24);
      const my = Math.max(0, (baseH * z - box.h) / 2 + 24);
      return z === 1 ? { z: 1, x: 0, y: 0 } : { z, x: clamp(v.x, -mx, mx), y: clamp(v.y, -my, my) };
    },
    [baseW, baseH, box.w, box.h, maxZ],
  );

  const zoomAt = useCallback(
    (factor: number, px = 0, py = 0, smooth = true) => {
      setAnimate(smooth);
      setView((v) => {
        const z2 = clamp(v.z * factor, 1, maxZ);
        const k = z2 / v.z;
        return constrain({ z: z2, x: px - (px - v.x) * k, y: py - (py - v.y) * k });
      });
    },
    [constrain, maxZ],
  );
  const reset = useCallback(() => {
    setAnimate(true);
    setView({ z: 1, x: 0, y: 0 });
  }, []);

  const go = useCallback((d: number) => onIndex((index + d + count) % count), [index, count, onIndex]);

  // Stage size
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // New drawing: reset view, show display size first, then swap in the full file.
  useEffect(() => {
    setView({ z: 1, x: 0, y: 0 });
    setSrc(img.src);
    setLoadingFull(img.full !== img.src);
    if (img.full === img.src) return;
    const pre = new Image();
    pre.decoding = "async";
    pre.onload = () => {
      setSrc(img.full);
      setLoadingFull(false);
    };
    pre.src = img.full;
    // Warm the neighbours
    [figures[(index + 1) % count], figures[(index - 1 + count) % count]].forEach((f) => {
      const r = resolveImage(f?.image);
      if (r) new Image().src = r.src;
    });
    return () => {
      pre.onload = null;
    };
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock page scroll, focus the dialog, restore on close.
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomAt(1.5); }
      else if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomAt(1 / 1.5); }
      else if (e.key === "0") { e.preventDefault(); reset(); }
      else if (e.key === "Tab") {
        // keep focus inside the dialog
        const f = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])");
        if (!f || !f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose, reset, zoomAt]);

  // Wheel zoom (non-passive so the page doesn't scroll)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left - r.width / 2;
      const py = e.clientY - r.top - r.height / 2;
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      zoomAt(Math.exp(-delta * (e.ctrlKey ? 0.01 : 0.0022)), px, py, false);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // Pointer pan / pinch / swipe
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ startX: number; startY: number; moved: boolean; dist?: number }>({ startX: 0, startY: 0, moved: false });

  const local = (x: number, y: number) => {
    const r = stageRef.current!.getBoundingClientRect();
    return { x: x - r.left - r.width / 2, y: y - r.top - r.height / 2 };
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) gesture.current = { startX: e.clientX, startY: e.clientY, moved: false };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.dist = Math.hypot(a.x - b.x, a.y - b.y);
    }
    setDragging(true);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (Math.abs(e.clientX - gesture.current.startX) + Math.abs(e.clientY - gesture.current.startY) > 6) gesture.current.moved = true;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = local((a.x + b.x) / 2, (a.y + b.y) / 2);
      if (gesture.current.dist) zoomAt(d / gesture.current.dist, mid.x, mid.y, false);
      gesture.current.dist = d;
      return;
    }
    if (view.z > 1) {
      setAnimate(false);
      setView((v) => constrain({ ...v, x: v.x + dx, y: v.y + dy }));
    }
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    const wasPinch = pointers.current.size > 1;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current.dist = undefined;
    if (pointers.current.size === 0) {
      setDragging(false);
      // swipe between drawings when not zoomed
      const sx = e.clientX - gesture.current.startX;
      const sy = e.clientY - gesture.current.startY;
      if (!wasPinch && view.z === 1 && e.pointerType !== "mouse" && Math.abs(sx) > 60 && Math.abs(sx) > Math.abs(sy) * 1.5) go(sx < 0 ? 1 : -1);
    }
  };

  const onDoubleClick = (e: ReactMouseEvent) => {
    if (view.z > 1.01) return reset();
    const p = local(e.clientX, e.clientY);
    zoomAt(2.5, p.x, p.y);
  };

  const pct = Math.round(fit * view.z * 100);
  const meta = [fig.type, fig.scale].filter(Boolean).join(" · ");

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`FIG. ${fig.code} — ${fig.title}`}
      className="viewer viewer-enter fixed inset-0 z-[100] flex flex-col text-ink"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        className="flex items-center justify-between gap-3 border-b border-rule py-2.5"
        style={{ paddingLeft: "max(16px, env(safe-area-inset-left, 0px))", paddingRight: "max(16px, env(safe-area-inset-right, 0px))" }}
      >
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="t-code shrink-0">FIG. {fig.code}</span>
          <span className="truncate text-[13px]">{fig.title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="t-code mr-2 hidden text-graphite sm:inline">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <button type="button" className="viewer-btn t-code" onClick={() => zoomAt(1 / 1.5)} disabled={view.z <= 1} aria-label="Zoom out">
            −
          </button>
          <button type="button" className="viewer-btn t-code w-[64px]" onClick={reset} aria-label="Fit drawing to screen" title="Fit to screen (0)">
            {view.z <= 1.001 ? "Fit" : `${pct}%`}
          </button>
          <button type="button" className="viewer-btn t-code" onClick={() => zoomAt(1.5)} disabled={view.z >= maxZ} aria-label="Zoom in">
            +
          </button>
          <button ref={closeRef} type="button" className="viewer-btn t-code ml-1.5" onClick={onClose} aria-label="Close viewer">
            ✕
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        className={`viewer-stage relative flex-1 overflow-hidden ${dragging && view.z > 1 ? "is-dragging" : ""}`}
        style={{ cursor: view.z > 1 ? undefined : "zoom-in" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
      >
        {fit > 0 && (
          <img
            key={fig.code}
            src={src}
            alt={fig.alt ?? [fig.title, fig.caption].filter(Boolean).join(". ")}
            draggable={false}
            className="absolute left-1/2 top-1/2 max-w-none bg-white shadow-[0_1px_0_var(--rule),0_0_0_1px_var(--rule)]"
            style={{
              width: baseW * view.z,
              height: baseH * view.z,
              transform: `translate(calc(-50% + ${view.x}px), calc(-50% + ${view.y}px))`,
              transition: animate && !dragging ? "width 220ms ease-out, height 220ms ease-out, transform 220ms ease-out" : "none",
            }}
          />
        )}
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className="viewer-btn t-code absolute left-3 top-1/2 -translate-y-1/2" aria-label="Previous drawing">
              ←
            </button>
            <button type="button" onClick={() => go(1)} className="viewer-btn t-code absolute right-3 top-1/2 -translate-y-1/2" aria-label="Next drawing">
              →
            </button>
          </>
        )}
        {loadingFull && <span className="t-code absolute bottom-3 left-1/2 -translate-x-1/2 bg-paper px-2 py-1 text-graphite">Loading full resolution…</span>}
      </div>

      <div
        className="flex items-baseline justify-between gap-4 border-t border-rule py-2.5 text-[12px] text-graphite"
        style={{ paddingLeft: "max(16px, env(safe-area-inset-left, 0px))", paddingRight: "max(16px, env(safe-area-inset-right, 0px))" }}
      >
        <span className="t-label truncate">{meta || "Drawing"}</span>
        <span className="hidden md:inline">Scroll or pinch to zoom · drag to pan · ← → to browse · Esc to close</span>
        <span className="t-code sm:hidden">
          {index + 1} / {count}
        </span>
      </div>
    </div>
  );
}
