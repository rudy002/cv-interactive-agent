"use client";

import { Linkedin, Github, MapPin, Mail, ExternalLink } from "lucide-react";

export default function HomePage() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
            RH
          </div>
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Rudy Haddad
          </h1>
          <p className="text-2xl text-zinc-600 dark:text-zinc-400 mb-6">
            Full-Stack Developer & AI Expert
          </p>
          <div className="flex items-center justify-center gap-4 text-zinc-500 dark:text-zinc-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Paris, France</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>rudy@example.com</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">5+</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Years of experience</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">50+</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Projects completed</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">15+</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Technologies mastered</div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-lg border border-zinc-200 dark:border-zinc-700 mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">About Me</h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Passionate about web development and artificial intelligence, I create innovative solutions 
            that combine technical performance with exceptional user experience. Expert in React, Next.js, 
            Node.js, and Python, I specialize in building modern and scalable applications.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <a 
            href="https://linkedin.com/in/rudy-haddad" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 transition-colors shadow-lg"
          >
            <Linkedin className="w-5 h-5" />
            <span className="font-medium">View LinkedIn Profile</span>
            <ExternalLink className="w-4 h-4 ml-auto" />
          </a>
          <a 
            href="https://github.com/rudyhaddad" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-xl p-4 transition-colors shadow-lg"
          >
            <Github className="w-5 h-5" />
            <span className="font-medium">View GitHub Profile</span>
            <ExternalLink className="w-4 h-4 ml-auto" />
          </a>
        </div>
      </div>
    </div>
  );
}

