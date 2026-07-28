import BlogClient from "./BlogClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Engineering Blog & Technical Insights",
  description: "Read the latest technology guides, agile case studies, micro-frontends engineering, and business consulting reviews written by our top architects.",
  keywords: ["Engineering Blog", "Next.js Micro-Frontends", "Technical Insights", "Epitome Blog", "Software Architecture Guide"],
  path: "/blog",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function BlogPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main id="main-content">
        <BlogClient />
      </main>
    </>
  );
}
