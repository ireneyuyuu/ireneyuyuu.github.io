import type { ReactNode } from "react";
import { resume } from "../content/resume";
import { DownloadButton, Email, Rule } from "../components/ui";
import type { ResumeEntry } from "../lib/types";

function Block({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`cv-${number}`} className="pt-10 lg:pt-14">
      <Rule />
      <div className="grid grid-cols-12 gap-x-6 gap-y-6 pt-5">
        <h2 id={`cv-${number}`} className="t-label col-span-12 flex gap-3 lg:col-span-3">
          <span className="t-code text-graphite">{number} /</span>
          {title}
        </h2>
        <div className="col-span-12 lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}

function Entry({ e }: { e: ResumeEntry }) {
  return (
    <li className="grid grid-cols-1 gap-x-6 gap-y-1 py-5 first:pt-0 md:grid-cols-[11rem_1fr]">
      <div className="t-code text-graphite md:pt-1">
        <div>{e.dates}</div>
        {e.location && <div className="mt-0.5">{e.location}</div>}
      </div>
      <div>
        <h3 className="font-display text-[18px] font-medium leading-snug tracking-[-0.01em]">{e.organization}</h3>
        <p className="text-[14px] text-graphite">
          {e.role}
          {e.kind && <span> · {e.kind}</span>}
        </p>
        {e.unit && <p className="mt-0.5 text-[13px] text-graphite">{e.unit}</p>}
        {e.points && (
          <ul className="mt-3 space-y-2 text-[15px] leading-relaxed">
            {e.points.map((pt, i) => (
              <li key={i} className="grid max-w-[72ch] grid-cols-[1rem_1fr]">
                <span aria-hidden="true" className="text-graphite">
                  –
                </span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function ResumePage() {
  const [main, ...more] = resume.downloads;
  return (
    <div className="cv-root wrap pt-8 lg:pt-12">
      <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8">
        <div className="col-span-12 lg:col-span-8">
          <p className="t-label text-graphite">Resume</p>
          <h1 className="t-display-l mt-4">{resume.name}</h1>
          <p className="t-lead mt-4 max-w-[36ch] text-graphite">{resume.headline}</p>
        </div>
        <div className="col-span-12 flex flex-wrap items-start gap-3 lg:col-span-4 lg:justify-end no-print">
          {main && <DownloadButton file={main.file} filename={main.filename} label={main.label} primary />}
          {more.map((d) => (
            <DownloadButton key={d.file} file={d.file} filename={d.filename} label={d.label} />
          ))}
          {resume.linkedin && (
            <a
              href={resume.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-dl t-label border border-rule px-4 py-3 transition-colors hover:border-ink"
              aria-label="LinkedIn profile (opens in a new tab)"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>

      <Block number="01" title="Profile">
        <p className="max-w-[60ch] text-[17px] leading-relaxed print:text-[14px]">{resume.summary}</p>
        <dl className="mt-6 grid max-w-[60ch] grid-cols-[6.5rem_1fr] gap-x-4 gap-y-2 text-[14px]">
          <div className="contents">
            <dt className="t-label pt-0.5 text-graphite">Location</dt>
            <dd>{resume.location}</dd>
          </div>
          {resume.emails.map((m) => (
            <div key={m.address} className="contents">
              <dt className="t-label pt-0.5 text-graphite">{m.label}</dt>
              <dd>
                <Email address={m.address} />
              </dd>
            </div>
          ))}
          {resume.phone && (
            <div className="contents">
              <dt className="t-label pt-0.5 text-graphite">Phone</dt>
              <dd className="select-all">{resume.phone}</dd>
            </div>
          )}
          {resume.linkedin && (
            <div className="contents">
              <dt className="t-label pt-0.5 text-graphite">LinkedIn</dt>
              <dd>
                <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="underline decoration-rule underline-offset-[0.25em] hover:decoration-ink">
                  {resume.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </dd>
            </div>
          )}
          {resume.portfolioUrl && (
            <div className="contents">
              <dt className="t-label pt-0.5 text-graphite">Portfolio</dt>
              <dd>
                <a href={resume.portfolioUrl} className="underline decoration-rule underline-offset-[0.25em]">
                  {resume.portfolioUrl.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </Block>

      <Block number="02" title="Education">
        <ul className="divide-y divide-rule">
          {resume.education.map((e) => (
            <Entry key={e.organization} e={e} />
          ))}
        </ul>
      </Block>

      <Block number="03" title="Experience">
        <ul className="divide-y divide-rule">
          {resume.experience.map((e) => (
            <Entry key={e.organization + e.role} e={e} />
          ))}
        </ul>
      </Block>

      <Block number="04" title="Skills">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3 print:grid-cols-3 print:gap-y-3">
          {resume.skills.map((s) => (
            <div key={s.group}>
              <dt className="t-label text-graphite">{s.group}</dt>
              <dd className="mt-1.5 text-[15px] leading-relaxed">{s.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block number="05" title="Awards & Activities">
        <ul className="divide-y divide-rule">
          {resume.awards.map((a) => (
            <li key={a.title} className="grid grid-cols-1 gap-x-6 gap-y-1 py-4 first:pt-0 md:grid-cols-[11rem_1fr]">
              <span className="t-code pt-1 text-graphite">{a.dates}</span>
              <span>
                <span className="font-display text-[18px] font-medium tracking-[-0.01em]">{a.title}</span>
                {a.detail && <span className="block text-[14px] text-graphite">{a.detail}</span>}
              </span>
            </li>
          ))}
        </ul>
      </Block>
    </div>
  );
}
