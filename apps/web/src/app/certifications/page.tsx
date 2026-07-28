import CertificationsClient from "./CertificationsClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Professional Certifications",
  description: "Validate your expertise with cryptographically secured professional certifications recognized by global enterprise partners. Learn more about the Epitome Strategic Leader certification.",
  keywords: ["Certifications", "Epitome Strategic Leader", "Cloud Solutions Specialist Certification", "Professional Verification"],
  path: "/certifications",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function CertificationsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Certifications", item: "/certifications" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main id="main-content">
        <CertificationsClient />
      </main>
    </>
  );
}
