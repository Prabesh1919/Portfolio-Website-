import { MetadataRoute } from "next";
import portfolioData from "@/data/portfolio.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prabesh122.vercel.app";
  const currentDate = new Date();

  const projectRoutes: MetadataRoute.Sitemap = portfolioData.projects.map((p) => ({
    url: `${baseUrl}/projects/${p.id}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...projectRoutes,
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
