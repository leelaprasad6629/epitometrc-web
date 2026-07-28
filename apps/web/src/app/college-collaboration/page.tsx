import CollegeCollaborationClient from "./CollegeCollaborationClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "College Collaboration & University Partnerships",
  description: "EpitomeTRC bridges the gap between academic excellence and industry demands. Discover our campus recruitment drives, skill development workshops, and institutional partnerships.",
  keywords: ["College Collaboration", "University Partnerships", "Campus Placement Drive", "Technology Workshops", "R&D Collaboration"],
  path: "/college-collaboration",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function CollegeCollaborationPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
    { name: "College Collaboration", item: "/college-collaboration" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main id="main-content">
        <CollegeCollaborationClient />
      </main>
    </>
  );
}
