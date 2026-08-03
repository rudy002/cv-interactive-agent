import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderMessageContent } from "@/lib/markdown";

const renderMarkdown = (content: string) =>
  render(<div>{renderMessageContent(content, "m1")}</div>);

describe("inline formatting", () => {
  it("renders bold, italic and inline code", () => {
    const { container } = renderMarkdown("Some **bold**, some *italic*, some `code`.");

    expect(container.querySelector("strong")).toHaveTextContent("bold");
    expect(container.querySelector("em")).toHaveTextContent("italic");
    expect(container.querySelector("code")).toHaveTextContent("code");
  });

  it("leaves unpaired markers as plain text", () => {
    renderMarkdown("2 * 3 = 6 and 4 ** 2 = 16");
    expect(screen.getByText(/2 \* 3 = 6/)).toBeInTheDocument();
  });
});

describe("links", () => {
  it("labels known domains instead of showing the raw URL", () => {
    renderMarkdown("Find me at https://github.com/rudy002");
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/rudy002",
    );
  });

  it("renders Markdown links with their label", () => {
    renderMarkdown("[my profile](https://linkedin.com/in/rudy-haddad)");
    expect(screen.getByRole("link", { name: "my profile" })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/rudy-haddad",
    );
  });

  // The welcome message promises mailto links; the previous regex only accepted
  // http(s), so they rendered as dead plain text.
  it("renders a bare mailto: link", () => {
    renderMarkdown("Write to rudyhaddad.job@gmail.com via mailto:rudyhaddad.job@gmail.com");
    expect(screen.getByRole("link")).toHaveAttribute("href", "mailto:rudyhaddad.job@gmail.com");
  });

  it("renders a Markdown mailto: link", () => {
    renderMarkdown("[Email Rudy](mailto:rudyhaddad.job@gmail.com?subject=Hello)");
    expect(screen.getByRole("link", { name: "Email Rudy" })).toHaveAttribute(
      "href",
      "mailto:rudyhaddad.job@gmail.com?subject=Hello",
    );
  });

  it("opens external links safely and keeps mailto in place", () => {
    renderMarkdown("https://github.com/rudy002 and mailto:a@b.com");
    const [external, mail] = screen.getAllByRole("link");

    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(mail).not.toHaveAttribute("target");
  });

  it("keeps sentence punctuation out of the href", () => {
    renderMarkdown("See https://github.com/rudy002.");
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://github.com/rudy002");
  });

  it("does not turn a javascript: payload into a link", () => {
    const { container } = renderMarkdown("[click me](javascript:alert(1))");
    expect(container.querySelector("a")).toBeNull();
  });

  it("never injects raw HTML from the model", () => {
    const { container } = renderMarkdown('<img src=x onerror="alert(1)">');
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText(/onerror/)).toBeInTheDocument();
  });
});

describe("block formatting", () => {
  it("renders an unordered list", () => {
    renderMarkdown("- React\n- Next.js\n- Node");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("list").tagName).toBe("UL");
  });

  it("renders an ordered list", () => {
    renderMarkdown("1. First\n2. Second");
    expect(screen.getByRole("list").tagName).toBe("OL");
  });

  it("keeps a mixed block as a paragraph", () => {
    const { container } = renderMarkdown("Here is a list:\n- but not really");
    expect(container.querySelector("ul")).toBeNull();
    expect(container.querySelector("p")).toBeInTheDocument();
  });

  it("splits blank-line-separated blocks", () => {
    const { container } = renderMarkdown("First paragraph.\n\nSecond paragraph.");
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });

  it("renders a heading without the hashes", () => {
    renderMarkdown("## Skills");
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.queryByText(/##/)).toBeNull();
  });

  it("renders links inside list items", () => {
    renderMarkdown("- see [repo](https://github.com/rudy002)");
    expect(screen.getByRole("link", { name: "repo" })).toBeInTheDocument();
  });

  it("survives empty content", () => {
    expect(() => renderMarkdown("")).not.toThrow();
  });
});
