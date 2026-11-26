import type { Category } from "../lib/types";

/* ──────────────────────────────────────────────────────────────
   Site-wide settings. Edit freely.
   ────────────────────────────────────────────────────────────── */

export const site = {
  name: "Irene (Yuhan) Zhang",
  /** Short line beside the name in the header. */
  tagline: "Architecture / Selected Works",
  /** Used in <title> and search results. */
  description:
    "Architecture portfolio of Irene (Yuhan) Zhang, B.Arch candidate at Syracuse University School of Architecture: a dog adoption and care institution, a winery, housing, landscape and public-infrastructure projects, 2024–2026.",
  /**
   * Your public address once deployed, e.g. "https://ireneyuhanzhang.com".
   * Enables canonical links, social previews, sitemap.xml and robots.txt.
   */
  siteUrl: "https://ireneyuyuu.github.io",
  /**
   * Set when the site lives in a sub-folder, e.g. "/portfolio" for
   * https://username.github.io/portfolio/. Leave "" for a root domain.
   */
  basePath: "",
  /**
   * Reserved "in preparation" tiles for projects that don't have images yet.
   * Set to false before you share the site if you'd rather hide them.
   */
  showPlaceholders: true,
  /** Range shown on the index. */
  years: "2024–2026",
  email: "yzhan654@syr.edu",
  /** Shown in the header, footer and on the resume page. Leave "" to hide. */
  linkedin: "https://www.linkedin.com/in/yuhanzhangirene/",
};

/**
 * Primary categories (chapters of the index), in display order.
 * Add a new object here to add a chapter; then set `category` on projects.
 */
export const categories: Category[] = [
  {
    id: "academic",
    title: "Academic Work",
    navLabel: "Academic Works",
    description: "Design studios at Syracuse University School of Architecture.",
  },
  {
    id: "professional",
    title: "Professional Work",
    navLabel: "Professional Works",
    description: "Internships and work carried out in architectural practice.",
  },
  {
    id: "independent",
    title: "Independent Work",
    navLabel: "Independent Works",
    description: "Self-initiated research, competitions and computational studies.",
  },
];
