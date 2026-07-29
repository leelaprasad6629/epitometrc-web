import { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  noIndex?: boolean;
  ogImage?: string;
  ogType?: "website" | "article";
}

export const BASE_URL = "https://epitometrc.com";

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  path,
  noIndex = false,
  ogImage = "/images/boardroom_hero.jpg",
  ogType = "website",
}: SEOProps): Metadata {
  const canonicalUrl = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  
  const robots = noIndex
    ? {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
        },
      };

  const defaultKeywords = [
    "EpitomeTRC",
    "Talent Acquisition",
    "IT Services",
    "Corporate Training",
    "Software Development",
    "Business Consulting",
    "ATS Resume Optimizer",
    "Mock Interview Preparation",
  ];

  const uniqueKeywords = Array.from(new Set([...keywords, ...defaultKeywords]));

  return {
    title: `${title} | EpitomeTRC`,
    description,
    keywords: uniqueKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots,
    openGraph: {
      title: `${title} | EpitomeTRC`,
      description,
      url: canonicalUrl,
      siteName: "EpitomeTRC",
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EpitomeTRC`,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`],
      site: "@epitometrc",
      creator: "@epitometrc",
    },
    authors: [{ name: "EpitomeTRC Team", url: BASE_URL }],
    creator: "EpitomeTRC",
    publisher: "EpitomeTRC",
    metadataBase: new URL(BASE_URL),
  };
}

// Structured Data (JSON-LD) Generators

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "EpitomeTRC",
    url: BASE_URL,
    logo: `${BASE_URL}/images/Epitome_logo_black.png`,
    description: "Strategic talent acquisition, executive recruitment & staffing, IT services, custom software development, and corporate training.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "208, Swadesh Bhawan, Behind Press Complex, LIG Colony",
      addressLocality: "Indore",
      addressRegion: "MP",
      postalCode: "452001",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-626-596-6705",
      contactType: "customer service",
      email: "info@epitometrc.com",
    },
    sameAs: [
      "https://www.linkedin.com/company/epitometrc",
      "https://www.facebook.com/epitometrc",
      "https://www.instagram.com/epitometrc007/",
    ],
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "EpitomeTRC",
    description: "Strategic Talent Acquisition, IT Services & Corporate Training",
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/jobs?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.item.startsWith("http") ? item.item : `${BASE_URL}${item.item}`,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateServiceSchema({
  id,
  name,
  description,
  serviceType,
}: {
  id: string;
  name: string;
  description: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/${id}/#service`,
    name,
    description,
    serviceType,
    provider: {
      "@id": `${BASE_URL}/#organization`,
    },
  };
}

export function generateJobPostingSchema({
  title,
  description,
  datePosted,
  validThrough,
  employmentType = "FULL_TIME",
  location = "Indore, India",
}: {
  title: string;
  description: string;
  datePosted: string;
  validThrough: string;
  employmentType?: string;
  location?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    datePosted,
    validThrough,
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: "EpitomeTRC",
      sameAs: BASE_URL,
      logo: `${BASE_URL}/images/Epitome_logo_black.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location.split(",")[0].trim(),
        addressRegion: "MP",
        addressCountry: "IN",
      },
    },
  };
}

export function generateSoftwareApplicationSchema({
  name,
  operatingSystem = "All",
  applicationCategory = "EducationalApplication",
  description,
}: {
  name: string;
  operatingSystem?: string;
  applicationCategory?: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    operatingSystem,
    applicationCategory,
    description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function generateArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  authorName,
  image,
  path,
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  image: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "EpitomeTRC",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/images/Epitome_logo_black.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}${path}`,
    },
  };
}
