"use client";

import {
  Briefcase,
  Code,
  Calendar,
  GraduationCap,
  Mail,
  Github,
  Linkedin,
} from "lucide-react";
import Image from "next/image";

export default function LinkedInPage() {
  const cardClass =
    "bg-gradient-to-br from-white via-white to-blue-50 dark:from-zinc-900 dark:via-slate-900 dark:to-zinc-950 rounded-lg p-6 shadow border border-blue-100 dark:border-zinc-800";

  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        {/* Header cover */}
        <div className="relative rounded-b-xl overflow-hidden border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="absolute inset-0">
            <Image
              src="/images/linkedin-cover.jpg"
              alt="Cover background"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/45 dark:from-black/25 dark:via-black/45 dark:to-black/65" />
          </div>
          <div className="relative px-8 pt-20 pb-8">
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-zinc-900 bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src="/images/linkedin-photo.jpeg"
                  alt="Rudy Haddad portrait"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex-1">
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-white/40 dark:border-white/10">
                  <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Rudy Haddad</h1>
                  <p className="text-lg text-zinc-700 dark:text-zinc-200">Full-Stack Developer | AI Automation & RAG | React & Node.js</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">Israel • 500+ connections</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="p-8 space-y-6">
          {/* About */}
          <div className={cardClass}>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">About</h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Early-career software engineer based in Israel, focused on AI systems, n8n automation,
              and RAG. I build Next.js apps with agents and n8n workflows tied to real data (CV,
              projects, recruiter FAQ) to deliver practical tools instead of static resumes. I enjoy
              backend/data flow design and can ship frontend when it helps deliver real products.
            </p>
          </div>

          {/* Roles */}
          <div className={cardClass}>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Roles of interest</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Backend / Full-stack</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    APIs, data flows, integrations. Loves designing the core logic and shipping fast.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">AI & Automation</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    LLM, RAG, agents, n8n, structured prompts tied to real data.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Data / Analyst / Junior DS</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Cleaning, exploration, graphs, productionizing data-centric flows.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className={cardClass}>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Skills & Tooling</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-blue-100 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 shadow-sm space-y-3">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Technical</p>
                  <p className="text-zinc-600 dark:text-zinc-300 text-xs">Stack & core engineering</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">Python</span>
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">TypeScript/JS</span>
                  <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">Java</span>
                  <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">C/C++</span>
                  <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200">React/Next.js</span>
                  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-200">Tailwind/MUI</span>
                  <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">Node.js/REST</span>
                  <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200">Webhooks/Auth</span>
                  <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">PostgreSQL</span>
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">MongoDB</span>
                  <span className="px-2 py-1 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200">Supabase/Airtable</span>
                  <span className="px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200">APIs externes</span>
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200">pandas/Jupyter</span>
                  <span className="px-2 py-1 rounded-full bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-200">NetworkX/graphs</span>
                  <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200">CS fundamentals</span>
                  <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">Git/GitHub</span>
                  <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200">Render/n8n deploys</span>
                </div>
              </div>
              <div className="rounded-xl border border-blue-100 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 shadow-sm space-y-3">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">AI & Automation</p>
                  <p className="text-zinc-600 dark:text-zinc-300 text-xs">LLM, RAG, workflows</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200">n8n workflows</span>
                  <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">OpenAI & LLMs</span>
                  <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">RAG (Pinecone)</span>
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">Drive ingestion</span>
                  <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">Structured prompts</span>
                  <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200">Tool-using agents</span>
                  <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">Tooling chatbots (APIs, SaaS, data sources)</span>
                  <span className="px-2 py-1 rounded-full bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-200">Retries/error handling</span>
                  <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200">Classical ML</span>
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Soft skills</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200">Clear communication</span>
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">Autonomous learner</span>
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">Problem solving</span>
                    <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">Collaboration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className={cardClass}>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Experience</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Freelance Software & AI Automation Developer</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">Self-employed • Israel (remote)</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    Aug 2024 - Present
                  </p>
                  <ul className="text-sm text-zinc-700 dark:text-zinc-300 mt-2 space-y-1 list-disc pl-4">
                    <li>Landing/event sites with React/Next.js/Tailwind.</li>
                    <li>AI agents for clients: n8n + LLM + external services.</li>
                    <li>End-to-end ownership: needs, solution, deployment, maintenance.</li>
                    <li>Practical ops: hosting, env vars, light monitoring.</li>
                  </ul>
                </div>
              </div>
                </div>
              </div>

          {/* Projects */}
          <div className={cardClass}>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Projects</h2>
            <div className="space-y-6 text-sm text-zinc-700 dark:text-zinc-300">
              <div className="rounded-xl border border-blue-100 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">SurveyFlow</p>
                    <p className="text-zinc-600 dark:text-zinc-400">Dynamic survey platform with graph builder</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">React Flow</span>
                      <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">Next.js</span>
                      <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">Node/Express</span>
                      <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">MongoDB</span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <a className="px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition" href="https://surveyflow.co" target="_blank" rel="noreferrer">Live</a>
                    <a className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition" href="https://github.com/joey603/SurveyPro" target="_blank" rel="noreferrer">GitHub</a>
                    <a className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition" href="https://github.com/rudy002/SurveyPro" target="_blank" rel="noreferrer">Fork</a>
                  </div>
                </div>
                <ul className="list-disc pl-4 mt-3 space-y-1">
                  <li>Node/edge survey builder, JWT auth, REST API, conditional paths.</li>
                  <li>Deployed: Render (backend) + Vercel (frontend), Cloudinary, SendGrid.</li>
                  <li>Full-stack features, external integrations, deployment docs.</li>
                </ul>
              </div>

              <div className="rounded-xl border border-blue-100 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">AI-Powered Interactive Portfolio</p>
                    <p className="text-zinc-600 dark:text-zinc-400">Chat over CV/projects with faux browser</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">Next.js</span>
                      <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200">n8n</span>
                      <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">RAG</span>
                      <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">OpenAI + Pinecone</span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <a className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition" href="https://github.com/rudy002/cv-interactive-agent.git" target="_blank" rel="noreferrer">GitHub</a>
                  </div>
                </div>
                <ul className="list-disc pl-4 mt-3 space-y-1">
                  <li>Ingestion/update/chat workflows (Drive/text), structured prompts, separation instructions/knowledge.</li>
                  <li>Fake browser side-panel to surface GitHub/LinkedIn/project pages.</li>
                  <li>Multi-language answers based on user language.</li>
                </ul>
              </div>

              <div className="rounded-xl border border-blue-100 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">Shavtsak – Guard duty planner</p>
                    <p className="text-zinc-600 dark:text-zinc-400">Scheduling tool for fair guard shifts</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">React</span>
                      <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">Vite</span>
                      <span className="px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200">Client-side</span>
                    </div>
                  </div>
                </div>
                <ul className="list-disc pl-4 mt-3 space-y-1">
                  <li>Posts/slots management, automatic assignment, avoids back-to-back shifts.</li>
                  <li>Built for simple field use; roadmap: constraints, export, roles.</li>
                </ul>
              </div>

              <div className="flex justify-center pt-2">
                <a
                  href="https://github.com/rudy002"
                  target="_blank"
                  rel="noreferrer"
                  className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:scale-105 transition-transform"
                >
                  <span className="absolute inset-0 rounded-full bg-blue-500/50 blur-lg animate-pulse" aria-hidden="true"></span>
                  <span className="relative">See more projects on GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Education & Certs */}
          <div className={cardClass}>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Education & Certifications</h2>
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded bg-green-100 dark:bg-green-900/20 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/sce-logo.png"
                    alt="Shamoon College of Engineering (SCE) logo"
                    width={48}
                    height={48}
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">BSc Software Engineering – Shamoon College of Engineering (SCE)</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">2020 – 2025 | Ashdod, Israel</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">Software eng, algorithms/structures, DB, OS, networks, ML.</p>
                </div>
              </div>
              <div className="pl-1 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">Certifications</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>AI Automation with n8n & APIs (Udemy 2024) – workflows, RAG, errors, integrations.</li>
                  <li>Complete SQL Bootcamp (Udemy 2025) – queries, joins, aggregations, schemas.</li>
                  <li>Neural Networks and Deep Learning (Coursera 2023) – NN foundations, BP, regularization.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-zinc-900 dark:via-slate-900 dark:to-zinc-800 text-zinc-900 dark:text-white rounded-lg p-6 shadow-lg border border-blue-100 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-xl font-bold">Availability & Contact</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-200">Based in Israel (UTC+2) • Open to remote</p>
              </div>
              <div className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200 dark:bg-white/10 dark:text-white dark:border-white/10">
                Actively exploring junior roles
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white/70 dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-lg p-3 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-500 dark:text-amber-300" />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">Roles</p>
                  <p className="text-zinc-700 dark:text-zinc-200">Backend / Full-stack • AI/Automation • Data</p>
                </div>
              </div>
              <a
                className="bg-white/70 dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-lg p-3 flex items-center gap-3 hover:bg-white dark:hover:bg-white/10 transition"
                href="mailto:rudyhaddad.job@gmail.com"
              >
                <Mail className="w-5 h-5 text-amber-500 dark:text-amber-300" />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">Email</p>
                  <p className="text-zinc-700 dark:text-zinc-200">rudyhaddad.job@gmail.com</p>
                </div>
              </a>
              <a
                className="bg-white/70 dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-lg p-3 flex items-center gap-3 hover:bg-white dark:hover:bg-white/10 transition"
                href="https://www.linkedin.com/in/rudy-haddad/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="w-5 h-5 text-sky-600 dark:text-sky-300" />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">LinkedIn</p>
                  <p className="text-zinc-700 dark:text-zinc-200">linkedin.com/in/rudy-haddad</p>
                </div>
              </a>
              <a
                className="bg-white/70 dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-lg p-3 flex items-center gap-3 hover:bg-white dark:hover:bg-white/10 transition"
                href="https://github.com/rudy002"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">GitHub</p>
                  <p className="text-zinc-700 dark:text-zinc-200">github.com/rudy002</p>
                </div>
              </a>
              <a
                className="bg-white/70 dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-lg p-3 flex items-center gap-3 hover:bg-white dark:hover:bg-white/10 transition"
                href="https://leetcode.com/u/rudy0202/"
                target="_blank"
                rel="noreferrer"
              >
                <Code className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">LeetCode</p>
                  <p className="text-zinc-700 dark:text-zinc-200">leetcode.com/u/rudy0202</p>
                </div>
              </a>
            </div>
          </div>

          {/* Background & Interests */}
        </div>
      </div>
    </div>
  );
}