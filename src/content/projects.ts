import type { Project } from "../lib/types";

/* ──────────────────────────────────────────────────────────────
   PROJECTS
   • Order in this list = order on the index (within each category).
   • Project numbers (01, 02 …) and figure numbers (FIG. 01.03) are
     generated from that order, so reordering renumbers automatically.
   • `image` values are keys from image-manifest.json — see README.
   ────────────────────────────────────────────────────────────── */

export const projects: Project[] = [
  /* ═════════════════════════ ACADEMIC ═════════════════════════ */
  {
    slug: "civic-house-of-care",
    category: "academic",
    title: "The Civic House of Care",
    shortTitle: "Civic House of Care",
    subtitle: "A public dog adoption and care institution in the historic houses of Nolan Park",
    type: "Civic Institution",
    year: "2026",
    term: "Fall 2026",
    location: "Nolan Park, Governors Island, New York",
    context: "Academic studio",
    organization: "Syracuse University School of Architecture",
    instructor: "Matthew Storrie",
    team: "Team — with Chang Cui and Boang Zhang",
    keywords: ["Adaptive reuse", "Human–dog relationship", "Pitched roof", "Landscape", "Care"],
    concept:
      "Rather than eliminating boundaries between humans and dogs, the project uses architecture to make those boundaries visible, understandable and protective.",
    statement: [
      "Our project transforms the historic houses of Nolan Park on Governors Island into a public dog adoption and care institution. We begin by examining the island through its existing infrastructure, including access, labor and maintenance. We then explore domesticity and domestication, questioning how humans have historically shaped environments for animals. This leads us to reconsider the human–dog relationship and how architecture can accommodate both human and canine needs.",
      "The institution brings together adoption, education, workshops, community dining, a market, a stadium, kennels and protected canine spaces. Through front-of-house, shared and back-of-house programs, we establish different levels of public access, participation and care.",
      "Our design develops through two architectural languages: pitched roof and landscape. The pitched roof extends the existing domestic typology into new structures that create thresholds, circulation and opportunities for observation. The landscape connects the historic houses while supporting canine movement, play and shared occupation.",
      "Together, these strategies transform a domestic environment into a collective infrastructure of care, establishing public trust through shared experience and responsible care.",
    ],
    cover: { image: "civic-house-of-care/cover", position: "50% 50%", alt: "Oblique drawing: Nolan Park houses with red pitched-roof canopies above the new glazed hall" },
    tile: { span: 4, aspect: "1/1" },
    sections: [
      {
        kind: "plans",
        blocks: [
          {
            kind: "text-figure",
            heading: "Ground floor",
            text: [
              "The historic houses, the new structures between them and the landscape, with people and dogs drawn in red.",
            ],
            figure: {
              image: "civic-house-of-care/plan",
              title: "Ground floor plan",
              type: "Floor plan",
              credit: "Drawing: Boang Zhang",
            },
          },
        ],
      },
      {
        kind: "sections",
        title: "Oblique Section",
        blocks: [
          {
            kind: "text-figure",
            heading: "Reading the oblique",
            text: [
              "The oblique drawing moves across Nolan Park in four bands. New pitched-roof structures, drawn in red, stand beside the existing houses.",
              "Framed vignettes look inside the programs: dining, the market, workshops, training, the stadium and the rooms where visitors meet the dogs.",
            ],
            figure: {
              image: "civic-house-of-care/oblique-sheet",
              title: "Oblique section — Nolan Park",
              type: "Oblique drawing",
            },
          },
        ],
      },
      {
        kind: "axonometrics",
        blocks: [
          {
            kind: "pair",
            figures: [
              {
                image: "civic-house-of-care/axon-site",
                title: "Exploded site axonometric — roofs and program above Nolan Park",
                type: "Exploded axonometric",
                caption: "The new roofs and program are lifted above the site, with dashed lines tying them back to the historic houses.",
                credit: "Drawing: Chang Cui",
              },
              {
                image: "civic-house-of-care/axon-materials",
                title: "Exploded axonometrics — structure and materials",
                type: "Exploded axonometric",
                caption: "1 Glass · 2 Oak wood · 3 Steel · 4 Preserved wood · 5 Vinyl floor · 6 Corrugated clear sheet · 7 Concrete · 8 Steel core.",
                credit: "Drawing: Boang Zhang",
              },
            ],
          },
        ],
      },
      {
        kind: "renderings",
        blocks: [
          {
            kind: "pair",
            figures: [
              {
                image: "civic-house-of-care/rendering",
                title: "Interior — the dog lawn beneath the pitched-roof hall",
                type: "Rendering",
                caption: "Visitors watch from the stair and landing while dogs occupy the planted ground below.",
              },
              {
                image: "civic-house-of-care/render-exterior",
                title: "Exterior — the planted roof between two historic houses",
                type: "Rendering",
                caption: "A wave-shaped planted roof on steel supports spans between two of the houses; visitors and dogs share the paths and lawn below.",
                credit: "Rendering: Chang Cui",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "petra-ferro-winery",
    category: "academic",
    title: "Petra Ferro Winery",
    subtitle: "A winery and interpretive museum in a historic stone settlement",
    type: "Winery Design",
    year: "2026",
    term: "Spring 2026",
    location: "Borgo Lodano, Ticino, Switzerland",
    context: "Academic studio",
    organization: "Syracuse University School of Architecture",
    instructor: "Luca Poinsi",
    team: "Team — with Annie (Zheyuan) Lu and Sum (Yue) Yu",
    keywords: ["Adaptive reuse", "Viticulture", "Stone", "Timber", "Steel"],
    concept:
      "A dialogue of old and new: two production lines, one artisanal and one mechanized, carry visitors from heritage craft to modern industry.",
    statement: [
      "This project centers on the dialogue of old and new, reimagining a historic rural site in Ticino’s wine-growing landscape as a dual-purpose winery and interpretive museum. The renovation preserves the region’s agricultural heritage while activating two distinct production lines: a traditional artisanal facility honoring Ticino’s small-scale viticultural roots, and a streamlined, mechanized line for contemporary winemaking.",
      "The design juxtaposes weathered stone structures and modern interventions (concrete, glass and open circulation) to frame visitor experiences, guiding guests through the full narrative of wine production, from heritage craft to modern industry. The result is an architectural manifestation of Ticino’s evolving rural identity: rooted in tradition, yet dynamic, adaptive, and open to public engagement.",
    ],
    cover: { image: "petra-ferro-winery/cover", position: "50% 50%", alt: "Section perspective through the stone house, tasting room and barrel cellar" },
    tile: { span: 4, aspect: "1/1" },
    sections: [
      {
        kind: "site-plan",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "petra-ferro-winery/site-plan",
              title: "Site plan — Borgo Lodano and the valley",
              type: "Site plan",
              caption: "The valley slope with its contours, the vineyard terraces, the river and the village; the winery sits at the foot of the terraces.",
            },
          },
        ],
      },
      {
        kind: "plans",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "petra-ferro-winery/plan-ground",
              title: "Ground floor plan",
              type: "Floor plan",
              scale: "Graphic scale 0–10 m",
              caption: "1 Shop & reception · 2 Pantry · 3 Toilet · 4 Exhibition area · 5 Check-in room · 6 Control room · 7 Sorting · 8 Storage · 9 Machinery room · 10 Fermentation.",
            },
          },
          {
            kind: "full",
            figure: {
              image: "petra-ferro-winery/plan-underground",
              title: "Underground floor plan",
              type: "Floor plan",
              scale: "Graphic scale 0–10 m",
              caption: "1 Industrial wine aging area · 2 Traditional wine aging area · 3 Tasting room · 4 Traditional wine production room · 5 Storage · 6 Bottling room · 7 Fermentation room.",
            },
          },
        ],
      },
      {
        kind: "sections",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "petra-ferro-winery/section-perspective",
              title: "Section A — mechanized production hall and stone house",
              type: "Section",
              scale: "Graphic scale 0–10 m",
              caption: "Fermentation tanks under the new steel roof on the left; the renovated stone house and cellar on the right.",
            },
          },
          {
            kind: "full",
            figure: {
              image: "petra-ferro-winery/section-b",
              title: "Section B — longitudinal section through the production wing",
              type: "Section",
              scale: "Graphic scale 0–10 m",
              caption: "The glazed gallery (left) and the steel-roofed production wing (right), with rooms below grade.",
            },
          },
          {
            kind: "full",
            figure: {
              image: "petra-ferro-winery/section-a",
              title: "Section perspective — stone house, tasting room and barrel cellar",
              type: "Section perspective",
              scale: "Graphic scale 0–10 m",
              caption: "The tasting room inside the stone house, the barrel cellar below it, and a glazed gallery under the extended roof.",
            },
          },
        ],
      },
      {
        kind: "axonometrics",
        blocks: [
          {
            kind: "text-figure",
            heading: "Old and new structure",
            text: [
              "The exploded axonometric separates the project into its layers: the traditional stone roof, new wood columns and beams, a new steel structure, the existing stone house and the renovated underground space.",
            ],
            figure: {
              image: "petra-ferro-winery/structure-axon",
              title: "Exploded axonometric — structural layers",
              type: "Exploded axonometric",
              caption: "Traditional stone roof · new wood columns and beams · new steel structure · existing stone house · renovated underground space.",
            },
          },
          {
            kind: "pair",
            figures: [
              {
                image: "petra-ferro-winery/detail-steel",
                title: "Detail — steel roof, column and glazing",
                type: "Axonometric detail",
                caption: "Corrugated steel roof panel on steel beams; H-section column on an anchored base plate; steel window frame with double glazing; slab build-up on crushed-stone sub-base.",
              },
              {
                image: "petra-ferro-winery/detail-timber",
                title: "Detail — stone roof, timber frame and existing wall",
                type: "Axonometric detail",
                caption: "Stone roof on secondary wood beams and planks; birdsmouth rafter, purlin and beam fixed with reinforcement timber screws; new slab set on the existing stone low wall.",
              },
            ],
          },
        ],
      },
      {
        kind: "renderings",
        blocks: [
          {
            kind: "pair",
            figures: [
              {
                image: "petra-ferro-winery/render-production",
                title: "Interior — mechanized production hall",
                type: "Rendering",
              },
              {
                image: "petra-ferro-winery/render-lounge",
                title: "Interior — stone house lounge and mezzanine",
                type: "Rendering",
              },
            ],
          },
          {
            kind: "full",
            figure: {
              image: "petra-ferro-winery/persp-panorama",
              title: "Perspective — from the catwalk above the fermentation tanks to the ramped route into the stone house",
              type: "Perspective",
            },
          },
        ],
      },
    ],
  },

  {
    slug: "urban-housing-collective",
    category: "academic",
    title: "Urban Housing Collective",
    subtitle: "Housing as a generator of urban form",
    type: "Housing Design",
    year: "2025",
    term: "Fall 2025",
    location: "Syracuse, New York",
    context: "Academic studio",
    organization: "Syracuse University School of Architecture",
    instructor: "Elizabeth N Kamell",
    keywords: ["Collective living", "Thresholds", "Urban form"],
    statement: [
      "This project explores housing as a generator of urban form within Syracuse’s evolving context. Organized around shared open spaces, the design balances collective living and private dwelling. Circulation extends the logic of the street, creating layered thresholds between public and private domains.",
      "Through simple materials and clear spatial organization, the project positions housing as both social infrastructure and an active contributor to the city’s form and life.",
    ],
    cover: { image: "urban-housing-collective/cover", position: "55% 50%", alt: "Downtown Syracuse figure-ground with the site plan and the housing tower in section" },
    tile: { span: 4, aspect: "1/1" },
    sections: [
      {
        kind: "drawings",
        title: "Composite Super Drawing",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "urban-housing-collective/board",
              title: "Composite super drawing — downtown Syracuse",
              type: "Composite super drawing",
              caption: "Downtown Syracuse figure-ground with the site, skyline section, typical floor, footprint studies and exploded unit axonometric.",
            },
          },
        ],
      },
      {
        kind: "plans",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "urban-housing-collective/plan",
              title: "Ground floor plan with exploded unit axonometric",
              type: "Floor plan",
              caption: "Sports courts, row units and a free-standing pavilion on the ground plane; typical tower floor and a duplex unit, top left.",
            },
          },
        ],
      },
      {
        kind: "sections",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "urban-housing-collective/section",
              title: "Urban section — tower, shared ground and mid-rise block",
              type: "Section",
              caption: "The tower and the mid-rise block frame a shared sports hall at street level. Inset: aerial view along the elevated highway.",
            },
          },
        ],
      },
      {
        kind: "renderings",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "urban-housing-collective/render",
              title: "Exterior — the tower from the reflecting pool",
              type: "Rendering",
            },
          },
        ],
      },
    ],
  },

  {
    slug: "rock-and-roll-hall-of-fame",
    category: "academic",
    title: "Rock and Roll Hall of Fame",
    subtitle: "A performance landscape in the sunken stadium at Epidaurus",
    type: "Landscape Design",
    year: "2024",
    term: "Fall 2024",
    location: "Epidaurus, Greece",
    context: "Academic studio",
    organization: "Syracuse University School of Architecture",
    course: "ARC 207",
    instructor: "Richard Rosa",
    keywords: ["Landscape", "Music", "Concrete", "Glass"],
    concept: "Inspired by Queen’s energy and musical notation, the building fills the stadium’s void instead of touching the ruins.",
    statement: [
      "This project, inspired by Queen’s energy and musical notation, transforms the stadium’s sunken landscape into a dynamic performance space. The design explores rhythm, movement, and spatial fluidity using concrete and glass.",
      "Avoiding the site’s ruins, it instead “fills” the void, creating a concert venue, performance areas, and exhibition spaces. With two main entry points, the circulation mirrors musical flow. The result is an architectural manifestation of music’s power — solid yet fluid, structured yet dynamic — a space that embodies the legacy of Queen.",
    ],
    cover: { image: "rock-and-roll-hall-of-fame/site-plan", position: "75% 50%", alt: "Site plan with contour lines, ruins and the new hall in the stadium" },
    tile: { span: 4, aspect: "1/1" },
    sections: [
      {
        kind: "site-plan",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "rock-and-roll-hall-of-fame/site-plan",
              title: "Site plan — the hall inside the ancient stadium",
              type: "Site plan",
              caption: "The long hall sits in the sunken stadium beside the ruins; the ancient theatre is at upper left.",
            },
          },
        ],
      },
      {
        kind: "plans",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "rock-and-roll-hall-of-fame/plan",
              title: "Plan",
              type: "Plan",
              scale: "1/16\" = 1′",
              caption: "Exhibition rooms, the stage set and the performance stage are arranged along the length of the stadium.",
            },
          },
          {
            kind: "full",
            figure: {
              image: "rock-and-roll-hall-of-fame/plan-elevation",
              title: "Plan elevation",
              type: "Plan elevation",
              scale: "1/32\" = 1′",
            },
          },
        ],
      },
      {
        kind: "sections",
        title: "Sections & Elevations",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "rock-and-roll-hall-of-fame/south-section",
              title: "South section — site",
              type: "Site section",
            },
          },
          {
            kind: "full",
            figure: {
              image: "rock-and-roll-hall-of-fame/long-section",
              title: "Long section",
              type: "Section",
              scale: "1/16\" = 1′",
              caption: "Cut along the length of the hall, drawn at the same scale as the plan.",
            },
          },
          {
            kind: "full",
            figure: {
              image: "rock-and-roll-hall-of-fame/cross-section",
              title: "Cross section — stepped seating cut into the slope",
              type: "Section",
              scale: "1/8\" = 1′",
            },
          },
          {
            kind: "full",
            figure: {
              image: "rock-and-roll-hall-of-fame/south-elevation",
              title: "South elevation",
              type: "Elevation",
              scale: "1/32\" = 1′",
            },
          },
        ],
      },
      {
        kind: "axonometrics",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "rock-and-roll-hall-of-fame/axon",
              title: "Exploded axonometric — program",
              type: "Exploded axonometric",
              caption: "Lobby, front exhibition, café, stage set, performance stage, back exhibition and archive.",
            },
          },
        ],
      },
    ],
  },

  {
    slug: "recreation-center",
    category: "academic",
    title: "Recreation Center",
    subtitle: "A climate-responsive recreation center on Fayette Street",
    type: "Small Infrastructures for Public Use",
    year: "2024",
    term: "Spring 2024",
    location: "Syracuse, New York",
    context: "Academic studio",
    organization: "Syracuse University School of Architecture",
    studio: "Small Infrastructures for Public Use",
    instructor: "Edgar Rodriguez",
    keywords: ["Climate", "Translucency", "Stacked program", "Timber"],
    concept: "Designed for Syracuse’s extreme seasonal temperature swings: glass that keeps heat in, screens that let air through.",
    statement: [
      "The recreation center in Syracuse is designed to adapt to the city’s extreme seasonal temperature variations. The glass walls prioritize insulation, reducing heat loss in winter while allowing natural light to enter, especially from the west. This enhances visibility, enabling visitors to enjoy the surrounding greenery.",
      "The second-floor multipurpose room and gym benefit from this energy-efficient design, promoting an active atmosphere. In spring and autumn, the rattan room divider with operable windows improves ventilation and controls wind from the west. The first-floor café features overhead shading, balanced by translucent glass windows that optimize natural light while ensuring privacy for the karate room.",
    ],
    cover: { image: "recreation-center/render-section", position: "50% 50%", alt: "Terrace level with the open stair and the translucent façade below" },
    tile: { span: 4, aspect: "1/1" },
    sections: [
      {
        kind: "site-plan",
        blocks: [
          {
            kind: "text-figure",
            heading: "Site",
            side: "right",
            text: [
              "The building sits on Fayette Street, with a planted park running diagonally across the site.",
            ],
            figure: {
              image: "recreation-center/site-plan",
              title: "Site plan",
              type: "Site plan",
              caption: "Section lines A and B are marked on the plan.",
            },
          },
        ],
      },
      {
        kind: "plans",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "recreation-center/plans-1-2",
              title: "Floor plans — ground and second level",
              type: "Floor plans",
              caption: "Ground: toilets, changing room, café, office, lobby, karate. Second: changing room, lounge, squash, table tennis, gym.",
            },
          },
          {
            kind: "full",
            figure: {
              image: "recreation-center/plans-3-4",
              title: "Floor plans — third and fourth level",
              type: "Floor plans",
              caption: "Third: squash and pool tables. Fourth: changing room, café and badminton court.",
            },
          },
        ],
      },
      {
        kind: "sections",
        title: "Sections & Elevations",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "recreation-center/sections",
              title: "Sections A and B",
              type: "Section",
            },
          },
          {
            kind: "full",
            figure: {
              image: "recreation-center/elevations",
              title: "East and south elevations",
              type: "Elevation",
            },
          },
          {
            kind: "full",
            figure: {
              image: "recreation-center/street-elevation",
              title: "Street elevation",
              type: "Elevation",
            },
          },
          {
            kind: "text-figure",
            heading: "Seasons",
            side: "left",
            text: [
              "In winter the glass walls hold heat in while letting west light reach the gym and multipurpose room.",
              "In spring and autumn a rattan room divider with operable windows ventilates the floors and controls wind from the west.",
            ],
            figure: {
              image: "recreation-center/side-elevation",
              title: "Side elevation",
              type: "Elevation",
            },
          },
        ],
      },
      {
        kind: "diagrams",
        blocks: [
          {
            kind: "pair",
            figures: [
              {
                image: "recreation-center/circulation",
                title: "Circulation diagram",
                type: "Diagram",
                caption: "One continuous stair route climbs through all four levels.",
              },
              {
                image: "recreation-center/program",
                title: "Program stacking",
                type: "Diagram",
                caption: "Café and karate at the base; gym, squash and table tennis above; badminton court on top.",
              },
            ],
          },
        ],
      },
      {
        kind: "renderings",
        blocks: [
          {
            kind: "grid",
            columns: 2,
            figures: [
              { image: "recreation-center/render-exterior", title: "Exterior — from the park", type: "Rendering" },
              { image: "recreation-center/render-cafe", title: "Ground-floor café", type: "Rendering" },
              { image: "recreation-center/render-court", title: "Badminton court from above", type: "Rendering" },
              { image: "recreation-center/render-section", title: "Terrace level and translucent façade", type: "Rendering" },
            ],
          },
        ],
      },
    ],
  },

  /* ════════════════════════ PROFESSIONAL ═══════════════════════ */
  {
    slug: "shenzhen-houhai-project-k",
    category: "professional",
    title: "Shenzhen Houhai Central District Project K",
    shortTitle: "Houhai Project K",
    subtitle: "A high-density office prototype conceived as an urban forest",
    type: "Office / Mixed-use Design",
    year: "2025",
    term: "Summer 2025",
    location: "Shenzhen, China",
    context: "Internship project",
    organization: "MAD Architects",
    role: "Press & Architectural Design Intern",
    keywords: ["Urban forest", "Elevated platforms", "Waterfront"],
    concept: "Three towers are lifted off the ground to keep the waterfront in view and give the ground plane back to the city.",
    statement: [
      "Located in Shenzhen’s Houhai Central District, this project proposes a high-density office prototype integrating landscape, public space, and vertical circulation. Inspired by the concept of an “urban forest,” the design creates a layered and porous spatial system.",
      "Three tower volumes are lifted to preserve waterfront views and open the ground plane. Program is distributed vertically and connected through elevated platforms, forming shared spaces such as sky lobbies, restaurants, and roof gardens. The scheme extends the coastal green network into the site, blending architecture and landscape into a continuous public environment. The result is a flexible and dynamic workplace that balances density, openness, and connectivity.",
    ],
    credit: "Project by MAD Architects. Shown as internship work.",
    cover: { image: "shenzhen-houhai-project-k/visitor-center", position: "40% 50%", alt: "Visitor center rendering with an exhibition wall and glazed façade" },
    tile: { span: 4, aspect: "1/1" },
    sections: [
      {
        kind: "sections",
        title: "Elevations",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "shenzhen-houhai-project-k/elevation",
              title: "Elevation — lifted towers and elevated platforms",
              type: "Elevation",
            },
          },
        ],
      },
      {
        kind: "axonometrics",
        blocks: [
          {
            kind: "text-figure",
            heading: "Roof gardens",
            text: [
              "Elevated platforms connect the towers and form shared spaces: sky lobbies, restaurants and roof gardens.",
            ],
            figure: {
              image: "shenzhen-houhai-project-k/axon",
              title: "Axonometric — roof gardens and sky bridges",
              type: "Axonometric",
            },
          },
        ],
      },
      {
        kind: "renderings",
        blocks: [
          {
            kind: "full",
            figure: {
              image: "shenzhen-houhai-project-k/visitor-center",
              title: "Visitor center",
              type: "Rendering",
            },
          },
        ],
      },
    ],
  },

  /* ════════════════════════ INDEPENDENT ════════════════════════
     No projects yet — the chapter stays hidden until one is added here
     with category: "independent". */
];
