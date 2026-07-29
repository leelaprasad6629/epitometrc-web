import ITServicesClient from "./ITServicesClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema, generateServiceSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Managed IT Services & Infrastructure Support",
  description: "We deliver robust enterprise IT infrastructure, managed cloud migrations, proactive security audit services, and IT support solutions.",
  keywords: ["IT Services", "Managed IT Services", "Cloud Solutions", "Cybersecurity Services", "IT Infrastructure Support", "SLA IT Support"],
  path: "/it-services",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function ITServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
    { name: "IT Services", item: "/it-services" },
  ]);

  const serviceSchema = generateServiceSchema({
    id: "it-services",
    name: "Managed IT Services & Infrastructure",
    description: "Proactive management, cybersecurity safeguards, cloud migration blueprints, and enterprise tech support.",
    serviceType: "IT Managed Services & Infrastructure Solutions",
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
        <ITServicesClient />
      </main>
    </>
  );
}
