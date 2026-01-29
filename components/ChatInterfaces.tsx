"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfacesProps {
  onTopicChange?: (topic: string) => void;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! 👋\n\nI'm Rudy Haddad’s virtual assistant. I can answer your questions about:\n\n• My professional background\n• My technical skills\n• My projects and achievements\n• My experience\n\nYou can also ask me to send an email: I’ll generate a ready-to-click `mailto:` link and/or a draft message you can copy/paste.\n\nFeel free to ask me anything! The browser content on the left will automatically adapt to your questions.",
};

const URL_REGEX = /^https?:\/\/[^\s)]+$/i;
const INLINE_MARKUP_REGEX =
  /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+)/g;

const DOMAIN_LABELS: Record<string, string> = {
  "linkedin.com": "LinkedIn",
  "www.linkedin.com": "LinkedIn",
  "github.com": "GitHub",
  "www.github.com": "GitHub",
};

const renderInline = (text: string, keyPrefix: string) => {
  const segments = text.split(INLINE_MARKUP_REGEX).filter(Boolean);

  return segments.map((segment, index) => {
    const key = `${keyPrefix}-inline-${index}`;

    const linkMatch = segment.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (linkMatch) {
      const [, labelText, href] = linkMatch;
      return (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          title={href}
        >
          <span>{labelText}</span>
        </a>
      );
    }

    if (URL_REGEX.test(segment)) {
      let label = segment;
      try {
        const urlObj = new URL(segment);
        const mapped = DOMAIN_LABELS[urlObj.hostname];
        label = mapped || urlObj.hostname.replace(/^www\./, "");
      } catch {
        // keep original segment
      }

      return (
        <a
          key={key}
          href={segment}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          title={segment}
        >
          <span>{label}</span>
        </a>
      );
    }

    if (segment.startsWith("**") && segment.endsWith("**")) {
      return <strong key={key}>{segment.slice(2, -2)}</strong>;
    }

    if (segment.startsWith("*") && segment.endsWith("*")) {
      return <em key={key}>{segment.slice(1, -1)}</em>;
    }

    if (segment.startsWith("`") && segment.endsWith("`")) {
      return (
        <code
          key={key}
          className="rounded bg-zinc-200/70 dark:bg-zinc-800 px-1 py-0.5 text-sm"
        >
          {segment.slice(1, -1)}
        </code>
      );
    }

    return <span key={key}>{segment}</span>;
  });
};

const renderBlock = (block: string, keyPrefix: string) => {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return null;

  const isOrderedList = lines.every((line) => /^\d+[\.\)]\s+/.test(line));
  const isUnorderedList = lines.every((line) => /^[-*•]\s+/.test(line));

  if (isOrderedList) {
    return (
      <ol
        key={`${keyPrefix}-ol`}
        className="list-decimal pl-6 space-y-1.5 marker:text-zinc-500 dark:marker:text-zinc-400"
      >
        {lines.map((line, index) => {
          const text = line.replace(/^\d+[\.\)]\s*/, "");
          return (
            <li key={`${keyPrefix}-ol-${index}`} className="text-base leading-relaxed">
              {renderInline(text, `${keyPrefix}-ol-${index}`)}
            </li>
          );
        })}
      </ol>
    );
  }

  if (isUnorderedList) {
    return (
      <ul
        key={`${keyPrefix}-ul`}
        className="list-disc pl-6 space-y-1.5 marker:text-zinc-500 dark:marker:text-zinc-400"
      >
        {lines.map((line, index) => {
          const text = line.replace(/^[-*•]\s*/, "");
          return (
            <li key={`${keyPrefix}-ul-${index}`} className="text-base leading-relaxed">
              {renderInline(text, `${keyPrefix}-ul-${index}`)}
            </li>
          );
        })}
      </ul>
    );
  }

  const paragraphText = lines.join(" ");

  return (
    <p key={`${keyPrefix}-p`} className="text-base leading-relaxed">
      {renderInline(paragraphText, `${keyPrefix}-p`)}
    </p>
  );
};

