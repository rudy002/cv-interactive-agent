"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, Home, Briefcase, Code2, Linkedin, Code, ChevronLeft, ChevronRight, RefreshCw, Bot, Lock, X, MoreVertical, Star, Share2, Download, Printer, Copy, Moon, Sun, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";
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
    id: "chat",
    name: "Chat AI",
    url: "chat.rudyhaddad.com",
    icon: <Bot className="w-4 h-4" />,
    keywords: [
      // English
      "chat", "ai", "assistant", "question", "conversation", "discuss", "ask", "talk", "speak", "message", "help", "support", "bot", "chatbot",
      // French
      "chat", "discuter", "parler", "question", "demander", "aide", "assistant", "conversation", "message", "bot", "chatbot", "discussion",
      // Hebrew
      "צ'אט", "שיחה", "שאלה", "לשאול", "לשוחח", "לדבר", "עזרה", "עוזר", "בוט", "צ'אטבוט", "שיח", "הודעה"
    ],
  },
  {
    id: "home",
    name: "Home",
    url: "rudyhaddad.com",
    icon: <Home className="w-4 h-4" />,
    keywords: [
      // English
      "home", "about", "main", "introduction", "hello", "who", "meet", "presentation", "overview", "welcome", "profile", "bio", "biography", "present", "introduce",
      // French
      "accueil", "accueillir", "à propos", "présentation", "bonjour", "salut", "qui", "rencontrer", "aperçu", "profil", "biographie", "bio", "présenter", "introduire",
      // Hebrew
      "בית", "עמוד בית", "אודות", "הצגה", "שלום", "מי", "לפגוש", "סקירה", "פרופיל", "ביוגרפיה", "להציג", "להכיר"
    ],
  },
  {
    id: "linkedin",
    name: "Professional",
    url: "linkedin.com/in/rudy-haddad",
    icon: <Linkedin className="w-4 h-4" />,
    keywords: [
      // English
      "linkedin", "professional", "network", "career", "job", "experience", "background", "education", "degree", "studies", "work", "position", "company", "employment", "cv", "resume", "curriculum vitae", "employer", "hire", "hiring", "recruiter", "recruitment", "interview", "employment history", "work experience", "professional experience", "academic", "university", "college", "school", "diploma", "certification", "certificate", "training", "qualification",
      // French
      "linkedin", "professionnel", "réseau", "carrière", "emploi", "travail", "expérience", "parcours", "formation", "éducation", "diplôme", "études", "poste", "entreprise", "cv", "curriculum vitae", "employeur", "embaucher", "recruteur", "recrutement", "entretien", "historique professionnel", "expérience professionnelle", "académique", "université", "école", "certification", "certificat", "formation", "qualification",
      // Hebrew
      "לינקדאין", "מקצועי", "רשת", "קריירה", "עבודה", "תעסוקה", "ניסיון", "רקע", "השכלה", "תואר", "לימודים", "משרה", "חברה", "קורות חיים", "מעסיק", "לשכור", "מגייס", "גיוס", "ראיון", "היסטוריה תעסוקתית", "ניסיון מקצועי", "אקדמי", "אוניברסיטה", "מכללה", "בית ספר", "תעודה", "הסמכה", "הכשרה", "כישורים"
    ],
  },
  {
    id: "github",
    name: "GitHub",
    url: "github.com/rudyhaddad",
    icon: <Code2 className="w-4 h-4" />,
    keywords: [
      // English
      "github", "code", "project", "projects", "repositories", "repo", "open source", "development", "built", "created", "developed", "programming", "coding", "software", "application", "app", "program", "source code", "repository", "git", "version control", "contribution", "contribute", "pull request", "commit", "push", "clone", "fork", "star", "issue", "bug", "feature", "implementation", "algorithm", "data structure", "api", "backend", "frontend", "fullstack", "full stack",
      // French
      "github", "code", "projet", "projets", "dépôts", "dépôt", "open source", "développement", "construit", "créé", "développé", "programmation", "codage", "logiciel", "application", "app", "programme", "code source", "répertoire", "git", "contrôle de version", "contribution", "contribuer", "pull request", "commit", "push", "clone", "fork", "star", "issue", "bug", "fonctionnalité", "implémentation", "algorithme", "structure de données", "api", "backend", "frontend", "fullstack", "full stack",
      // Hebrew
      "גיטהאב", "קוד", "פרויקט", "פרויקטים", "מאגרים", "מאגר", "קוד פתוח", "פיתוח", "נבנה", "נוצר", "מפותח", "תכנות", "קידוד", "תוכנה", "אפליקציה", "אפ", "תוכנית", "קוד מקור", "מאגר", "גיט", "בקרת גרסאות", "תרומה", "לתרום", "pull request", "קומיט", "פוש", "קלון", "פורק", "כוכב", "בעיה", "באג", "תכונה", "יישום", "אלגוריתם", "מבנה נתונים", "api", "בקאנד", "פרונטאנד", "פולסטאק"
    ],
  },
  {
    id: "skills",
    name: "Skills",
    url: "rudyhaddad.com/skills",
    icon: <Code className="w-4 h-4" />,
    keywords: [
      // English
      "skills", "skill", "technologies", "technology", "stack", "tech", "tools", "tool", "master", "know", "capable", "react", "node", "python", "javascript", "typescript", "expertise", "competence", "ability", "proficiency", "knowledge", "know-how", "framework", "library", "language", "programming language", "database", "sql", "nosql", "mongodb", "postgresql", "mysql", "html", "css", "tailwind", "bootstrap", "next.js", "nextjs", "express", "rest", "api", "graphql", "docker", "kubernetes", "aws", "azure", "gcp", "cloud", "devops", "ci/cd", "testing", "jest", "cypress", "webpack", "vite", "npm", "yarn", "git", "linux", "bash", "shell", "agile", "scrum", "methodology",
      // French
      "compétences", "compétence", "technologies", "technologie", "stack", "tech", "outils", "outil", "maîtriser", "connaître", "capable", "react", "node", "python", "javascript", "typescript", "expertise", "aptitude", "capacité", "maîtrise", "connaissance", "savoir-faire", "framework", "bibliothèque", "langage", "langage de programmation", "base de données", "sql", "nosql", "mongodb", "postgresql", "mysql", "html", "css", "tailwind", "bootstrap", "next.js", "nextjs", "express", "rest", "api", "graphql", "docker", "kubernetes", "aws", "azure", "gcp", "cloud", "devops", "ci/cd", "tests", "jest", "cypress", "webpack", "vite", "npm", "yarn", "git", "linux", "bash", "shell", "agile", "scrum", "méthodologie",
      // Hebrew
      "כישורים", "כישור", "טכנולוגיות", "טכנולוגיה", "סטאק", "טק", "כלים", "כלי", "לשלוט", "לדעת", "מסוגל", "ריאקט", "נוד", "פייתון", "ג'אווהסקריפט", "טייפסקריפט", "מומחיות", "יכולת", "כשירות", "ידע", "know-how", "פריימוורק", "ספרייה", "שפה", "שפת תכנות", "מסד נתונים", "sql", "nosql", "מונגודיב", "פוסטגרס", "mysql", "html", "css", "טיילווינד", "בוטסטראפ", "נקסט", "אקספרס", "רסט", "api", "גרף קיו אל", "דוקר", "קוברנטיס", "aws", "אזור", "gcp", "ענן", "דבופס", "ci/cd", "בדיקות", "ג'סט", "סייפרס", "וובפאק", "ויט", "npm", "יארן", "גיט", "לינוקס", "באש", "של", "אג'יל", "סקראם", "מתודולוגיה"
    ],
  },
];
const DEFAULT_DESKTOP_PAGE = PAGES.find((p) => p.id === "home") || PAGES[1];
const CHAT_PAGE = PAGES.find((p) => p.id === "chat") || PAGES[0];

