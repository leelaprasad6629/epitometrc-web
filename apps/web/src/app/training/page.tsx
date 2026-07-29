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

const testimonials = [
  {
    id: "1",
    name: "Steve Collins",
    role: "Software Engineer at TECHNO",
    quote: "The internship program gave me real project experience that directly led to my full-time offer.",
  },
  {
    id: "2",
    name: "Samuel Rice",
    role: "DevOps Specialist at GLOBAL",
    quote: "EpitomeTRC's DevOps course was the most practical training I've ever taken. Highly recommended.",
  },
  {
    id: "3",
    name: "Bella Rose",
    role: "UX Designer at ZENITH",
    quote: "The mentorship and capstone project were invaluable for building my portfolio and confidence.",
  },
];

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
        <Testimonials
          title="Placement Success"
          description="Our graduates are working at innovative companies worldwide."
          testimonials={testimonials}
          dark
        />
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
