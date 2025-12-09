"use client";

import { Linkedin, Github, Briefcase, Code, MapPin, Mail, Calendar, ExternalLink, Star, GitFork } from "lucide-react";

interface BrowserContentProps {
  pageId: string;
}

export default function BrowserContent({ pageId }: BrowserContentProps) {
  switch (pageId) {
    case "home":
      return <HomePage />;
    case "linkedin":
      return <LinkedInPage />;
    case "github":
      return <GitHubPage />;
    case "portfolio":
      return <PortfolioPage />;
    case "skills":
      return <SkillsPage />;
    default:
      return <HomePage />;
  }
}

// Home Page
function HomePage() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
            RH
          </div>
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Rudy Haddad
          </h1>
          <p className="text-2xl text-zinc-600 dark:text-zinc-400 mb-6">
            Full-Stack Developer & AI Expert
          </p>
          <div className="flex items-center justify-center gap-4 text-zinc-500 dark:text-zinc-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Paris, France</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>rudy@example.com</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">5+</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Years of experience</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">50+</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Projects completed</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">15+</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Technologies mastered</div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-lg border border-zinc-200 dark:border-zinc-700 mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">About Me</h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Passionate about web development and artificial intelligence, I create innovative solutions 
            that combine technical performance with exceptional user experience. Expert in React, Next.js, 
            Node.js, and Python, I specialize in building modern and scalable applications.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <a 
            href="https://linkedin.com/in/rudy-haddad" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 transition-colors shadow-lg"
          >
            <Linkedin className="w-5 h-5" />
            <span className="font-medium">View LinkedIn Profile</span>
            <ExternalLink className="w-4 h-4 ml-auto" />
          </a>
          <a 
            href="https://github.com/rudyhaddad" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-xl p-4 transition-colors shadow-lg"
          >
            <Github className="w-5 h-5" />
            <span className="font-medium">View GitHub Profile</span>
            <ExternalLink className="w-4 h-4 ml-auto" />
          </a>
        </div>
      </div>
    </div>
  );
}

// LinkedIn Page
function LinkedInPage() {
  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        {/* LinkedIn-style Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>
        <div className="bg-white dark:bg-zinc-900 px-8 pt-4 pb-8 border-b border-zinc-200 dark:border-zinc-800 -mt-16">
          <div className="flex items-end gap-6 mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white dark:border-zinc-900">
              RH
            </div>
            <div className="flex-1 mb-4">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Rudy Haddad</h1>
              <p className="text-lg text-zinc-700 dark:text-zinc-300">Full-Stack Developer | AI Expert | React & Node.js</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Paris, Île-de-France, France • 500+ connections</p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="p-8 space-y-6">
          {/* About */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">About</h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Passionate full-stack developer with over 5 years of experience creating modern and 
              high-performance web applications. Specialized in the JavaScript/TypeScript ecosystem 
              (React, Next.js, Node.js) and artificial intelligence (Python, TensorFlow, LangChain).
              <br /><br />
              I build innovative solutions that combine modern design, optimal performance, and artificial 
              intelligence to deliver exceptional user experiences.
            </p>
          </div>

          {/* Experience */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Experience</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Lead Full-Stack Developer</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">TechCorp • Paris</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    Jan 2022 - Present • 3 years
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                    Technical leadership and development of React/Next.js applications. 
                    Integration of conversational AI and performance optimization.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Full-Stack Developer</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">StartupXYZ • Paris</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    Jan 2020 - Dec 2021 • 2 years
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                    Development of modern web applications with React, TypeScript, and Node.js.
                    Implementation of microservices architecture.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Education</h2>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎓</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Master's in Computer Science</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Paris Diderot University</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500">2017 - 2019</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// GitHub Page
function GitHubPage() {
  const repos = [
    { name: "cv-ai-interactive", desc: "Interactive CV with conversational AI", stars: 42, forks: 8, lang: "TypeScript" },
    { name: "react-dashboard", desc: "Modern dashboard with React and Tailwind", stars: 156, forks: 23, lang: "JavaScript" },
    { name: "node-api-starter", desc: "REST API template with Node.js and Express", stars: 89, forks: 15, lang: "JavaScript" },
    { name: "python-ml-tools", desc: "Machine Learning tools in Python", stars: 67, forks: 12, lang: "Python" },
  ];

  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto p-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow border border-zinc-200 dark:border-zinc-800 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              RH
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Rudy Haddad</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mb-3">@rudyhaddad</p>
              <p className="text-zinc-700 dark:text-zinc-300 mb-4">
                🚀 Full-Stack Developer | 🤖 AI Enthusiast | 💻 Open Source Contributor
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">50+</span>
                  <span className="text-zinc-600 dark:text-zinc-400">repositories</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">354</span>
                  <span className="text-zinc-600 dark:text-zinc-400">contributions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Repositories */}
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Popular repositories</h2>
        <div className="grid gap-4">
          {repos.map((repo, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 rounded-lg p-5 shadow border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-blue-600 dark:text-blue-400 text-lg flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  {repo.name}
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Public
                </span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-3">{repo.desc}</p>
              <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  {repo.lang}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  {repo.forks}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Portfolio Page
function PortfolioPage() {
  const projects = [
    {
      title: "E-Commerce Platform",
      desc: "Complete platform with Stripe payment, inventory management, and analytics",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      image: "🛍️"
    },
    {
      title: "AI Chatbot SaaS",
      desc: "AI chatbot SaaS solution for customer service with multi-channel integration",
      tech: ["Next.js", "Python", "OpenAI", "PostgreSQL"],
      image: "🤖"
    },
    {
      title: "Analytics Dashboard",
      desc: "Real-time dashboard with complex data visualization",
      tech: ["React", "D3.js", "WebSocket", "Redis"],
      image: "📊"
    },
    {
      title: "Social Mobile App",
      desc: "Social mobile app with real-time chat and content sharing",
      tech: ["React Native", "Firebase", "Node.js"],
      image: "📱"
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Portfolio</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">My most significant projects</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl transition-shadow">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-40 flex items-center justify-center text-6xl">
                {project.image}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{project.title}</h3>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-4">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Skills Page
function SkillsPage() {
  const skillCategories = [
    {
      title: "Frontend",
      icon: "⚛️",
      skills: [
        { name: "React / Next.js", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Tailwind CSS", level: 95 },
        { name: "Vue.js", level: 75 },
      ]
    },
    {
      title: "Backend",
      icon: "🔧",
      skills: [
        { name: "Node.js / Express", level: 90 },
        { name: "Python / FastAPI", level: 85 },
        { name: "PostgreSQL / MongoDB", level: 88 },
        { name: "Redis / WebSocket", level: 80 },
      ]
    },
    {
      title: "Artificial Intelligence",
      icon: "🤖",
      skills: [
        { name: "OpenAI / GPT", level: 92 },
        { name: "LangChain", level: 88 },
        { name: "TensorFlow", level: 75 },
        { name: "RAG Systems", level: 85 },
      ]
    },
    {
      title: "DevOps & Tools",
      icon: "🚀",
      skills: [
        { name: "Docker / Kubernetes", level: 82 },
        { name: "CI/CD (GitHub Actions)", level: 85 },
        { name: "AWS / Vercel", level: 80 },
        { name: "Git / GitHub", level: 95 },
      ]
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Skills</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Technologies and tools I master</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{category.title}</h2>
              </div>
              <div className="space-y-4">
                {category.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{skill.name}</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
