import HomeClient from "./HomeClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Strategic Talent Acquisition, IT Services & Corporate Training",
  description: "EpitomeTRC connects enterprise leaders with top talent, custom IT development, strategic business consulting, and industry-aligned corporate training cohorts.",
  keywords: ["Recruitment", "Staffing", "IT Services", "Software Development", "Corporate Training", "Business Consulting"],
  path: "/",
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function Home() {
  const orgSchema = generateOrganizationSchema();
  const siteSchema = generateWebSiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />
      <main id="main-content">
        <HomeClient />
      </main>
    </>
  );
}