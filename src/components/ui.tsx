import { useEffect, useRef, useState, type CSSProperties } from "react";
import { resolveImage } from "../lib/images";
import { asset, getRuntime } from "../lib/runtime";

/** Hairline rule that draws itself in when it scrolls into view. */
export function Rule({ ink = false, className = "" }: { ink?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} data-draw="" aria-hidden="true" className={`rule ${ink ? "rule-ink" : ""} ${className}`} />;
}

interface ImgProps {
  image?: string;
  alt: string;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
}

/** Responsive <img> with width/height set from the image manifest (no layout shift). */
export function Img({ image, alt, sizes, className, style, eager = false }: ImgProps) {
  const r = resolveImage(image);
  if (!r) return null;
  return (
    <img
      src={r.src}
      srcSet={r.srcSet}
      sizes={r.srcSet ? sizes : undefined}
      width={r.width}
      height={r.height}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
      className={className}
      style={style}
    />
  );
}

/** Email address shown as selectable text, a mail link and a copy button. */
export function Email({ address, className = "" }: { address: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const sel = window.getSelection();
      if (sel && ref.current) {
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-3 ${className}`}>
      <a ref={ref} href={`mailto:${address}`} className="select-all underline decoration-rule underline-offset-[0.25em] hover:decoration-ink">
        {address}
      </a>
      <button type="button" onClick={copy} className="t-label text-graphite hover:text-ink no-print" aria-live="polite">
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}

/**
 * CV download. On a normal host it's a plain download link to the PDF in
 * /public/documents. In the hosted preview, browsers block direct downloads,
 * so it hands the file to the preview's save dialog instead.
 */
export function DownloadButton({ file, filename, label, primary = false }: { file: string; filename: string; label: string; primary?: boolean }) {
  const [note, setNote] = useState("");
  const cls = primary
    ? "resume-dl t-label bg-ink text-paper border border-ink px-4 py-3 hover:bg-accent hover:border-accent transition-colors"
    : "resume-dl t-label border border-rule px-4 py-3 hover:border-ink transition-colors";
  if (!getRuntime().preview) {
    return (
      <a href={asset(file)} download={filename} className={cls}>
        {label} <span aria-hidden="true">↓</span>
      </a>
    );
  }
  const save = async () => {
    setNote("");
    try {
      const claude = (window as unknown as { claude?: { use?: (n: string) => Promise<unknown> } }).claude;
      const dl = (await claude?.use?.("downloads")) as { save: (r: { filename: string; data: Blob }) => Promise<unknown> } | null | undefined;
      if (!dl) {
        setNote("Downloading isn’t available in this view.");
        return;
      }
      const res = await fetch(asset(file));
      if (!res.ok) throw new Error(String(res.status));
      await dl.save({ filename, data: await res.blob() });
    } catch (e) {
      const code = (e as { code?: string })?.code;
      if (code === "declined") return;
      setNote("The download didn’t start. Please try again.");
    }
  };
  return (
    <span className="inline-flex flex-col gap-2">
      <button type="button" onClick={save} className={cls}>
        {label} <span aria-hidden="true">↓</span>
      </button>
      {note && (
        <span role="status" className="text-[12px] text-graphite">
          {note}
        </span>
      )}
    </span>
  );
}
