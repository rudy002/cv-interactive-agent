import {
  availability,
  certifications,
  education,
  experience,
  languages,
  linkLabels,
  links,
  profile,
  rolesOfInterest,
  stats,
} from "@/data/profile";
import { assistantRules, extraKnowledge } from "@/data/knowledge";
import { projects } from "@/data/projects";
import { aiSkills, skillCategories, softSkills, technicalSkills } from "@/data/skills";

/**
 * Serialises everything the site knows into one document for the chat agent.
 *
 * The pages and the agent read the same `data/` modules, so they cannot
 * describe different people. It replaces a Google Drive → vector store
 * ingestion that could only ever *add* knowledge, leaving stale copies of an
 * outdated CV alongside the current one.
 *
 * Two structural choices matter here:
 *
 * 1. **XML delimiters, not headings.** Markdown headings put the facts and the
 *    behavioural rules on the same footing — a second `# H1` made the
 *    instructions look like a chapter of the CV. Tagged blocks give the model
 *    an unambiguous boundary between "things that are true" and "things to do".
 * 2. **No heading collisions.** Programming languages and spoken languages both
 *    used to be called "Languages" in the same document.
 */
export function buildKnowledgeDocument(): string {
  const facts: string[] = [];

  facts.push(
    [
      "## Identity",
      "",
      `- Name: ${profile.name}`,
      `- Title: ${profile.headline}`,
      `- Professional headline: ${profile.linkedinHeadline}`,
      `- Location: ${profile.location} (${profile.timezone})`,
      `- Email: ${profile.email}`,
      `- LinkedIn: ${links.linkedin}`,
      `- GitHub: ${links.github} (${linkLabels.github})`,
      `- LeetCode: ${links.leetcode}`,
      `- Interactive CV: ${links.site}`,
      `- CV as PDF: ${links.site}${profile.resumePath}`,
    ].join("\n"),
  );

  facts.push(
    [
      "## Summary",
      "",
      profile.about,
      "",
      // Quoted and attributed: this one is written in the first person for the
      // LinkedIn page, and an unmarked "I" would drag the assistant's voice
      // out of the third person mid-answer.
      `In his own words: "${profile.linkedinAbout}"`,
    ].join("\n"),
  );

  facts.push(
    [
      "## Roles of interest",
      "",
      `- Looking for: ${availability.roles}`,
      `- Status: ${availability.status}`,
      "",
      ...rolesOfInterest.map((role) => `- ${role.title}: ${role.description}`),
    ].join("\n"),
  );

  facts.push(
    [
      "## Professional experience",
      "",
      ...experience.flatMap((job) => [
        `### ${job.role} — ${job.company}`,
        `${job.location} • ${job.period}`,
        ...job.bullets.map((bullet) => `- ${bullet}`),
        "",
      ]),
    ]
      .join("\n")
      .trimEnd(),
  );

  facts.push(
    [
      "## Projects",
      "",
      ...projects.flatMap((project) => [
        `### ${project.title} — ${project.tagline}`,
        project.description,
        `Technologies: ${project.tech.join(", ")}`,
        ...(project.links.length
          ? [`Links: ${project.links.map((l) => `${l.label} ${l.href}`).join(" | ")}`]
          : []),
        ...project.highlights.map((highlight) => `- ${highlight}`),
        "",
      ]),
    ]
      .join("\n")
      .trimEnd(),
  );

  facts.push(
    [
      "## Technical skills",
      "",
      ...skillCategories.map(
        (category) =>
          `### ${category.title === "Languages" ? "Programming languages" : category.title}\n` +
          `${category.chips.join(", ")}\n${category.note}`,
      ),
      "",
      `Technical (condensed): ${technicalSkills.map((s) => s.label).join(", ")}`,
      `AI & automation: ${aiSkills.map((s) => s.label).join(", ")}`,
      `Soft skills: ${softSkills.map((s) => s.label).join(", ")}`,
    ].join("\n"),
  );

  facts.push(
    [
      "## Education and certifications",
      "",
      `- ${education.degree} (${education.period}) — ${education.summary}`,
      ...certifications.map((certification) => `- ${certification}`),
    ].join("\n"),
  );

  facts.push(
    [
      // Explicitly "spoken": the skills block already owns "Programming languages".
      "## Spoken languages",
      "",
      ...languages.map((language) => `- ${language.name}: ${language.level}`),
    ].join("\n"),
  );

  facts.push(
    ["## Key figures", "", ...stats.map((stat) => `- ${stat.value} ${stat.label}`)].join("\n"),
  );

  facts.push(extraKnowledge.trim());

  return [
    "<knowledge_base>",
    `Facts about ${profile.name}. This is the only source of facts you may use.`,
    "",
    facts.join("\n\n"),
    "</knowledge_base>",
    "",
    "<operating_rules>",
    "How to behave. These are instructions, not facts to recite.",
    "",
    assistantRules.trim(),
    "</operating_rules>",
    "",
  ].join("\n");
}

/**
 * Stable fingerprint of the document, used as an ETag so n8n can skip the
 * transfer when nothing changed.
 */
export function knowledgeFingerprint(document: string): string {
  let hash = 5381;
  for (let i = 0; i < document.length; i += 1) {
    hash = ((hash << 5) + hash + document.charCodeAt(i)) >>> 0;
  }
  return `${hash.toString(36)}-${document.length.toString(36)}`;
}
