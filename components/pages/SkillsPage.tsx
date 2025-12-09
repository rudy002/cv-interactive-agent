"use client";

export default function SkillsPage() {
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

