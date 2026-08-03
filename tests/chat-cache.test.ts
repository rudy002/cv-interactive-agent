import { beforeEach, describe, expect, it } from "vitest";
import { cacheKey, clearAnswerCache, getCachedAnswer, setCachedAnswer } from "@/lib/chat-cache";

beforeEach(() => {
  window.sessionStorage.clear();
});

describe("cacheKey", () => {
  it.each([
    ["What's your stack?", "what s your stack"],
    ["  WHAT'S   YOUR STACK ?  ", "what s your stack"],
    ["Quelle est ton expérience ?", "quelle est ton experience"],
  ])("normalises %j", (input, expected) => {
    expect(cacheKey(input)).toBe(expected);
  });

  it("treats punctuation and casing differences as the same question", () => {
    expect(cacheKey("Are you available?")).toBe(cacheKey("are you  available"));
  });

  it("keeps genuinely different questions apart", () => {
    expect(cacheKey("What is your stack?")).not.toBe(cacheKey("What are your projects?"));
  });
});

describe("get/set", () => {
  it("returns an answer stored under an equivalent question", () => {
    setCachedAnswer("What's your stack?", "Next.js and Python.");
    expect(getCachedAnswer("  what's your STACK ? ")).toBe("Next.js and Python.");
  });

  it("returns null for an unknown question", () => {
    expect(getCachedAnswer("never asked")).toBeNull();
  });

  it("ignores empty questions and empty answers", () => {
    setCachedAnswer("   ", "something");
    setCachedAnswer("a real question", "   ");

    expect(getCachedAnswer("   ")).toBeNull();
    expect(getCachedAnswer("a real question")).toBeNull();
  });

  it("expires entries after the TTL", () => {
    const start = 1_000_000;
    setCachedAnswer("question", "answer", start);

    expect(getCachedAnswer("question", start + 29 * 60 * 1000)).toBe("answer");
    expect(getCachedAnswer("question", start + 31 * 60 * 1000)).toBeNull();
  });

  it("overwrites a previous answer for the same question", () => {
    setCachedAnswer("question", "old");
    setCachedAnswer("question", "new");
    expect(getCachedAnswer("question")).toBe("new");
  });

  it("evicts the oldest entries past the cap", () => {
    const start = 1_000_000;
    for (let i = 0; i < 45; i += 1) {
      setCachedAnswer(`question ${i}`, `answer ${i}`, start + i);
    }

    // Read on the same clock, otherwise the TTL check hides the eviction result.
    const now = start + 45;
    expect(getCachedAnswer("question 0", now)).toBeNull();
    expect(getCachedAnswer("question 4", now)).toBeNull();
    expect(getCachedAnswer("question 5", now)).toBe("answer 5");
    expect(getCachedAnswer("question 44", now)).toBe("answer 44");
  });

  it("clears everything on demand", () => {
    setCachedAnswer("question", "answer");
    clearAnswerCache();
    expect(getCachedAnswer("question")).toBeNull();
  });

  it("survives corrupted storage", () => {
    window.sessionStorage.setItem("cv-chat-answers", "{not json");
    expect(getCachedAnswer("question")).toBeNull();
    expect(() => setCachedAnswer("question", "answer")).not.toThrow();
    expect(getCachedAnswer("question")).toBe("answer");
  });
});
