import BlogPostClient from "./BlogPostClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema, generateArticleSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Scaling Next.js Micro-Frontends in 2026",
  description: "Deep dive into architectural blueprints, performance optimizations, and layout systems in modern enterprise React apps.",
  keywords: ["Next.js Micro-Frontends", "Next.js 16", "Multi-Zone Layouts", "Turborepo", "Web Bundler Optimizations"],
  path: "/blog/scaling-nextjs-microfrontends",
  ogImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
  ogType: "article",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function BlogPostDetailPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog" },
    { name: "Scaling Next.js Micro-Frontends in 2026", item: "/blog/scaling-nextjs-microfrontends" },
  ]);

  const articleSchema = generateArticleSchema({
    title: "Scaling Next.js Micro-Frontends in 2026",
    description: "Deep dive into architectural blueprints, performance optimizations, and layout systems in modern enterprise React apps.",
    datePublished: "2026-10-24T00:00:00.000Z",
    dateModified: "2026-10-24T00:00:00.000Z",
    authorName: "Sarah Jennings",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    path: "/blog/scaling-nextjs-microfrontends",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main id="main-content">
        <BlogPostClient />
      </main>
    </>
  );
}
