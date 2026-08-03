"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Code2, ExternalLink, Linkedin, Mail, MapPin } from "lucide-react";
import { links, profile, stats } from "@/data/profile";

const MAILTO = `mailto:${profile.email}?subject=${encodeURIComponent(
  "Contact from your interactive CV",
)}&body=${encodeURIComponent("Hi Rudy,\n\n")}`;

export default function HomePage() {
  const [emailCopied, setEmailCopied] = useState(false);

  /**
   * Let the browser follow the `mailto:` normally, and copy the address as a
   * safety net: without a registered mail handler the link silently does
   * nothing, which used to leave visitors with no way to reach out.
   */
  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 3000);
    } catch {
      // Clipboard blocked: the mailto navigation still happens.
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 scroll-smooth">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <header className="text-center mb-16">
          <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl ring-4 ring-white dark:ring-zinc-800">
            <Image
              src={profile.avatar}
              alt={`${profile.name} portrait`}
              width={128}
              height={128}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            {profile.name}
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 mb-6">
            {profile.headline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-500 dark:text-zinc-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2 relative">
              <Mail className="w-4 h-4" aria-hidden="true" />
              <a
                href={MAILTO}
                onClick={handleEmailClick}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
                title="Opens your mail client — the address is copied to your clipboard too"
              >
                {profile.email}
              </a>
              {emailCopied && (
                <div
                  role="status"
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg z-50 whitespace-nowrap"
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Email copied!</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 sm:max-w-2xl mx-auto gap-4 sm:gap-6 mb-12 sm:mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-zinc-800 rounded-xl p-5 sm:p-6 text-center shadow-lg border border-zinc-200 dark:border-zinc-700"
            >
              <div className={`text-3xl sm:text-4xl font-bold mb-2 ${stat.accent}`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <section className="bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-lg border border-zinc-200 dark:border-zinc-700 mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">About Me</h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{profile.about}</p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 transition-all shadow-lg active:scale-[0.98] touch-manipulation min-h-14 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Linkedin className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="font-medium text-sm sm:text-base">View LinkedIn Profile</span>
            <ExternalLink className="w-4 h-4 ml-auto shrink-0" aria-hidden="true" />
          </a>
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-xl p-4 transition-all shadow-lg active:scale-[0.98] touch-manipulation min-h-14 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Code2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="font-medium text-sm sm:text-base">View GitHub Profile</span>
            <ExternalLink className="w-4 h-4 ml-auto shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
