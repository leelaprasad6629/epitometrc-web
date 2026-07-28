import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://epitometrc.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/student/", "/employee/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
