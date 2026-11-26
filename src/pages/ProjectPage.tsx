import { useMemo } from "react";
import { FigureView, GalleryBlock } from "../components/ProjectGallery";
import { ProjectNavigation, SectionNav } from "../components/ProjectNavigation";
import { ViewerProvider } from "../components/DrawingViewer";
import { Rule } from "../components/ui";
import { resolveImage } from "../lib/images";
import { Link } from "../lib/router";
import { categoryNumber, getCategory, getProject, numberFigures, projectNumber, projectSections } from "../lib/portfolio";
import type { Project } from "../lib/types";
import { NotFoundPage } from "./NotFoundPage";

function TitleBlock({ p }: { p: Project }) {
  const cat = getCategory(p.category);
  const rows: [string, string | undefined][] = [
    ["Category", cat?.title],
    ["Type", p.type],
    ["Year", p.placeholder ? "In preparation" : p.term ?? p.year],
    ["Location", p.location],
    ["Context", p.context],
    ["Studio", p.studio && p.studio !== p.type ? p.studio : undefined],
    ["Course", p.course],
    ["Organization", p.organization],
    ["Instructor", p.instructor],
    ["Role", p.role],
    ["Team", p.team],
  ];
  return (
    <dl className="border-b border-rule">
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div key={k} className="grid grid-cols-[7rem_1fr] gap-x-4 border-t border-rule py-2">
            <dt className="t-label pt-px text-graphite">{k}</dt>
            <dd className="text-[13px] leading-snug">{v}</dd>
          </div>
        ))}
    </dl>
  );
}

function SectionHeader({ number, title, count }: { number: string; title: string; count?: number }) {
  return (
    <>
      <Rule />
      <div className="flex items-baseline justify-between gap-4 pb-8 pt-4 lg:pb-12">
        <h2 className="flex items-baseline gap-4">
          <span className="t-code text-graphite">{number} /</span>
          <span className="font-display text-[clamp(1.4rem,1.05rem+1.1vw,2.2rem)] font-medium leading-tight tracking-[-0.02em]">{title}</span>
        </h2>
        {count !== undefined && count > 0 && (
          <span className="t-code text-graphite">
            {String(count).padStart(2, "0")} {count === 1 ? "figure" : "figures"}
          </span>
        )}
      </div>
    </>
  );
}

export function ProjectPage({ slug }: { slug: string }) {
  const p = getProject(slug);
  const numbered = useMemo(() => (p ? numberFigures(p) : null), [p]);
  const sections = useMemo(() => (p ? projectSections(p) : []), [p]);
  if (!p || !numbered) return <NotFoundPage />;

  const no = projectNumber(p.slug);
  const cat = getCategory(p.category);
  const realFigures = numbered.list.filter((f) => f.image && !f.placeholder).length;
  const heroImg = resolveImage(p.hero?.image);
  const heroIsRender = /render|perspective|photo/i.test(p.hero?.type ?? "") && !!heroImg && heroImg.width / heroImg.height >= 1.3;

  return (
    <ViewerProvider figures={numbered.list} byFigure={numbered.byFigure}>
      <article>
        <header className="wrap pt-8 lg:pt-12">
          <nav aria-label="Breadcrumb" className="t-label flex flex-wrap gap-x-2 text-graphite">
            <Link to={{ name: "index" }} className="hover:text-ink">
              Index
            </Link>
            <span aria-hidden="true">/</span>
            <span>
              {categoryNumber(p.category)} {cat?.title}
            </span>
            <span aria-hidden="true">/</span>
            <span className="text-ink">Project {no}</span>
          </nav>
          <div className="mt-8 grid grid-cols-12 items-end gap-x-6 gap-y-10 lg:mt-16">
            <div className="col-span-12 lg:col-span-8">
              <p className="t-code text-graphite">Project {no}</p>
              <h1 className="t-display-xl mt-3" style={p.title.length > 28 ? { fontSize: "clamp(2.3rem, 1.3rem + 4vw, 5.6rem)" } : undefined}>
                {p.title}
              </h1>
              <p className="t-lead mt-5 max-w-[34ch] text-graphite lg:mt-7">{p.subtitle}</p>
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-4">
              <TitleBlock p={p} />
            </div>
          </div>
        </header>

        <div className="mt-10 lg:mt-16">
          <SectionNav items={sections} figureCount={realFigures} />
        </div>

        <div className="wrap">
          <section id="sec-overview" className="scroll-mt-[calc(var(--header-h)+64px)] pt-10 lg:pt-16">
            <SectionHeader number="01" title="Overview" />
            <div className="grid grid-cols-12 gap-x-6 gap-y-8">
              {p.concept && <p className="t-lead col-span-12 lg:col-span-5">{p.concept}</p>}
              <div className={`col-span-12 space-y-4 text-[16px] leading-[1.7] lg:col-span-6 ${p.concept ? "lg:col-start-7" : "lg:col-start-5"}`}>
                {p.statement.map((t, i) => (
                  <p key={i} className="max-w-[66ch]">
                    {t}
                  </p>
                ))}
                {p.keywords && p.keywords.length > 0 && (
                  <ul className="flex flex-wrap gap-2 pt-3" aria-label="Keywords">
                    {p.keywords.map((k) => (
                      <li key={k} className="t-label border border-rule px-2.5 py-1 text-graphite">
                        {k}
                      </li>
                    ))}
                  </ul>
                )}
                {p.credit && <p className="t-code pt-2 text-graphite">{p.credit}</p>}
              </div>
            </div>

            {p.hero && (
              <div className="mt-14 lg:mt-20">
                <FigureView fig={p.hero} layout={heroIsRender ? "bleed" : "full"} eager />
              </div>
            )}

            {p.placeholder && (
              <div className="hatch mt-14 flex aspect-[16/6] items-center justify-center outline outline-1 -outline-offset-1 outline-rule lg:mt-20">
                <p className="max-w-[40ch] border border-rule bg-paper px-5 py-4 text-center text-[14px] leading-relaxed">
                  <span className="t-code block text-graphite">In preparation</span>
                  Drawings and project text will be added here.
                </p>
              </div>
            )}
          </section>

          {sections.slice(1).map((s) => {
            const figs = s.section!.blocks.reduce((n, b) => n + ("figures" in b ? b.figures.length : "figure" in b ? 1 : 0), 0);
            return (
              <section key={s.id} id={`sec-${s.id}`} className="scroll-mt-[calc(var(--header-h)+64px)] pt-16 lg:pt-24">
                <SectionHeader number={s.number} title={s.title} count={figs} />
                {s.section!.intro && <p className="mb-10 max-w-[66ch] text-[16px] leading-relaxed text-graphite">{s.section!.intro}</p>}
                <div className="space-y-16 lg:space-y-24">
                  {s.section!.blocks.map((b, i) => (
                    <GalleryBlock key={i} block={b} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <ProjectNavigation slug={p.slug} />
      </article>
    </ViewerProvider>
  );
}
