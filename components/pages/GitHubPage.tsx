"use client";

import Image from "next/image";
import { Code2, ExternalLink, Github } from "lucide-react";
import { GITHUB_HANDLE, links, profile } from "@/data/profile";
import { projects } from "@/data/projects";

const badge =
  "px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 text-xs";
const cardClass =
  "bg-linear-to-br from-white via-white to-blue-50 dark:from-zinc-900 dark:via-slate-900 dark:to-zinc-950 rounded-lg shadow-sm border border-blue-100 dark:border-zinc-800";

export default function GitHubPage() {
  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950 scroll-smooth">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
        <header className="relative rounded-2xl overflow-hidden border border-blue-100 dark:border-zinc-800 shadow-lg">
          <div
            className="absolute inset-0 bg-linear-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-emerald-900/30"
            aria-hidden="true"
          />
          <div className="relative p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-zinc-900 bg-zinc-200 dark:bg-zinc-800 mx-auto sm:mx-0 shrink-0">
              <Image
                src={profile.avatar}
                alt={`${profile.name} avatar`}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100 wrap-break-word">
                  {profile.name}
                </h1>
                <span className={badge}>@{GITHUB_HANDLE}</span>
              </div>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 wrap-break-word">
                {profile.githubBio}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs">
                <span className="px-2 sm:px-3 py-1 rounded-full bg-white/70 text-zinc-800 border border-blue-100 dark:bg-white/5 dark:text-white dark:border-white/10">
                  Open to collabs/feedback
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Featured repositories
          </h2>
          <div className="grid gap-3 sm:gap-4">
            {projects.map((project) => (
              <article key={project.id} className={`${cardClass} p-4 sm:p-5`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Code2
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-300 shrink-0"
                      aria-hidden="true"
                    />
                    <h3 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 wrap-break-word">
                      {project.repoName}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mt-1 wrap-break-word">
                    {project.description}
                  </p>
                  <ul className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 text-xs">
                    {project.tech.map((tech) => (
                      <li
                        key={tech}
                        className="px-2 py-0.5 sm:py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-white"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>

                {project.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        className="inline-flex items-center gap-1 px-3 py-1.5 sm:py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all text-xs active:scale-[0.98] touch-manipulation min-h-9 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400"
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                        <span>
                          {link.label}
                          {/* Distinguishes the repeated "GitHub" links for screen readers. */}
                          <span className="sr-only"> — {project.repoName}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="flex justify-center pt-3 sm:pt-4">
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-xl hover:scale-105 transition-transform touch-manipulation min-h-12 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span
                className="absolute inset-0 rounded-full bg-blue-500/40 blur-xl motion-safe:animate-pulse"
                aria-hidden="true"
              />
              <span className="relative flex items-center gap-2">
                <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-white/20">
                  <Github className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                </span>
                <span className="text-sm sm:text-base">More on GitHub</span>
              </span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
