import { GITHUB_HANDLE, links } from "./profile";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  /** Stable id, also used as React key. */
  id: string;
  /** Repository-style name shown on the GitHub page. */
  repoName: string;
  /** Human-friendly name shown on the LinkedIn page. */
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  links: ProjectLink[];
  highlights: string[];
}

/**
 * Ordered strongest first — this is what a recruiter reads top-down.
 * The first four mirror the CV; the last two are older work the CV no longer
 * lists but that is still worth showing on the GitHub tab.
 */
export const projects: Project[] = [
  {
    id: "poolguard",
    repoName: `${GITHUB_HANDLE}/poolguard`,
    title: "PoolGuard",
    tagline: "Real-time AI pool safety surveillance system",
    description:
      "Edge AI surveillance detecting people near a private pool in real time (1080p H.265 @ 25 fps) on an NVIDIA Jetson Orin Nano — fully local inference, no cloud dependency.",
    tech: [
      "NVIDIA Jetson",
      "DeepStream",
      "PeopleNet INT8",
      "Python",
      "FastAPI",
      "GStreamer",
      "ffmpeg",
      "systemd",
    ],
    links: [
      { label: "GitHub", href: `https://github.com/${GITHUB_HANDLE}/poolguard` },
    ],
    highlights: [
      "Edge AI pipeline with NVIDIA DeepStream (PeopleNet INT8, NvDCF tracking) on a Jetson Orin Nano 8GB — fully local inference, no cloud dependency.",
      "Full alerting logic: auto-arming alarm state machine, alerts within 3 seconds of intrusion via Telegram (with remote arm/disarm), automatic incident recording (ffmpeg, RTSP).",
      "Deployed to production as systemd services with a FastAPI REST API and a live web monitoring interface (status, event history, remote control).",
    ],
  },
  {
    id: "studio-vision",
    repoName: "Studio Vision",
    title: "Studio Vision",
    tagline: "Multilingual real estate photography platform",
    description:
      "Multilingual platform for a real estate photography studio, with an interactive map, an admin dashboard and full i18n — built and deployed for a real client.",
    tech: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Leaflet",
      "Cloudflare R2",
      "AWS SDK",
      "NextAuth",
      "i18n",
    ],
    links: [{ label: "Live", href: "https://studiovision.co.il" }],
    highlights: [
      "Multilingual platform (Next.js 15, TypeScript, Tailwind CSS) with an interactive map (Leaflet), admin dashboard and i18n support.",
      "Integrated Cloudflare R2 (S3-compatible storage) via the AWS SDK, authentication with NextAuth, and deployed for a real client.",
    ],
  },
  {
    id: "surveyflow",
    repoName: `${GITHUB_HANDLE}/SurveyPro (fork)`,
    title: "SurveyFlow",
    tagline: "Advanced web survey application — collaborative project, 2 developers",
    description:
      "Full-stack survey platform supporting standard and conditional surveys with dynamic question flows, built around a visual node-based editor.",
    tech: ["Next.js", "React Flow", "Tailwind CSS", "Node/Express", "MongoDB", "JWT"],
    links: [
      { label: "Live", href: "https://surveyflow.co" },
      { label: "Fork", href: `https://github.com/${GITHUB_HANDLE}/SurveyPro` },
      { label: "Upstream", href: "https://github.com/joey603/SurveyPro" },
    ],
    highlights: [
      "Full-stack survey platform supporting standard and conditional surveys with dynamic question flows.",
      "Visual, node-based editor with React Flow enabling non-technical users to build complex survey logic.",
      "Secure, scalable backend (Node.js, Express, MongoDB, JWT, REST APIs) with a responsive Next.js frontend.",
    ],
  },
  {
    id: "cv-interactive-agent",
    repoName: `${GITHUB_HANDLE}/cv-interactive-agent`,
    title: "Interactive CV",
    tagline: "AI-powered portfolio with chat interface",
    description:
      "Conversational AI portfolio letting recruiters query skills and experience through a chat interface, with a browser panel that follows the conversation.",
    tech: ["Next.js", "TypeScript", "n8n", "OpenAI", "SSE streaming", "Vitest", "Tailwind CSS"],
    links: [
      { label: "Live", href: links.site },
      {
        label: "GitHub",
        href: `https://github.com/${GITHUB_HANDLE}/cv-interactive-agent`,
      },
    ],
    highlights: [
      "Conversational AI portfolio (Next.js, LLM, n8n workflows) letting recruiters query skills and experience through a chat interface.",
      "Measured the knowledge corpus at ~2k tokens and dropped vector retrieval for full-context prompting: one LLM call instead of three, and answers three times faster.",
      "Single source of truth: one endpoint serves the site's own data to the agent, so the pages and the assistant can never describe different people.",
      "Fake browser side-panel that opens the GitHub, LinkedIn or skills page each answer is about.",
    ],
  },
  {
    id: "gpu-cpu-benchmark",
    repoName: `${GITHUB_HANDLE}/gpu-cpu-benchmark-pytorch`,
    title: "GPU vs CPU benchmark",
    tagline: "PyTorch benchmark isolating transfer from compute",
    description:
      "CPU vs NVIDIA GPU benchmark with PyTorch: separates CPU→GPU transfer from GPU compute and tracks VRAM usage.",
    tech: ["Python", "PyTorch", "CUDA", "Benchmarking", "GPU"],
    links: [
      {
        label: "GitHub",
        href: `https://github.com/${GITHUB_HANDLE}/gpu-cpu-benchmark-pytorch`,
      },
    ],
    highlights: [
      "Separates host→device transfer cost from raw GPU compute time.",
      "Tracks VRAM usage across workload sizes.",
    ],
  },
  {
    id: "shavtsak",
    repoName: "Shavtsak guard planner",
    title: "Shavtsak — Guard duty planner",
    tagline: "Scheduling tool for fair guard shifts",
    description:
      "Lightweight React/Vite tool to generate fair guard duty schedules (posts/slots, avoid back-to-back).",
    tech: ["React", "Vite", "JavaScript", "CSS"],
    links: [],
    highlights: [
      "Posts/slots management, automatic assignment, avoids back-to-back shifts.",
      "Built for simple field use; roadmap: constraints, export, roles.",
    ],
  },
];
