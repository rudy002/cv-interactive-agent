"use client";

import { useState } from "react";
import { Linkedin, Code2, MapPin, Mail, ExternalLink, Check } from "lucide-react";

export default function HomePage() {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleEmailClick = async () => {
    const email = "rudyhaddad.job@gmail.com";
    const mailtoLink = `mailto:${email}?subject=Contact%20depuis%20le%20CV%20interactif&body=Bonjour%20Rudy%2C%0A%0A`;
    
    // Essayer d'abord d'ouvrir le client de messagerie
    try {
      // Créer un lien temporaire et le cliquer
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Attendre un peu pour voir si le client de messagerie s'ouvre
      setTimeout(() => {
        // Si après 500ms rien ne s'est passé, copier l'email
        copyEmailToClipboard(email);
      }, 500);
    } catch (error) {
      // En cas d'erreur, copier l'email directement
      copyEmailToClipboard(email);
    }
  };

  const copyEmailToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => {
        setEmailCopied(false);
      }, 3000);
    } catch (error) {
      // Fallback pour les navigateurs qui ne supportent pas l'API Clipboard
      const textArea = document.createElement('textarea');
      textArea.value = email;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setEmailCopied(true);
        setTimeout(() => {
          setEmailCopied(false);
        }, 3000);
      } catch (err) {
        console.error('Impossible de copier l\'email:', err);
      }
      document.body.removeChild(textArea);
    }
  };
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
            <img src="/images/linkedin-photo.jpeg" alt="Rudy Haddad" className="w-full h-full object-cover rounded-full" />
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
              <span>Israel</span>
            </div>
            <div className="flex items-center gap-2 relative">
              <Mail className="w-4 h-4" />
              <button
                type="button"
                onClick={handleEmailClick}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded cursor-pointer bg-transparent border-none p-0"
                title="Cliquez pour ouvrir votre client de messagerie ou copier l'email"
              >
                rudyhaddad.job@gmail.com
              </button>
              {emailCopied && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg z-50 whitespace-nowrap">
                  <Check className="w-4 h-4" />
                  <span>copy !</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">5+</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Years in software engineering</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">8+</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Real-world projects (academic, freelance & personal)</div>
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
            As an early-career software engineer, I focus on AI-powered systems, LLM applications and data workflows. I work with React, Next.js, Node.js and Python to build RAG pipelines, automation workflows and web apps that turn raw data into useful products.
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
            href="https://github.com/rudy002/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-xl p-4 transition-colors shadow-lg"
          >
            <Code2 className="w-5 h-5" />
            <span className="font-medium">View GitHub Profile</span>
            <ExternalLink className="w-4 h-4 ml-auto" />
          </a>
        </div>
      </div>
    </div>
  );
}

