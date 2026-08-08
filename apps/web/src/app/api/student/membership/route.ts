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
      // 1. Fetch user data (Verified email, contactNumber, status)
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, email: true, status: true, contactNumber: true }
      });

      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      // A. Verified Email check
      if (user.status !== "Active") {
        return NextResponse.json({ error: "Email verification is required before acquiring or upgrading membership plans." }, { status: 400 });
      }

      // B. Verified Mobile check
      if (!user.contactNumber || user.contactNumber.trim() === "") {
        return NextResponse.json({ error: "A verified contact mobile number is required to claim/upgrade your membership." }, { status: 400 });
      }

      // C. Verified Mobile unique check across premium plans
      const duplicateMobileUser = await prisma.user.findFirst({
        where: {
          contactNumber: user.contactNumber,
          id: { not: payload.id },
          membership: {
            planName: { not: "Free Plan" }
          }
        }
      });

      if (duplicateMobileUser) {
        return NextResponse.json({ error: "This contact mobile number is already linked to another active premium membership." }, { status: 400 });
      }

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

      // D. Audit Log membership purchase
      const { logAuditAction } = await import("@/lib/audit");
      await logAuditAction(
        payload.id,
        user.email,
        "MEMBERSHIP_PURCHASE",
        { planName: planSpecs.name, validUntil: validUntilDate },
        req.headers.get("x-forwarded-for")
      );

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
