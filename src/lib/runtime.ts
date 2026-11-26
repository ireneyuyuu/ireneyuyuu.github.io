/**
 * How the site is being served.
 *  • "history": normal hosting — real URLs like /projects/petra-ferro-winery/
 *  • "hash":    single-file preview — #petra-ferro-winery (used by the hosted preview)
 */
export type Mode = "history" | "hash";

export interface Runtime {
  mode: Mode;
  /** Sub-folder the site is deployed in ("" for a root domain). */
  base: string;
  /** Hosted-preview build (enables the preview download bridge). */
  preview: boolean;
}

let runtime: Runtime = { mode: "history", base: "", preview: false };

export function setRuntime(next: Partial<Runtime>) {
  runtime = { ...runtime, ...next, base: (next.base ?? runtime.base).replace(/\/+$/, "") };
}

export function getRuntime(): Runtime {
  return runtime;
}

/** Public URL for a file in /public, e.g. asset("images/x.webp"). */
export function asset(path: string): string {
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  const clean = path.replace(/^\/+/, "");
  return runtime.mode === "hash" ? clean : `${runtime.base}/${clean}`;
}
