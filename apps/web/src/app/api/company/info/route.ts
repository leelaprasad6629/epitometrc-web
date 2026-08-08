import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    trainingsInternships: 7000,
    collegeTieUps: 200,
  },
  contact: {
    phone: "+91-626-596-6705",
    email: "careers@epitometrc.com",
    address: "Headquartered in Indore, Madhya Pradesh | Serving PAN India",
  },
  testimonials: [],
  collaborations: [
    { name: "Public Cohorts", count: "7000+ Placed" },
    { name: "Academic Partners", count: "200+ Colleges" },
    { name: "Enterprise Clients", count: "340+ Global" },
  ],
};

export async function GET(req: NextRequest) {
  // Query database-driven content configuration first
  try {
    const dbInfo = await prisma.companyInfo.findFirst();
    const dbStatsList = await prisma.companyStat.findMany({ where: { status: "Active" }, orderBy: { order: "asc" } });
    const dbServices = await prisma.companyService.findMany({ where: { status: "Active" } });
    const dbTestimonials = await prisma.companyTestimonial.findMany({ where: { status: "Active" } });
    const dbSuccessStories = await prisma.successStory.findMany({ where: { status: "Active" } });

    if (dbInfo && dbStatsList.length > 0) {
      // Re-map stats array to object keys
      const statsObj: Record<string, number> = {};
      dbStatsList.forEach(s => {
        // Strip non-numeric suffixes (like "+") to get base number
        const valNum = parseInt(s.value.replace(/[^0-9]/g, ""), 10);
        statsObj[s.key] = isNaN(valNum) ? 0 : valNum;
      });

      return NextResponse.json({
        success: true,
        stats: statsObj,
        contact: {
          phone: dbInfo.phone,
          email: dbInfo.email,
          address: dbInfo.address,
        },
        testimonials: dbTestimonials.map(t => ({
          quote: t.quote,
          author: t.author,
          role: t.role,
          stars: t.stars
        })),
        collaborations: dbStatsList.map(s => ({
          name: s.label,
          count: s.value
        })),
        services: dbServices.map(s => ({
          title: s.title,
          subtitle: s.subtitle,
          slug: s.slug,
          description: s.description,
          iconName: s.iconName,
          category: s.category,
          features: JSON.parse(s.features),
          persona: s.persona
        })),
        successStories: dbSuccessStories.map(s => ({
          title: s.title,
          clientType: s.clientType,
          industry: s.industry,
          challenge: s.challenge,
          solution: s.solution,
          results: JSON.parse(s.results),
          primaryMetric: { value: s.primaryMetricVal, label: s.primaryMetricLabel },
          secondaryMetric: { value: s.secondaryMetricVal, label: s.secondaryMetricLabel },
          trustBadge: s.trustBadge,
          category: s.category
        })),
        isDatabaseDriven: true
      });
    }
  } catch (dbErr) {
    console.warn("[Company Info API] Database query failed, falling back to scraped official defaults:", dbErr);
  }

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
