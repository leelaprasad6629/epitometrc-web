import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import FounderMessage from "@/components/about/FounderMessage";
import CompanyStory from "@/components/about/CompanyStory";
import MissionVision from "@/components/about/MissionVision";
import CultureStory from "@/components/about/CultureStory";
import CoreValues from "@/components/about/CoreValues";
import Leadership from "@/components/about/Leadership";
import Achievements from "@/components/about/Achievements";
import CTA from "@/components/common/CTA";

export const metadata: Metadata = {
  title: "About Us | Epitome TRC",
  description:
    "Learn about EpitomeTRC — our mission, values, leadership, and commitment to strategic excellence across enterprise consulting and technology.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <FounderMessage />
        <CompanyStory />
        <MissionVision />
        <CultureStory />
        <CoreValues />
        <Leadership />
        <Achievements />
        <CTA
          title="Ready to Transform Your Organization?"
          description="Connect with our team to explore how EpitomeTRC can accelerate your strategic goals."
          buttons={[
            { label: "Contact Us", href: "/contact", variant: "primary" },
            { label: "View Services", href: "/services", variant: "ghost" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
