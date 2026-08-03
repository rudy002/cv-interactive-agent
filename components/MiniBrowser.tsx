"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Code,
  Code2,
  Copy,
  Download,
  Home,
  Linkedin,
  Lock,
  Moon,
  MoreVertical,
  RefreshCw,
  Share2,
  Star,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import BrowserContent from "./BrowserContent";
import { useChat } from "./ChatProvider";
import {
  BROWSER_PAGES,
  CHAT_PAGE_ID,
  DEFAULT_DESKTOP_PAGE_ID,
  type BrowserPageMeta,
  type PageId,
} from "@/data/pages";
import { links, profile } from "@/data/profile";
import { matchTopic } from "@/lib/topic-matcher";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useClock } from "@/hooks/useClock";

const PAGE_ICONS: Record<PageId, React.ReactNode> = {
  chat: <Bot className="w-4 h-4" aria-hidden="true" />,
  home: <Home className="w-4 h-4" aria-hidden="true" />,
  linkedin: <Linkedin className="w-4 h-4" aria-hidden="true" />,
  github: <Code2 className="w-4 h-4" aria-hidden="true" />,
  skills: <Code className="w-4 h-4" aria-hidden="true" />,
};

const byId = (id: PageId): BrowserPageMeta =>
  BROWSER_PAGES.find((page) => page.id === id) ?? BROWSER_PAGES[0];

const DEFAULT_DESKTOP_PAGE = byId(DEFAULT_DESKTOP_PAGE_ID);
const CHAT_PAGE = byId(CHAT_PAGE_ID);

function StatusClock() {
  const time = useClock();

  return (
    <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">{time}</span>
  );
}

