"use client";

import HomePage from "./pages/HomePage";
import LinkedInPage from "./pages/LinkedInPage";
import GitHubPage from "./pages/GitHubPage";
import ChatInterfaces from "./ChatInterfaces";

import SkillsPage from "./pages/SkillsPage";

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
    case "skills":
      return <SkillsPage />;
    case "chat":
      return <ChatInterfaces />;
    default:
      return <HomePage />;
  }
}
