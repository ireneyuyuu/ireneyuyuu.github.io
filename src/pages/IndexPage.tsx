import { site } from "../content/site";
import { CategorySection } from "../components/CategorySection";
import { visibleCategories } from "../lib/portfolio";

/** The landing page: a visual table of contents, one chapter per category. */
export function IndexPage() {
  const cats = visibleCategories();
  return (
    <div className="wrap">
      <div className="pt-8 lg:pt-14">
        <h1 className="t-label text-graphite">
          Index <span aria-hidden="true">—</span> Selected Works {site.years}
        </h1>
        <p className="t-lead mt-4 [text-wrap:pretty]">Projects on the relationship between space, sequence and nature.</p>
      </div>
      {cats.map((c, i) => (
        <CategorySection key={c.id} category={c} first={i === 0} />
      ))}
    </div>
  );
}
