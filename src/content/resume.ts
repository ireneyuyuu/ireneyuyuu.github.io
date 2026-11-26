import type { Resume } from "../lib/types";

/* ──────────────────────────────────────────────────────────────
   RESUME — matches Yuhan_Irene_Zhang_Resume.pdf (Nov 2026).
   Edit any line here; the /resume page and the PDF are separate,
   so replace /public/documents/*.pdf when you update the PDF.
   ────────────────────────────────────────────────────────────── */

export const resume: Resume = {
  name: "Irene (Yuhan) Zhang",
  headline: "Architecture student, Syracuse University — design, visualization and data-driven research",
  summary:
    "B.Arch candidate with a minor in AI in Business Applications, working across architectural design, visualization and business research. Internship experience at Tencent in Shenzhen, MAD Architects in Beijing and Shenzhen Keyuan Construction Group.",
  location: "Syracuse, New York · Shenzhen, China",
  emails: [
    { label: "School", address: "yzhan654@syr.edu" },
    { label: "Personal", address: "ireneyuhanz@outlook.com" },
  ],
  /** Left empty so the number isn't on the public website. Type a number between the quotes to show it again. */
  phone: "",
  /** Add your live site address once deployed. */
  portfolioUrl: "",
  linkedin: "https://www.linkedin.com/in/yuhanzhangirene/",

  education: [
    {
      organization: "Syracuse University School of Architecture",
      role: "Bachelor of Architecture (B.Arch.)",
      location: "Syracuse, New York",
      dates: "Expected May 2028",
      points: ["Minor in AI in Business Applications"],
    },
    {
      organization: "Shenzhen Senior High School (Group), Central Campus",
      role: "High school diploma",
      location: "Shenzhen, China",
      dates: "Graduated June 2023",
    },
  ],

  experience: [
    {
      organization: "Tencent",
      role: "Business Analysis Intern",
      unit: "Cloud and Smart Industries Group (CSIG) · Strategic Accounts Department, Ecosystem Operations Center",
      location: "Shenzhen, China",
      dates: "May – Aug 2026",
      points: [
        "Independently designed and built two data-driven systems to consolidate fragmented client and industry intelligence and support faster updates.",
        "Prototyped a company intelligence website covering business segments, financial performance, organizational structure and news, with direct links to original sources.",
        "Evaluated AI tools and documented their potential applications in business research workflows.",
      ],
    },
    {
      organization: "Syracuse University School of Architecture",
      role: "Teaching Assistant",
      location: "Syracuse, New York",
      dates: "Aug – Dec 2025",
      points: [
        "Led 50+ one-on-one tutoring sessions in digital modeling, drawing and visualization for architecture students.",
        "Coordinated with instructors to support design workshops and troubleshoot student projects.",
      ],
    },
    {
      organization: "MAD Architects",
      role: "Press & Architectural Design Intern",
      location: "Beijing, China",
      dates: "May – Aug 2025",
      points: [
        "Wrote, edited and published bilingual WeChat content and standardized the layout of project and award announcements.",
        "Prepared bilingual press materials and presentations for the Fenix Museum and the Venice Architecture Biennale; edited forum videos and created closed captions for publication.",
        "Produced diagrams and refined renderings for the Shenzhen ByteDance Headquarters competition and the Shaoxing Cultural Arts Center project.",
      ],
    },
    {
      organization: "Qingmu International Art Studio",
      role: "Teaching Assistant",
      location: "Shenzhen, China",
      dates: "Jun – Aug 2024",
      points: ["Mentored three architecture applicants from concept development through completion of their portfolios."],
    },
    {
      organization: "Shenzhen Keyuan Construction Group",
      role: "Design Intern",
      location: "Shenzhen, China",
      dates: "May – Jun 2024",
      points: ["Used Rhino and SketchUp to help produce curtain-wall renderings for a residential project."],
    },
  ],

  skills: [
    { group: "Business analysis", items: ["Company and industry research", "Competitive analysis", "AI tool evaluation"] },
    { group: "Design & media", items: ["Adobe Illustrator", "Photoshop", "InDesign", "Rhino", "SketchUp", "CapCut"] },
    { group: "Languages", items: ["Mandarin (native)", "English (fluent)", "Cantonese (conversational)", "Korean (basic)", "Italian (basic)"] },
    { group: "Interests", items: ["Photography", "Skiing", "Dance"] },
  ],

  awards: [
    { title: "Dean’s List", detail: "Syracuse University School of Architecture", dates: "2023 – 2026" },
  ],

  downloads: [
    { label: "Download CV", file: "documents/Yuhan_Irene_Zhang_Resume.pdf", filename: "Yuhan_Irene_Zhang_Resume.pdf" },
    { label: "中文简历", file: "documents/Irene-Zhang-CV-ZH.pdf", filename: "Irene-Zhang-CV-Chinese.pdf" },
  ],
};

/** Text for the About page. */
export const about = {
  statement:
    "In my design, I am especially interested in the relationship between space, sequence and nature.",
  paragraphs: [
    "I am an architecture student at Syracuse University School of Architecture, completing a Bachelor of Architecture expected in May 2028.",
    "This site collects selected studio work from 2024 to 2026 — a dog adoption and care institution on Governors Island, a winery in Ticino, collective housing and a recreation center in Syracuse, and a performance landscape at Epidaurus — alongside work from my internship at MAD Architects.",
  ],
};
