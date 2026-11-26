import { site } from "../content/site";
import { getProject } from "./portfolio";
import { resolveImage } from "./images";
import type { Route } from "./router";

export interface PageMeta {
  title: string;
  description: string;
  image?: string;
}

export function pageMeta(route: Route): PageMeta {
  switch (route.name) {
    case "index":
      return { title: `${site.name} — Architecture Portfolio`, description: site.description, image: resolveImage("petra-ferro-winery/render-lounge")?.src };
    case "about":
      return { title: `About — ${site.name}`, description: `About ${site.name}, architecture student at Syracuse University School of Architecture.` };
    case "contact":
      return { title: `Contact — ${site.name}`, description: `Email and LinkedIn for ${site.name}.` };
    case "resume":
      return { title: `Resume — ${site.name}`, description: `Education, experience and skills of ${site.name}.` };
    case "project": {
      const p = getProject(route.slug);
      if (!p) return { title: `Not found — ${site.name}`, description: site.description };
      const cover = resolveImage(p.cover.image);
      return {
        title: `${p.title} — ${site.name}`,
        description: `${p.subtitle}. ${p.type}, ${p.location}${p.year ? `, ${p.year}` : ""}.`,
        image: cover?.src,
      };
    }
    default:
      return { title: `Not found — ${site.name}`, description: site.description };
  }
}
