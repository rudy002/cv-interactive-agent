/**
 * Single source of truth for identity, contact and headline copy.
 *
 * Kept in sync with `public/fichierPDF/Rudy-Haddad-CV.pdf`. Every page (and
 * ideally the n8n knowledge base) reads from here so the chat answers and the
 * rendered pages can never drift apart.
 */

export const GITHUB_HANDLE = "rudy002";

export const profile = {
  name: "Rudy Haddad",
  headline: "Software Engineer",
  linkedinHeadline:
    "Software Engineer | Full-Stack & Edge AI | RAG, Automation, React & Node.js",
  location: "Israel",
  timezone: "UTC+2",
  email: "rudyhaddad.job@gmail.com",
  avatar: "/images/linkedin-photo.jpeg",
  cover: "/images/linkedin-cover.webp",
  // No spaces in the filename: the old path needed %20 encoding in every link.
  resumePath: "/fichierPDF/Rudy-Haddad-CV.pdf",
  resumeDownloadName: "Rudy_Haddad_CV.pdf",
  about:
    "Software Engineer building full-stack systems and edge AI solutions, with production projects spanning RAG chatbots, automation pipelines (n8n, Python), and real-time computer vision on NVIDIA Jetson. Experienced in AI-assisted development (Claude, Cursor, GitHub Copilot) and shipping features end-to-end, from design to deployment.",
  linkedinAbout:
    "Software Engineer based in Israel, working across full-stack web and edge AI. As a freelancer I ship production systems end-to-end: RAG chatbots grounded in real documents, n8n and Python automation pipelines, and real-time computer vision running locally on NVIDIA Jetson. I enjoy owning a problem from design to deployment — API and data-flow design first, frontend whenever it is what actually delivers the product.",
  githubBio:
    "Software Engineer — full-stack, edge AI and automation. Next.js, Python, n8n, RAG and NVIDIA DeepStream. Building production systems for real clients.",
} as const;

export const links = {
  linkedin: "https://www.linkedin.com/in/rudy-haddad/",
  github: `https://github.com/${GITHUB_HANDLE}`,
  leetcode: "https://leetcode.com/u/rudy0202/",
  repository: `https://github.com/${GITHUB_HANDLE}/cv-interactive-agent`,
  // Both Vercel deployments resolve; this is the one printed on the CV, so it
  // is the canonical target for search engines and social previews.
  site: "https://rudy-haddad-ai.vercel.app",
} as const;

/** Display-only labels (no protocol) used in the fake browser and contact cards. */
export const linkLabels = {
  linkedin: "linkedin.com/in/rudy-haddad",
  github: `github.com/${GITHUB_HANDLE}`,
  leetcode: "leetcode.com/u/rudy0202",
} as const;

export const stats = [
  {
    value: "10+",
    label: "Full-stack websites delivered for real clients",
    accent: "text-purple-600 dark:text-purple-400",
  },
  {
    value: "25+",
    label: "Technologies across web, data and edge AI",
    accent: "text-green-600 dark:text-green-400",
  },
] as const;

export const availability = {
  status: "Open to new opportunities",
  summary: `Based in ${profile.location} (${profile.timezone}) • Open to remote`,
  roles: "Software Engineering • Full-Stack • AI & Edge AI",
} as const;

export const rolesOfInterest = [
  {
    title: "Full-Stack Engineering",
    description:
      "APIs, data flows, integrations. Owns the core logic and ships the product end-to-end.",
    tone: "blue",
  },
  {
    title: "AI & Automation",
    description:
      "RAG pipelines, LLM integration, tool-using agents, n8n and Python workflows.",
    tone: "purple",
  },
  {
    title: "Edge AI & Computer Vision",
    description:
      "Real-time inference on NVIDIA Jetson with DeepStream, fully local, no cloud dependency.",
    tone: "amber",
  },
] as const;

export const experience = [
  {
    role: "Freelance Software Engineer",
    company: "Self-Employed (Web Development & AI Solutions)",
    location: "Israel (remote)",
    period: "2024 – Present",
    bullets: [
      "Built and deployed AI-powered chatbots with RAG architecture (vector database + LLM), delivering accurate, document-grounded answers to customer questions without human intervention.",
      "Delivered 10+ full-stack websites for small businesses (retail, services, real estate) using React, Next.js, Node.js and TypeScript.",
      "Designed automation pipelines with n8n and Python (email workflows, AI agents, scraping, notifications), streamlining repetitive operations for non-technical clients.",
    ],
  },
] as const;

export const education = {
  degree: "B.Sc. Software Engineering — Shamoon College of Engineering (SCE)",
  period: "2020 – 2025 | Israel",
  summary: "Software engineering, algorithms & data structures, DB, OS, networks, ML.",
  logo: "/images/sce-logo.png",
} as const;

export const certifications = [
  "NVIDIA-Certified Associate: AI Infrastructure and Operations (2026)",
  "AI Automation: Build LLM Apps & AI-Agents with n8n & APIs — Udemy (2025)",
] as const;

export const languages = [
  { name: "French", level: "Native" },
  { name: "Hebrew", level: "Fluent" },
  { name: "English", level: "Advanced" },
] as const;