interface MiniBrowserProps {
  currentTopic?: string;
}

export default function MiniBrowser({ currentTopic }: MiniBrowserProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(DEFAULT_DESKTOP_PAGE);
  const [history, setHistory] = useState<BrowserPage[]>([DEFAULT_DESKTOP_PAGE]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const visiblePages = isMobile ? PAGES : PAGES.filter((p) => p.id !== "chat");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Sync current page when switching between mobile and desktop
  useEffect(() => {
    if (!isMobile && currentPage.id === "chat") {
      setCurrentPage(DEFAULT_DESKTOP_PAGE);
      setHistory([DEFAULT_DESKTOP_PAGE]);
      setHistoryIndex(0);
      setKey((prev) => prev + 1);
      return;
    }
    if (isMobile && currentPage.id !== "chat") {
      setCurrentPage(CHAT_PAGE);
      setHistory([CHAT_PAGE]);
      setHistoryIndex(0);
      setKey((prev) => prev + 1);
    }
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Automatically detect which page to display based on the topic
  useEffect(() => {
    if (currentTopic) {
      const topicLower = currentTopic.toLowerCase();
      const matchedPage = PAGES.find(page =>
        page.keywords.some(keyword => topicLower.includes(keyword))
      );
      
      if (matchedPage && matchedPage.id !== currentPage.id && (isMobile || matchedPage.id !== "chat")) {
        navigateToPage(matchedPage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTopic, isMobile]);

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    copyToClipboard(url);
    setIsMenuOpen(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: `CV de Rudy Haddad - ${currentPage.name}`,
      text: `Découvrez mon CV interactif - ${currentPage.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setIsMenuOpen(false);
      } catch (err) {
        // L'utilisateur a annulé le partage
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier le lien
      handleCopyLink();
    }
  };

  const handleDownloadPDF = () => {
    // Télécharger le fichier PDF depuis le dossier public
    const pdfPath = '/fichierPDF/Rudy Haddad - FullStack.pdf';
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = 'Rudy_Haddad_FullStack.pdf'; // Nom du fichier téléchargé
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsMenuOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setIsMenuOpen(false);
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(linkedInUrl, '_blank');
    setIsMenuOpen(false);
  };

  const handleViewSource = () => {
    window.open('https://github.com/rudyhaddad/cv-agent', '_blank');
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    const isDark = resolvedTheme === 'dark';
    setTheme(isDark ? 'light' : 'dark');
    setIsMenuOpen(false);
  };

  const isDark = resolvedTheme === 'dark';

  const menuItems = [
    {
      icon: Share2,
      label: "Share",
      action: handleShare,
      divider: false,
    },
    {
      icon: Copy,
      label: copied ? "Link copied!" : "Copy link",
      action: handleCopyLink,
      divider: false,
    },
    {
      icon: Linkedin,
      label: "Share on LinkedIn",
      action: handleShareLinkedIn,
      divider: true,
    },
    {
      icon: Download,
      label: "Download PDF",
      action: handleDownloadPDF,
      divider: true,
    },
    {
      icon: isDark ? Sun : Moon,
      label: isDark ? "Light mode" : "Dark mode",
      action: toggleTheme,
      divider: false,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-zinc-100 dark:bg-zinc-950">
      {/* Browser Chrome - Top Bar */}
      <div className="flex-shrink-0 bg-zinc-200 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800">
        {/* Tabs Bar */}
        <div className="flex items-end gap-1 px-2 pt-2 overflow-x-auto scrollbar-hide">
          {visiblePages.map((page) => (
            <div
              key={page.id}
              onClick={() => navigateToPage(page)}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-t-lg border-t border-x transition-all cursor-pointer min-w-[120px] sm:min-w-[140px] ${
                currentPage.id === page.id
                  ? "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 shadow-sm z-10"
                  : "bg-zinc-100 dark:bg-zinc-900/50 border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              <span className="flex-shrink-0 text-zinc-600 dark:text-zinc-400">
                {page.icon}
              </span>
              <span className={`text-xs sm:text-sm font-medium truncate ${
                currentPage.id === page.id
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}>
                {page.name}
              </span>
              {currentPage.id === page.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </div>
          ))}
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
          <button
            onClick={goBack}
            disabled={historyIndex === 0}
              className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Back"
          >
              <ChevronLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>
          
          <button
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
              className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Forward"
          >
              <ChevronRight className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>
          
          <button
            onClick={refresh}
            disabled={isLoading}
              className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 transition-all"
            title="Refresh"
          >
              <RefreshCw className={`w-4 h-4 text-zinc-700 dark:text-zinc-300 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          </div>

          {/* URL Bar - Style Chrome/Safari */}
          <div className="flex-1 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-300 dark:border-zinc-700 min-w-0 shadow-inner">
            <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs md:text-sm text-zinc-700 dark:text-zinc-300 truncate font-medium flex-1 min-w-0">
              https://{currentPage.url}
            </span>
            <div className="ml-auto flex items-center gap-1 flex-shrink-0">
              {isMobile ? (
                <button
                  onClick={toggleTheme}
                  className="p-0.5 sm:p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  title={isDark ? "Light mode" : "Dark mode"}
                >
                  {isDark ? (
                    <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-600 dark:text-zinc-400" />
                  ) : (
                    <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-600 dark:text-zinc-400" />
                  )}
                </button>
              ) : (
                <Star className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 hover:text-yellow-500 cursor-pointer transition-colors" />
              )}
          </div>
        </div>

          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all ${
                isMenuOpen ? 'bg-zinc-100 dark:bg-zinc-700' : ''
              }`}
              title="More options"
            >
              <MoreVertical className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            </button>

            {/* Menu Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 py-2 z-50">
                {menuItems
                  .filter((item) => {
                    // Cacher le toggle de thème en mode mobile (il est dans la barre de recherche)
                    if (isMobile && (item.label === "Light mode" || item.label === "Dark mode")) {
                      return false;
                    }
                    return true;
                  })
                  .map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index}>
                        {item.divider && index > 0 && (
                          <div className="my-1 border-t border-zinc-200 dark:border-zinc-700" />
                        )}
                        <button
                          onClick={item.action}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left"
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className={copied && item.label.includes("copied") ? "text-green-600 dark:text-green-400 font-medium" : ""}>
                            {item.label}
                          </span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Browser Content Area */}
      <div className="flex-1 relative bg-white dark:bg-zinc-900 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 z-20 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                Loading...
              </p>
            </div>
          </div>
        )}
        
        <div key={key} className="w-full h-full overflow-auto">
          <BrowserContent pageId={currentPage.id} />
        </div>
      </div>

      {/* Status Bar */}
      <div className="hidden sm:flex flex-shrink-0 items-center justify-between px-4 py-1.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Secure connection</span>
          </span>
          <span>•</span>
          <span>{currentPage.url}</span>
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

