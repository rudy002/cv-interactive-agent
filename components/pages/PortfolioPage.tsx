"use client";

export default function PortfolioPage() {
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

