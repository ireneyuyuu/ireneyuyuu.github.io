import { resume } from "../content/resume";
import { DownloadButton, Email, Rule } from "../components/ui";
import { Link } from "../lib/router";

export function ContactPage() {
  const [school, ...others] = resume.emails;
  const cv = resume.downloads[0];
  return (
    <div className="wrap pt-8 lg:pt-12">
      <p className="t-label text-graphite">Contact</p>
      <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-12 lg:mt-14">
        <div className="col-span-12 lg:col-span-8">
          <h1 className="t-display-l break-words">{school?.address}</h1>
          <p className="t-lead mt-5 max-w-[34ch] text-graphite">{resume.name} · Syracuse University School of Architecture</p>
        </div>

        <dl className="col-span-12 border-b border-rule md:col-span-8 lg:col-span-5 lg:col-start-8">
          {school && (
            <div className="grid grid-cols-[7.5rem_1fr] gap-x-4 border-t border-rule py-3">
              <dt className="t-label pt-0.5 text-graphite">{school.label} email</dt>
              <dd className="text-[15px]">
                <Email address={school.address} />
              </dd>
            </div>
          )}
          {others.map((m) => (
            <div key={m.address} className="grid grid-cols-[7.5rem_1fr] gap-x-4 border-t border-rule py-3">
              <dt className="t-label pt-0.5 text-graphite">{m.label} email</dt>
              <dd className="text-[15px]">
                <Email address={m.address} />
              </dd>
            </div>
          ))}
          {resume.linkedin && (
            <div className="grid grid-cols-[7.5rem_1fr] gap-x-4 border-t border-rule py-3">
              <dt className="t-label pt-0.5 text-graphite">LinkedIn</dt>
              <dd className="text-[15px]">
                <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="underline decoration-rule underline-offset-[0.25em] hover:decoration-ink">
                  {resume.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} ↗
                </a>
              </dd>
            </div>
          )}
          <div className="grid grid-cols-[7.5rem_1fr] gap-x-4 border-t border-rule py-3">
            <dt className="t-label pt-0.5 text-graphite">Location</dt>
            <dd className="text-[15px]">{resume.location}</dd>
          </div>
        </dl>

        <div className="col-span-12 flex flex-wrap gap-3 lg:col-span-5 lg:col-start-8">
          <Link to={{ name: "resume" }} className="t-label border border-ink bg-ink px-4 py-3 text-paper transition-colors hover:border-accent hover:bg-accent">
            Read resume →
          </Link>
          {cv && <DownloadButton file={cv.file} filename={cv.filename} label={cv.label} />}
        </div>
      </div>
      <Rule className="mt-20" />
    </div>
  );
}
