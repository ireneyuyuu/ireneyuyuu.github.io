import { Link } from "../lib/router";

export function NotFoundPage() {
  return (
    <div className="wrap pt-16 lg:pt-28">
      <p className="t-code text-graphite">404</p>
      <h1 className="t-display-l mt-4">This sheet isn’t in the set.</h1>
      <p className="mt-5 max-w-[48ch] text-[16px] text-graphite">The page you asked for doesn’t exist or has moved.</p>
      <Link to={{ name: "index" }} className="t-label mt-8 inline-block border border-ink px-4 py-3 hover:bg-ink hover:text-paper">
        ← Back to index
      </Link>
    </div>
  );
}
