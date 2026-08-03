'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Square, Zap } from 'lucide-react';
import { MAX_MESSAGE_LENGTH, useChat } from './ChatProvider';
import CopyButton from './CopyButton';
import RecruiterActions from './RecruiterActions';
import { renderMessageContent } from '@/lib/markdown';
import { STAGE_LABELS, useLoadingStage } from '@/hooks/useLoadingStage';

/**
 * Phrased the way a recruiter screens a candidate, and kept visible for the
 * whole conversation rather than only before the first message.
 */
const SUGGESTIONS = [
  "What's your stack?",
  'Are you available for hire?',
  'Tell me about your projects',
  "What's your professional background?",
  'Where are you based?',
  'Any certifications?',
];

export default function ChatInterfaces() {
  const { messages, isLoading, sendMessage, cancel, canSend, hasAsked } =
    useChat();
  const [inputValue, setInputValue] = useState('');
  const stage = useLoadingStage(isLoading);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, isLoading]);

  // Hand focus back to the input once the assistant is done answering.
  useEffect(() => {
    if (!canSend) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [canSend]);

  const submit = (text: string) => {
    if (!text.trim() || !canSend) return;
    sendMessage(text);
    setInputValue('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-linear-to-b from-white via-zinc-50 to-white dark:from-black dark:via-zinc-950 dark:to-black">
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pt-3 sm:pt-5 pb-2 sm:pb-3">
        <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/85 dark:bg-zinc-900/80 backdrop-blur-md shadow-lg px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                Rudy&apos;s Assistant
              </p>
              <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate">
                Answers in English, French or Hebrew
              </p>
            </div>
          </div>
          <RecruiterActions />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto scroll-smooth"
        role="log"
        aria-live="polite"
        aria-label="Conversation with Rudy's assistant"
      >
        <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 sm:gap-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div
                  className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500/90 to-indigo-600/90 flex items-center justify-center shrink-0 shadow-sm"
                  aria-hidden="true"
                >
                  <span className="text-sm font-semibold text-white">RH</span>
                </div>
              )}
              <div className="max-w-[85%] sm:max-w-[80%] min-w-0">
                <div
                  className={`rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 shadow-md ${
                    message.role === 'user'
                      ? 'bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white dark:from-zinc-100 dark:via-zinc-200 dark:to-white dark:text-zinc-900 border border-zinc-800/70'
                      : message.isError
                        ? 'bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100 border border-red-200 dark:border-red-900/60'
                        : 'bg-white text-zinc-900 dark:bg-zinc-900/90 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800/80'
                  }`}
                >
                  {renderMessageContent(message.content, message.id)}
                  {message.isStreaming && (
                    <span
                      className="inline-block w-1.5 h-4 ml-0.5 align-text-bottom bg-zinc-400 dark:bg-zinc-500 motion-safe:animate-pulse"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* No copy affordance on the welcome blurb or on failures. */}
                {message.role === 'assistant' &&
                  message.id !== 'welcome' &&
                  !message.isError &&
                  !message.isStreaming && (
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <CopyButton
                        text={message.content}
                        label="Copy this answer"
                      />
                      {message.fromCache && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500"
                          title="Answered from this session — no round trip needed"
                        >
                          <Zap className="w-3 h-3" aria-hidden="true" />
                          Instant
                        </span>
                      )}
                    </div>
                  )}
              </div>
              {message.role === 'user' && (
                <div
                  className="w-9 h-9 rounded-full bg-linear-to-br from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-50 flex items-center justify-center shrink-0 shadow-sm"
                  aria-hidden="true"
                >
                  <svg
                    className="w-5 h-5 text-white dark:text-zinc-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 sm:gap-4 justify-start">
              <div
                className="w-9 h-9 rounded-full bg-linear-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center shrink-0 shadow-sm"
                aria-hidden="true"
              >
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  RH
                </span>
              </div>
              <div className="rounded-2xl px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2.5">
                <div className="flex gap-1" aria-hidden="true">
                  <div
                    className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full motion-safe:animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full motion-safe:animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full motion-safe:animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
                {/* Naming the stage keeps a 10s wait legible instead of looking stuck. */}
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {STAGE_LABELS[stage]}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="px-3 sm:px-4 pb-2">
        <div className="w-full max-w-3xl mx-auto">
          {!hasAsked && (
            <p
              id="chat-suggestions-label"
              className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 px-1 font-medium"
            >
              Try one of these:
            </p>
          )}
          <div
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
            aria-labelledby={hasAsked ? undefined : 'chat-suggestions-label'}
            aria-label={hasAsked ? 'Suggested questions' : undefined}
          >
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => submit(suggestion)}
                disabled={!canSend}
                className="shrink-0 px-3 py-1.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-zinc-200 dark:border-zinc-700 active:scale-[0.98] touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-3 sm:px-4 pb-4 sm:pb-6 pt-2 sm:pt-3 border-t border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm safe-area-inset-bottom">
        <div className="w-full max-w-3xl">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submit(inputValue);
            }}
            className="relative flex items-center rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg dark:shadow-zinc-900/50 px-3 sm:px-4 py-2.5 sm:py-3 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors"
          >
            <label htmlFor="chat-input" className="sr-only">
              Ask a question about Rudy Haddad
            </label>
            {/*
              Deliberately never disabled: with a 5–10s answer time, locking the
              field means the visitor sits and waits instead of writing their
              next question. Only sending is gated.
            */}
            <input
              id="chat-input"
              ref={inputRef}
              type="text"
              value={inputValue}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your question..."
              autoComplete="off"
              className="flex-1 bg-transparent outline-hidden text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm sm:text-base"
            />
            {isLoading ? (
              <button
                type="button"
                onClick={cancel}
                className="ml-2 p-2.5 sm:p-3 rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-all touch-manipulation min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Stop generating"
              >
                <Square
                  className="w-3.5 h-3.5 fill-current text-zinc-700 dark:text-zinc-200"
                  aria-hidden="true"
                />
              </button>
            ) : (
              <button
                type="submit"
                onMouseDown={(event) => event.preventDefault()}
                disabled={!inputValue.trim()}
                className="ml-2 p-2.5 sm:p-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Send message"
              >
                <Send
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-zinc-900"
                  aria-hidden="true"
                />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
