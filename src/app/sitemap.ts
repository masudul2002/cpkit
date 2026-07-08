import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cpkit.vercel.app";
  const routes = [
    "",
    "/dashboard",
    "/contest-utilities",
    "/debug-tools",
    "/test-generator",
    "/number-theory",
    "/string-laboratory",
    "/matrix",
    "/graph",
    "/tree",
    "/dynamic-programming",
    "/greedy",
    "/search",
    "/sorting",
    "/geometry",
    "/reference",
    "/workspace",
    "/practice",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
