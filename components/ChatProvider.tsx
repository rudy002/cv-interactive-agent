"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getCachedAnswer, setCachedAnswer } from "@/lib/chat-cache";
import { decodeSseFrame } from "@/lib/stream";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Set on assistant messages produced by a failed request. */
  isError?: boolean;
  /** Answered from this session's cache, so it appeared instantly. */
  fromCache?: boolean;
  /** Still being streamed in. */
  isStreaming?: boolean;
}

/**
 * A topic to react to, carrying a nonce so consumers can tell two identical
 * messages apart and re-trigger navigation.
 */
export interface TopicSignal {
  text: string;
  nonce: number;
}

interface ChatContextValue {
  messages: ChatMessage[];
  isLoading: boolean;
  topicSignal: TopicSignal | null;
  sendMessage: (text: string) => void;
  retryLast: () => void;
  cancel: () => void;
  canSend: boolean;
  hasAsked: boolean;
}

const SESSION_STORAGE_KEY = "cv-chat-session-id";
const REQUEST_TIMEOUT_MS = 45_000;
export const MAX_MESSAGE_LENGTH = 1000;

export const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi — I'm Rudy Haddad's assistant. 👋\n\nAsk me anything about his background, stack, projects or availability, in English, French or Hebrew. The browser panel follows along and opens the page each answer is about.\n\nIn a hurry? The buttons above get you the CV, his email and his LinkedIn in one tap.",
};

const ChatContext = createContext<ChatContextValue | null>(null);

function createSessionId(): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 11);
  return `session-${Date.now()}-${random}`;
}

/**
 * Reuse the same session id across reloads so the n8n Simple Memory node keeps
 * the conversation thread instead of starting from scratch on every refresh.
 */
function readSessionId(): string {
  if (typeof window === "undefined") return "";

  try {
    const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) return stored;

    const created = createSessionId();
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, created);
    return created;
  } catch {
    // Private browsing / storage disabled: fall back to an ephemeral id.
    return createSessionId();
  }
}

/**
 * Owns the whole conversation.
 *
 * The chat is rendered twice (a dedicated desktop pane and a mobile browser
 * tab). Keeping the state here means the two surfaces stay in sync, and
 * remounting either one — switching tabs, hitting refresh in the fake browser —
 * no longer wipes the history.
 */
export function ChatProvider({ children }: { children: React.ReactNode }) {
  // The welcome message is present from the very first paint: the old 1.2s
  // "typing" animation was pure invented latency in front of an agent that
  // already takes 5–10s to answer.
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [topicSignal, setTopicSignal] = useState<TopicSignal | null>(null);
  const [hasAsked, setHasAsked] = useState(false);

  const sessionIdRef = useRef<string>("");
  const lastUserMessageRef = useRef<string>("");
  const nonceRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const emitTopic = useCallback((text: string) => {
    nonceRef.current += 1;
    setTopicSignal({ text, nonce: nonceRef.current });
  }, []);

  const appendAssistant = useCallback((message: Omit<ChatMessage, "id" | "role">) => {
    setMessages((prev) => [
      ...prev,
      { id: `assistant-${Date.now()}-${prev.length}`, role: "assistant", ...message },
    ]);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!trimmed) return;

      lastUserMessageRef.current = trimmed;
      setHasAsked(true);

      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}-${prev.length}`, role: "user", content: trimmed },
      ]);
      emitTopic(trimmed);

      // Repeat questions — exactly what the suggestion chips encourage — should
      // not pay the 5–10s round trip again.
      const cached = getCachedAnswer(trimmed);
      if (cached) {
        appendAssistant({ content: cached, fromCache: true });
        emitTopic(cached);
        return;
      }

      setIsLoading(true);

      if (!sessionIdRef.current) {
        sessionIdRef.current = readSessionId();
      }

      const controller = new AbortController();
      abortRef.current = controller;
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            sessionId: sessionIdRef.current,
          }),
          signal: controller.signal,
        });

        const contentType = response.headers.get("content-type") ?? "";

        if (response.ok && contentType.includes("text/event-stream") && response.body) {
          const answer = await consumeStream(response.body, controller.signal, setMessages);

          if (answer) {
            setCachedAnswer(trimmed, answer);
            emitTopic(answer);
          }
          return;
        }

        const data = await response.json().catch(() => null);

        if (response.ok && data?.success && typeof data.message === "string") {
          appendAssistant({ content: data.message });
          setCachedAnswer(trimmed, data.message);
          emitTopic(data.message);
          return;
        }

        appendAssistant({
          content:
            response.status === 429
              ? "I'm getting a lot of questions right now. Please wait a moment and try again."
              : "Sorry, an error occurred while reaching the assistant. Please try again.",
          isError: true,
        });
      } catch (error) {
        const aborted = error instanceof DOMException && error.name === "AbortError";

        appendAssistant({
          content: aborted
            ? "The answer was stopped. Ask again whenever you like."
            : "Sorry, I cannot connect to the server. Please try again later.",
          isError: true,
        });
      } finally {
        clearTimeout(timeout);
        abortRef.current = null;
        setIsLoading(false);
      }
    },
    [appendAssistant, emitTopic],
  );

  const sendMessage = useCallback(
    (text: string) => {
      void send(text);
    },
    [send],
  );

  const retryLast = useCallback(() => {
    if (lastUserMessageRef.current) void send(lastUserMessageRef.current);
  }, [send]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const value = useMemo<ChatContextValue>(
    () => ({
      messages,
      isLoading,
      topicSignal,
      sendMessage,
      retryLast,
      cancel,
      canSend: !isLoading,
      hasAsked,
    }),
    [messages, isLoading, topicSignal, sendMessage, retryLast, cancel, hasAsked],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

/**
 * Append an assistant message and grow it as SSE deltas arrive, so the first
 * words are on screen while the model is still writing the rest.
 */
async function consumeStream(
  body: ReadableStream<Uint8Array>,
  signal: AbortSignal,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
): Promise<string> {
  const id = `assistant-${Date.now()}-stream`;
  const reader = body.getReader();
  const decoder = new TextDecoder();

  let buffered = "";
  let answer = "";
  let started = false;
  let failure: string | null = null;

  const push = (content: string, isStreaming: boolean) => {
    setMessages((prev) => {
      if (!started) return prev;
      return prev.map((message) =>
        message.id === id ? { ...message, content, isStreaming } : message,
      );
    });
  };

  try {
    for (;;) {
      if (signal.aborted) break;

      const { done, value } = await reader.read();
      if (done) break;

      buffered += decoder.decode(value, { stream: true });

      // SSE frames are separated by a blank line.
      const frames = buffered.split(/\r?\n\r?\n/);
      buffered = frames.pop() ?? "";

      for (const frame of frames) {
        const event = decodeSseFrame(frame);
        if (!event) continue;

        if (event.kind === "error") {
          failure = event.error;
          continue;
        }
        if (event.kind === "done") continue;

        answer += event.delta;

        if (!started) {
          started = true;
          setMessages((prev) => [
            ...prev,
            { id, role: "assistant", content: answer, isStreaming: true },
          ]);
        } else {
          push(answer, true);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (started) {
    push(answer, false);
    return answer;
  }

  setMessages((prev) => [
    ...prev,
    {
      id,
      role: "assistant",
      content: failure ?? "Sorry, an error occurred while reaching the assistant.",
      isError: true,
    },
  ]);
  return "";
}

export function useChat(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used inside a <ChatProvider>");
  }
  return context;
}
