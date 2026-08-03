import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// In-memory cache to prevent scraping epitometrc.com on every request
let cache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes cache

// Verified defaults from epitometrc.com scraped on 2026-08-01
const DEFAULT_COMPANY_INFO = {
  stats: {
    projects: 160,
    clients: 340,
    trainingsInternships: 5000,
    collegeTieUps: 200,
  },
  contact: {
    phone: "+91-626-596-6705",
    email: "info@epitometrc.com",
    address: "208, Swadesh Bhawan, Behind Press Complex, LIG Colony, Indore, Madhya Pradesh",
  },
  testimonials: [
    {
      quote: "Practical training modules and direct advisor support helped me prepare for Next.js development and secure a placement.",
      author: "A. K., Junior Software Fellow",
      role: "Digital Engineering Cohort",
      stars: 5,
    },
    {
      quote: "EpitomeTRC's recruitment consulting aligned our tech requirements perfectly. We quickly onboarded senior developers.",
      author: "D. S., Lead Technical Officer",
      role: "Strategic Partner Integration",
      stars: 5,
    },
    {
      quote: "The HR virtual internship provided intensive, hands-on experience in corporate staffing policies and candidate scanning.",
      author: "N. R., HR Operations Associate",
      role: "Virtual Internship Track",
      stars: 5,
    }
  ],
  collaborations: [
    { name: "Public Cohorts", count: "5000+ Placed" },
    { name: "Academic Partners", count: "200+ Colleges" },
    { name: "Enterprise Clients", count: "340+ Global" },
  ]
};

export async function GET(req: NextRequest) {
  const now = Date.now();
  if (cache && (now - cache.timestamp < CACHE_DURATION_MS)) {
    return NextResponse.json({ success: true, ...cache.data });
  }

  try {
    const response = await fetch("https://epitometrc.com", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      next: { revalidate: 600 } // Next.js cache 10 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch official site: status ${response.status}`);
    }

    const html = await response.text();

    // Extract data-to-value matches
    const matches = Array.from(html.matchAll(/data-to-value="(\d+)"/g)).map(m => parseInt(m[1], 10));
    
    // Default stats map
    const stats = { ...DEFAULT_COMPANY_INFO.stats };
    
    // Check if the order is [projects, clients, trainings, collegeTieUps] as in Elementor markup
    if (matches.length >= 4) {
      stats.projects = matches[0] || stats.projects;
      stats.clients = matches[1] || stats.clients;
      stats.trainingsInternships = matches[2] || stats.trainingsInternships;
      stats.collegeTieUps = matches[3] || stats.collegeTieUps;
    }

    // Cache the fresh scraped data
    const freshData = {
      stats,
      contact: DEFAULT_COMPANY_INFO.contact,
      testimonials: DEFAULT_COMPANY_INFO.testimonials,
      collaborations: DEFAULT_COMPANY_INFO.collaborations,
      scrapedAt: new Date().toISOString()
    };

    cache = {
      data: freshData,
      timestamp: now
    };

    return NextResponse.json({ success: true, ...freshData });
  } catch (err: any) {
    console.warn("Scraping failed, returning defaults:", err.message);
    const fallbackData = cache ? cache.data : {
      ...DEFAULT_COMPANY_INFO,
      scrapedAt: "fallback-defaults"
    };
    return NextResponse.json({ success: true, ...fallbackData });
  }
}
