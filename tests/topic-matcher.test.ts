import { describe, expect, it } from "vitest";
import { matchTopic, normalize, scoreCandidate, tokenize } from "@/lib/topic-matcher";
import { BROWSER_PAGES } from "@/data/pages";

/** The tabs auto-navigation can actually reach (chat is the surface, not a target). */
const navigable = BROWSER_PAGES.filter((page) => page.id !== "chat");

const routeOf = (text: string) => matchTopic(text, navigable)?.id ?? null;

describe("tokenize / normalize", () => {
  it("lowercases and strips Latin diacritics", () => {
    expect(normalize("Expérience Professionnelle")).toBe("experience professionnelle");
  });

  it("splits on punctuation across scripts", () => {
    expect(tokenize("Next.js, CI/CD & Node!")).toEqual(["next", "js", "ci", "cd", "node"]);
    expect(tokenize("קורות חיים")).toEqual(["קורות", "חיים"]);
  });

  it("returns an empty list for text with no word characters", () => {
    expect(tokenize("!!! ??? ---")).toEqual([]);
  });
});

describe("substring collisions (the regression this module exists for)", () => {
  // Previously `text.includes("ai")` matched inside all of these words and sent
  // every one of them to the chat tab, cancelling navigation entirely.
  const aiTraps = [
    "What is your email address?",
    "Can you explain again your main role?",
    "Are you available for a job?",
    "I want details about your experience",
    "Please explain your training",
  ];

  it.each(aiTraps)("never matches the bare keyword \"ai\" inside %j", (text) => {
    const skills = navigable.find((page) => page.id === "skills")!;
    expect(scoreCandidate(text, skills).matched).not.toContain("ai");
  });

  it("still matches AI as a standalone word", () => {
    expect(routeOf("Do you work with AI?")).toBe("skills");
  });

  it.each([
    ["star", "Let me start over"],
    ["app", "That sounds appealing"],
    ["git", "Are you a digital native?"],
    ["home", "Tell me something homogeneous"],
  ])("does not match %j as a substring", (keyword, text) => {
    for (const page of BROWSER_PAGES) {
      expect(scoreCandidate(text, page).matched).not.toContain(keyword);
    }
  });
});

describe("routing the three on-screen suggestions", () => {
  it("routes the background question to the professional tab", () => {
    expect(routeOf("What's your professional background?")).toBe("linkedin");
  });

  it("routes the skills question to the skills tab", () => {
    expect(routeOf("What are your main skills?")).toBe("skills");
  });

  it("routes the projects question to the GitHub tab", () => {
    expect(routeOf("Tell me about your projects")).toBe("github");
  });
});

describe("routing across languages", () => {
  it.each([
    ["Quelles sont tes compétences techniques ?", "skills"],
    ["Parle-moi de ton expérience professionnelle", "linkedin"],
    ["Montre-moi tes projets sur GitHub", "github"],
    ["Comment te contacter par email ?", "home"],
    ["מה הכישורים שלך?", "skills"],
    ["ספר לי על הניסיון שלך", "linkedin"],
  ])("routes %j to %s", (text, expected) => {
    expect(routeOf(text)).toBe(expected);
  });

  it("matches accented French even though keywords are unaccented", () => {
    expect(routeOf("Parle-moi de ta formation et de ton diplôme")).toBe("linkedin");
  });
});

describe("scoring", () => {
  it("weights a multi-word keyword above a single word", () => {
    const linkedin = navigable.find((page) => page.id === "linkedin")!;
    const single = scoreCandidate("experience", linkedin).score;
    const phrase = scoreCandidate("work experience", linkedin).score;
    expect(phrase).toBeGreaterThan(single);
  });

  it("picks the highest-scoring tab, not the first declared one", () => {
    // "projects" (github) plus "repository" (github) must outweigh "experience".
    expect(routeOf("Which repository shows your best projects?")).toBe("github");
  });

  it("only matches a phrase when its words are contiguous", () => {
    const github = navigable.find((page) => page.id === "github")!;
    expect(scoreCandidate("pull request", github).matched).toContain("pull request");
    expect(scoreCandidate("pull the latest request", github).matched).not.toContain(
      "pull request",
    );
  });
});

describe("no-match behaviour", () => {
  it.each(["", "   ", "hmm", "ok thanks", "42"])("returns null for %j", (text) => {
    expect(matchTopic(text, navigable)).toBeNull();
  });

  it("returns null when there are no candidates", () => {
    expect(matchTopic("tell me about your skills", [])).toBeNull();
  });

  it("ignores degenerate keyword entries", () => {
    expect(scoreCandidate("hello world", { id: "x", keywords: ["", "  ", "!!"] }).score).toBe(0);
  });
});
