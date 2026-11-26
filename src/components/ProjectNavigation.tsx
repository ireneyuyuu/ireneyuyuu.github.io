import { useEffect, useState } from "react";
import { Link } from "../lib/router";
import { neighbours, projectNumber } from "../lib/portfolio";
import { Rule } from "./ui";

/** Sticky in-page navigation between a project's sections. */
export function SectionNav({ items, figureCount }: { items: { id: string; number: string; title: string }[]; figureCount: number }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    // Active = the last section whose top has passed just below the sticky bars.
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current = items[0]?.id;
      for (const i of items) {
        const el = document.getElementById(`sec-${i.id}`);
        if (el && el.getBoundingClientRect().top <= line) current = i.id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = items[items.length - 1]?.id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  const go = (id: string) => {
    const el = document.getElementById(`sec-${id}`);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav aria-label="Project sections" className="subnav sticky z-40 border-b border-rule bg-paper/95 backdrop-blur-sm no-print">
      <div className="wrap flex items-center gap-6">
        <div className="subnav-scroll min-w-0 flex-1 overflow-x-auto">
          <ol className="flex gap-5 whitespace-nowrap lg:gap-9">
            {items.map((i) => (
              <li key={i.id}>
                <button
                  type="button"
                  onClick={() => go(i.id)}
                  aria-current={active === i.id ? "true" : undefined}
                  className={`t-label -mb-px flex items-baseline gap-2 border-b py-3.5 transition-colors ${
                    active === i.id ? "border-ink text-ink" : "border-transparent text-graphite hover:text-ink"
                  }`}
                >
                  <span className="t-code">{i.number}</span>
                  {i.title}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <span className="t-code hidden whitespace-nowrap text-graphite md:block">
          {String(figureCount).padStart(2, "0")} figures
        </span>
      </div>
    </nav>
  );
}

/** ← Previous project · Back to index · Next project → */
export function ProjectNavigation({ slug }: { slug: string }) {
  const { prev, next } = neighbours(slug);
  return (
    <nav aria-label="More projects" className="wrap mt-24 lg:mt-36 no-print">
      <Rule ink />
      <div className="grid grid-cols-2 items-start gap-x-6 gap-y-6 py-6 md:grid-cols-3 lg:py-8">
        <div>
          {prev && (
            <Link to={{ name: "project", slug: prev.slug }} className="group block">
              <span className="t-label text-graphite">← Previous project</span>
              <span className="mt-2 flex items-baseline gap-2">
                <span className="t-code text-graphite">{projectNumber(prev.slug)}</span>
                <span className="t-title group-hover:underline underline-offset-[0.2em] decoration-1">{prev.shortTitle ?? prev.title}</span>
              </span>
            </Link>
          )}
        </div>
        <div className="order-last col-span-2 border-t border-rule pt-5 text-center md:order-none md:col-span-1 md:border-0 md:pt-0">
          <Link to={{ name: "index" }} className="t-label inline-block py-1 underline-offset-[0.45em] hover:underline">
            Back to index
          </Link>
        </div>
        <div className="text-right">
          {next && (
            <Link to={{ name: "project", slug: next.slug }} className="group block">
              <span className="t-label text-graphite">Next project →</span>
              <span className="mt-2 flex items-baseline justify-end gap-2">
                <span className="t-code text-graphite">{projectNumber(next.slug)}</span>
                <span className="t-title group-hover:underline underline-offset-[0.2em] decoration-1">{next.shortTitle ?? next.title}</span>
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
