import InternshipsClient from "./InternshipsClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema, generateJobPostingSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Internship Programs & Apprenticeships",
  description: "Kickstart your professional career with EpitomeTRC's hybrid and remote internship opportunities. Work with mentors on production-grade client deliverables.",
  keywords: ["Internships", "Apprenticeships", "Frontend Developer Internship", "IT Analyst Apprenticeship", "Student Placement"],
  path: "/internships",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function InternshipsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Internships", item: "/internships" },
  ]);

  const internSchema1 = generateJobPostingSchema({
    title: "Frontend Developer Internship",
    description: "Gain hands-on experience building high-performance frontend interfaces with React and Tailwind CSS.",
    datePosted: "2026-07-24",
    validThrough: "2026-12-31",
    employmentType: "INTERN",
    location: "Indore, India",
  });

  const internSchema2 = generateJobPostingSchema({
    title: "IT Analyst Apprenticeship",
    description: "Assist our strategy consulting teams in compiling market intelligence and designing operational flowcharts.",
    datePosted: "2026-07-24",
    validThrough: "2026-12-31",
    employmentType: "INTERN",
    location: "Indore, India",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(internSchema1) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(internSchema2) }}
      />
      <main id="main-content">
        <InternshipsClient />
      </main>
    </>
  );
}
