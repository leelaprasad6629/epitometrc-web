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
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "About Us",
  description: "Learn about EpitomeTRC — our mission, values, leadership, and commitment to strategic excellence across enterprise consulting and technology.",
  keywords: ["About Us", "EpitomeTRC Story", "Company Values", "Executive Leadership Team", "Achievements"],
  path: "/about",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "About", item: "/about" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main id="main-content">
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
