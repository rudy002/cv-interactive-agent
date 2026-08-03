import { describe, expect, it } from "vitest";
import {
  decodeSseFrame,
  encodeSseDelta,
  encodeSseDone,
  encodeSseError,
  extractDelta,
  isStreamingContentType,
  parseChunk,
} from "@/lib/stream";

describe("isStreamingContentType", () => {
  it.each([
    "text/event-stream",
    "application/x-ndjson",
    "application/x-ndjson; charset=utf-8",
    "APPLICATION/JSONL",
  ])("recognises %j", (contentType) => {
    expect(isStreamingContentType(contentType)).toBe(true);
  });

  it.each([null, "application/json", "text/html", ""])("rejects %j", (contentType) => {
    expect(isStreamingContentType(contentType)).toBe(false);
  });
});

describe("extractDelta", () => {
  it("reads n8n's streaming item shape", () => {
    expect(extractDelta('{"type":"item","content":"Hello"}')).toBe("Hello");
  });

  it("ignores the envelope frames", () => {
    expect(extractDelta('{"type":"begin","metadata":{}}')).toBeNull();
    expect(extractDelta('{"type":"end","metadata":{}}')).toBeNull();
  });

  it.each([
    ['{"delta":"a"}', "a"],
    ['{"output":"b"}', "b"],
    ['{"text":"c"}', "c"],
    ['{"chunk":"d"}', "d"],
    ['"plain json string"', "plain json string"],
  ])("reads %j", (line, expected) => {
    expect(extractDelta(line)).toBe(expected);
  });

  it("tolerates an SSE data prefix", () => {
    expect(extractDelta('data: {"content":"Hi"}')).toBe("Hi");
  });

  it("treats a non-JSON line as raw text", () => {
    expect(extractDelta("just some text")).toBe("just some text");
  });

  it.each(["", "   ", "[DONE]", "data: [DONE]", "{}", '{"content":""}'])(
    "returns null for %j",
    (line) => {
      expect(extractDelta(line)).toBeNull();
    },
  );
});

describe("parseChunk", () => {
  it("emits complete lines and buffers the partial tail", () => {
    const result = parseChunk("", '{"content":"a"}\n{"content":"b"}\n{"cont');

    expect(result.deltas).toEqual(["a", "b"]);
    expect(result.rest).toBe('{"cont');
  });

  it("stitches a line split across two chunks", () => {
    const first = parseChunk("", '{"content":"hel');
    expect(first.deltas).toEqual([]);

    const second = parseChunk(first.rest, 'lo"}\n');
    expect(second.deltas).toEqual(["hello"]);
  });

  it("handles CRLF line endings", () => {
    expect(parseChunk("", '{"content":"a"}\r\n{"content":"b"}\r\n').deltas).toEqual(["a", "b"]);
  });

  it("skips blank lines", () => {
    expect(parseChunk("", '\n\n{"content":"a"}\n\n').deltas).toEqual(["a"]);
  });
});

describe("SSE round trip", () => {
  it("encodes and decodes a delta", () => {
    const frame = encodeSseDelta("Hello");
    expect(frame.endsWith("\n\n")).toBe(true);
    expect(decodeSseFrame(frame)).toEqual({ kind: "delta", delta: "Hello" });
  });

  it("preserves newlines inside a delta", () => {
    expect(decodeSseFrame(encodeSseDelta("line1\nline2"))).toEqual({
      kind: "delta",
      delta: "line1\nline2",
    });
  });

  it("encodes and decodes completion", () => {
    expect(decodeSseFrame(encodeSseDone("s1"))).toEqual({ kind: "done", sessionId: "s1" });
  });

  it("encodes and decodes an error", () => {
    expect(decodeSseFrame(encodeSseError("boom"))).toEqual({ kind: "error", error: "boom" });
  });

  it.each(["", "no data line", "data: {broken"])("returns null for %j", (frame) => {
    expect(decodeSseFrame(frame)).toBeNull();
  });
});
