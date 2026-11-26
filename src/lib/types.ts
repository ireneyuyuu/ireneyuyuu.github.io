/* ──────────────────────────────────────────────────────────────
   Portfolio data model
   Portfolio → Category → Project → Section → Block → Figure
   Everything on the site is rendered from these structures.
   ────────────────────────────────────────────────────────────── */

export interface Category {
  /** Used in URLs and anchors. Lower-case, no spaces. */
  id: string;
  title: string;
  /** One line shown beside the category title on the index. */
  description?: string;
  /** Label in the top navigation, e.g. "Academic Works". */
  navLabel?: string;
}

/**
 * A single drawing, rendering, diagram or photo.
 *
 * `image` is either
 *   • a key in src/content/image-manifest.json, e.g. "petra-ferro-winery/section-a"
 *     (created by `npm run images`; gives responsive sizes + a full-res file), or
 *   • a direct path to a file in /public, e.g. "/images/misc/model-photo.jpg".
 */
export interface Figure {
  image?: string;
  title: string;
  /** Drawing type, shown in small caps: "Section", "Floor plan", "Rendering"… */
  type?: string;
  /** "1:200", "Graphic scale 0–10 m" … */
  scale?: string;
  /** One or two sentences under the drawing. */
  caption?: string;
  /** Who made it, for team projects, e.g. "Drawing: Boang Zhang". */
  credit?: string;
  /** Alt text. Defaults to title + caption. */
  alt?: string;
  /** Override the automatic figure number ("FIG. 01.03"). */
  number?: string;
  /** Marks a reserved slot whose image hasn't been added yet. */
  placeholder?: boolean;
  /** Only needed for direct-path images (manifest images know their size). */
  width?: number;
  height?: number;
}

/** How figures are arranged inside a section. */
export type Block =
  /** One drawing across the content width. Never cropped. */
  | { kind: "full"; figure: Figure }
  /** Edge-to-edge image for renderings and atmospheric views. */
  | { kind: "bleed"; figure: Figure }
  /** Two related drawings side by side. */
  | { kind: "pair"; figures: [Figure, Figure] }
  /** A grid of 2 or 3 columns. */
  | { kind: "grid"; columns?: 2 | 3; figures: Figure[] }
  /** Explanatory text beside a drawing. */
  | { kind: "text-figure"; heading?: string; text: string[]; figure: Figure; side?: "left" | "right" }
  /** Text only. */
  | { kind: "text"; heading?: string; text: string[] };

/**
 * Project page sections. List them in this order:
 * site-plan → plans → sections → diagrams → axonometrics → renderings
 * (research / drawings / visualization / models are also available).
 */
export type SectionKind =
  | "overview"
  | "site-plan"
  | "plans"
  | "sections"
  | "diagrams"
  | "axonometrics"
  | "renderings"
  | "research"
  | "drawings"
  | "visualization"
  | "models";

export interface Section {
  kind: SectionKind;
  /** Defaults to the standard title for the kind. */
  title?: string;
  intro?: string;
  blocks: Block[];
}

export interface TileLayout {
  /** Columns on the 12-column desktop grid: 3–12. */
  span: 3 | 4 | 5 | 6 | 7 | 8 | 12;
  /**
   * Desktop aspect ratio of the cover, e.g. "16/10".
   * Leave it out to let the tile stretch to the height of the tallest tile in its row.
   */
  aspect?: string;
}

export interface Project {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  /** Short title used in tight spaces (project navigation). */
  shortTitle?: string;
  type: string;
  year?: string;
  /** e.g. "Spring 2026" — shown on the project page. */
  term?: string;
  location: string;
  /** "Academic studio", "Internship project" … */
  context: string;
  studio?: string;
  course?: string;
  instructor?: string;
  organization?: string;
  role?: string;
  /** "Individual" or "Team — with …". Leave out if you'd rather not say. */
  team?: string;
  keywords?: string[];
  /** Project statement paragraphs. */
  statement: string[];
  /** One-line design concept, set larger than the statement. */
  concept?: string;
  /** Credit line for professional work, shown under the statement. */
  credit?: string;
  cover: { image?: string; position?: string; fit?: "cover" | "contain"; alt?: string };
  /** Large image under the project header. Leave out to skip. */
  hero?: Figure;
  tile: TileLayout;
  sections: Section[];
  /** Reserved project whose content is still being prepared. */
  placeholder?: boolean;
}

export interface ResumeEntry {
  organization: string;
  role: string;
  location?: string;
  dates: string;
  kind?: string;
  /** Department or group, shown under the role. */
  unit?: string;
  points?: string[];
}

export interface Resume {
  name: string;
  headline: string;
  summary: string;
  location: string;
  emails: { label: string; address: string }[];
  phone?: string;
  portfolioUrl?: string;
  linkedin?: string;
  education: ResumeEntry[];
  experience: ResumeEntry[];
  skills: { group: string; items: string[] }[];
  awards: { title: string; detail?: string; dates?: string }[];
  /** Files in /public/documents. The first one is the main download. */
  downloads: { label: string; file: string; filename: string }[];
}
