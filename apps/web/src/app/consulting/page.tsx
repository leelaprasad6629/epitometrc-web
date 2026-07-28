import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultingHero from "@/components/consulting/ConsultingHero";
import ConsultingExpertise from "@/components/consulting/ConsultingExpertise";
import ConsultingBenefits from "@/components/consulting/ConsultingBenefits";
import ConsultingProcess from "@/components/consulting/ConsultingProcess";
import CTA from "@/components/common/CTA";
import AIConsultantWidget from "@/components/ai/AIConsultantWidget";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema, generateServiceSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Business Consulting & Strategic Advisory Services",
  description: "Strategic advisory for global growth. EpitomeTRC delivers business consulting, operational process improvement, and M&A support for enterprise leaders.",
  keywords: ["Business Consulting", "Strategic Advisory", "Process Improvement", "M&A Support", "Enterprise Leadership Consulting"],
  path: "/consulting",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function ConsultingPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
    { name: "Consulting", item: "/consulting" },
  ]);

  const serviceSchema = generateServiceSchema({
    id: "consulting",
    name: "Business Consulting & Strategic Advisory",
    description: "Expert business advisory, operations re-engineering, digital strategies, and enterprise consulting.",
    serviceType: "Strategic Business Consulting & Corporate Advisory",
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
      <Navbar />
      <main id="main-content" className="pt-20">
        <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "Consulting" }]} />
        <ConsultingHero />
        <ConsultingExpertise />
        <ConsultingBenefits />
        <ConsultingProcess />
        <AIConsultantWidget />
        <CTA
          title="Ready to Accelerate Your Growth?"
          description="Connect with our experts to design a customized consulting engagement tailored to your strategic objectives."
          buttons={[
            { label: "Request Consultation", href: "/contact", variant: "primary" },
            { label: "Contact Us", href: "/contact", variant: "ghost" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
