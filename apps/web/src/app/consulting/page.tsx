import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultingHero from "@/components/consulting/ConsultingHero";
import ConsultingExpertise from "@/components/consulting/ConsultingExpertise";
import ConsultingBenefits from "@/components/consulting/ConsultingBenefits";
import ConsultingProcess from "@/components/consulting/ConsultingProcess";
import CTA from "@/components/common/CTA";
import AIConsultantWidget from "@/components/ai/AIConsultantWidget";
import Breadcrumbs from "@/components/common/Breadcrumbs";

export const metadata: Metadata = {
  title: "Business Consulting | Epitome TRC",
  description:
    "Strategic advisory for global growth. EpitomeTRC delivers business consulting, process improvement, and M&A support for enterprise leaders.",
};

export default function ConsultingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
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
