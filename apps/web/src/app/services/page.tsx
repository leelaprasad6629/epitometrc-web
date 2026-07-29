import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceGrid from "@/components/services/ServiceGrid";
import CTA from "@/components/common/CTA";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Professional Enterprise Services",
  description: "Explore EpitomeTRC services — business consulting, recruitment & staffing, managed IT services, college collaboration, training, and custom IT software development.",
  keywords: ["Enterprise Services", "Staffing Solutions", "IT Consultancy", "Managed Services", "College Partnerships"],
  path: "/services",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function ServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main id="main-content">
        <ServicesHero />
        <ServiceGrid />
        <CTA
          title="Ready to Elevate Your Strategy?"
          description="Partner with EpitomeTRC to design a customized roadmap that streamlines your operations and deploys scalable technology."
          buttons={[
            { label: "Submit An Inquiry", href: "/contact", variant: "primary" },
            { label: "View Case Studies", href: "/blog", variant: "ghost" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
