/**
 * Tabs of the fake browser and the vocabulary that routes a conversation to them.
 *
 * Keywords are matched as whole tokens (see `lib/topic-matcher.ts`), never as
 * substrings, so short entries like "ai" only match the standalone word and no
 * longer fire on "em-ai-l" / "m-ai-n" / "av-ai-lable".
 *
 * Multi-word entries ("pull request", "who are you") are matched as a
 * contiguous token sequence and score higher than single words, so the most
 * specific tab wins.
 */

export type PageId = "chat" | "home" | "linkedin" | "github" | "skills";

export interface BrowserPageMeta {
  id: PageId;
  name: string;
  url: string;
  keywords: string[];
}

export const BROWSER_PAGES: BrowserPageMeta[] = [
  {
    id: "chat",
    name: "Chat AI",
    url: "chat.rudyhaddad.com",
    keywords: [
      // English
      "chat", "chatbot", "assistant", "conversation", "talk to you", "ask you",
      // French
      "discuter", "discussion",
      // Hebrew
      "צאט", "שיחה", "עוזר", "בוט", "שיח",
    ],
  },
  {
    id: "home",
    name: "Home",
    url: "rudyhaddad.com",
    keywords: [
      // English. There is deliberately no bare "about" here: a question like
      // "tell me about your projects" must reach the GitHub tab instead.
      "home", "homepage", "about you", "about yourself", "about rudy",
      "who are you", "introduce", "introduction", "presentation", "overview",
      "profile", "bio", "biography", "contact", "email", "reach you",
      "get in touch", "location", "where do you live", "hello", "hi",
      // French
      "accueil", "propos", "presenter", "qui es tu",
      "qui etes vous", "apercu", "profil", "biographie",
      "contacter", "mail", "joindre", "localisation", "bonjour", "salut",
      // Hebrew
      "בית", "אודות", "מי אתה", "הצגה", "פרופיל", "ביוגרפיה", "קשר", "אימייל", "שלום",
    ],
  },
  {
    id: "linkedin",
    name: "Professional",
    url: "linkedin.com/in/rudy-haddad",
    keywords: [
      // English
      "linkedin", "professional", "career", "experience", "work experience",
      "professional experience", "background", "education", "degree",
      "studies", "study", "studied", "graduate", "graduated", "diploma",
      "university", "college", "school",
      "job", "jobs", "position", "role", "roles", "company", "employer",
      "employment", "hire", "hiring", "recruiter", "recruitment", "interview",
      "cv", "resume", "curriculum vitae", "certification", "certifications",
      "certificate", "qualification", "availability", "available",
      "freelance", "internship", "seniority", "junior",
      // Spoken languages live here, not on the Skills tab. Multi-word entries
      // outscore the single "languages" keyword that means programming languages.
      "languages do you speak", "language do you speak", "spoken languages",
      "speak english", "speak french", "speak hebrew",
      // French
      "professionnel", "carriere",
      "experience professionnelle", "parcours", "formation",
      "diplome", "etudes", "universite", "ecole", "emploi", "poste",
      "entreprise", "employeur", "embauche", "recruteur", "recrutement",
      "entretien", "certificat", "etudier", "etudie", "scolarite",
      "disponibilite", "disponible", "stage",
      // Hebrew
      "לינקדאין", "מקצועי", "קריירה", "ניסיון", "רקע", "השכלה", "תואר",
      "לימודים", "אוניברסיטה", "משרה", "חברה", "מעסיק", "מגייס", "ראיון",
      "קורות חיים", "תעודה", "הסמכה", "זמינות",
    ],
  },
  {
    id: "github",
    name: "GitHub",
    url: "github.com/rudy002",
    keywords: [
      // English
      "github", "repository", "repositories", "repo", "repos", "open source",
      "source code", "codebase", "project", "projects", "portfolio",
      "built", "created", "developed", "shipped", "contribution",
      "contributions", "contribute", "pull request", "commit", "commits",
      "fork", "branch", "issue", "surveyflow", "surveypro", "shavtsak",
      "benchmark", "side project", "personal project",
      // Project names, so asking about one opens the right tab
      "poolguard", "pool guard", "studio vision", "studiovision",
      // French
      "depot", "depots", "code source", "projet", "projets",
      "realisations",
      "contribuer", "projet personnel",
      // Hebrew
      "גיטהאב", "מאגר", "מאגרים", "קוד פתוח", "קוד מקור", "פרויקט",
      "פרויקטים", "תרומה", "קומיט",
    ],
  },
  {
    id: "skills",
    name: "Skills",
    url: "rudyhaddad.com/skills",
    keywords: [
      // English
      "skill", "skills", "technology", "technologies", "stack", "tech stack",
      "tooling", "expertise", "competence", "competencies", "proficiency",
      "know how", "framework", "frameworks", "library", "libraries",
      "language", "languages", "programming language", "database",
      "databases", "devops", "testing", "methodology", "agile", "scrum",
      // Concrete technologies
      "react", "nextjs", "next js", "node", "nodejs", "express", "python",
      "javascript", "typescript", "java", "tailwind", "mui", "bootstrap",
      "html", "css", "sql", "nosql", "mongodb", "postgresql", "postgres",
      "mysql", "supabase", "airtable", "pinecone", "docker", "kubernetes",
      "aws", "azure", "gcp", "cloud", "vercel", "render", "graphql", "rest",
      "api", "apis", "webhook", "webhooks", "jest", "vitest", "cypress",
      "webpack", "vite", "npm", "linux", "bash", "pandas", "jupyter",
      "networkx", "sklearn", "pytorch", "fastapi", "systemd", "cloudflare",
      "nextauth", "leaflet", "jwt", "i18n",
      // AI vocabulary
      "ai", "llm", "llms", "rag", "openai", "gpt", "agent", "agents",
      "automation", "n8n", "workflow", "workflows", "machine learning",
      "deep learning", "neural network", "embedding", "embeddings",
      "vector store", "vector database", "vector databases", "prompt",
      "prompts", "mcp", "mcp server", "mcp servers", "cursor", "copilot",
      // Edge AI and computer vision
      "edge ai", "computer vision", "nvidia", "jetson", "orin", "deepstream",
      "peoplenet", "gstreamer", "ffmpeg", "rtsp", "inference", "surveillance",
      // French
      "competences", "outils", "maitrise", "connaissances",
      "savoir faire", "bibliotheque", "langage", "langages",
      "base de donnees", "bases de donnees", "tests", "methodologie",
      "intelligence artificielle", "apprentissage automatique", "automatisation",
      // Hebrew
      "כישורים", "טכנולוגיות", "כלים", "מומחיות", "ידע", "שפה", "שפות",
      "מסד נתונים", "בדיקות", "בינה מלאכותית", "אוטומציה", "סוכן",
    ],
  },
];

export const DEFAULT_DESKTOP_PAGE_ID: PageId = "home";
export const CHAT_PAGE_ID: PageId = "chat";
