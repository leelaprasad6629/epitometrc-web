"use client";

import PageBanner from "@/components/common/PageBanner";

export default function CoursesHero() {
  return (
    <PageBanner
      eyebrow="Professional Development"
      title="Courses Designed for Career Advancement"
      description="Explore technical courses, soft skills workshops, and certification programs crafted by industry experts to keep you ahead in a competitive market."
      buttons={[
        { label: "Browse All Courses", href: "#technical", variant: "primary" },
        { label: "Get Certified", href: "/certifications", variant: "outline" },
      ]}
    />
  );
}
