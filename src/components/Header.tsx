import { useEffect, useState } from "react";
import { resume } from "../content/resume";
import { site } from "../content/site";
import { asset, getRuntime } from "../lib/runtime";
import { getProject, visibleCategories } from "../lib/portfolio";
import { Link, useRouter, type Route } from "../lib/router";

/** On the index: the category chapter currently on screen. */
function useChapterInView(enabled: boolean) {
  const [id, setId] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!enabled) return;
    const chapters = visibleCategories().map((c) => c.id);
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let current = chapters[0];
      for (const c of chapters) {
        const el = document.getElementById(`chapter-${c}`);
        if (el && el.getBoundingClientRect().top <= line) current = c;
      }
      setId(current);
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
  }, [enabled]);
  return enabled ? id : undefined;
}

interface Item {
  key: string;
  label: string;
  to: Route;
  active: boolean;
}

function useNavItems(): Item[] {
  const { route } = useRouter();
  const inView = useChapterInView(route.name === "index");
  const projectCategory = route.name === "project" ? getProject(route.slug)?.category : undefined;
  return [
    { key: "about", label: "About", to: { name: "about" }, active: route.name === "about" },
    ...visibleCategories().map((c) => ({
      key: c.id,
      label: c.navLabel ?? c.title,
      to: { name: "index", chapter: c.id } as Route,
      active: projectCategory === c.id || (route.name === "index" && inView === c.id),
    })),
    { key: "contact", label: "Contact", to: { name: "contact" }, active: route.name === "contact" },
  ];
}

function NavLinks({ items, className }: { items: Item[]; className: string }) {
  return (
    <ul className={className}>
      {items.map((i) => (
        <li key={i.key}>
          <Link to={i.to} aria-current={i.active ? "page" : undefined} className="topnav-link">
            {i.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Header() {
  const { route } = useRouter();
  const items = useNavItems();
  const cv = resume.downloads[0];
  return (
    <header className="sticky z-50 border-b border-rule bg-paper/95 backdrop-blur-sm no-print" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="wrap">
        <div className="grid h-14 grid-cols-[1fr_auto] items-center gap-4 lg:h-[var(--header-h)] lg:grid-cols-[1fr_auto_1fr]">
          <Link to={{ name: "index" }} className="flex min-w-0 flex-col justify-self-start leading-tight" aria-label={`${site.name} — index`}>
            <span className="font-display text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap lg:text-[16px]">{site.name}</span>
            <span className="t-label mt-0.5 text-[10px] whitespace-nowrap text-graphite">{site.tagline}</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <NavLinks items={items} className="flex items-center gap-10 text-[15px] xl:gap-14 xl:text-[16px]" />
          </nav>

          <div className="flex items-center gap-4 justify-self-end">
            {site.linkedin && (
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label hidden py-2 underline-offset-[0.45em] decoration-1 hover:underline md:inline"
                aria-label="LinkedIn profile (opens in a new tab)"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            )}
            {cv && !getRuntime().preview ? (
              // Opens the resume PDF in a new tab
              <a
                href={asset(cv.file)}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label border border-ink px-3 py-2 transition-colors hover:bg-ink hover:text-paper sm:px-4"
                aria-label="Resume (PDF, opens in a new tab)"
              >
                Resume
              </a>
            ) : (
              // The hosted preview can't open files directly, so it shows the resume page
              <Link
                to={{ name: "resume" }}
                aria-current={route.name === "resume" ? "page" : undefined}
                className={`t-label border px-3 py-2 transition-colors sm:px-4 ${
                  route.name === "resume" ? "border-ink bg-ink text-paper" : "border-ink hover:bg-ink hover:text-paper"
                }`}
              >
                Resume
              </Link>
            )}
          </div>
        </div>

        <nav aria-label="Main" className="topnav-scroll -mx-[var(--gutter)] h-10 overflow-x-auto border-t border-rule lg:hidden">
          <NavLinks items={items} className="mx-auto flex h-full w-max items-center gap-3.5 px-[var(--gutter)] text-[13px] min-[400px]:gap-5 min-[400px]:text-[13.5px] sm:gap-9 sm:text-[14px]" />
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const year = "2026";
  return (
    <footer className="mt-24 lg:mt-36 no-print">
      <div className="wrap">
        <div className="rule" />
        <div className="grid grid-cols-1 gap-y-4 py-8 md:grid-cols-12 md:gap-x-6 lg:py-10">
          <p className="t-label text-graphite md:col-span-4">
            © {year} {site.name}
          </p>
          <p className="text-[13px] md:col-span-5">
            <a href={`mailto:${site.email}`} className="select-all underline decoration-rule underline-offset-[0.25em] hover:decoration-ink">
              {site.email}
            </a>
            <span className="text-graphite"> · Syracuse University School of Architecture</span>
            {site.linkedin && (
              <>
                <span className="text-graphite"> · </span>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="underline decoration-rule underline-offset-[0.25em] hover:decoration-ink">
                  LinkedIn ↗
                </a>
              </>
            )}
          </p>
          <p className="md:col-span-3 md:text-right">
            <button
              type="button"
              className="t-label text-graphite hover:text-ink"
              onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
            >
              Back to top ↑
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