export default function MiniBrowser() {
  const { topicSignal } = useChat();
  const { setTheme, resolvedTheme } = useTheme();

  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState<BrowserPageMeta>(DEFAULT_DESKTOP_PAGE);
  const [history, setHistory] = useState<BrowserPageMeta[]>([DEFAULT_DESKTOP_PAGE]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  /**
   * On mobile the chat *is* a tab, so auto-navigating would yank the user out of
   * the conversation they are typing in. We flag the relevant tab instead.
   */
  const [suggestedPageId, setSuggestedPageId] = useState<PageId | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const lastTopicNonce = useRef(0);

  const visiblePages = useMemo(
    () => (isMobile ? BROWSER_PAGES : BROWSER_PAGES.filter((page) => page.id !== "chat")),
    [isMobile],
  );

  const navigateToPage = useCallback(
    (page: BrowserPageMeta) => {
      if (page.id === currentPage.id) return;

      // No spinner: the pages are local React, so the old 400ms "loading"
      // overlay was invented latency on every single tab click.
      setCurrentPage(page);
      setSuggestedPageId((current) => (current === page.id ? null : current));

      const truncated = history.slice(0, historyIndex + 1);
      setHistory([...truncated, page]);
      setHistoryIndex(truncated.length);

      setContentKey((prev) => prev + 1);
    },
    [currentPage.id, history, historyIndex],
  );

  const resetTo = useCallback((page: BrowserPageMeta) => {
    setCurrentPage(page);
    setHistory([page]);
    setHistoryIndex(0);
    setSuggestedPageId(null);
    setContentKey((prev) => prev + 1);
  }, []);

  // Keep the visible tab valid when crossing the mobile/desktop breakpoint:
  // the chat tab only exists on mobile, and only there is it a valid landing.
  useEffect(() => {
    if (isMobile) {
      resetTo(CHAT_PAGE);
    } else if (currentPage.id === "chat") {
      resetTo(DEFAULT_DESKTOP_PAGE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Route the conversation to the tab it is actually about.
  useEffect(() => {
    if (!topicSignal || topicSignal.nonce === lastTopicNonce.current) return;
    lastTopicNonce.current = topicSignal.nonce;

    // Only ever consider tabs the user can currently reach, and never the chat
    // tab itself — that used to swallow every match and cancel navigation.
    const candidates = BROWSER_PAGES.filter(
      (page) => page.id !== "chat" && page.id !== currentPage.id,
    );

    const match = matchTopic(topicSignal.text, candidates);
    if (!match) return;

    const target = byId(match.id as PageId);

    if (isMobile) {
      setSuggestedPageId(target.id);
    } else {
      navigateToPage(target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicSignal, isMobile, currentPage.id]);

  const goBack = () => {
    if (historyIndex === 0) return;
    setHistoryIndex(historyIndex - 1);
    setCurrentPage(history[historyIndex - 1]);
    setContentKey((prev) => prev + 1);
  };

  const goForward = () => {
    if (historyIndex >= history.length - 1) return;
    setHistoryIndex(historyIndex + 1);
    setCurrentPage(history[historyIndex + 1]);
    setContentKey((prev) => prev + 1);
  };

  /**
   * The only place a spin still makes sense: it is the affordance of a reload
   * button. Kept short and purely decorative — the content swaps immediately.
   */
  const refresh = () => {
    setIsSpinning(true);
    setContentKey((prev) => prev + 1);
    setTimeout(() => setIsSpinning(false), 350);
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission): stay silent,
      // the URL is already visible in the address bar.
    }
  };

  const handleCopyLink = () => {
    void copyToClipboard(window.location.href);
    setIsMenuOpen(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${profile.name} — Interactive CV`,
      text: `Chat with ${profile.name}'s interactive CV`,
      url: window.location.href,
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
      } catch {
        // Share sheet dismissed by the user: nothing to do.
      }
      setIsMenuOpen(false);
      return;
    }

    handleCopyLink();
  };

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = profile.resumePath;
    link.download = profile.resumeDownloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsMenuOpen(false);
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
    setIsMenuOpen(false);
  };

  const handleViewSource = () => {
    window.open(links.repository, "_blank", "noopener,noreferrer");
    setIsMenuOpen(false);
  };

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
    setIsMenuOpen(false);
  };

  const menuItems = [
    { key: "share", icon: Share2, label: "Share", action: handleShare, divider: false },
    {
      key: "copy",
      icon: Copy,
      label: copied ? "Link copied!" : "Copy link",
      action: handleCopyLink,
      divider: false,
    },
    {
      key: "linkedin",
      icon: Linkedin,
      label: "Share on LinkedIn",
      action: handleShareLinkedIn,
      divider: true,
    },
    {
      key: "pdf",
      icon: Download,
      label: "Download PDF",
      action: handleDownloadPDF,
      divider: true,
    },
    {
      key: "source",
      icon: Code2,
      label: "View source on GitHub",
      action: handleViewSource,
      divider: false,
    },
    {
      key: "theme",
      icon: isDark ? Sun : Moon,
      label: isDark ? "Light mode" : "Dark mode",
      action: toggleTheme,
      divider: true,
      hiddenOnMobile: true,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-zinc-100 dark:bg-zinc-950">
      <div className="shrink-0 bg-zinc-200 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800">
        <div
          className="flex items-end gap-1 px-2 pt-2 overflow-x-auto scrollbar-hide"
          role="tablist"
          aria-label="Browser tabs"
        >
          {visiblePages.map((page) => {
            const isActive = currentPage.id === page.id;
            const isSuggested = suggestedPageId === page.id && !isActive;

            return (
              <button
                key={page.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="browser-content"
                onClick={() => navigateToPage(page)}
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-t-lg border-t border-x transition-all cursor-pointer min-w-30 sm:min-w-35 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset ${
                  isActive
                    ? "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 shadow-sm z-10"
                    : "bg-zinc-100 dark:bg-zinc-900/50 border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                <span className="shrink-0 text-zinc-600 dark:text-zinc-400">
                  {PAGE_ICONS[page.id]}
                </span>
                <span
                  className={`text-xs sm:text-sm font-medium truncate ${
                    isActive
                      ? "text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {page.name}
                </span>
                {isSuggested && (
                  <span
                    className="ml-auto w-2 h-2 rounded-full bg-blue-500 motion-safe:animate-pulse shrink-0"
                    title="Related to your last question"
                  >
                    <span className="sr-only">Related to your last question</span>
                  </span>
                )}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goBack}
              disabled={historyIndex === 0}
              className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Go back"
            >
              <ChevronLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={goForward}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Go forward"
            >
              <ChevronRight className="w-4 h-4 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={refresh}
              disabled={isSpinning}
              className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Reload page"
            >
              <RefreshCw
                className={`w-4 h-4 text-zinc-700 dark:text-zinc-300 ${
                  isSpinning ? "motion-safe:animate-spin" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="flex-1 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-300 dark:border-zinc-700 min-w-0 shadow-inner">
            <Lock
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0"
              aria-hidden="true"
            />
            <span className="text-[10px] sm:text-xs md:text-sm text-zinc-700 dark:text-zinc-300 truncate font-medium flex-1 min-w-0">
              https://{currentPage.url}
            </span>
            <div className="ml-auto flex items-center gap-1 shrink-0">
              {isMobile ? (
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-0.5 sm:p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? (
                    <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-600 dark:text-zinc-400" aria-hidden="true" />
                  ) : (
                    <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-600 dark:text-zinc-400" aria-hidden="true" />
                  )}
                </button>
              ) : (
                <Star className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
              )}
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className={`p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isMenuOpen ? "bg-zinc-100 dark:bg-zinc-700" : ""
              }`}
              aria-label="More options"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
            >
              <MoreVertical className="w-4 h-4 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 py-2 z-50"
              >
                {menuItems
                  .filter((item) => !(isMobile && item.hiddenOnMobile))
                  .map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key}>
                        {item.divider && index > 0 && (
                          <div className="my-1 border-t border-zinc-200 dark:border-zinc-700" />
                        )}
                        <button
                          type="button"
                          role="menuitem"
                          onClick={item.action}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
                        >
                          <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span
                            className={
                              item.key === "copy" && copied
                                ? "text-green-600 dark:text-green-400 font-medium"
                                : ""
                            }
                          >
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

      <div
        id="browser-content"
        role="tabpanel"
        aria-label={currentPage.name}
        className="flex-1 relative bg-white dark:bg-zinc-900 overflow-hidden"
      >
        <div key={contentKey} className="w-full h-full overflow-auto">
          <BrowserContent pageId={currentPage.id} />
        </div>
      </div>

      <div className="hidden sm:flex shrink-0 items-center justify-between px-4 py-1.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" aria-hidden="true" />
            <span>Secure connection</span>
          </span>
          <span aria-hidden="true">•</span>
          <span className="truncate">{currentPage.url}</span>
        </div>
        <StatusClock />
      </div>
    </div>
  );
}
