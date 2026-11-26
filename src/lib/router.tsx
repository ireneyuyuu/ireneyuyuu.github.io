import { createContext, useCallback, useContext, useEffect, useRef, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { categories } from "../content/site";
import { getRuntime } from "./runtime";

export type Route =
  /** `chapter` scrolls the index to one category, e.g. "academic". */
  | { name: "index"; chapter?: string }
  | { name: "about" }
  | { name: "contact" }
  | { name: "resume" }
  | { name: "project"; slug: string }
  | { name: "notfound" };

const STATIC = ["about", "contact", "resume"] as const;
const isChapter = (id: string) => categories.some((c) => c.id === id);

/** Real path for a route, with trailing slash (works on every static host). */
export function routePath(r: Route): string {
  switch (r.name) {
    case "index": return "/";
    case "about": return "/about/";
    case "contact": return "/contact/";
    case "resume": return "/resume/";
    case "project": return `/projects/${r.slug}/`;
    default: return "/404.html";
  }
}

export function href(r: Route): string {
  const { mode, base } = getRuntime();
  if (mode === "hash") {
    if (r.name === "project") return `#${r.slug}`;
    if (r.name === "index") return `#${r.chapter ?? "index"}`;
    return `#${r.name === "notfound" ? "index" : r.name}`;
  }
  return base + routePath(r) + (r.name === "index" && r.chapter ? `#${r.chapter}` : "");
}

export function parsePath(pathname: string, base = "", hash = ""): Route {
  let p = pathname;
  if (base && p.startsWith(base)) p = p.slice(base.length);
  p = p.replace(/index\.html$/, "");
  if (p === "" || p === "/") {
    const h = hash.replace(/^#/, "");
    return isChapter(h) ? { name: "index", chapter: h } : { name: "index" };
  }
  const m = p.match(/^\/projects\/([a-z0-9-]+)\/?$/);
  if (m) return { name: "project", slug: m[1] };
  const s = p.match(/^\/(about|contact|resume)\/?$/);
  if (s) return { name: s[1] as "about" | "contact" | "resume" };
  return { name: "notfound" };
}

export function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, "");
  if (!h || h === "index") return { name: "index" };
  if (isChapter(h)) return { name: "index", chapter: h };
  if ((STATIC as readonly string[]).includes(h)) return { name: h as "about" | "contact" | "resume" };
  if (/^[a-z0-9-]+$/.test(h)) return { name: "project", slug: h };
  return { name: "index" };
}

export function currentRoute(): Route {
  const { mode, base } = getRuntime();
  return mode === "hash" ? parseHash(window.location.hash) : parsePath(window.location.pathname, base, window.location.hash);
}

/** Identifies a page (chapters of the index are the same page). */
export function routeKey(r: Route) {
  return r.name === "project" ? `project:${r.slug}` : r.name;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scrolls the index to a category chapter. */
export function scrollToChapter(id: string, smooth: boolean) {
  const el = document.getElementById(`chapter-${id}`);
  if (!el) return;
  // Line the chapter's top rule up just under the sticky header.
  const anchor = (el.firstElementChild as HTMLElement | null) ?? el;
  const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
  const top = anchor.getBoundingClientRect().top + window.scrollY - header - 28;
  window.scrollTo({ top: Math.max(0, top), behavior: smooth && !reducedMotion() ? "smooth" : ("instant" as ScrollBehavior) });
}

interface RouterValue {
  route: Route;
  /** Increments on every client-side navigation (drives the page transition). */
  navCount: number;
  navigate: (r: Route) => void;
}

const RouterContext = createContext<RouterValue>({ route: { name: "index" }, navCount: 0, navigate: () => {} });

type Pending = { kind: "top" | "restore"; y: number } | { kind: "chapter"; id: string; smooth: boolean } | null;

export function RouterProvider({ initial, children }: { initial: Route; children: ReactNode }) {
  const [state, setState] = useState({ route: initial, navCount: 0 });
  const scrolls = useRef(new Map<string, number>());
  const pending = useRef<Pending>(null);
  /** Set by navigate() so the hashchange that follows knows it was a link click. */
  const linkTarget = useRef<Route | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    // Opened directly on a chapter link, e.g. /#professional
    if (initial.name === "index" && initial.chapter) {
      const id = initial.chapter;
      requestAnimationFrame(() => scrollToChapter(id, false));
    }
    const onChange = () => {
      const r = currentRoute();
      const fromLink = linkTarget.current;
      linkTarget.current = null;
      setState((s) => {
        const samePage = routeKey(s.route) === routeKey(r);
        if (r.name === "index" && r.chapter && fromLink) pending.current = { kind: "chapter", id: r.chapter, smooth: samePage };
        else if (fromLink) pending.current = { kind: "top", y: 0 };
        else pending.current = { kind: "restore", y: scrolls.current.get(routeKey(r)) ?? 0 };
        return { route: r, navCount: s.navCount + 1 };
      });
    };
    const { mode } = getRuntime();
    const evt = mode === "hash" ? "hashchange" : "popstate";
    window.addEventListener(evt, onChange);
    return () => window.removeEventListener(evt, onChange);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    if (p.kind === "chapter") scrollToChapter(p.id, p.smooth);
    else window.scrollTo({ top: p.y, behavior: "instant" as ScrollBehavior });
  }, [state]);

  const navigate = useCallback((r: Route) => {
    const cur = currentRoute();
    scrolls.current.set(routeKey(cur), window.scrollY);
    const target = href(r);
    const samePage = routeKey(cur) === routeKey(r);
    const { mode } = getRuntime();

    if (mode === "hash") {
      if (window.location.hash === target || (target === "#index" && !window.location.hash)) {
        // Already there: just scroll.
        if (r.name === "index" && r.chapter) scrollToChapter(r.chapter, true);
        else window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
        return;
      }
      linkTarget.current = r;
      window.location.hash = target;
      return;
    }

    if (window.location.pathname + window.location.hash !== target) history.pushState(null, "", target);
    pending.current = r.name === "index" && r.chapter ? { kind: "chapter", id: r.chapter, smooth: samePage } : { kind: "top", y: 0 };
    setState((s) => ({ route: r, navCount: s.navCount + 1 }));
  }, []);

  return <RouterContext.Provider value={{ ...state, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  return useContext(RouterContext);
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to: Route };

/** Client-side link that still works as a normal link (open in new tab, no JS). */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={href(to)} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
