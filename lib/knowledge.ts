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
import { extraKnowledge } from "@/data/knowledge";
import { projects } from "@/data/projects";
import { aiSkills, skillCategories, softSkills, technicalSkills } from "@/data/skills";

/**
 * Serialises everything the site knows into one plain-text document for the
 * chat agent.
 *
 * This is the whole point of the architecture: the pages and the agent read the
 * same `data/` modules, so they cannot describe different people. It replaces a
 * Google Drive → vector store ingestion that could only ever *add* knowledge,
 * leaving stale copies of an outdated CV alongside the current one.
 *
 * The corpus is ~2k tokens — small enough to hand to the model whole, which
 * removes retrieval, chunk-boundary errors and the purge-on-update problem.
 */
export function buildKnowledgeDocument(): string {
  const sections: string[] = [];

  sections.push(
    [
      `# ${profile.name} — knowledge base`,
      "",
      "This is the complete, authoritative source about Rudy Haddad.",
      "Answer only from what is written here.",
    ].join("\n"),
  );

  sections.push(
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

  sections.push(["## Summary", "", profile.about, "", profile.linkedinAbout].join("\n"));

  sections.push(
    [
      "## Availability",
      "",
      `- Status: ${availability.status}`,
      `- ${availability.summary}`,
      `- Roles of interest: ${availability.roles}`,
      "",
      ...rolesOfInterest.map((role) => `- ${role.title}: ${role.description}`),
    ].join("\n"),
  );

  sections.push(
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

  sections.push(
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

  sections.push(
    [
      "## Skills",
      "",
      ...skillCategories.map(
        (category) => `### ${category.title}\n${category.chips.join(", ")}\n${category.note}`,
      ),
      "",
      `Technical (condensed): ${technicalSkills.map((s) => s.label).join(", ")}`,
      `AI & automation: ${aiSkills.map((s) => s.label).join(", ")}`,
      `Soft skills: ${softSkills.map((s) => s.label).join(", ")}`,
    ].join("\n"),
  );

  sections.push(
    [
      "## Education and certifications",
      "",
      `- ${education.degree} (${education.period}) — ${education.summary}`,
      ...certifications.map((certification) => `- ${certification}`),
    ].join("\n"),
  );

  sections.push(
    [
      "## Languages",
      "",
      ...languages.map((language) => `- ${language.name}: ${language.level}`),
    ].join("\n"),
  );

  sections.push(
    ["## Key figures", "", ...stats.map((stat) => `- ${stat.value} ${stat.label}`)].join("\n"),
  );

  sections.push(extraKnowledge.trim());

  return `${sections.join("\n\n")}\n`;
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
