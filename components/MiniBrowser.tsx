"use client";

import { useState, useEffect } from "react";
import { Globe, Home, Briefcase, Github, Linkedin, Code, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import BrowserContent from "./BrowserContent";

interface BrowserPage {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  keywords: string[];
}

const PAGES: BrowserPage[] = [
  {
    id: "home",
    name: "Home",
    url: "rudyhaddad.com",
    icon: <Home className="w-4 h-4" />,
    keywords: ["home", "about", "main", "introduction", "hello", "who", "meet"],
  },
  {
    id: "linkedin",
    name: "Professional",
    url: "linkedin.com/in/rudy-haddad",
    icon: <Linkedin className="w-4 h-4" />,
    keywords: ["linkedin", "professional", "network", "career", "job", "experience", "background", "education", "degree", "studies", "work", "position", "company"],
  },
  {
    id: "github",
    name: "GitHub",
    url: "github.com/rudyhaddad",
    icon: <Github className="w-4 h-4" />,
    keywords: ["github", "code", "project", "projects", "repositories", "repo", "open source", "development", "built", "created", "developed"],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    url: "rudyhaddad.com/portfolio",
    icon: <Briefcase className="w-4 h-4" />,
    keywords: ["portfolio", "work", "achievements", "accomplishments", "examples", "made", "built", "created"],
  },
  {
    id: "skills",
    name: "Skills",
    url: "rudyhaddad.com/skills",
    icon: <Code className="w-4 h-4" />,
    keywords: ["skills", "skill", "technologies", "technology", "stack", "tech", "tools", "tool", "master", "know", "capable", "react", "node", "python", "javascript", "typescript"],
  },
];

interface MiniBrowserProps {
  currentTopic?: string;
}

export default function MiniBrowser({ currentTopic }: MiniBrowserProps) {
  const [currentPage, setCurrentPage] = useState(PAGES[0]);
  const [history, setHistory] = useState<BrowserPage[]>([PAGES[0]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0);

  // Automatically detect which page to display based on the topic
  useEffect(() => {
    if (currentTopic) {
      const topicLower = currentTopic.toLowerCase();
      const matchedPage = PAGES.find(page =>
        page.keywords.some(keyword => topicLower.includes(keyword))
      );
      
      if (matchedPage && matchedPage.id !== currentPage.id) {
        navigateToPage(matchedPage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTopic]);

  const navigateToPage = (page: BrowserPage) => {
    setIsLoading(true);
    setCurrentPage(page);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(page);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Force content reload
    setKey(prev => prev + 1);
    
    setTimeout(() => setIsLoading(false), 400);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setIsLoading(true);
      setHistoryIndex(historyIndex - 1);
      setCurrentPage(history[historyIndex - 1]);
      setKey(prev => prev + 1);
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setIsLoading(true);
      setHistoryIndex(historyIndex + 1);
      setCurrentPage(history[historyIndex + 1]);
      setKey(prev => prev + 1);
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const refresh = () => {
    setIsLoading(true);
    setKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 400);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-zinc-900">
      {/* Navigation bar */}
      <div className="flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        {/* Navigation controls */}
        <div className="flex items-center gap-2 p-3 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={goBack}
            disabled={historyIndex === 0}
            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Back"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>
          
          <button
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Forward"
          >
            <ChevronRight className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>
          
          <button
            onClick={refresh}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-zinc-700 dark:text-zinc-300 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* URL bar */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700">
            <Globe className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
              {currentPage.url}
            </span>
          </div>
        </div>

        {/* Quick navigation tabs */}
        <div className="flex gap-1 px-2 py-2 overflow-x-auto">
          {PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => navigateToPage(page)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                currentPage.id === page.id
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {page.icon}
              <span>{page.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Browser area (custom content) */}
      <div className="flex-1 relative bg-white dark:bg-zinc-900 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-900/80 z-10">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-zinc-400 animate-spin" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Loading...
              </p>
            </div>
          </div>
        )}
        
        <div key={key} className="w-full h-full">
          <BrowserContent pageId={currentPage.id} />
        </div>
      </div>

      {/* Current page indicator */}
      <div className="flex-shrink-0 px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
          Viewing: <span className="font-medium text-zinc-700 dark:text-zinc-300">{currentPage.name}</span>
        </p>
      </div>
    </div>
  );
}

