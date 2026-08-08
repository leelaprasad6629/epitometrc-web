import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrainingHero from "@/components/training/TrainingHero";
import LearningTracks from "@/components/training/LearningTracks";
import CertificationBar from "@/components/training/CertificationBar";
import ProgramGrid from "@/components/training/ProgramGrid";
import LearningPath from "@/components/training/LearningPath";
import Testimonials from "@/components/common/Testimonials";
import CTA from "@/components/common/CTA";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema, generateServiceSchema } from "@/lib/seo";



export const metadata: Metadata = generateSEOMetadata({
  title: "Training & Internships Programs",
  description: "Accelerate your career with EpitomeTRC training programs, internships, and professional certification courses led by industry experts.",
  keywords: ["Training Programs", "Software Engineering Internships", "DevOps Course", "UX Design Mentorship", "Career Acceleration"],
  path: "/training",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function TrainingPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
    { name: "Corporate Training", item: "/training" },
  ]);

  const serviceSchema = generateServiceSchema({
    id: "training",
    name: "Corporate Training & Internships",
    description: "Expert-led corporate bootcamps, university skill-building collaborations, and hands-on developer internship tracks.",
    serviceType: "Professional Corporate Training & Internship Placement Services",
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
        <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "Corporate Training" }]} />
        <TrainingHero />
        <LearningTracks />
        <CertificationBar />
        <ProgramGrid />
        <LearningPath />

        <CTA
          title="Ready to start your journey?"
          description="Join our training ecosystem and take the next step in your professional development."
          variant="orange"
          buttons={[{ label: "Join Internship", href: "/internships", variant: "navy" }]}
        />
      </main>
      <Footer />
    </>
  );
}
