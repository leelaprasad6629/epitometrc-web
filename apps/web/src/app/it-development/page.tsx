import ITDevelopmentClient from "./ITDevelopmentClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema, generateServiceSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "IT Development & Software Engineering Services",
  description: "We engineer custom high-performance, secure, and scalable web applications, mobile apps, and cloud microservices tailored for modern enterprise growth.",
  keywords: ["IT Development", "Software Engineering", "Web Applications Development", "Mobile App Development", "Cloud Systems", "React Native Developers"],
  path: "/it-development",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function ITDevelopmentPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
    { name: "IT Development", item: "/it-development" },
  ]);

  const serviceSchema = generateServiceSchema({
    id: "it-development",
    name: "IT Development & Custom Software Engineering",
    description: "End-to-end development of custom enterprise web applications, mobile applications, and secure cloud platforms.",
    serviceType: "Software Engineering & IT Development",
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
        <ITDevelopmentClient />
      </main>
    </>
  );
}
