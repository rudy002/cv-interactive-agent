/** Tailwind tone presets used to colour skill chips consistently. */
export const chipTones = {
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
  purple:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-200",
  indigo:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200",
  cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200",
  zinc: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200",
  green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200",
  lime: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-200",
  orange:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200",
  yellow:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200",
} as const;

export type ChipTone = keyof typeof chipTones;

export interface SkillCategory {
  title: string;
  icon: string;
  chips: string[];
  note: string;
}

/**
 * Detailed breakdown rendered on the Skills page.
 * Mirrors the SKILLS section of the CV.
 */
export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    icon: "💬",
    chips: ["Python", "TypeScript", "JavaScript", "C", "Java", "SQL"],
    note: "Python and TypeScript daily; C and Java from the engineering degree.",
  },
  {
    title: "Frontend",
    icon: "⚛️",
    chips: ["React", "Next.js", "Tailwind CSS", "React Flow", "Leaflet", "i18n"],
    note: "Chat UIs, dashboards, multilingual client sites.",
  },
  {
    title: "Backend & APIs",
    icon: "🔧",
    chips: ["Node.js", "Express", "FastAPI", "REST APIs", "JWT / NextAuth", "Webhooks"],
    note: "Focus on data flows, integrations and delivery speed.",
  },
  {
    title: "Data & Storage",
    icon: "🗄️",
    chips: [
      "PostgreSQL",
      "MongoDB",
      "Supabase",
      "Pinecone",
      "Cloudflare R2",
      "AWS SDK",
    ],
    note: "From relational stores to vector databases and object storage.",
  },
  {
    title: "AI & Automation",
    icon: "🤖",
    chips: [
      "RAG pipelines",
      "LLM integration",
      "n8n workflows",
      "MCP servers",
      "Tool-using agents",
      "Structured prompts",
      "AI-assisted dev (Claude, Cursor, Copilot)",
    ],
    note: "Agents grounded in real documents, not generic chat.",
  },
  {
    title: "Edge AI & Vision",
    icon: "📷",
    chips: [
      "NVIDIA Jetson",
      "DeepStream",
      "PeopleNet INT8",
      "NvDCF tracking",
      "GStreamer",
      "ffmpeg",
      "RTSP",
    ],
    note: "Real-time computer vision running fully on-device.",
  },
  {
    title: "DevOps & Delivery",
    icon: "🚀",
    chips: [
      "Docker",
      "Linux (systemd)",
      "Git / GitHub",
      "Vercel",
      "Render",
      "Hosted n8n",
      "Env vars & secrets",
    ],
    note: "Pragmatic deploys, services that survive a reboot.",
  },
  {
    title: "CS foundations",
    icon: "📐",
    chips: [
      "Data structures / algorithms",
      "Complexity",
      "Databases",
      "Operating systems",
      "Networks",
      "Machine learning",
    ],
    note: "Grounding for reasoning about data and performance.",
  },
];

/** Condensed chip list rendered on the LinkedIn page. */
export const technicalSkills: { label: string; tone: ChipTone }[] = [
  { label: "Python", tone: "emerald" },
  { label: "TypeScript/JS", tone: "blue" },
  { label: "C", tone: "purple" },
  { label: "Java", tone: "amber" },
  { label: "SQL", tone: "orange" },
  { label: "React/Next.js", tone: "sky" },
  { label: "Tailwind CSS", tone: "slate" },
  { label: "Node.js/Express", tone: "indigo" },
  { label: "FastAPI", tone: "teal" },
  { label: "REST APIs", tone: "rose" },
  { label: "PostgreSQL", tone: "amber" },
  { label: "MongoDB", tone: "emerald" },
  { label: "Supabase", tone: "cyan" },
  { label: "Docker", tone: "blue" },
  { label: "Linux (systemd)", tone: "zinc" },
  { label: "AWS SDK / Cloudflare R2", tone: "yellow" },
  { label: "Git/GitHub", tone: "teal" },
  { label: "Vercel / Render", tone: "lime" },
];

export const aiSkills: { label: string; tone: ChipTone }[] = [
  { label: "RAG pipelines", tone: "amber" },
  { label: "LLM integration", tone: "indigo" },
  { label: "Vector DBs (Pinecone)", tone: "cyan" },
  { label: "n8n workflows", tone: "sky" },
  { label: "MCP servers", tone: "purple" },
  { label: "Tool-using agents", tone: "rose" },
  { label: "Edge AI (NVIDIA Jetson)", tone: "green" },
  { label: "DeepStream / computer vision", tone: "emerald" },
  { label: "GStreamer / ffmpeg", tone: "zinc" },
  { label: "AI-assisted dev (Claude, Cursor, Copilot)", tone: "teal" },
];

export const softSkills: { label: string; tone: ChipTone }[] = [
  { label: "Clear communication", tone: "zinc" },
  { label: "Autonomous learner", tone: "blue" },
  { label: "Problem solving", tone: "emerald" },
  { label: "End-to-end ownership", tone: "amber" },
];
