import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildKnowledgeDocument } from "@/lib/knowledge";
import { profile } from "@/data/profile";

/**
 * Structural QA on the prompt the model actually receives.
 *
 * The system message is not what is written in n8n — it is the n8n template
 * with the knowledge endpoint spliced in. Auditing either half alone hides the
 * defects that only appear once they are concatenated: duplicate headings,
 * competing H1s, rules restated in two places, first-person leakage.
 */

const workflow = JSON.parse(
  readFileSync(join(process.cwd(), "n8n/rudy-portfolio-agent.json"), "utf8"),
) as { nodes: { name: string; parameters: Record<string, unknown> }[] };

const systemTemplate = (() => {
  const agent = workflow.nodes.find((node) => node.name === "AI Agent");
  const options = agent!.parameters.options as { systemMessage: string };
  return options.systemMessage.replace(/^=/, "");
})();

const knowledge = buildKnowledgeDocument();
const assembled = systemTemplate.replace(
  "{{ $('Fetch knowledge').item.json.data }}",
  knowledge,
);

const headings = (text: string, level: number) =>
  text
    .split("\n")
    .filter((line) => new RegExp(`^#{${level}} [^#]`).test(line))
    .map((line) => line.replace(/^#+\s*/, "").trim());

/**
 * Slice a tagged block. The tag must sit alone on its line: the `# Role`
 * section mentions both tag names inline, and matching those would swallow the
 * whole document.
 */
const block = (tag: string) => {
  const open = assembled.indexOf(`\n<${tag}>\n`);
  const close = assembled.indexOf(`\n</${tag}>`);
  if (open < 0 || close < 0) throw new Error(`block <${tag}> not found on its own line`);
  return assembled.slice(open, close);
};

const knowledgeBase = () => block("knowledge_base");
const operatingRules = () => block("operating_rules");

describe("data / instruction boundary", () => {
  it("wraps facts and rules in distinct, closed blocks", () => {
    for (const tag of ["knowledge_base", "operating_rules"]) {
      expect(assembled).toContain(`<${tag}>`);
      expect(assembled).toContain(`</${tag}>`);
      expect(assembled.indexOf(`<${tag}>`)).toBeLessThan(assembled.indexOf(`</${tag}>`));
    }
  });

  it("puts facts in the knowledge block and rules in the rules block", () => {
    expect(knowledgeBase()).toContain("PoolGuard");
    expect(knowledgeBase()).toContain("Sayeret Haruv");
    expect(knowledgeBase()).not.toContain("Pythagorean");

    expect(operatingRules()).toContain("Pythagorean");
    expect(operatingRules()).not.toContain("PoolGuard");
  });

  it("tells the model what each block is for", () => {
    expect(systemTemplate).toContain("<knowledge_base>");
    expect(systemTemplate).toContain("<operating_rules>");
    expect(systemTemplate).toMatch(/ONLY source of facts/i);
  });

  it("keeps the knowledge document free of competing top-level headings", () => {
    // A second `# H1` inside the data made the instructions look like a
    // chapter of the CV, flattening the distinction the tags now carry.
    expect(headings(knowledge, 1)).toEqual([]);
  });
});

describe("no ambiguity in the assembled prompt", () => {
  it("has no duplicate section heading", () => {
    const all = [...headings(assembled, 1), ...headings(assembled, 2)].map((h) =>
      h.toLowerCase(),
    );
    const seen = new Set<string>();
    const duplicates = all.filter((h) => (seen.has(h) ? true : (seen.add(h), false)));

    expect(duplicates).toEqual([]);
  });

  it("distinguishes programming languages from spoken languages", () => {
    const all = [...headings(assembled, 2), ...headings(assembled, 3)];

    expect(all).toContain("Spoken languages");
    expect(all).toContain("Programming languages");
    // A bare "Languages" heading meant both, in the same document.
    expect(all).not.toContain("Languages");
  });

  it("states the scope rule exactly once", () => {
    const scopeHeadings = [...headings(assembled, 1), ...headings(assembled, 2)].filter((h) =>
      /scope/i.test(h),
    );
    expect(scopeHeadings).toHaveLength(1);
  });
});

describe("persona consistency", () => {
  it("keeps the knowledge base in the third person", () => {
    const leaks = knowledgeBase()
      .split("\n")
      .filter((line) => !line.startsWith("#"))
      .filter((line) => !line.includes("In his own words"))
      .filter((line) => /(^|[^\w'])(I|I'm|my)([^\w']|$)/.test(line));

    expect(leaks, `first-person leakage: ${leaks.join(" | ")}`).toEqual([]);
  });

  it("attributes the one first-person passage as a quotation", () => {
    // profile.linkedinAbout is written in the first person for the LinkedIn
    // page; unmarked, it drags the assistant out of the third person.
    expect(knowledge).toContain(`In his own words: "${profile.linkedinAbout}"`);
  });

  it("instructs the third person explicitly", () => {
    expect(systemTemplate).toMatch(/third person/i);
  });
});

describe("instruction quality", () => {
  it("orders the prompt role → data → rules → workflow instructions", () => {
    const order = [
      assembled.indexOf("# Role"),
      assembled.indexOf("<knowledge_base>"),
      assembled.indexOf("<operating_rules>"),
      assembled.indexOf("# Workflow instructions"),
    ];
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(order.every((index) => index >= 0)).toBe(true);
  });

  it("says which block wins when instructions could conflict", () => {
    expect(systemTemplate).toMatch(/do not override|authoritative/i);
  });

  it("gives the refusal a shape rather than only a prohibition", () => {
    // "Do not X" alone is weaker than "do not X, do Y instead".
    expect(operatingRules()).toMatch(/Suggested shape/i);
    expect(operatingRules()).toMatch(/Decline \*\*first\*\*/i);
  });

  it("guards against instruction-override attempts", () => {
    expect(operatingRules()).toMatch(/ignore your\s+instructions/i);
  });

  it("pins the answer language to the visitor's", () => {
    expect(operatingRules()).toMatch(/language the visitor writes in/i);
  });

  it("forbids the three fabrications that would embarrass a candidate", () => {
    const rules = operatingRules();
    expect(rules).toMatch(/never invent/i);
    expect(rules).toMatch(/never state or estimate a salary/i);
    expect(rules).toMatch(/offer the email address/i);
  });
});

describe("budget", () => {
  it("stays well inside a small model's context window", () => {
    const approximateTokens = assembled.length / 4;
    expect(approximateTokens).toBeLessThan(8_000);
  });

  it("keeps the static prefix large enough to be worth caching", () => {
    // Providers cache prompt prefixes above ~1k tokens; the whole point of a
    // stable, identical block is that it is billed once.
    expect(assembled.length / 4).toBeGreaterThan(1_024);
  });

  it("carries no mis-decoded characters", () => {
    for (const artefact of ["â€", "Ã©", "â¢", "Â"]) {
      expect(assembled).not.toContain(artefact);
    }
  });

  it("leaves no unresolved template expression", () => {
    expect(assembled).not.toMatch(/\{\{/);
    expect(assembled).not.toContain("undefined");
    expect(assembled).not.toContain("[object Object]");
  });
});
