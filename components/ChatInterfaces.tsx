"use client";

import { useState } from "react";
import { useSpeechContext } from "@/contexts/SpeechContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterfaces() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const { speak, stop, isSpeaking } = useSpeechContext();

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulation d'une réponse de l'assistant
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Bonjour ! Je suis votre assistant IA. Je peux vous parler de mon parcours, mes compétences et mes projets. N'hésitez pas à me poser des questions !",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Faire parler si autoSpeak est activé
      if (autoSpeak) {
        speak(assistantMessage.content, { lang: 'fr-FR', rate: 1.0 });
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Zone de messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                Commencez une conversation...
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">RUDY</span>
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-white dark:text-zinc-900">Vous</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input de message */}
      <div className="flex items-center justify-center px-4 pb-6 pt-4">
        <div className="w-full max-w-3xl space-y-3">
          {/* Contrôles audio */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`p-2 rounded-lg transition-colors ${
                  autoSpeak 
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
                title={autoSpeak ? "Son activé" : "Son désactivé"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {autoSpeak ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  )}
                </svg>
              </button>
              {isSpeaking && (
                <button
                  onClick={stop}
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title="Arrêter la lecture"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" />
                  </svg>
                </button>
              )}
            </div>
            {isSpeaking && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                En train de parler...
              </span>
            )}
          </div>

          {/* Input */}
          <div className="relative flex items-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg dark:shadow-zinc-900/50 px-4 py-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="write your message here..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="ml-2 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
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
        </div>
      </div>
    </div>
  );
}

