import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/settings/", "/profile/"],
    },
    sitemap: "https://cpkit.vercel.app/sitemap.xml",
  };
}
