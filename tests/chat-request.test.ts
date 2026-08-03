import { describe, expect, it } from "vitest";
import {
  MAX_MESSAGE_LENGTH,
  extractAssistantMessage,
  parseChatRequest,
} from "@/lib/chat-request";

describe("parseChatRequest", () => {
  it("accepts a well-formed body and trims the message", () => {
    const result = parseChatRequest({ message: "  hello  ", sessionId: "session-1-abc" });

    expect(result).toEqual({
      ok: true,
      value: { message: "hello", sessionId: "session-1-abc" },
    });
  });

  it("accepts a body without a sessionId", () => {
    const result = parseChatRequest({ message: "hi" });
    expect(result.ok && result.value.sessionId).toBe("");
  });

  it.each([
    ["null body", null],
    ["a string body", "hello"],
    ["an array body", []],
  ])("rejects %s", (_label, body) => {
    expect(parseChatRequest(body).ok).toBe(false);
  });

  it.each([
    ["a missing message", {}],
    ["a numeric message", { message: 42 }],
    ["an object message", { message: { evil: true } }],
    ["an empty message", { message: "   " }],
  ])("rejects %s", (_label, body) => {
    expect(parseChatRequest(body).ok).toBe(false);
  });

  it("rejects an oversized message", () => {
    const result = parseChatRequest({ message: "x".repeat(MAX_MESSAGE_LENGTH + 1) });
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.error).toContain(String(MAX_MESSAGE_LENGTH));
  });

  it("accepts a message exactly at the limit", () => {
    expect(parseChatRequest({ message: "x".repeat(MAX_MESSAGE_LENGTH) }).ok).toBe(true);
  });

  it.each([
    ["a non-string sessionId", { message: "hi", sessionId: 7 }],
    ["a sessionId with separators", { message: "hi", sessionId: "a/../b" }],
    ["a sessionId with a newline", { message: "hi", sessionId: "abc\ndef" }],
    ["an overlong sessionId", { message: "hi", sessionId: "a".repeat(200) }],
  ])("rejects %s", (_label, body) => {
    expect(parseChatRequest(body).ok).toBe(false);
  });
});

describe("extractAssistantMessage", () => {
  it.each([
    ["the documented n8n array shape", [{ output: "Hello" }]],
    ["a bare object with output", { output: "Hello" }],
    ["a response key", { response: "Hello" }],
    ["a message key", { message: "Hello" }],
    ["a text key", { text: "Hello" }],
    ["a plain string", "Hello"],
    ["a nested array", [[{ output: "Hello" }]]],
  ])("reads %s", (_label, payload) => {
    expect(extractAssistantMessage(payload)).toBe("Hello");
  });

  it("skips empty entries and keeps looking", () => {
    expect(extractAssistantMessage([{ output: "   " }, { output: "Real answer" }])).toBe(
      "Real answer",
    );
  });

  it.each([
    ["null", null],
    ["an empty array", []],
    ["an empty object", {}],
    ["a number", 42],
    ["a blank string", "   "],
    ["a non-string output", { output: { nested: true } }],
  ])("returns null for %s", (_label, payload) => {
    expect(extractAssistantMessage(payload)).toBeNull();
  });
});
