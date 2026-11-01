import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prabesh122.vercel.app";

export const metadata: Metadata = {
  title: "Privacy Policy & Terms of Service",
  description:
    "Privacy commitments, data ethics, and terms of use for the engineering portfolio of Prabesh Shah · Autonomous AI & Systems Architect.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy & Terms of Service | Prabesh Shah",
    description: "Data handling policies and terms of service for Prabesh Shah's portfolio.",
    url: `${siteUrl}/privacy`,
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
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
      name: "Privacy & Terms",
      item: `${siteUrl}/privacy`,
    },
  ],
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="min-h-screen py-16 px-5 max-w-4xl mx-auto space-y-12 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-200">Privacy &amp; Terms</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <Shield className="w-3.5 h-3.5" />
          <span>DATA INTEGRITY &amp; ETHICS PROTOCOL</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Privacy Policy &amp; Terms of Service
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Last updated: <time dateTime="2026-11-01">November 1, 2026</time>. This document establishes the data collection ethics, local-first computing boundaries, and terms governing interactions with this site.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-slate-300">
        {/* Section 1 */}
        <section className="aurora-card p-7 space-y-3">
          <div className="flex items-center gap-2.5 text-white font-semibold text-base">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h2>1. Zero Unsolicited Tracking &amp; Analytics</h2>
          </div>
          <p className="text-slate-400">
            This portfolio does not run tracking pixels, intrusive advertising cookies, or third-party marketing beacons. All interactive components (including the Live CRDT Simulator and Vector Clock visualizer) compute state strictly within client-side memory.
          </p>
        </section>

        {/* Section 2 */}
        <section className="aurora-card p-7 space-y-3">
          <div className="flex items-center gap-2.5 text-white font-semibold text-base">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h2>2. Communication &amp; Handshake Inquiries</h2>
          </div>
          <p className="text-slate-400">
            When you submit a project inquiry or handshake message through the contact form, the transmitted data (name, email, and message body) is delivered securely to Prabesh Shah for direct professional correspondence only. Information is never sold, shared, or redistributed.
          </p>
        </section>

        {/* Section 3 */}
        <section className="aurora-card p-7 space-y-3">
          <div className="flex items-center gap-2.5 text-white font-semibold text-base">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <h2>3. Open-Source Codebases &amp; Intellectual Property</h2>
          </div>
          <p className="text-slate-400">
            Projects showcased across this platform (such as the Elite NEPSE AI Trading Agent, AI Autonomous Project Manager, and CRDT Simulator) reference open repositories hosted on GitHub. Each project is governed by its respective open-source license (MIT/Apache 2.0).
          </p>
        </section>
      </div>

      {/* Back CTA */}
      <div className="pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition-all hover:-translate-x-0.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Portfolio</span>
        </Link>
      </div>
    </main>
  );
}

