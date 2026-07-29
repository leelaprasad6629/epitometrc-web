import ContactClient from "./ContactClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Contact Us & Strategic Inquiries",
  description: "Connect with our team to explore custom IT services, corporate training cohorts, and recruitment drives. Get office directions, email details, and support contact.",
  keywords: ["Contact Us", "Indore Office", "Strategic Consultation", "Enterprise Consulting Support", "Recruitment Inquiry"],
  path: "/contact",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Contact", item: "/contact" },
  ]);

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://epitometrc.com/contact/#webpage",
    url: "https://epitometrc.com/contact",
    name: "Contact Us & Strategic Inquiries",
    description: "Connect with our team to explore custom IT services, corporate training cohorts, and recruitment drives.",
    mainEntity: {
      "@type": "Organization",
      name: "EpitomeTRC",
      telephone: "+91-626-596-6705",
      email: "info@epitometrc.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <main id="main-content">
        <ContactClient />
      </main>
    </>
  );
}
