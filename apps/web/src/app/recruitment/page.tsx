import RecruitmentClient from "./RecruitmentClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema, generateServiceSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Recruitment & Tech Staffing Solutions",
  description: "EpitomeTRC identifies, vets, and places top-tier tech professionals. Discover our specialized IT recruitment, executive search, and bulk hiring campaigns.",
  keywords: ["Recruitment", "Tech Staffing Solutions", "IT Recruitment Agency", "Executive Search Tech", "Bulk Hiring Candidates", "Developer Sourcing"],
  path: "/recruitment",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function RecruitmentPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
    { name: "Recruitment & Staffing", item: "/recruitment" },
  ]);

  const serviceSchema = generateServiceSchema({
    id: "recruitment",
    name: "Recruitment & Staffing Solutions",
    description: "Matchmaking engineering talent with companies through custom vetting workflows, executive placement, and bulk staffing campaigns.",
    serviceType: "Talent Acquisition & Technical Recruitment Services",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <main id="main-content">
        <RecruitmentClient />
      </main>
    </>
  );
}
