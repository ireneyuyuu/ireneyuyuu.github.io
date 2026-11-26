/**
 * Static site build.
 *
 *   npm run build            → dist/           real URLs, one pre-rendered HTML file per page
 *   npm run build:preview    → dist-preview/   single page with #hash routing (hosted preview)
 *
 * Steps: compile Tailwind CSS → bundle the React app → pre-render every route
 * to HTML (so pages load instantly and are readable by search engines) →
 * copy /public.
 */
import * as esbuild from "esbuild";
import { compile } from "tailwindcss";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");
const require = createRequire(import.meta.url);

const FONTS =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter+Tight:wght@400;500;600&family=Inter:wght@400;500;600&display=swap";

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const hash = (s) => crypto.createHash("md5").update(s).digest("hex").slice(0, 8);
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function buildCss() {
  const twDir = path.dirname(require.resolve("tailwindcss/package.json"));
  const input = await fs.readFile(path.join(src, "styles.css"), "utf8");
  const compiler = await compile(input, {
    base: src,
    loadStylesheet: async (id, base) => {
      let file;
      if (id === "tailwindcss") file = path.join(twDir, "index.css");
      else if (id.startsWith("tailwindcss/")) file = path.join(twDir, id.slice("tailwindcss/".length));
      else file = path.resolve(base, id);
      return { path: file, base: path.dirname(file), content: await fs.readFile(file, "utf8") };
    },
  });
  // Every token in the source that could be a class name.
  const candidates = new Set();
  for (const f of await walk(src)) {
    if (!/\.(tsx?|jsx?)$/.test(f)) continue;
    const text = await fs.readFile(f, "utf8");
    for (const m of text.matchAll(/[^\s"'`{}<>;\\]+/g)) candidates.add(m[0]);
  }
  const css = compiler.build([...candidates]);
  const { code } = await esbuild.transform(css, { loader: "css", minify: true, target: ["chrome100", "safari15.4", "firefox100"] });
  return code;
}

async function bundleClient(preview) {
  const r = await esbuild.build({
    entryPoints: [path.join(src, "entry-client.tsx")],
    bundle: true,
    minify: true,
    format: preview ? "iife" : "esm",
    target: ["es2020"],
    jsx: "automatic",
    legalComments: "none",
    define: { "process.env.NODE_ENV": '"production"' },
    write: false,
    outdir: "out",
  });
  return r.outputFiles[0].text;
}

async function loadServer() {
  const outfile = path.join(root, ".build", "server.mjs");
  await esbuild.build({
    entryPoints: [path.join(src, "entry-server.tsx")],
    bundle: true,
    platform: "node",
    format: "esm",
    jsx: "automatic",
    external: ["react", "react-dom"],
    define: { "process.env.NODE_ENV": '"production"' },
    outfile,
    logLevel: "warning",
  });
  return import(`${pathToFileURL(outfile).href}?v=${Date.now()}`);
}

function headMeta({ meta, site, route, base, routePath }) {
  const abs = (u) => (site.siteUrl && u && !/^https?:/.test(u) ? site.siteUrl.replace(/\/$/, "") + (u.startsWith("/") ? u : `/${u}`) : u);
  const url = site.siteUrl ? abs(base + routePath(route)) : "";
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    meta.image ? `<meta property="og:image" content="${esc(abs(meta.image))}">` : "",
    `<meta name="twitter:card" content="summary_large_image">`,
    url ? `<link rel="canonical" href="${esc(url)}">` : "",
    route.name === "notfound" ? `<meta name="robots" content="noindex">` : "",
  ]
    .filter(Boolean)
    .join("\n    ");
}

async function copyDir(from, to, filter = () => true) {
  await fs.mkdir(to, { recursive: true });
  for (const e of await fs.readdir(from, { withFileTypes: true })) {
    const a = path.join(from, e.name);
    const b = path.join(to, e.name);
    if (!filter(a)) continue;
    if (e.isDirectory()) await copyDir(a, b, filter);
    else await fs.copyFile(a, b);
  }
}

export async function build({ preview = false, quiet = false } = {}) {
  const t0 = Date.now();
  const out = path.join(root, preview ? "dist-preview" : "dist");
  await fs.rm(out, { recursive: true, force: true });
  await fs.mkdir(out, { recursive: true });

  const [css, js, server] = await Promise.all([buildCss(), bundleClient(preview), loadServer()]);
  const { site, routes, render, routePath } = server;
  const base = preview ? "" : (site.basePath || "").replace(/\/+$/, "");

  if (preview) {
    // One page; #hash routing. Content only — the host adds <html>/<head>/<body>.
    const runtime = { mode: "hash", base: "", preview: true };
    const { html, meta } = render({ name: "index" }, runtime);
    const page = `<title>Irene Zhang Portfolio</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(meta.description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>${css}</style>
<div id="root" data-route="index">${html}</div>
<script>window.__SITE__=${JSON.stringify(runtime)}</script>
<script>${js.replace(/<\/script/gi, "<\\/script")}</script>
`;
    await fs.writeFile(path.join(out, "index.html"), page);
    await copyDir(path.join(root, "public", "images"), path.join(out, "images"));
    await copyDir(path.join(root, "public", "documents"), path.join(out, "documents"));
  } else {
    const cssName = `site.${hash(css)}.css`;
    const jsName = `app.${hash(js)}.js`;
    await fs.mkdir(path.join(out, "assets"), { recursive: true });
    await fs.writeFile(path.join(out, "assets", cssName), css);
    await fs.writeFile(path.join(out, "assets", jsName), js);
    const runtime = { mode: "history", base, preview: false };

    for (const route of routes()) {
      const { html, meta } = render(route, runtime);
      const key = route.name === "project" ? `project:${route.slug}` : route.name;
      const doc = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    ${headMeta({ meta, site, route, base, routePath })}
    <link rel="icon" href="${base}/favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="${FONTS}">
    <link rel="stylesheet" href="${base}/assets/${cssName}">
    <script>window.__SITE__=${JSON.stringify(runtime)}</script>
    <script type="module" src="${base}/assets/${jsName}"></script>
  </head>
  <body>
    <div id="root" data-route="${key}">${html}</div>
  </body>
</html>
`;
      const file = route.name === "notfound" ? path.join(out, "404.html") : path.join(out, routePath(route), "index.html");
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, doc);
    }
    await copyDir(path.join(root, "public"), out, (p) => !p.endsWith(".gitkeep"));

    if (site.siteUrl) {
      const origin = site.siteUrl.replace(/\/$/, "");
      const urls = routes()
        .filter((r) => r.name !== "notfound")
        .map((r) => `  <url><loc>${origin}${base}${routePath(r)}</loc></url>`)
        .join("\n");
      await fs.writeFile(path.join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
      await fs.writeFile(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${origin}${base}/sitemap.xml\n`);
    }
  }

  if (!quiet) {
    const pages = preview ? 1 : routes().length;
    console.log(`✓ built ${path.relative(root, out)}/ — ${pages} page${pages > 1 ? "s" : ""}, css ${(css.length / 1024).toFixed(0)} kB, js ${(js.length / 1024).toFixed(0)} kB, ${Date.now() - t0} ms`);
  }
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  build({ preview: process.argv.includes("--preview") }).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
