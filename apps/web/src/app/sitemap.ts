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
    "/privacy",
    "/terms",
    "/blog",
    "/blog/scaling-nextjs-microfrontends",
  ];

  const now = new Date();

  return routes.map((route) => {
    let priority = 0.8;
    let changeFrequency: "daily" | "weekly" | "monthly" = "weekly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (route === "/jobs" || route === "/careers" || route === "/blog") {
      priority = 0.9;
      changeFrequency = "daily";
    } else if (route.startsWith("/blog/")) {
      priority = 0.7;
      changeFrequency = "monthly";
    } else if (route === "/privacy" || route === "/terms") {
      priority = 0.5;
      changeFrequency = "monthly";
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency,
      priority,
    };
  });
}
