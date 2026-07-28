import CareersClient from "./CareersClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema, generateJobPostingSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Careers & Openings",
  description: "Join the EpitomeTRC team and build the future of strategic execution. Explore open job opportunities in engineering, consulting, and staffing.",
  keywords: ["Careers", "Jobs", "Engineering Jobs", "Consulting Opportunities", "Recruiter Jobs", "Indore Tech Jobs"],
  path: "/careers",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function CareersPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Careers", item: "/careers" },
  ]);

  // Generate job postings from the jobs array in CareersClient for search engines to index
  const jobSchema1 = generateJobPostingSchema({
    title: "Senior Full Stack Developer",
    description: "Lead the development of high-performance enterprise applications using React, Node.js, and AWS.",
    datePosted: "2026-07-24",
    validThrough: "2026-12-31",
    employmentType: "FULL_TIME",
    location: "Indore, India",
  });

  const jobSchema2 = generateJobPostingSchema({
    title: "Strategy Consultant",
    description: "Advise Fortune 500 executives on digital transformation and market entry strategies. Requires strong analytical skills.",
    datePosted: "2026-07-24",
    validThrough: "2026-12-31",
    employmentType: "FULL_TIME",
    location: "Indore, India",
  });

  const jobSchema3 = generateJobPostingSchema({
    title: "Technical Recruiter",
    description: "Shape our engineering teams by identifying, attracting, and onboarding top talent for our clients in the technology sector.",
    datePosted: "2026-07-24",
    validThrough: "2026-12-31",
    employmentType: "FULL_TIME",
    location: "Indore, India",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema1) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema2) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema3) }}
      />
      <main id="main-content">
        <CareersClient />
      </main>
    </>
  );
}
