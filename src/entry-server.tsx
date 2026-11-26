import { renderToString } from "react-dom/server";
import { App } from "./App";
import { site } from "./content/site";
import { pageMeta } from "./lib/meta";
import { visibleProjects } from "./lib/portfolio";
import { routePath, type Route } from "./lib/router";
import { setRuntime, type Runtime } from "./lib/runtime";

export { pageMeta, routePath, site };

export function routes(): Route[] {
  return [
    { name: "index" },
    { name: "about" },
    { name: "contact" },
    { name: "resume" },
    ...visibleProjects().map((p) => ({ name: "project", slug: p.slug }) as Route),
    { name: "notfound" },
  ];
}

export function render(route: Route, runtime: Partial<Runtime>) {
  setRuntime(runtime);
  return { html: renderToString(<App initial={route} />), meta: pageMeta(route) };
}
