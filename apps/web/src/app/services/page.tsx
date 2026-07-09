import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceGrid from "@/components/services/ServiceGrid";
import CTA from "@/components/common/CTA";

export const metadata: Metadata = {
  title: "Services | Epitome TRC",
  description:
    "Explore EpitomeTRC services — business consulting, recruitment, IT services, college collaboration, training, and IT development.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
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
