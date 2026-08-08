import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MEMBERSHIP_PLANS } from "@/lib/membershipConfig";

export async function GET(req: NextRequest) {
  try {
    const dbPlans = await prisma.membershipPlan.findMany({
      where: { status: "Active" }
    });

    if (dbPlans.length > 0) {
      const plans = dbPlans.map(p => ({
        name: p.name,
        price: p.price,
        priceValue: parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0,
        period: p.interval,
        mockInterviewLimit: p.maxInterviews,
        resumeOptimizationLimit: p.maxResumes,
        features: JSON.parse(p.features),
        restrictions: p.maxInterviews > 0 ? [`Capped at ${p.maxInterviews} AI interviews`] : ["Unrestricted Access"],
        status: p.status
      }));
      return NextResponse.json({ success: true, plans });
    }

    return NextResponse.json({ success: true, plans: MEMBERSHIP_PLANS });
  } catch (error: any) {
    console.warn("[Plans API] Database query failed, returning static config fallback plans:", error);
    return NextResponse.json({ success: true, plans: MEMBERSHIP_PLANS });
  }
}
