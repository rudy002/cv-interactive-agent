"use client";

import { Github, Star, GitFork } from "lucide-react";

export default function GitHubPage() {
  const repos = [
    { name: "cv-ai-interactive", desc: "Interactive CV with conversational AI", stars: 42, forks: 8, lang: "TypeScript" },
    { name: "react-dashboard", desc: "Modern dashboard with React and Tailwind", stars: 156, forks: 23, lang: "JavaScript" },
    { name: "node-api-starter", desc: "REST API template with Node.js and Express", stars: 89, forks: 15, lang: "JavaScript" },
    { name: "python-ml-tools", desc: "Machine Learning tools in Python", stars: 67, forks: 12, lang: "Python" },
  ];

  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto p-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow border border-zinc-200 dark:border-zinc-800 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              RH
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Rudy Haddad</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mb-3">@rudyhaddad</p>
              <p className="text-zinc-700 dark:text-zinc-300 mb-4">
                🚀 Full-Stack Developer | 🤖 AI Enthusiast | 💻 Open Source Contributor
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">50+</span>
                  <span className="text-zinc-600 dark:text-zinc-400">repositories</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">354</span>
                  <span className="text-zinc-600 dark:text-zinc-400">contributions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Repositories */}
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Popular repositories</h2>
        <div className="grid gap-4">
          {repos.map((repo, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 rounded-lg p-5 shadow border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-blue-600 dark:text-blue-400 text-lg flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  {repo.name}
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Public
                </span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-3">{repo.desc}</p>
              <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  {repo.lang}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  {repo.forks}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

