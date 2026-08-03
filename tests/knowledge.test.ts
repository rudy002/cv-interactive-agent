import { describe, expect, it } from "vitest";
import { buildKnowledgeDocument, knowledgeFingerprint } from "@/lib/knowledge";
import { isAuthorised } from "@/lib/knowledge-auth";
import { certifications, education, languages, links, profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";

const doc = buildKnowledgeDocument();

/**
 * These tests are the guarantee that replaced the Drive → Pinecone ingestion:
 * whatever the pages show, the agent knows. If someone adds a project and only
 * the pages pick it up, this suite fails.
 */
describe("the agent knows everything the site shows", () => {
  it.each(projects.map((project) => [project.title, project]))(
    "includes the project %s",
    (_title, project) => {
      expect(doc).toContain(project.title);
      expect(doc).toContain(project.description);
      for (const tech of project.tech) {
        expect(doc).toContain(tech);
      }
      for (const highlight of project.highlights) {
        expect(doc).toContain(highlight);
      }
    },
  );

  it.each(skillCategories.map((category) => [category.title, category]))(
    "includes the skill category %s",
    (_title, category) => {
      for (const chip of category.chips) {
        expect(doc).toContain(chip);
      }
    },
  );

  it.each(certifications)("includes the certification %s", (certification) => {
    expect(doc).toContain(certification);
  });

  it.each(languages.map((language) => [language.name, language.level]))(
    "includes %s at level %s",
    (name, level) => {
      expect(doc).toContain(name);
      expect(doc).toContain(level);
    },
  );

  it("includes identity, contact and links", () => {
    expect(doc).toContain(profile.name);
    expect(doc).toContain(profile.headline);
    expect(doc).toContain(profile.email);
    expect(doc).toContain(links.linkedin);
    expect(doc).toContain(links.github);
    expect(doc).toContain(links.site);
  });

  it("includes the education entry", () => {
    expect(doc).toContain(education.degree);
    expect(doc).toContain(education.period);
  });

  it("includes the summary the pages display", () => {
    expect(doc).toContain(profile.about);
  });

  it("links to the downloadable CV", () => {
    expect(doc).toContain(`${links.site}${profile.resumePath}`);
  });

  it("carries the free-form notes that never reach the pages", () => {
    expect(doc).toMatch(/Questions recruiters ask most/i);
    expect(doc).toMatch(/Answer in the language the visitor writes in/i);
  });

  // The assistant must read as an interactive CV, not as a general-purpose bot
  // that happens to know a résumé.
  it("tells the agent to refuse anything outside Rudy's profile", () => {
    expect(doc).toMatch(/Scope/i);
    expect(doc).toMatch(/not a general-purpose AI/i);
    expect(doc).toMatch(/Pythagorean/i);
    // "decline **first**, then offer" — the emphasis wraps the whole phrase.
    expect(doc).toMatch(/decline\s+first/i);
    expect(doc).toMatch(/Do not answer and then redirect/i);
  });

  it("still allows humour and questions about how the site is built", () => {
    expect(doc).toMatch(/Light humour/i);
    expect(doc).toMatch(/how this site and this assistant are built/i);
  });
});

describe("document shape", () => {
  it("stays small enough to sit in a system prompt", () => {
    // ~4 characters per token. Well under any modern context window, which is
    // the reason retrieval was removed in the first place.
    const approximateTokens = doc.length / 4;
    expect(approximateTokens).toBeLessThan(20_000);
  });

  it("is not accidentally empty or truncated", () => {
    expect(doc.length).toBeGreaterThan(2_000);
    expect(doc.trimEnd().endsWith("`")).toBe(false);
  });

  it("opens with a heading that frames it for the model", () => {
    expect(doc.startsWith(`# ${profile.name}`)).toBe(true);
  });

  it("has no unresolved template placeholders", () => {
    expect(doc).not.toContain("undefined");
    expect(doc).not.toContain("[object Object]");
    expect(doc).not.toMatch(/\$\{/);
  });

  it("is deterministic", () => {
    expect(buildKnowledgeDocument()).toBe(doc);
  });
});

describe("access control", () => {
  const withHeaders = (init: Record<string, string>) => new Headers(init);

  it("is public when no token is configured", () => {
    expect(isAuthorised(withHeaders({}), undefined)).toBe(true);
    expect(isAuthorised(withHeaders({}), "")).toBe(true);
  });

  it("accepts a matching bearer token", () => {
    expect(isAuthorised(withHeaders({ authorization: "Bearer s3cret" }), "s3cret")).toBe(true);
  });

  it("accepts the plain header variant n8n finds easier to set", () => {
    expect(isAuthorised(withHeaders({ "x-knowledge-token": "s3cret" }), "s3cret")).toBe(true);
  });

  it.each([
    ["no header at all", {}],
    ["a wrong token", { authorization: "Bearer wrong" }],
    ["a wrong plain header", { "x-knowledge-token": "wrong" }],
    ["the token without the Bearer scheme", { authorization: "s3cret" }],
    ["an empty bearer", { authorization: "Bearer " }],
  ])("rejects %s", (_label, headers) => {
    expect(isAuthorised(withHeaders(headers), "s3cret")).toBe(false);
  });
});

describe("knowledgeFingerprint", () => {
  it("is stable for identical content", () => {
    expect(knowledgeFingerprint(doc)).toBe(knowledgeFingerprint(doc));
  });

  it("changes when the content changes", () => {
    expect(knowledgeFingerprint(doc)).not.toBe(knowledgeFingerprint(`${doc} extra`));
  });

  it("produces an ETag-safe token", () => {
    expect(knowledgeFingerprint(doc)).toMatch(/^[a-z0-9-]+$/);
  });
});
