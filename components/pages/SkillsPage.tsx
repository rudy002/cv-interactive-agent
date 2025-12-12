"use client";

const cardClass =
  "bg-gradient-to-br from-white via-white to-blue-50 dark:from-zinc-900 dark:via-slate-900 dark:to-zinc-950 rounded-xl p-6 shadow border border-blue-100 dark:border-zinc-800";

const categories = [
  {
    title: "Frontend",
    icon: "⚛️",
    chips: [
      "React",
      "Next.js (pages/app)",
      "TypeScript",
      "Tailwind CSS",
      "UI libs (MUI, etc.)",
    ],
    note: "Builds chat UIs, faux browser panels, dashboards.",
  },
  {
    title: "Backend & APIs",
    icon: "🔧",
    chips: [
      "Node.js / Express",
      "REST APIs",
      "Webhooks",
      "Auth (basic/JWT)",
      "API integrations",
    ],
    note: "Focus on data flows, integrations, and delivery speed.",
  },
  {
    title: "Data & Storage",
    icon: "🗄️",
    chips: [
      "PostgreSQL",
      "MongoDB",
      "Supabase",
      "Airtable",
      "External APIs as sources",
    ],
    note: "From structured DBs to API-backed datasets.",
  },
  {
    title: "AI & Automation",
    icon: "🤖",
    chips: [
      "n8n workflows",
      "LLM (OpenAI & others)",
      "RAG (Pinecone)",
      "Drive/text ingestion",
      "Structured prompts",
      "Tooling chatbots",
      "Retries/error handling",
    ],
    note: "Agents connected to real data (CV, projects, docs).",
  },
  {
    title: "DevOps & Delivery",
    icon: "🚀",
    chips: [
      "Git / GitHub",
      "Render / Vercel",
      "Hosted n8n",
      "Env vars & secrets",
      "Light CI (GitHub Actions)",
    ],
    note: "Pragmatic deploys and environment hygiene.",
  },
  {
    title: "CS & Data foundations",
    icon: "📐",
    chips: [
      "Data structures / algos",
      "Complexity",
      "Graphs / NetworkX",
      "pandas / notebooks",
      "Classical ML (sklearn)",
    ],
    note: "Grounding for reasoning about data and performance.",
  },
];

export default function SkillsPage() {
  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Skills & Tooling</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Stacks, workflows et fondamentaux que j’utilise au quotidien.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div key={cat.title} className={cardClass}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{cat.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {cat.chips.map((chip) => (
                  <span
                    key={chip}
                    className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs dark:bg-white/10 dark:text-white"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              {cat.note && (
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {cat.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

