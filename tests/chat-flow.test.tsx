import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ChatInterfaces from "@/components/ChatInterfaces";
import { ChatProvider } from "@/components/ChatProvider";
import { profile } from "@/data/profile";

/** Mimics `/api/chat`, which answers with the `{ success, message }` envelope. */
function mockChatResponse(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  return vi.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    headers: new Headers({ "content-type": "application/json" }),
    json: async () => body,
  });
}

const answering = (message: string) =>
  mockChatResponse({ success: true, message, sessionId: "session-test" });

const user = () => userEvent.setup();

async function typeAndSend(text: string) {
  const session = user();
  await session.type(screen.getByLabelText(/ask a question/i), text);
  await session.click(screen.getByRole("button", { name: /send message/i }));
}

const renderChat = () =>
  render(
    <ChatProvider>
      <ChatInterfaces />
    </ChatProvider>,
  );

beforeEach(() => {
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("first paint", () => {
  // The old build hid the welcome behind a 1.2s fake "typing" animation, in
  // front of an agent that already needs 5-10s. Nothing may be faked now.
  it("shows the welcome message immediately, with no typing delay", () => {
    renderChat();
    expect(screen.getByText(/Rudy Haddad's assistant/i)).toBeInTheDocument();
  });

  it("lets the visitor type straight away", () => {
    renderChat();
    expect(screen.getByLabelText(/ask a question/i)).toBeEnabled();
  });

  it("surfaces the recruiter shortcuts without asking anything", () => {
    renderChat();
    // Read from the data source: swapping the CV file must not break the test.
    expect(screen.getByTitle(/download .* CV/i)).toHaveAttribute(
      "download",
      profile.resumeDownloadName,
    );
    expect(screen.getByTitle(/^Email /i)).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
    expect(screen.getByTitle(/LinkedIn profile/i)).toHaveAttribute(
      "href",
      expect.stringContaining("linkedin.com"),
    );
  });

  it("keeps the suggestions available after the first question", async () => {
    vi.stubGlobal("fetch", answering("Sure."));
    renderChat();

    await user().click(screen.getByRole("button", { name: /what's your stack\?/i }));
    await screen.findByText("Sure.");

    // They used to vanish after one message, stranding anyone who wanted a
    // second angle on the profile.
    expect(screen.getByRole("button", { name: /any certifications\?/i })).toBeInTheDocument();
  });
});

describe("sending a message", () => {
  it("posts the message and renders the answer", async () => {
    const fetchMock = answering("I build AI agents.");
    vi.stubGlobal("fetch", fetchMock);

    renderChat();
    await typeAndSend("What do you do?");

    expect(await screen.findByText("I build AI agents.")).toBeInTheDocument();
    expect(screen.getByText("What do you do?")).toBeInTheDocument();

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/chat");
    expect(JSON.parse(options.body as string)).toMatchObject({ message: "What do you do?" });
  });

  it("sends a stable sessionId across turns", async () => {
    const fetchMock = answering("ok");
    vi.stubGlobal("fetch", fetchMock);

    renderChat();
    await typeAndSend("first");
    await screen.findByText("ok");
    await typeAndSend("second");

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    const ids = fetchMock.mock.calls.map(
      ([, options]) => JSON.parse(options.body as string).sessionId,
    );
    expect(ids[0]).toBeTruthy();
    expect(ids[0]).toBe(ids[1]);
  });

  it("clears the input after sending", async () => {
    vi.stubGlobal("fetch", answering("ok"));

    renderChat();
    await typeAndSend("hello");

    await waitFor(() => expect(screen.getByLabelText(/ask a question/i)).toHaveValue(""));
  });

  it("does not send a whitespace-only message", async () => {
    const fetchMock = answering("ok");
    vi.stubGlobal("fetch", fetchMock);

    renderChat();
    await user().type(screen.getByLabelText(/ask a question/i), "   ");

    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("caps the input at the length the API accepts", () => {
    renderChat();
    expect(screen.getByLabelText(/ask a question/i)).toHaveAttribute("maxLength", "1000");
  });
});

describe("waiting for a slow agent", () => {
  it("names what it is doing instead of showing bare dots", async () => {
    // Never resolves: keeps the pending state on screen.
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    renderChat();
    await typeAndSend("hello");

    expect(await screen.findByText(/reading your question/i)).toBeInTheDocument();
  });

  it("keeps the input usable while the agent thinks", async () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    renderChat();
    await typeAndSend("hello");

    // A 5-10s lockout is the difference between "slow" and "broken".
    expect(await screen.findByLabelText(/ask a question/i)).toBeEnabled();
  });

  it("offers a stop button that ends the wait", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(
        (_url, options: RequestInit) =>
          new Promise((_resolve, reject) => {
            options.signal?.addEventListener("abort", () =>
              reject(new DOMException("aborted", "AbortError")),
            );
          }),
      ),
    );

    renderChat();
    await typeAndSend("hello");

    await user().click(await screen.findByRole("button", { name: /stop generating/i }));

    expect(await screen.findByText(/the answer was stopped/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument(),
    );
  });
});

describe("answer cache", () => {
  it("answers a repeated question instantly, without a second round trip", async () => {
    const fetchMock = answering("My stack is Next.js and Python.");
    vi.stubGlobal("fetch", fetchMock);

    renderChat();
    await typeAndSend("What's your stack?");
    await screen.findByText("My stack is Next.js and Python.");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await typeAndSend("what's your stack?");

    await waitFor(() =>
      expect(screen.getAllByText("My stack is Next.js and Python.")).toHaveLength(2),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/instant/i)).toBeInTheDocument();
  });

  it("still calls the agent for a different question", async () => {
    const fetchMock = answering("Answer.");
    vi.stubGlobal("fetch", fetchMock);

    renderChat();
    await typeAndSend("First question?");
    await screen.findByText("Answer.");
    await typeAndSend("Second question?");

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it("does not cache an error as if it were an answer", async () => {
    const failing = mockChatResponse({ success: false }, { ok: false, status: 502 });
    vi.stubGlobal("fetch", failing);

    renderChat();
    await typeAndSend("Will this fail?");
    await screen.findByText(/an error occurred/i);

    vi.stubGlobal("fetch", answering("Recovered."));
    await typeAndSend("Will this fail?");

    expect(await screen.findByText("Recovered.")).toBeInTheDocument();
  });
});

describe("streaming answers", () => {
  function sseResponse(frames: string[]) {
    const encoder = new TextEncoder();
    return vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "text/event-stream" }),
      body: new ReadableStream<Uint8Array>({
        start(controller) {
          frames.forEach((frame) => controller.enqueue(encoder.encode(frame)));
          controller.close();
        },
      }),
    });
  }

  it("appends deltas as they arrive", async () => {
    vi.stubGlobal(
      "fetch",
      sseResponse([
        'data: {"delta":"I build "}\n\n',
        'data: {"delta":"AI agents."}\n\n',
        'data: {"done":true,"sessionId":"s1"}\n\n',
      ]),
    );

    renderChat();
    await typeAndSend("What do you do?");

    expect(await screen.findByText("I build AI agents.")).toBeInTheDocument();
  });

  it("reassembles deltas split across network chunks", async () => {
    vi.stubGlobal(
      "fetch",
      sseResponse(['data: {"delta":"Hel', 'lo there"}\n\n', 'data: {"done":true}\n\n']),
    );

    renderChat();
    await typeAndSend("hi");

    expect(await screen.findByText("Hello there")).toBeInTheDocument();
  });

  it("surfaces a mid-stream error", async () => {
    vi.stubGlobal("fetch", sseResponse(['data: {"error":"Upstream died"}\n\n']));

    renderChat();
    await typeAndSend("hi");

    expect(await screen.findByText("Upstream died")).toBeInTheDocument();
  });
});

describe("error handling", () => {
  it("surfaces a friendly message when the API fails", async () => {
    vi.stubGlobal(
      "fetch",
      mockChatResponse({ success: false, error: "boom" }, { ok: false, status: 502 }),
    );

    renderChat();
    await typeAndSend("hello");

    expect(await screen.findByText(/an error occurred/i)).toBeInTheDocument();
  });

  it("explains rate limiting distinctly from a generic failure", async () => {
    vi.stubGlobal(
      "fetch",
      mockChatResponse({ success: false, error: "slow down" }, { ok: false, status: 429 }),
    );

    renderChat();
    await typeAndSend("hello");

    expect(await screen.findByText(/a lot of questions right now/i)).toBeInTheDocument();
  });

  it("recovers when the network throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    renderChat();
    await typeAndSend("hello");

    expect(await screen.findByText(/cannot connect to the server/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument(),
    );
  });

  it("never leaves the composer stuck after a malformed payload", async () => {
    vi.stubGlobal("fetch", mockChatResponse({ unexpected: true }));

    renderChat();
    await typeAndSend("hello");

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument(),
    );
  });
});

describe("reading an answer", () => {
  it("lets a recruiter copy an answer", async () => {
    vi.stubGlobal("fetch", answering("Based in Israel, open to remote."));

    // user-event installs its own clipboard stub on setup, so the session must
    // be created once and reused for both the typing and the copy click.
    const session = userEvent.setup();
    renderChat();

    await session.type(screen.getByLabelText(/ask a question/i), "Where are you based?");
    await session.click(screen.getByRole("button", { name: /send message/i }));
    await screen.findByText("Based in Israel, open to remote.");

    await session.click(screen.getByRole("button", { name: /copy this answer/i }));

    await waitFor(async () =>
      expect(await navigator.clipboard.readText()).toBe("Based in Israel, open to remote."),
    );
  });

  it("offers no copy button on an error bubble", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    renderChat();
    await typeAndSend("hello");
    await screen.findByText(/cannot connect/i);

    expect(screen.queryByRole("button", { name: /copy this answer/i })).not.toBeInTheDocument();
  });
});

describe("accessibility", () => {
  it("exposes the transcript as a polite live region", () => {
    renderChat();

    const log = screen.getByRole("log");
    expect(log).toHaveAttribute("aria-live", "polite");
  });

  it("labels the composer controls", () => {
    renderChat();

    expect(screen.getByLabelText(/ask a question/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });
});
