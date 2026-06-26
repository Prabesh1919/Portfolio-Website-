import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prabesh Shah · AI Engineer & Full-Stack Architect",
  description:
    "Portfolio of Prabesh Shah — specializing in autonomous AI multi-agent architectures, quantitative trading algorithms, and distributed systems. Based in Nepal.",
  keywords: ["AI Engineer", "Full-Stack", "Quant Developer", "LangGraph", "Nepal"],
  openGraph: {
    title: "Prabesh Shah · AI Engineer",
    description: "Autonomous AI multi-agent architectures, quant algorithms & distributed systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-theme="aurora">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased" style={{ fontFamily: "var(--font-sans)" }}>
        {children}
      </body>
    </html>
  );
}
