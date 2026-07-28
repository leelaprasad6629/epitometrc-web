import CoursesClient from "./CoursesClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Academy Courses & Workshops",
  description: "Acquire elite credentials led by industry experts. Learn agile systems, business analysis, operational strategy, and production engineering at Epitome Academy.",
  keywords: ["Academy Courses", "Business Analyst Course", "Strategy Workshop", "Epitome Academy", "Professional Training"],
  path: "/courses",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function CoursesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Courses", item: "/courses" },
  ]);

  const courseSchema1 = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Strategic Business Analyst",
    "description": "Learn modern enterprise analysis models, UML diagrams, and fintech strategy formulation.",
    "provider": {
      "@type": "Organization",
      "name": "EpitomeTRC",
      "sameAs": "https://epitometrc.com"
    }
  };

  const courseSchema2 = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Advanced Execution & Strategy",
    "description": "Assemble operational roadmaps, run agile sprint plans, and implement KPIs for scaling startups.",
    "provider": {
      "@type": "Organization",
      "name": "EpitomeTRC",
      "sameAs": "https://epitometrc.com"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema1) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema2) }}
      />
      <main id="main-content">
        <CoursesClient />
      </main>
    </>
  );
}
