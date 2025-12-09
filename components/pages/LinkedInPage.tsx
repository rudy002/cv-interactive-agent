"use client";

import { Briefcase, Code, Calendar } from "lucide-react";

export default function LinkedInPage() {
  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        {/* LinkedIn-style Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>
        <div className="bg-white dark:bg-zinc-900 px-8 pt-4 pb-8 border-b border-zinc-200 dark:border-zinc-800 -mt-16">
          <div className="flex items-end gap-6 mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white dark:border-zinc-900">
              RH
            </div>
            <div className="flex-1 mb-4">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Rudy Haddad</h1>
              <p className="text-lg text-zinc-700 dark:text-zinc-300">Full-Stack Developer | AI Expert | React & Node.js</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Paris, Île-de-France, France • 500+ connections</p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="p-8 space-y-6">
          {/* About */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">About</h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Passionate full-stack developer with over 5 years of experience creating modern and 
              high-performance web applications. Specialized in the JavaScript/TypeScript ecosystem 
              (React, Next.js, Node.js) and artificial intelligence (Python, TensorFlow, LangChain).
              <br /><br />
              I build innovative solutions that combine modern design, optimal performance, and artificial 
              intelligence to deliver exceptional user experiences.
            </p>
          </div>

          {/* Experience */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Experience</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Lead Full-Stack Developer</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">TechCorp • Paris</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    Jan 2022 - Present • 3 years
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                    Technical leadership and development of React/Next.js applications. 
                    Integration of conversational AI and performance optimization.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Full-Stack Developer</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">StartupXYZ • Paris</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    Jan 2020 - Dec 2021 • 2 years
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                    Development of modern web applications with React, TypeScript, and Node.js.
                    Implementation of microservices architecture.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Education</h2>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎓</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Master's in Computer Science</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Paris Diderot University</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500">2017 - 2019</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

