 "use client";

import { Code2, ExternalLink, Github, GitFork, Star } from "lucide-react";
import Image from "next/image";

const repos = [
  {
    name: "rudy002/cv-interactive-agent",
    desc: "AI-powered interactive portfolio: Next.js UI (chat + embedded browser panel) + n8n + RAG over CV/projects.",
    tech: ["Next.js", "TypeScript", "n8n", "RAG", "OpenAI", "Pinecone", "Tailwind"],
    links: [{ label: "GitHub", href: "https://github.com/rudy002/cv-interactive-agent.git" }],
  },
  {
    name: "rudy002/gpu-cpu-benchmark-pytorch",
    desc: "CPU vs NVIDIA GPU benchmark with PyTorch: separates CPU→GPU transfer from GPU compute and tracks VRAM usage.",
    tech: ["Python", "PyTorch", "CUDA", "Benchmarking", "GPU"],
    links: [{ label: "GitHub", href: "https://github.com/rudy002/gpu-cpu-benchmark-pytorch" }],
  },
  {
    name: "rudy002/SurveyPro (fork)",
    desc: "Fork of SurveyFlow: dynamic survey platform with React Flow builder and Node/Express API.",
    tech: ["Next.js", "React Flow", "Tailwind", "Node/Express", "MongoDB"],
    links: [
      { label: "Live", href: "https://surveyflow.co" },
      { label: "Fork", href: "https://github.com/rudy002/SurveyPro" },
      { label: "Upstream", href: "https://github.com/joey603/SurveyPro" },
    ],
  },
  {
    name: "Shavtsak guard planner",
    desc: "Lightweight React/Vite tool to generate fair guard duty schedules (posts/slots, avoid back-to-back).",
    tech: ["React", "Vite", "JavaScript", "CSS"],
    links: [],
  },
];

const badge =
  "px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 text-xs";
const cardClass =
  "bg-gradient-to-br from-white via-white to-blue-50 dark:from-zinc-900 dark:via-slate-900 dark:to-zinc-950 rounded-lg p-5 shadow border border-blue-100 dark:border-zinc-800";

export default function GitHubPage() {
  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950 scroll-smooth">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
        {/* Profile Header */}
        <div className="relative rounded-2xl overflow-hidden border border-blue-100 dark:border-zinc-800 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-emerald-900/30" />
          <div className="relative p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-zinc-900 bg-zinc-200 dark:bg-zinc-800 mx-auto sm:mx-0 flex-shrink-0">
              <Image
                src="/images/linkedin-photo.jpeg"
                alt="Rudy Haddad avatar"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100 break-words">Rudy Haddad</h1>
                <span className={badge}>@rudy002</span>
              </div>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 break-words">
                Full-stack & AI automation — Next.js, n8n, RAG, workflow tooling. Building chat+browser CV experience and
                survey/automation projects.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs">
                <span className="px-2 sm:px-3 py-1 rounded-full bg-white/70 text-zinc-800 border border-blue-100 dark:bg-white/5 dark:text-white dark:border-white/10">
                  Open to collabs/feedback
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Repositories */}
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">Featured repositories</h2>
          <div className="grid gap-3 sm:gap-4">
            {repos.map((repo, idx) => (
              <div key={idx} className={`${cardClass} p-4 sm:p-5`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-300 flex-shrink-0" />
                      <h3 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 break-words">{repo.name}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mt-1 break-words">{repo.desc}</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 text-xs">
                      {repo.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 sm:py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-white"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-2 text-xs text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>—</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitFork className="w-4 h-4" />
                      <span>—</span>
                    </div>
                  </div>
                </div>
                {repo.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {repo.links.map((link) => (
                      <a
                        key={link.href}
                        className="inline-flex items-center gap-1 px-3 py-1.5 sm:py-1 rounded-full bg-blue-600 text-white active:bg-blue-700 hover:bg-blue-700 transition-all text-xs active:scale-[0.98] touch-manipulation min-h-[36px]"
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-3 sm:pt-4">
            <a
              href="https://github.com/rudy002"
              target="_blank"
              rel="noreferrer"
              className="relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-xl active:scale-105 hover:scale-105 transition-transform touch-manipulation min-h-[48px]"
            >
              <span className="absolute inset-0 rounded-full bg-blue-500/40 blur-xl animate-pulse" aria-hidden="true"></span>
              <span className="relative flex items-center gap-2">
                <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-white/20 animate-bounce">
                  <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                </span>
                <span className="text-sm sm:text-base">More on GitHub</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