const renderMessageContent = (content: string, messageId: string) => {
  const blocks = content.trim().split(/\n\s*\n/);

  return (
    <div className="space-y-3 text-base leading-relaxed">
      {blocks.map((block, index) => renderBlock(block, `${messageId}-block-${index}`))}
    </div>
  );
};

export default function ChatInterfaces({ onTopicChange }: ChatInterfacesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingWelcome, setIsShowingWelcome] = useState(true);
  const [sessionId] = useState(() => 
    `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Animation du message de bienvenue au chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([WELCOME_MESSAGE]);
      setIsShowingWelcome(false);
    }, 2000); // 2 secondes d'animation de typing

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isShowingWelcome]);

  // Remet le focus quand isLoading devient false (après la réponse)
  useEffect(() => {
    if (!isLoading && !isShowingWelcome) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isShowingWelcome]);

  // Focus initial au montage
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Remet le focus après l'animation de bienvenue
  useEffect(() => {
    if (!isShowingWelcome) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isShowingWelcome]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Détecte le sujet pour mettre à jour le MiniBrowser
    if (onTopicChange) {
      onTopicChange(inputValue);
    }
    
    setInputValue("");
    setIsLoading(true);
    
    // Remet le focus sur le champ de saisie après la mise à jour du DOM
    requestAnimationFrame(() => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        
        // Also detect topics in AI responses
        if (onTopicChange) {
          onTopicChange(data.message);
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, an error occurred. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
        console.error('API Error:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I cannot connect to the server. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Le focus sera remis par le useEffect qui surveille isLoading
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const suggestions = [
    "What's your professional background?",
    "What are your main skills?",
    "Tell me about your projects",
  ];

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-white via-zinc-50 to-white dark:from-black dark:via-zinc-950 dark:to-black">
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pt-4 sm:pt-5 pb-2 sm:pb-3">
        <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/85 dark:bg-zinc-900/80 backdrop-blur-md shadow-lg px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">Rudy's Assistant</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate">Clear, concise answers</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-blue-600 dark:text-blue-300 font-semibold px-2 py-1 rounded-full bg-blue-50/80 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex-shrink-0">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Live chat</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/90 to-indigo-600/90 dark:from-blue-500/80 dark:to-indigo-600/80 flex items-center justify-center flex-shrink-0 shadow-sm text-white">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">RH</span>
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 shadow-md ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white dark:from-zinc-100 dark:via-zinc-200 dark:to-white dark:text-zinc-900 border border-zinc-800/70"
                    : "bg-white text-zinc-900 dark:bg-zinc-900/90 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800/80"
                }`}
              >
                {renderMessageContent(message.content, message.id)}
              </div>
              {message.role === "user" && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-5 h-5 text-white dark:text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
          {(isLoading || isShowingWelcome) && (
            <div className="flex gap-4 justify-start animate-in fade-in duration-300">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">RH</span>
              </div>
              <div className="max-w-[80%] rounded-2xl px-5 py-3.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {messages.length === 1 && !isLoading && !isShowingWelcome && (
        <div className="px-3 sm:px-4 pb-2 sm:pb-3">
          <div className="w-full max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-2 sm:mb-2.5 px-1 font-medium">
              Suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 active:bg-zinc-200 dark:active:bg-zinc-700 transition-all border border-zinc-200 dark:border-zinc-700 active:scale-[0.98] touch-manipulation min-h-[40px]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center px-3 sm:px-4 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm safe-area-inset-bottom">
        <div className="w-full max-w-3xl">
          <div className="relative flex items-center rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg dark:shadow-zinc-900/50 px-3 sm:px-4 py-2.5 sm:py-3 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your question..."
              disabled={isLoading || isShowingWelcome}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm sm:text-base disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              onMouseDown={(e) => e.preventDefault()}
              disabled={!inputValue.trim() || isLoading || isShowingWelcome}
              className="ml-2 p-2.5 sm:p-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 active:bg-zinc-800 dark:active:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:bg-zinc-900 dark:disabled:active:bg-zinc-100 touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
              title="Send"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-zinc-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-600 mt-2 sm:mt-2.5 text-center">
            Powered by AI • Up-to-date data
          </p>
        </div>
      </div>
    </div>
  );
}

