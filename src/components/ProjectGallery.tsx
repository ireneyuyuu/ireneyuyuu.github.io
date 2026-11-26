import type { CSSProperties } from "react";
import { resolveImage } from "../lib/images";
import type { NumberedFigure } from "../lib/portfolio";
import type { Block, Figure } from "../lib/types";
import { useViewer } from "./DrawingViewer";

type Layout = "full" | "bleed" | "half" | "third" | "side";

const SIZES: Record<Layout, string> = {
  full: "(min-width: 1720px) 1620px, 100vw",
  bleed: "100vw",
  half: "(min-width: 768px) 50vw, 100vw",
  third: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  side: "(min-width: 1024px) 64vw, 100vw",
};

/** FIG. 01.03 — Title · TYPE · SCALE, then an optional sentence. */
export function DrawingCaption({ fig, nf, className = "" }: { fig: Figure; nf?: NumberedFigure; className?: string }) {
  const meta = [fig.type, fig.scale].filter(Boolean).join(" · ");
  return (
    <figcaption className={`mt-3 grid grid-cols-[4.75rem_1fr] items-baseline gap-x-3 gap-y-1 md:grid-cols-[4.75rem_1fr_auto] ${className}`}>
      <span className="t-code text-graphite">FIG. {nf?.code ?? "—"}</span>
      <span className="text-[13px] font-medium leading-snug">{fig.title}</span>
      {meta && <span className="t-label col-start-2 text-graphite md:col-start-3 md:row-start-1 md:text-right">{meta}</span>}
      {fig.caption && <span className="col-start-2 max-w-[70ch] text-[13px] leading-relaxed text-graphite md:col-span-2">{fig.caption}</span>}
      {fig.credit && <span className="t-code col-start-2 text-graphite md:col-span-2">{fig.credit}</span>}
    </figcaption>
  );
}

export function FigureView({ fig, layout, eager = false }: { fig: Figure; layout: Layout; eager?: boolean }) {
  const viewer = useViewer();
  const nf = viewer.numberOf(fig);
  const img = resolveImage(fig.image, fig);

  if (fig.placeholder || !img) {
    return (
      <figure className={layout === "bleed" ? "wrap" : ""}>
        <div className="hatch relative flex aspect-[16/6] md:aspect-[16/4] items-center justify-center outline outline-1 -outline-offset-1 outline-rule">
          <span className="t-code border border-rule bg-paper px-3 py-1.5 text-graphite">Image to be added</span>
        </div>
        <DrawingCaption fig={fig} nf={nf} />
      </figure>
    );
  }

  const ar = img.width / img.height;
  const alt = fig.alt ?? [fig.title, fig.caption].filter(Boolean).join(". ");
  const style = { "--ar": ar.toFixed(4) } as CSSProperties;

  const button = (
    <button type="button" className="fig-btn group" onClick={() => viewer.open(fig)} aria-label={`Enlarge FIG. ${nf?.code ?? ""}: ${fig.title}`}>
      <img
        src={img.src}
        srcSet={img.srcSet}
        sizes={img.srcSet ? SIZES[layout] : undefined}
        width={img.width}
        height={img.height}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={layout === "bleed" ? { outline: "none" } : undefined}
      />
      <span className="fig-enlarge t-label absolute right-3 top-3 bg-paper px-2.5 py-1.5" aria-hidden="true">
        Enlarge <span className="text-accent">⤢</span>
      </span>
    </button>
  );

  if (layout === "bleed") {
    return (
      <figure className="fig fig-bleed relative left-1/2 w-screen -translate-x-1/2">
        {button}
        <div className="wrap">
          <DrawingCaption fig={fig} nf={nf} />
        </div>
      </figure>
    );
  }

  return (
    <figure className={`fig fig-${layout}`}>
      <div className={`fig-frame ${layout === "full" ? "mx-auto" : ""}`} style={style}>
        {button}
        <DrawingCaption fig={fig} nf={nf} />
      </div>
    </figure>
  );
}

/** Lays out one block of a project section. */
export function GalleryBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case "full":
      return <FigureView fig={block.figure} layout="full" />;
    case "bleed":
      return <FigureView fig={block.figure} layout="bleed" />;
    case "pair":
      return (
        <div className="grid grid-cols-1 items-start gap-x-6 gap-y-12 md:grid-cols-2 lg:gap-x-10">
          {block.figures.map((f, i) => (
            <FigureView key={i} fig={f} layout="half" />
          ))}
        </div>
      );
    case "grid": {
      const three = block.columns === 3;
      return (
        <div className={`grid grid-cols-1 items-start gap-x-6 gap-y-12 md:grid-cols-2 lg:gap-x-10 ${three ? "lg:grid-cols-3" : ""}`}>
          {block.figures.map((f, i) => (
            <FigureView key={i} fig={f} layout={three ? "third" : "half"} />
          ))}
        </div>
      );
    }
    case "text-figure": {
      const textRight = block.side === "right";
      return (
        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-8 lg:gap-x-10">
          <div className={`col-span-12 lg:col-span-4 lg:sticky lg:top-[calc(var(--header-h)+72px)] ${textRight ? "lg:order-2" : ""}`}>
            {block.heading && <h3 className="t-title">{block.heading}</h3>}
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-graphite">
              {block.text.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          </div>
          <div className={`col-span-12 lg:col-span-8 ${textRight ? "lg:order-1" : ""}`}>
            <FigureView fig={block.figure} layout="side" />
          </div>
        </div>
      );
    }
    case "text":
      return (
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-7 lg:col-start-5">
            {block.heading && <h3 className="t-title">{block.heading}</h3>}
            <div className="mt-3 space-y-4 text-[16px] leading-relaxed">
              {block.text.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          </div>
        </div>
      );
  }
}
