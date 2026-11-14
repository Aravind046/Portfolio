/**
 * Every piece of copy on the site lives here and is taken from the résumé
 * (no longer in the repo), including its embedded hyperlinks.
 * Components only read from this file.
 */

export type Link = { label: string; href: string };

export const PROFILE = {
  name: "Aravind Prakash",
  firstName: "Aravind",
  initials: "AP",
  role: "UI/UX Designer",
  email: "aravindimaginative@gmail.com",
  phone: "+91 8122730480",
  phoneHref: "tel:+918122730480",
  location: "Coimbatore",
  /** "About me", verbatim from the résumé. */
  resumeSummary:
    "Creative and user-focused Designer with 6+ years of experience delivering intuitive and impactful web and mobile products. Strong in design thinking, conducting user research, and leading end-to-end product design",
  /** A second line, verbatim from the Stackly / Tejuri experience bullets. */
  extraLine: "Collaborated with cross-functional teams to align user needs with product goals.",
  /** Short paraphrase of the summary's own wording (used as a quote). */
  quote: "Design thinking and user research first — then intuitive, end-to-end products for web and mobile.",
  yearsExperience: "6+",
  github: null as string | null, // not in the résumé
  linkedin: "https://www.linkedin.com/in/-aravind-prakash/",
  portfolio: "https://valley-khaki-33770656.figma.site",
  resume: "/Aravind-Prakash-Resume.pdf",
} as const;

export type NavItem = { id: string; label: string };

export const NAV: NavItem[] = [
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

/** Section tags, numbered in page order. */
export const SECTION_INDEX = {
  skills: "01",
  certifications: "02",
  experience: "03",
  contact: "04",
} as const;

/* ------------------------------------------------------------------ skills */

export type SkillFamily = "Tools" | "Craft" | "Research" | "Strategy" | "Systems";

export type Skill = {
  key: string; // TechLogo key
  name: string;
  symbol: string;
  family: SkillFamily;
  /** Which résumé list the skill appears in. */
  source: "Design Tools" | "Skills";
};

export type SkillGroup = { family: SkillFamily; blurb: string; skills: Skill[] };

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Tools",
    blurb: "Design tools",
    skills: [
      { key: "figma", name: "Figma", symbol: "Fg", family: "Tools", source: "Design Tools" },
      { key: "sketch", name: "Sketch", symbol: "Sk", family: "Tools", source: "Design Tools" },
      { key: "invision", name: "InVision", symbol: "Iv", family: "Tools", source: "Design Tools" },
      { key: "miro", name: "Miro", symbol: "Mi", family: "Tools", source: "Design Tools" },
      { key: "webflow", name: "Webflow", symbol: "Wf", family: "Tools", source: "Design Tools" },
      { key: "framer", name: "Framer", symbol: "Fr", family: "Tools", source: "Design Tools" },
    ],
  },
  {
    family: "Craft",
    blurb: "Making it tangible",
    skills: [
      { key: "wireframing", name: "Wireframing", symbol: "Wi", family: "Craft", source: "Skills" },
      { key: "prototyping", name: "Prototyping", symbol: "Pr", family: "Craft", source: "Skills" },
    ],
  },
  {
    family: "Research",
    blurb: "Listening to users",
    skills: [
      { key: "user-research", name: "User Research", symbol: "Ur", family: "Research", source: "Skills" },
      { key: "usability-testing", name: "Usability Testing", symbol: "Ut", family: "Research", source: "Skills" },
    ],
  },
  {
    family: "Strategy",
    blurb: "Framing the problem",
    skills: [
      {
        key: "design-thinking",
        name: "Design Thinking & UX Strategy",
        symbol: "Dt",
        family: "Strategy",
        source: "Skills",
      },
    ],
  },
  {
    family: "Systems",
    blurb: "Scaling the design",
    skills: [
      { key: "design-systems", name: "Design Systems", symbol: "Ds", family: "Systems", source: "Skills" },
      { key: "responsive", name: "Responsive & Adaptive Design", symbol: "Ra", family: "Systems", source: "Skills" },
    ],
  },
];

export const ALL_SKILLS: Skill[] = SKILL_GROUPS.flatMap((g) => g.skills);

/* -------------------------------------------------------------- experience */

export type Role = {
  kind: "work";
  title: string;
  company: string;
  place: string;
  start: string;
  end: string;
  points: string[];
  /** Company logo in /public (e.g. "/logos/companies/stackly.svg"); omit to show a placeholder tile. */
  logo?: string;
};

