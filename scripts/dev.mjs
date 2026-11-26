/** npm run dev — build, serve on http://localhost:4173 and rebuild when src/ or public/ change. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "./build.mjs";
import { serve } from "./serve.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await build();
serve(Number(process.env.PORT || 4173));
let timer;
let running = false;
const rebuild = () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    if (running) return rebuild();
    running = true;
    try { await build(); console.log("  (refresh the browser)"); } catch (e) { console.error(e.message); }
    running = false;
  }, 150);
};
for (const d of ["src", "public"]) fs.watch(path.join(root, d), { recursive: true }, rebuild);
console.log("watching src/ and public/ …");
