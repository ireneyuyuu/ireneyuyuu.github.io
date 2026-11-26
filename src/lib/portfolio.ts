import { projects as allProjects } from "../content/projects";
import { categories, site } from "../content/site";
import type { Block, Figure, Project, Section, SectionKind } from "./types";

export const SECTION_TITLES: Record<SectionKind | "overview", string> = {
  overview: "Overview",
  "site-plan": "Site Plan",
  plans: "Plans",
  sections: "Sections",
  diagrams: "Diagrams",
  axonometrics: "Axonometrics",
  renderings: "Renderings",
  research: "Research & Concept",
  drawings: "Architectural Drawings",
  visualization: "Visualization",
  models: "Models & Process",
};

/** Projects shown on the site, grouped in category order. */
export function visibleProjects(): Project[] {
  const list = allProjects.filter((p) => site.showPlaceholders || !p.placeholder);
  return categories.flatMap((c) => list.filter((p) => p.category === c.id));
}

export function categoryProjects(categoryId: string): Project[] {
  return visibleProjects().filter((p) => p.category === categoryId);
}

export function visibleCategories() {
  return categories.filter((c) => categoryProjects(c.id).length > 0);
}

export function categoryNumber(categoryId: string): string {
  return pad(visibleCategories().findIndex((c) => c.id === categoryId) + 1);
}

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function getProject(slug: string): Project | undefined {
  return visibleProjects().find((p) => p.slug === slug);
}

export function projectNumber(slug: string): string {
  return pad(visibleProjects().findIndex((p) => p.slug === slug) + 1);
}

/** Previous / next finished project (reserved slots are skipped), wrapping around. */
export function neighbours(slug: string): { prev?: Project; next?: Project } {
  const list = visibleProjects();
  const i = list.findIndex((p) => p.slug === slug);
  const real = (p: Project) => !p.placeholder;
  const step = (dir: 1 | -1) => {
    for (let k = 1; k < list.length; k++) {
      const p = list[(i + dir * k + list.length) % list.length];
      if (real(p) && p.slug !== slug) return p;
    }
    return undefined;
  };
  return { prev: step(-1), next: step(1) };
}

export function blockFigures(b: Block): Figure[] {
  switch (b.kind) {
    case "full":
    case "bleed":
    case "text-figure":
      return [b.figure];
    case "pair":
    case "grid":
      return b.figures;
    default:
      return [];
  }
}

export interface NumberedFigure extends Figure {
  code: string;
  index: number;
}

/**
 * Every figure of a project in reading order, numbered FIG. 01.01, 01.02 …
 * The returned map is keyed by figure object so components can look up numbers.
 */
export function numberFigures(p: Project): { list: NumberedFigure[]; byFigure: Map<Figure, NumberedFigure> } {
  const no = projectNumber(p.slug);
  const figs: Figure[] = [];
  if (p.hero) figs.push(p.hero);
  p.sections.forEach((s) => s.blocks.forEach((b) => figs.push(...blockFigures(b))));
  const list: NumberedFigure[] = [];
  const byFigure = new Map<Figure, NumberedFigure>();
  let n = 0;
  figs.forEach((f) => {
    n += 1;
    const nf: NumberedFigure = { ...f, code: f.number ?? `${no}.${pad(n)}`, index: list.length };
    list.push(nf);
    byFigure.set(f, nf);
  });
  return { list, byFigure };
}

/** Sections in display order with their numbers; Overview always comes first. */
export function projectSections(p: Project): { id: string; number: string; title: string; section?: Section }[] {
  const out = [{ id: "overview", number: "01", title: SECTION_TITLES.overview } as { id: string; number: string; title: string; section?: Section }];
  p.sections.forEach((s) => {
    out.push({ id: s.kind, number: pad(out.length + 1), title: s.title ?? SECTION_TITLES[s.kind], section: s });
  });
  return out;
}

export function pad(n: number) {
  return String(n).padStart(2, "0");
}