export const EXPERIENCE: Role[] = [
  {
    kind: "work",
    title: "Senior UI/UX Designer",
    company: "Stackly",
    place: "Salem",
    start: "Dec 2025",
    end: "Present",
    points: ["Collaborated with cross-functional teams to align user needs with product goals."],
  },
  {
    kind: "work",
    title: "Senior UI/UX Designer",
    company: "Tejuri Com LLC",
    place: "UAE",
    start: "Apr 2024",
    end: "Oct 2025",
    points: [
      "Worked on Dubai Supplier Hub Business platform, enabling business owners to manage multiple businesses and teams.",
      "Collaborated with cross-functional teams to align user needs with product goals.",
    ],
  },
  {
    kind: "work",
    title: "User Experience Designer",
    company: "Cognizant",
    place: "Chennai",
    start: "Sep 2022",
    end: "Apr 2024",
    points: [
      "Designed to help increase user experience in US Bank project and worked on POC for World Bank",
      "Worked as a team in designing and delivered the ODC rebranding for Design and Support team",
    ],
  },
  {
    kind: "work",
    title: "UI/UX Designer",
    company: "Heptagon",
    place: "Coimbatore",
    start: "Sep 2020",
    end: "Sep 2022",
    points: [
      "Worked on various application like work force management, visitor management and job search portal.",
      "Created promo video and micro interaction for application and social media activities",
    ],
  },
  {
    kind: "work",
    title: "UI Designer",
    company: "Walinns Innovation",
    place: "Coimbatore",
    start: "May 2019",
    end: "Aug 2020",
    points: ["Worked as graphic designer for branding and social media marketing banners"],
  },
  {
    kind: "work",
    title: "UI Designer",
    company: "Linlax Info Tech",
    place: "Coimbatore",
    start: "May 2019",
    end: "Aug 2020",
    points: ["Worked as graphic designer for branding and social media marketing banners"],
  },
];

export type Degree = {
  kind: "education";
  title: string;
  school: string;
  place: string;
  start: string;
  end: string;
  /** College logo in /public; omit to show a placeholder tile. */
  logo?: string;
};

export const EDUCATION: Degree[] = [
  {
    kind: "education",
    title: "Master of Computer Applications",
    school: "Kumaraguru College of Technology",
    place: "Coimbatore, India",
    start: "2015",
    end: "2017",
  },
  {
    kind: "education",
    title: "Bachelor of Information Technology",
    school: "GRD College of Science",
    place: "Coimbatore, India",
    start: "2012",
    end: "2015",
  },
];

/* ---------------------------------------------------------------- projects */
/* The résumé has no separate projects list; these are the named pieces of
   work from the experience bullets, using their wording only. */

export type MiniUI = "hub" | "bank" | "rebrand" | "apps" | "motion" | "banners";

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  role: string;
  github: string | null;
  ui: MiniUI;
  /** One-line subtext under the title. */
  tagline: string;
  /** Handwritten note beside the mockup. */
  note: string;
  /** Screenshot in /public (e.g. "/work/dubai-supplier-hub.webp"); null shows the sketch. */
  image: string | null;
  /** Case-study URL; null links to Contact ("Ask for the case study"). */
  caseStudy: string | null;
};

