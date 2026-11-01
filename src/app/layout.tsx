import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prabesh122.vercel.app";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prabesh Shah · Autonomous AI & Multi-Agent Systems | Vector Trading Backend Engineer",
    template: "%s | Prabesh Shah",
  },
  description:
    "Prabesh Shah builds autonomous multi-agent AI systems, vector-powered trading backends, and distributed quantitative pipelines. AI Engineer & Quant Architect based in Nepal.",
  keywords: [
    "Prabesh Shah",
    "AI Engineer",
    "Quantitative Trading",
    "Quant Developer",
    "Autonomous AI Agents",
    "Multi-Agent Architectures",
    "Distributed Systems",
    "CRDT",
    "NEPSE Trading",
    "Full-Stack Architect",
    "Nepal AI",
    "LangGraph",
  ],
  authors: [{ name: "Prabesh Shah", url: siteUrl }],
  creator: "Prabesh Shah",
  publisher: "Prabesh Shah",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Prabesh Shah · Autonomous Multi-Agent AI | Vector Trading Backend Engineer",
    description:
      "Autonomous multi-agent AI systems, vector-powered trading backends, and high-throughput distributed pipelines. Built for production durability.",
    url: siteUrl,
    siteName: "Prabesh Shah Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/avatar.webp",
        width: 400,
        height: 400,
        alt: "Prabesh Shah · AI Engineer & Quantitative Systems Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prabesh Shah · Autonomous Multi-Agent AI | Vector Trading Backend Engineer",
    description:
      "Autonomous multi-agent AI systems, vector-powered trading backends, and high-throughput distributed pipelines.",
    images: ["/avatar.webp"],
    creator: "@PrabeshShah",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Prabesh Shah",
      alternateName: ["Prabes Shah", "Prabash Shah", "Prebesh Shah", "Pravesh Shah", "Prabesh Sha", "Prabesh Sah", "Prabesh Shans"],
      givenName: "Prabesh",
      familyName: "Shah",
      jobTitle: "Autonomous AI Engineer & Quantitative Systems Architect",
      url: siteUrl,
      image: `${siteUrl}/avatar.webp`,
      email: "mailto:contact@prabeshshah.dev",
      nationality: {
        "@type": "Country",
        name: "Nepal",
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "Nepal",
      },
      sameAs: [
        "https://github.com/Prabesh1919",
        "https://linkedin.com",
      ],
      knowsAbout: [
        "Autonomous AI Multi-Agent Architectures",
        "Quantitative Trading Algorithms",
        "Vector Search & Hybrid Retrieval",
        "Conflict-Free Replicated Data Types (CRDTs)",
        "Distributed Systems Engineering",
        "LangGraph & Agent Orchestration",
        "Financial Market Microstructure (NEPSE)",
      ],
      description:
        "Specialized in engineering autonomous multi-agent networks, quantitative trading algorithms, and production-grade distributed codebases.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Prabesh Shah · Engineering Portfolio",
      description:
        "Official engineering portfolio of Prabesh Shah, showcasing autonomous AI agent systems, quantitative trading platforms, and distributed architectures.",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: "Prabesh Shah · Portfolio & Technical Showcase",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      mainEntity: {
        "@id": `${siteUrl}/#person`,
      },
      dateCreated: "2025-01-01T00:00:00Z",
      dateModified: "2026-11-01T00:00:00Z",
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#hero-bio", "#agent-answer-summary", "#core-specializations-heading"],
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#stockagent`,
      name: "Elite NEPSE AI Trading Agent",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Cloud / Linux",
      description:
        "Institutional-grade self-improving AI quantitative trading agent built to crawl floorsheets, classify market regimes, and execute automated broker transactions.",
      author: {
        "@id": `${siteUrl}/#person`,
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      url: "https://github.com/Prabesh1919/Stockagent-main",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} data-theme="aurora">
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased" style={{ fontFamily: "var(--font-sans)" }}>
        {/* SXO & Accessibility Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-950 focus:rounded-md focus:font-mono focus:text-sm focus:font-bold focus:shadow-2xl"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
