import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { getPlanByName } from "@/lib/membershipConfig";

// Stateless fallback for development if database is unreached
const getMockMembership = (userId: string, planName = "Free Plan") => {
  const isFree = planName === "Free Plan";
  return {
    id: `mock-id-${userId}`,
    userId,
    planName,
    status: "Active",
    validUntil: null,
    mockInterviewsUsed: isFree ? 1 : 4, // 1 used if free (limit reached)
    resumesOptimizedUsed: isFree ? 1 : 2, // 1 used if free (limit reached)
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role?: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      let membership = await prisma.userMembership.findUnique({
        where: { userId: payload.id }
      });

      if (!membership) {
        membership = await prisma.userMembership.create({
          data: {
            userId: payload.id,
            planName: "Free Plan",
            status: "Active",
            mockInterviewsUsed: 0,
            resumesOptimizedUsed: 0
          }
        });
      }

      return NextResponse.json({ success: true, membership });
    } catch (dbError) {
      console.warn("[Membership API] Database connection failed, returning fallback mock membership state:", dbError);
      // Retrieve plan from mock cookie if set during upgrade simulator, otherwise default to Free
      const mockPlan = req.cookies.get("mock_membership_plan")?.value || "Free Plan";
      const membership = getMockMembership(payload.id, mockPlan);
      return NextResponse.json({ success: true, membership, isOfflineMock: true });
    }
  } catch (error: any) {
    console.error("Membership fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role?: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planName } = await req.json();
    if (!planName) {
      return NextResponse.json({ error: "planName is required" }, { status: 400 });
    }

    const planSpecs = getPlanByName(planName);

    try {
      const validUntilDate = new Date();
      validUntilDate.setMonth(validUntilDate.getMonth() + 1); // 1 month validity

      const membership = await prisma.userMembership.upsert({
        where: { userId: payload.id },
        update: {
          planName: planSpecs.name,
          status: "Active",
          validUntil: validUntilDate,
          mockInterviewsUsed: 0, // Reset usage counter on upgrade
          resumesOptimizedUsed: 0
        },
        create: {
          userId: payload.id,
          planName: planSpecs.name,
          status: "Active",
          validUntil: validUntilDate,
          mockInterviewsUsed: 0,
          resumesOptimizedUsed: 0
        }
      });

      return NextResponse.json({ success: true, membership });
    } catch (dbError) {
      console.warn("[Membership API] Database connection failed during upgrade, setting local mock cookie:", dbError);
      const res = NextResponse.json({
        success: true,
        membership: getMockMembership(payload.id, planSpecs.name),
        isOfflineMock: true
      });
      // Store in cookie to persist mock upgrade status across page reloads
      res.cookies.set("mock_membership_plan", planSpecs.name, { maxAge: 60 * 60 * 24 });
      return res;
    }
  } catch (error: any) {
    console.error("Membership upgrade error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
