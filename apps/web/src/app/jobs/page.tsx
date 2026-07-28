import JobsClient from "./JobsClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema, generateJobPostingSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Open Job Positions",
  description: "Explore open job positions at EpitomeTRC. Apply today for Senior Full Stack Developer, Strategy Consultant, and Technical Recruiter roles in Indore.",
  keywords: ["Open Positions", "Job Search", "Indore Developer Jobs", "Strategy Consultant Openings", "Recruitment Jobs"],
  path: "/jobs",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function JobsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Jobs", item: "/jobs" },
  ]);

  const job1 = generateJobPostingSchema({
    title: "Senior Full Stack Developer",
    description: "Lead the development of high-performance enterprise applications using React, Node.js, and AWS.",
    datePosted: "2026-07-24",
    validThrough: "2026-12-31",
    location: "Indore, India",
  });

  const job2 = generateJobPostingSchema({
    title: "Strategy Consultant",
    description: "Advise Fortune 500 executives on digital transformation and market entry strategies.",
    datePosted: "2026-07-24",
    validThrough: "2026-12-31",
    location: "Indore, India",
  });

  const job3 = generateJobPostingSchema({
    title: "Technical Recruiter",
    description: "Shape our engineering teams by identifying, attracting, and onboarding top talent.",
    datePosted: "2026-07-24",
    validThrough: "2026-12-31",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(job1) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(job2) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(job3) }}
      />
      <main id="main-content">
        <JobsClient />
      </main>
    </>
  );
}
