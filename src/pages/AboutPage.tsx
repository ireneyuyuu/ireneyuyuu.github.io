import { about, resume } from "../content/resume";
import { Email, Img, Rule } from "../components/ui";
import { Link } from "../lib/router";

export function AboutPage() {
  const rows: [string, string][] = [
    ["Education", "B.Arch, Syracuse University School of Architecture — expected May 2028; minor in AI in Business Applications"],
    ["Recognition", "Dean’s List, 2023–2026"],
    ["Practice", "MAD Architects, Beijing (2025) · Shenzhen Keyuan Construction Group (2024)"],
    ["Research", "Business Analysis Intern, Tencent (CSIG), Shenzhen (2026)"],
    ["Teaching", "Teaching Assistant, Syracuse University School of Architecture (2025)"],
    ["Languages", "Mandarin (native), English (fluent), Cantonese (conversational); basic Korean and Italian"],
  ];
  return (
    <div className="wrap pt-8 lg:pt-12">
      <p className="t-label text-graphite">About</p>
      <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-12 lg:mt-14">
        <blockquote className="t-display-l col-span-12 lg:col-span-10">“{about.statement}”</blockquote>

        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <Img
            image="petra-ferro-winery/section-a"
            alt="Section perspective through the Petra Ferro Winery stone house"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-auto w-full outline outline-1 -outline-offset-1 outline-rule"
          />
          <p className="t-code mt-3 text-graphite">Petra Ferro Winery, section perspective — Spring 2026</p>
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-6 lg:col-start-7">
          <div className="space-y-4 text-[17px] leading-relaxed">
            {about.paragraphs.map((t, i) => (
              <p key={i} className="max-w-[60ch]">
                {t}
              </p>
            ))}
          </div>
          <dl className="mt-10 border-b border-rule">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-x-4 border-t border-rule py-2.5">
                <dt className="t-label pt-0.5 text-graphite">{k}</dt>
                <dd className="text-[14px] leading-snug">{v}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[7.5rem_1fr] gap-x-4 border-t border-rule py-2.5">
              <dt className="t-label pt-0.5 text-graphite">Contact</dt>
              <dd className="space-y-1 text-[14px]">
                {resume.emails.map((m) => (
                  <div key={m.address}>
                    <Email address={m.address} />
                  </div>
                ))}
              </dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={{ name: "resume" }} className="t-label border border-ink bg-ink px-4 py-3 text-paper transition-colors hover:border-accent hover:bg-accent">
              Read resume →
            </Link>
            <Link to={{ name: "index" }} className="t-label border border-rule px-4 py-3 transition-colors hover:border-ink">
              View projects
            </Link>
          </div>
        </div>
      </div>
      <Rule className="mt-20" />
    </div>
  );
}
