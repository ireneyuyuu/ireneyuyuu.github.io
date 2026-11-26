import { useEffect } from "react";
import { Footer, Header } from "./components/Header";
import { pageMeta } from "./lib/meta";
import { RouterProvider, routeKey, useRouter, type Route } from "./lib/router";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { IndexPage } from "./pages/IndexPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectPage } from "./pages/ProjectPage";
import { ResumePage } from "./pages/ResumePage";

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case "index": return <IndexPage />;
    case "about": return <AboutPage />;
    case "contact": return <ContactPage />;
    case "resume": return <ResumePage />;
    case "project": return <ProjectPage slug={route.slug} />;
    default: return <NotFoundPage />;
  }
}

function Shell() {
  const { route, navCount } = useRouter();

  useEffect(() => {
    if (navCount > 0) {
      document.title = pageMeta(route).title;
      // move focus to the new page for keyboard and screen-reader users
      document.getElementById("main")?.focus({ preventScroll: true });
    }
  }, [route, navCount]);

  const skip = () => document.getElementById("main")?.focus();

  return (
    <>
      <button
        type="button"
        onClick={skip}
        className="t-label fixed left-3 top-3 z-[70] -translate-y-24 bg-ink px-3 py-2 text-paper focus:translate-y-0"
      >
        Skip to content
      </button>
      <Header />
      <main id="main" tabIndex={-1} key={routeKey(route)} className={`outline-none ${navCount > 0 ? "page-enter" : ""}`}>
        <Page route={route} />
      </main>
      <Footer />
    </>
  );
}

export function App({ initial }: { initial: Route }) {
  return (
    <RouterProvider initial={initial}>
      <Shell />
    </RouterProvider>
  );
}
