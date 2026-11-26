import type { CSSProperties } from "react";
import { Link } from "../lib/router";
import { projectNumber } from "../lib/portfolio";
import type { Project } from "../lib/types";
import { Img } from "./ui";

/* Literal class names so Tailwind can see them. */
const SPAN: Record<number, string> = {
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  12: "lg:col-span-12",
};

export function ProjectTile({ project, eager = false }: { project: Project; eager?: boolean }) {
  const no = projectNumber(project.slug);
  const { span, aspect } = project.tile;
  const reserved = !!project.placeholder;
  const wide = span === 12;

  const mediaAspect = reserved
    ? `aspect-[5/2] md:aspect-[5/2] ${aspect ? "lg:aspect-[var(--ar)]" : "lg:aspect-auto lg:flex-1 lg:min-h-[180px]"}`
    : aspect
      ? "aspect-[var(--ar)]" // same proportions at every width
      : "aspect-[4/3] lg:aspect-auto lg:flex-1 lg:min-h-[260px]";

  const style = { "--ar": aspect ?? "auto" } as CSSProperties;
  const sizes = `(min-width: 1024px) ${Math.round((span / 12) * 100)}vw, (min-width: 768px) 50vw, 100vw`;

  return (
    <Link
      to={{ name: "project", slug: project.slug }}
      className={`tile group flex flex-col col-span-1 ${wide ? "md:col-span-6" : "md:col-span-3"} ${SPAN[span]}`}
      aria-label={`${no} ${project.title}${reserved ? " (in preparation)" : `, ${project.year ?? ""}`}`}
    >
      <div className={`tile-media ${reserved ? "hatch" : ""} ${mediaAspect}`} style={style}>
        <div className="absolute inset-0 overflow-hidden">
          {!reserved && project.cover.image && (
            <Img
              image={project.cover.image}
              alt={project.cover.alt ?? project.title}
              sizes={sizes}
              eager={eager}
              style={{ objectPosition: project.cover.position ?? "50% 50%", objectFit: project.cover.fit ?? "cover" }}
            />
          )}
          {reserved && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 t-code whitespace-nowrap border border-rule bg-paper px-3 py-1.5 text-graphite">
              In preparation
            </span>
          )}
        </div>
        <span className="tile-crop tl" aria-hidden="true" />
        <span className="tile-crop tr" aria-hidden="true" />
        <span className="tile-crop bl" aria-hidden="true" />
        <span className="tile-crop br" aria-hidden="true" />
        {!reserved && (
          <span className="tile-cta absolute bottom-3 right-3 t-label bg-paper px-2.5 py-1.5 text-ink" aria-hidden="true">
            View project <span className="text-accent">→</span>
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-[2.25rem_1fr_auto] content-start items-baseline gap-x-3 lg:mt-4 lg:min-h-[4.5rem]">
        <span className="tile-num t-code text-graphite">{no}</span>
        <h3 className="tile-title t-title">{project.title}</h3>
        <span className="t-code text-graphite whitespace-nowrap">{reserved ? "—" : project.year}</span>
        <p className="col-start-2 col-span-2 mt-1 t-label text-graphite">
          {project.type}
          <span aria-hidden="true"> · </span>
          {reserved ? "In preparation" : project.location}
        </p>
      </div>
    </Link>
  );
}
