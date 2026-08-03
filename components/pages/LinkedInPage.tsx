"use client";

import Image from "next/image";
import { Briefcase, Calendar, Code, Github, Linkedin, Mail } from "lucide-react";
import {
  availability,
  certifications,
  education,
  experience,
  languages,
  linkLabels,
  links,
  profile,
  rolesOfInterest,
} from "@/data/profile";
import { projects } from "@/data/projects";
import { aiSkills, chipTones, softSkills, technicalSkills } from "@/data/skills";

const cardClass =
  "bg-linear-to-br from-white via-white to-blue-50 dark:from-zinc-900 dark:via-slate-900 dark:to-zinc-950 rounded-lg p-6 shadow-sm border border-blue-100 dark:border-zinc-800";

const roleTones: Record<string, string> = {
  blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  amber: "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
};

const contactCardClass =
  "bg-white/70 dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-lg p-3 flex items-center gap-3 hover:bg-white dark:hover:bg-white/10 transition active:scale-[0.98] touch-manipulation min-h-14 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500";

export default function LinkedInPage() {
  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950 scroll-smooth">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <header className="relative rounded-b-xl overflow-hidden border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="absolute inset-0">
            <Image
              src={profile.cover}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div
              className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/45 dark:from-black/25 dark:via-black/45 dark:to-black/65"
              aria-hidden="true"
            />
          </div>
          <div className="relative px-4 sm:px-8 pt-16 sm:pt-20 pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-zinc-900 bg-zinc-200 dark:bg-zinc-800 mx-auto sm:mx-0 shrink-0">
                <Image
                  src={profile.avatar}
                  alt={`${profile.name} portrait`}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-lg border border-white/40 dark:border-white/10">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100 wrap-break-word">
                    {profile.name}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-zinc-700 dark:text-zinc-200 wrap-break-word">
                    {profile.linkedinHeadline}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                    {profile.location} • 500+ connections
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">
          <section className={cardClass}>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">About</h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {profile.linkedinAbout}
            </p>
          </section>

          <section className={cardClass}>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Roles of interest
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {rolesOfInterest.map((role) => (
                <div key={role.title} className="flex gap-3 items-start">
                  <div
                    className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 ${
                      roleTones[role.tone] ?? roleTones.blue
                    }`}
                  >
                    <Briefcase className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {role.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {role.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 sm:mb-4">
              Skills &amp; Tooling
            </h2>
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div className="rounded-xl border border-blue-100 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 shadow-sm space-y-3">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Technical</h3>
                  <p className="text-zinc-600 dark:text-zinc-300 text-xs">
                    Stack &amp; core engineering
                  </p>
                </div>
                <ul className="flex flex-wrap gap-1.5 sm:gap-2">
                  {technicalSkills.map((skill) => (
                    <li
                      key={skill.label}
                      className={`px-2 py-1 rounded-full text-xs sm:text-sm ${chipTones[skill.tone]}`}
                    >
                      {skill.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-blue-100 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 shadow-sm space-y-3">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    AI &amp; Automation
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-300 text-xs">
                    LLM, RAG, workflows
                  </p>
                </div>
                <ul className="flex flex-wrap gap-1.5 sm:gap-2">
                  {aiSkills.map((skill) => (
                    <li
                      key={skill.label}
                      className={`px-2 py-1 rounded-full text-xs sm:text-sm ${chipTones[skill.tone]}`}
                    >
                      {skill.label}
                    </li>
                  ))}
                </ul>
                <div className="pt-1">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                    Soft skills
                  </h3>
                  <ul className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                    {softSkills.map((skill) => (
                      <li
                        key={skill.label}
                        className={`px-2 py-1 rounded-full text-xs sm:text-sm ${chipTones[skill.tone]}`}
                      >
                        {skill.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Experience</h2>
            <div className="space-y-6">
              {experience.map((job) => (
                <article key={job.role} className="flex flex-col sm:flex-row gap-4">
                  <div className="w-12 h-12 rounded-sm bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <Briefcase
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{job.role}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {job.company} • {job.location}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      {job.period}
                    </p>
                    <ul className="text-sm text-zinc-700 dark:text-zinc-300 mt-2 space-y-1 list-disc pl-4">
                      {job.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Projects</h2>
            <div className="space-y-6 text-sm text-zinc-700 dark:text-zinc-300">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-xl border border-blue-100 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {project.title}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400">{project.tagline}</p>
                      <ul className="flex flex-wrap gap-2 mt-2 text-xs">
                        {project.tech.map((tech) => (
                          <li
                            key={tech}
                            className="px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-white"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {project.links.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {project.links.map((link) => (
                          <a
                            key={link.href}
                            className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label}
                            <span className="sr-only"> — {project.title}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <ul className="list-disc pl-4 mt-3 space-y-1">
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              ))}

              <div className="flex justify-center pt-2">
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:scale-105 transition-transform focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <span
                    className="absolute inset-0 rounded-full bg-blue-500/50 blur-lg motion-safe:animate-pulse"
                    aria-hidden="true"
                  />
                  <span className="relative">See more projects on GitHub</span>
                </a>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Education &amp; Certifications
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-sm bg-green-100 dark:bg-green-900/20 flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src={education.logo}
                    alt="Shamoon College of Engineering logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {education.degree}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{education.period}</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{education.summary}</p>
                </div>
              </div>
              <div className="pl-1 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Certifications</h3>
                <ul className="list-disc pl-4 space-y-1">
                  {certifications.map((certification) => (
                    <li key={certification}>{certification}</li>
                  ))}
                </ul>
              </div>

              <div className="pl-1 space-y-2 text-sm">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Languages</h3>
                <ul className="flex flex-wrap gap-1.5 sm:gap-2">
                  {languages.map((language) => (
                    <li
                      key={language.name}
                      className="px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-white text-xs sm:text-sm"
                    >
                      {language.name}
                      <span className="text-zinc-500 dark:text-zinc-400"> · {language.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-linear-to-r from-blue-50 via-white to-blue-50 dark:from-zinc-900 dark:via-slate-900 dark:to-zinc-800 text-zinc-900 dark:text-white rounded-lg p-6 shadow-lg border border-blue-100 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold">Availability &amp; Contact</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-200">{availability.summary}</p>
              </div>
              <p className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200 dark:bg-white/10 dark:text-white dark:border-white/10">
                {availability.status}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white/70 dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-lg p-3 flex items-center gap-3 min-h-14">
                <Calendar
                  className="w-5 h-5 text-amber-500 dark:text-amber-300 shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-900 dark:text-white text-xs sm:text-sm">
                    Roles
                  </p>
                  <p className="text-zinc-700 dark:text-zinc-200 text-xs sm:text-sm wrap-break-word">
                    {availability.roles}
                  </p>
                </div>
              </div>

              <a className={contactCardClass} href={`mailto:${profile.email}`}>
                <Mail
                  className="w-5 h-5 text-amber-500 dark:text-amber-300 shrink-0"
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block font-semibold text-zinc-900 dark:text-white text-xs sm:text-sm">
                    Email
                  </span>
                  <span className="block text-zinc-700 dark:text-zinc-200 text-xs sm:text-sm break-all">
                    {profile.email}
                  </span>
                </span>
              </a>

              <a
                className={contactCardClass}
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin
                  className="w-5 h-5 text-sky-600 dark:text-sky-300 shrink-0"
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block font-semibold text-zinc-900 dark:text-white text-xs sm:text-sm">
                    LinkedIn
                  </span>
                  <span className="block text-zinc-700 dark:text-zinc-200 text-xs sm:text-sm break-all">
                    {linkLabels.linkedin}
                  </span>
                </span>
              </a>

              <a
                className={contactCardClass}
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github
                  className="w-5 h-5 text-emerald-600 dark:text-emerald-300 shrink-0"
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block font-semibold text-zinc-900 dark:text-white text-xs sm:text-sm">
                    GitHub
                  </span>
                  <span className="block text-zinc-700 dark:text-zinc-200 text-xs sm:text-sm break-all">
                    {linkLabels.github}
                  </span>
                </span>
              </a>

              <a
                className={contactCardClass}
                href={links.leetcode}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code
                  className="w-5 h-5 text-indigo-600 dark:text-indigo-300 shrink-0"
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block font-semibold text-zinc-900 dark:text-white text-xs sm:text-sm">
                    LeetCode
                  </span>
                  <span className="block text-zinc-700 dark:text-zinc-200 text-xs sm:text-sm break-all">
                    {linkLabels.leetcode}
                  </span>
                </span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
