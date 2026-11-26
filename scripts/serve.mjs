/** Minimal static server for the built site: npm run start (after npm run build). */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, process.argv.includes("--preview") ? "dist-preview" : "dist");
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".pdf": "application/pdf", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain" };

export function serve(port = 4173) {
  return http
    .createServer((req, res) => {
      const url = decodeURIComponent((req.url || "/").split("?")[0]);
      let file = path.join(dir, url);
      if (!file.startsWith(dir)) return res.writeHead(403).end();
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!fs.existsSync(file) && fs.existsSync(path.join(dir, url, "index.html"))) {
        res.writeHead(301, { Location: url.replace(/\/?$/, "/") });
        return res.end();
      }
      const ok = fs.existsSync(file);
      const f = ok ? file : path.join(dir, "404.html");
      res.writeHead(ok ? 200 : 404, { "Content-Type": types[path.extname(f)] || "application/octet-stream" });
      fs.createReadStream(f).pipe(res);
    })
    .listen(port, () => console.log(`→ http://localhost:${port}`));
}

if (import.meta.url === `file://${process.argv[1]}`) serve(port);
