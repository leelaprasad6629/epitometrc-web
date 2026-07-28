import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://epitometrc.com";

  const routes = [
    "",
    "/about",
    "/services",
    "/recruitment",
    "/consulting",
    "/it-services",
    "/it-development",
    "/training",
    "/college-collaboration",
    "/courses",
    "/jobs",
    "/contact",
    "/careers",
    "/certifications",
    "/internships",
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
