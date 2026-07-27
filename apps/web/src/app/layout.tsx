import type { Metadata } from "next";
import "./globals.css";
import FloatingAIButton from "@/components/ai/FloatingAIButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://epitometrc.com"),
  title: {
    default: "EpitomeTRC — Strategic Talent Acquisition, IT Services & Corporate Training",
    template: "%s | EpitomeTRC",
  },
  description:
    "EpitomeTRC connects enterprise leaders with top talent, custom IT development, strategic business consulting, and industry-aligned corporate training cohorts.",
  keywords: [
    "Recruitment & Staffing",
    "IT Services",
    "Software Development",
    "Corporate Training",
    "Business Consulting",
    "ATS Resume Optimizer",
    "Tech Bootcamps",
  ],
  authors: [{ name: "EpitomeTRC Team", url: "https://epitometrc.com" }],
  creator: "EpitomeTRC",
  publisher: "EpitomeTRC",
  openGraph: {
    title: "EpitomeTRC — Strategic Talent Acquisition, IT Services & Corporate Training",
    description:
      "Enterprise strategic advisory, candidate recruitment, custom IT development, and high-impact bootcamps.",
    url: "https://epitometrc.com",
    siteName: "EpitomeTRC",
    images: [
      {
        url: "/images/boardroom_hero.jpg",
        width: 1200,
        height: 630,
        alt: "EpitomeTRC Corporate Enterprise",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EpitomeTRC — Strategic Talent Acquisition & IT Development",
    description: "Enterprise consulting, tech staffing, custom software solutions, and corporate training.",
    images: ["/images/boardroom_hero.jpg"],
  },
  alternates: {
    canonical: "https://epitometrc.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EpitomeTRC",
  url: "https://epitometrc.com",
  logo: "https://epitometrc.com/images/boardroom_hero.jpg",
  description:
    "Strategic talent acquisition, executive recruitment & staffing, IT services, custom software development, and corporate training.",
  sameAs: [
    "https://linkedin.com/company/epitometrc",
    "https://twitter.com/epitometrc",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "contact@epitometrc.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <FloatingAIButton />
      </body>
    </html>
  );
}
