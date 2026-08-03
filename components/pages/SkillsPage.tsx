"use client";

import { skillCategories } from "@/data/skills";

const cardClass =
  "bg-linear-to-br from-white via-white to-blue-50 dark:from-zinc-900 dark:via-slate-900 dark:to-zinc-950 rounded-xl shadow-sm border border-blue-100 dark:border-zinc-800";

export default function SkillsPage() {
  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950 scroll-smooth">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 sm:mb-3">
            Skills &amp; Tooling
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-400 px-2">
            The stacks, workflows and fundamentals I work with day to day.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {skillCategories.map((category) => (
            <section key={category.title} className={`${cardClass} p-4 sm:p-6`}>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl" aria-hidden="true">
                  {category.icon}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {category.title}
                </h2>
              </div>
              <ul className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                {category.chips.map((chip) => (
                  <li
                    key={chip}
                    className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs dark:bg-white/10 dark:text-white"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                {category.note}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
