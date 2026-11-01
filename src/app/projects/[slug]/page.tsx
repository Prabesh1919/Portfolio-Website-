import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import portfolioData from "@/data/portfolio.json";
import { ArrowLeft, ExternalLink, Github, Cpu, Layers, Sparkles, CheckCircle2, GitBranch } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prabesh122.vercel.app";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return portfolioData.projects.map((p) => ({
    slug: p.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolioData.projects.find((p) => p.id === slug);

  if (!project) {
    return {
      title: "Project Not Found | Prabesh Shah",
    };
  }

  const cleanTitle = project.title.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "").trim();

  return {
    title: `${cleanTitle} · Architecture & Case Study | Prabesh Shah`,
    description: project.description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: `${cleanTitle} · Systems Engineering Case Study`,
      description: project.description,
      url: `${siteUrl}/projects/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} · Prabesh Shah`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = portfolioData.projects.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  const cleanTitle = project.title.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "").trim();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${siteUrl}/#projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: cleanTitle,
            item: `${siteUrl}/projects/${slug}`,
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/projects/${slug}/#software`,
        name: cleanTitle,
        description: project.description,
        applicationCategory:
          project.category === "AI & Quant"
            ? "FinanceApplication"
            : project.category === "Mobile"
            ? "MobileApplication"
            : "DeveloperApplication",
        operatingSystem: "Cloud / Web / Linux",
        codeRepository: project.repo,
        author: {
          "@type": "Person",
          name: "Prabesh Shah",
          url: siteUrl,
        },
      },
    ],
  };

  return (
    <main id="main-content" className="min-h-screen py-16 px-5 max-w-4xl mx-auto space-y-12 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/#projects" className="hover:text-white transition-colors">
          Projects
        </Link>
        <span>/</span>
        <span className="text-slate-200">{cleanTitle}</span>
      </nav>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-purple-500/30 bg-purple-500/10 text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{project.category.toUpperCase()} · PRODUCTION ARCHITECTURE</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
          {cleanTitle}
        </h1>
        <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl leading-relaxed">
          {project.subtitle}
        </p>
      </div>

      {/* Core Description */}
      <div className="aurora-card p-7 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold text-base">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <h2>System Overview &amp; Problem Space</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Architecture Pipeline */}
      <div className="aurora-card p-7 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold text-base">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <h2>Dataflow &amp; System Architecture</h2>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto">
          {project.architecture}
        </div>
      </div>

      {/* Key Engineering Achievements */}
      <div className="aurora-card p-7 space-y-5">
        <div className="flex items-center gap-2 text-white font-semibold text-base">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <h2>Verifiable Milestones &amp; Implementations</h2>
        </div>
        <ul className="space-y-3.5">
          {project.achievements.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tech Stack Arsenal */}
      <div className="aurora-card p-7 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold text-base">
          <Layers className="w-4 h-4 text-purple-400" />
          <h2>Technology Stack</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-lg border text-xs font-mono bg-white/3 border-white/10 text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Actions & Links */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition-all hover:-translate-x-0.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Codebases</span>
        </Link>

        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <Github className="w-4 h-4" />
          <span>Inspect Source Code</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>
    </main>
  );
}

