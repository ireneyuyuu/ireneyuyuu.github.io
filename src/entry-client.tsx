import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { currentRoute, routeKey } from "./lib/router";
import { setRuntime, type Runtime } from "./lib/runtime";

const cfg = (window as unknown as { __SITE__?: Partial<Runtime> }).__SITE__ ?? {};
setRuntime(cfg);
document.documentElement.classList.add("js");

const el = document.getElementById("root")!;
const route = currentRoute();
const prerendered = el.getAttribute("data-route");

if (prerendered && prerendered === routeKey(route) && el.firstElementChild) {
  hydrateRoot(el, <App initial={route} />);
} else {
  el.innerHTML = "";
  createRoot(el).render(<App initial={route} />);
}
