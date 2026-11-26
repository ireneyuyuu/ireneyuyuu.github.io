/**
 * npm run images
 *
 * Turns original drawings into web-ready files:
 *   source-images/<project-slug>/<name>.(png|jpg|jpeg|tif|tiff|webp)
 *     → public/images/<project-slug>/<name>-800.webp
 *     → public/images/<project-slug>/<name>-1600.webp
 *     → public/images/<project-slug>/<name>-full.webp   (long edge ≤ 4000 px, for the zoom viewer)
 * and records each image's size in src/content/image-manifest.json.
 *
 * Then reference it in src/content/projects.ts as  image: "<project-slug>/<name>"
 *
 * Images already processed are skipped unless the original is newer. Use --force to redo all.
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "source-images");
const OUT = path.join(root, "public", "images");
const MANIFEST = path.join(root, "src", "content", "image-manifest.json");
const force = process.argv.includes("--force");
const FULL_MAX = 4000;
const WIDTHS = [800, 1600];

const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8").catch(() => "{}"));
let made = 0;

const slugs = (await fs.readdir(SRC, { withFileTypes: true }).catch(() => [])).filter((d) => d.isDirectory());
for (const dir of slugs) {
  const files = (await fs.readdir(path.join(SRC, dir.name))).filter((f) => /\.(png|jpe?g|tiff?|webp)$/i.test(f));
  for (const file of files) {
    const name = file.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const key = `${dir.name}/${name}`;
    const input = path.join(SRC, dir.name, file);
    const fullOut = path.join(OUT, dir.name, `${name}-full.webp`);
    const srcStat = await fs.stat(input);
    const outStat = await fs.stat(fullOut).catch(() => null);
    if (!force && outStat && outStat.mtimeMs > srcStat.mtimeMs && manifest[key]) continue;

    await fs.mkdir(path.join(OUT, dir.name), { recursive: true });
    const img = sharp(input, { limitInputPixels: false }).rotate();
    const meta = await img.metadata();
    const w0 = meta.width;
    const h0 = meta.height;
    const scale = Math.min(1, FULL_MAX / Math.max(w0, h0));
    const fw = Math.round(w0 * scale);
    const fh = Math.round(h0 * scale);
    await img.clone().resize(fw, fh).webp({ quality: 86 }).toFile(fullOut);
    const widths = [];
    for (const w of WIDTHS) {
      if (w >= fw) continue;
      await img.clone().resize(w).webp({ quality: 80 }).toFile(path.join(OUT, dir.name, `${name}-${w}.webp`));
      widths.push(w);
    }
    manifest[key] = { w: fw, h: fh, widths };
    made++;
    console.log(`✓ ${key}  ${w0}×${h0} → ${fw}×${fh}`);
  }
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 1) + "\n");
console.log(made ? `Processed ${made} image(s). Manifest updated.` : "Nothing new in source-images/.");