export const PROJECTS: Project[] = [
  {
    id: "dubai-supplier-hub",
    index: "01",
    title: "Dubai Supplier Hub",
    kicker: "Tejuri Com LLC · Apr 2024 – Oct 2025",
    description:
      "Worked on Dubai Supplier Hub Business platform, enabling business owners to manage multiple businesses and teams.",
    features: ["Business platform", "Multiple businesses", "Team management", "Cross-functional alignment"],
    role: "Senior UI/UX Designer",
    github: null,
    ui: "hub",
    tagline: "One platform for owners to run multiple businesses and their teams.",
    note: "many businesses, one hub",
    image: null,
    caseStudy: null,
  },
  {
    id: "us-bank-world-bank",
    index: "02",
    title: "US Bank & World Bank POC",
    kicker: "Cognizant · Sep 2022 – Apr 2024",
    description:
      "Designed to help increase user experience in US Bank project and worked on POC for World Bank",
    features: ["US Bank project", "User experience", "World Bank POC", "Proof of concept"],
    role: "User Experience Designer",
    github: null,
    ui: "bank",
    tagline: "Smoother banking journeys, plus a proof of concept for World Bank.",
    note: "banking, made easier",
    image: null,
    caseStudy: null,
  },
  {
    id: "odc-rebranding",
    index: "03",
    title: "ODC Rebranding",
    kicker: "Cognizant · Sep 2022 – Apr 2024",
    description: "Worked as a team in designing and delivered the ODC rebranding for Design and Support team",
    features: ["Rebranding", "Design team", "Support team", "Delivered as a team"],
    role: "User Experience Designer",
    github: null,
    ui: "rebrand",
    tagline: "A refreshed identity for the Design and Support team, delivered together.",
    note: "same team, fresh look",
    image: null,
    caseStudy: null,
  },
  {
    id: "workforce-visitor-jobs",
    index: "04",
    title: "Workforce, Visitor & Job Apps",
    kicker: "Heptagon · Sep 2020 – Sep 2022",
    description:
      "Worked on various application like work force management, visitor management and job search portal.",
    features: ["Workforce management", "Visitor management", "Job search portal", "Various applications"],
    role: "UI/UX Designer",
    github: null,
    ui: "apps",
    tagline: "Workforce management, visitor management and job search, designed end to end.",
    note: "three apps, one craft",
    image: null,
    caseStudy: null,
  },
  {
    id: "promo-micro-interactions",
    index: "05",
    title: "Promo Video & Micro-interactions",
    kicker: "Heptagon · Sep 2020 – Sep 2022",
    description: "Created promo video and micro interaction for application and social media activities",
    features: ["Promo video", "Micro interactions", "Application", "Social media"],
    role: "UI/UX Designer",
    github: null,
    ui: "motion",
    tagline: "Promo videos and micro-interactions for apps and social media.",
    note: "small moments, big feel",
    image: null,
    caseStudy: null,
  },
];

/* ----------------------------------------------------------- certifications */

export type Certification = { title: string; issuer: string; href: string | null };

export const CERTIFICATIONS: Certification[] = [
  { title: "Functions of MIRO", issuer: "Coursera", href: null },
  { title: "Advanced UX Research", issuer: "Coursera", href: null },
];

/* ------------------------------------------------------------- achievements */
/* The résumé lists no achievements, ranks or awards, so the section is omitted. */
export const ACHIEVEMENTS: never[] = [];

/* --------------------------------------------------------------- ID card */

export const QUICK_FACTS = [
  { k: "Location", v: PROFILE.location },
  { k: "Education", v: "MCA, Kumaraguru College of Technology" },
  { k: "Current role", v: "Senior UI/UX Designer, Stackly · Dec 2025 – Present" },
  { k: "Email", v: PROFILE.email, href: `mailto:${PROFILE.email}` },
];

/* -------------------------------------------------------------- ticket hero */

/** Copy for the ticket hero (hero/TicketHero.tsx). Years are set here once. */
const HERO_YEARS = "8+";

export const HERO = {
  years: HERO_YEARS,
  pill: "Senior UI/UX Designer",
  /** Each line: [bold sentence, light sentence]. */
  headline: [
    { strong: "I explore.", light: "I question." },
    { strong: "I design.", light: "I simplify." },
  ],
  facts: [`${HERO_YEARS} Years of Experience`, "UI/UX Design", "Product Design"],
  description:
    "Transforming complex problems into intuitive, meaningful digital experiences through thoughtful design and purposeful innovation.",
  ticket: {
    edition: "Portfolio 2018",
    role: ["Senior UI/UX", "Designer"],
    meta: ["Product Design", `${PROFILE.location}, IN`],
    portrait: "/hero/ticket-portrait.webp",
    info: [
      { k: "Role", v: "Senior UI/UX Designer" },
      { k: "Experience", v: `${HERO_YEARS} Years` },
      { k: "Speciality", v: "Digital Products" },
    ],
    serial: "AP2026 08UX 001",
    /** Back of the ticket (shown when it flips). */
    back: {
      title: "Who am I?",
      groups: [
        {
          k: "Skills",
          chips: ["Wireframing", "Prototyping", "UX Strategy", "Usability Testing", "Design Systems", "Micro-interactions"],
        },
        { k: "Tools", chips: ["Figma", "Sketch", "Miro", "Webflow", "Framer", "Adobe Suite"] },
        {
          k: "Education",
          chips: ["Master of Computer Applications", "2015–2017"],
          strong: "Kumaraguru College of Technology",
        },
      ],
      signature: PROFILE.name,
      found: "If found, say hello",
    },
  },
};
