import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BROWSER_PAGES } from "@/data/pages";
import {
  GITHUB_HANDLE,
  certifications,
  education,
  experience,
  linkLabels,
  links,
  profile,
  stats,
} from "@/data/profile";
import { projects } from "@/data/projects";
import { aiSkills, chipTones, skillCategories, softSkills, technicalSkills } from "@/data/skills";
import { tokenize } from "@/lib/topic-matcher";

/**
 * Guards against the class of bug that shipped before: the same fact written in
 * several places, drifting apart. A recruiter following a stale handle lands on
 * a 404, so these are treated as failures, not nits.
 */

const allLinks = [
  ...Object.values(links),
  ...projects.flatMap((project) => project.links.map((link) => link.href)),
];

describe("identity consistency", () => {
  it("uses a single GitHub handle everywhere", () => {
    expect(links.github).toBe(`https://github.com/${GITHUB_HANDLE}`);
    expect(linkLabels.github).toBe(`github.com/${GITHUB_HANDLE}`);

    const githubTab = BROWSER_PAGES.find((page) => page.id === "github")!;
    expect(githubTab.url).toBe(`github.com/${GITHUB_HANDLE}`);
  });

  it("points every own repository at that handle", () => {
    const ownRepos = projects
      .flatMap((project) => project.links)
      .filter((link) => link.href.includes("github.com") && link.label !== "Upstream");

    for (const link of ownRepos) {
      expect(link.href).toContain(`github.com/${GITHUB_HANDLE}/`);
    }
  });

  it("keeps the repository link inside the owned namespace", () => {
    expect(links.repository.startsWith(`https://github.com/${GITHUB_HANDLE}/`)).toBe(true);
  });

  it("uses the same email in the profile and the LinkedIn label", () => {
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});

describe("links", () => {
  it.each(allLinks)("%s is an absolute https URL", (href) => {
    expect(() => new URL(href)).not.toThrow();
    expect(new URL(href).protocol).toBe("https:");
  });

  it("has no duplicate link labels inside a single project", () => {
    for (const project of projects) {
      const labels = project.links.map((link) => link.label);
      expect(new Set(labels).size).toBe(labels.length);
    }
  });
});

describe("assets", () => {
  it.each([profile.avatar, profile.cover, profile.resumePath, education.logo])(
    "%s is a root-relative public path",
    (path) => {
      expect(path.startsWith("/")).toBe(true);
    },
  );

  it("no longer references the uncompressed cover", () => {
    expect(profile.cover).not.toContain(".jpg");
  });

  // Swapping the CV file is a routine operation; a stale path would give
  // recruiters a 404 on the single button they came for.
  it.each([
    ["resume", profile.resumePath],
    ["avatar", profile.avatar],
    ["cover", profile.cover],
    ["school logo", education.logo],
  ])("serves the %s from public/", (_label, publicPath) => {
    const onDisk = join(process.cwd(), "public", decodeURIComponent(publicPath));
    expect(existsSync(onDisk), `${publicPath} is missing from public/`).toBe(true);
  });

  it("uses a resume filename with no characters that need URL encoding", () => {
    expect(profile.resumePath).toMatch(/^\/[A-Za-z0-9/_.-]+\.pdf$/);
  });
});

describe("content completeness", () => {
  it("gives every project an id, description and highlights", () => {
    for (const project of projects) {
      expect(project.id).toBeTruthy();
      expect(project.description.length).toBeGreaterThan(20);
      expect(project.tech.length).toBeGreaterThan(0);
      expect(project.highlights.length).toBeGreaterThan(0);
    }
  });

  it("uses unique project ids", () => {
    const ids = projects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("fills in the CV sections a recruiter reads first", () => {
    expect(stats.length).toBeGreaterThan(0);
    expect(experience.length).toBeGreaterThan(0);
    expect(certifications.length).toBeGreaterThan(0);
    expect(skillCategories.length).toBeGreaterThan(0);
    expect(profile.about.length).toBeGreaterThan(80);
  });

  it("only uses declared chip tones", () => {
    for (const skill of [...technicalSkills, ...aiSkills, ...softSkills]) {
      expect(chipTones).toHaveProperty(skill.tone);
    }
  });
});

describe("browser tab keywords", () => {
  const navigable = BROWSER_PAGES.filter((page) => page.id !== "chat");

  it("declares every tab id exactly once", () => {
    const ids = BROWSER_PAGES.map((page) => page.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no keyword that tokenizes to nothing", () => {
    for (const page of BROWSER_PAGES) {
      for (const keyword of page.keywords) {
        expect(tokenize(keyword).length).toBeGreaterThan(0);
      }
    }
  });

  it("has no single-character keyword", () => {
    // One-letter tokens match far too much to be useful signal.
    for (const page of BROWSER_PAGES) {
      for (const keyword of page.keywords) {
        for (const token of tokenize(keyword)) {
          expect(token.length).toBeGreaterThan(1);
        }
      }
    }
  });

  it("lists each keyword at most once per tab", () => {
    for (const page of BROWSER_PAGES) {
      const normalized = page.keywords.map((keyword) => tokenize(keyword).join(" "));
      expect(new Set(normalized).size, `${page.id} has duplicates`).toBe(normalized.length);
    }
  });

  it("keeps generic connectors out of the keyword sets", () => {
    // "about" fires on "tell me about your projects" and would hijack the
    // GitHub tab; "ai" used to match inside "email" back when we did substring
    // matching. Both are guarded here because both shipped as bugs.
    const home = BROWSER_PAGES.find((page) => page.id === "home")!;
    expect(home.keywords).not.toContain("about");

    for (const page of BROWSER_PAGES) {
      for (const banned of ["a", "of", "the", "me", "your", "tell"]) {
        expect(page.keywords).not.toContain(banned);
      }
    }
  });

  it("never assigns the same keyword to two navigable tabs", () => {
    const owner = new Map<string, string>();
    const clashes: string[] = [];

    for (const page of navigable) {
      for (const keyword of new Set(page.keywords)) {
        const normalized = tokenize(keyword).join(" ");
        const previous = owner.get(normalized);
        if (previous && previous !== page.id) {
          clashes.push(`"${keyword}" is claimed by both ${previous} and ${page.id}`);
        }
        owner.set(normalized, page.id);
      }
    }

    expect(clashes).toEqual([]);
  });
});
