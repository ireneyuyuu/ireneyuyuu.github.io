import { categoryNumber, categoryProjects } from "../lib/portfolio";
import type { Category } from "../lib/types";
import { ProjectTile } from "./ProjectTile";
import { Rule } from "./ui";

export function yearRange(categoryId: string) {
  const years = categoryProjects(categoryId)
    .filter((p) => !p.placeholder && p.year)
    .map((p) => Number(p.year));
  if (!years.length) return "In preparation";
  const lo = Math.min(...years);
  const hi = Math.max(...years);
  return lo === hi ? String(lo) : `${lo}–${hi}`;
}

/** One chapter of the index: numbered header + its grid of project tiles. */
export function CategorySection({ category, first = false }: { category: Category; first?: boolean }) {
  const projects = categoryProjects(category.id);
  const num = categoryNumber(category.id);
  const count = projects.length;
  return (
    <section id={`chapter-${category.id}`} aria-labelledby={`chapter-${category.id}-title`} className="scroll-mt-[calc(var(--header-h)+16px)] pt-14 lg:pt-24">
      <Rule ink />
      <div className="grid grid-cols-12 items-end gap-x-6 gap-y-4 pb-8 pt-5 lg:pb-12 lg:pt-6">
        <div className="col-span-12 flex items-baseline gap-4 lg:col-span-8 lg:gap-6">
          <span className="t-code text-graphite">{num} /</span>
          <h2 id={`chapter-${category.id}-title`} className="t-display-l">
            {category.title}
          </h2>
        </div>
        <div className="col-span-12 flex items-baseline justify-between gap-6 text-[13px] leading-snug text-graphite lg:col-span-4 lg:justify-end">
          {category.description && <p className="max-w-[38ch] lg:text-right">{category.description}</p>}
          <span className="t-code whitespace-nowrap">
            {String(count).padStart(2, "0")} {count === 1 ? "project" : "projects"}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-y-10 md:grid-cols-6 md:gap-x-6 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-14">
        {projects.map((p, i) => (
          <ProjectTile key={p.slug} project={p} eager={first && i < 2} />
        ))}
      </div>
    </section>
  );
}
