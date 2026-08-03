import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { links, profile } from "@/data/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = `${profile.name} — Interactive CV`;
const description =
  "Chat with an AI agent that knows Rudy Haddad's background, skills and projects — instead of reading a static PDF.";

export const metadata: Metadata = {
  metadataBase: new URL(links.site),
  title: {
    default: title,
    template: `%s — ${profile.name}`,
  },
  description,
  applicationName: title,
  authors: [{ name: profile.name, url: links.linkedin }],
  keywords: [
    profile.name,
    "interactive CV",
    "AI agent",
    "full-stack developer",
    "Next.js",
    "n8n",
    "RAG",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: title,
    title,
    description,
    url: links.site,
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.headline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Structured data so search engines read this as a person, not a landing page. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.headline,
  email: `mailto:${profile.email}`,
  url: links.site,
  image: `${links.site}${profile.avatar}`,
  description: profile.about,
  address: { "@type": "PostalAddress", addressCountry: profile.location },
  sameAs: [links.linkedin, links.github, links.leetcode],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <script
          type="application/ld+json"
          // Serialised from a local literal, never from user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
