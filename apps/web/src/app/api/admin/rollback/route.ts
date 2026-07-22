import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { createRecordVersion } from "../../../../lib/ai/services/versionHelper";

// POST: Rollback a record to a previous saved snapshot version
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

    // Verify user is Admin or Employee
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || (user.role !== "Admin" && user.role !== "Employee")) {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    const { versionId } = await req.json();
    if (!versionId) {
      return NextResponse.json({ error: "Missing versionId" }, { status: 400 });
    }

    // Find the version record in DB
    const versionRecord = await prisma.recordVersion.findUnique({
      where: { id: versionId },
    });

    if (!versionRecord) {
      return NextResponse.json({ error: "Version record not found" }, { status: 404 });
    }

    const snapshot = JSON.parse(versionRecord.snapshot);

    // Rollback target based on recordType
    if (versionRecord.recordType === "Lead") {
      await prisma.lead.update({
        where: { id: versionRecord.recordId },
        data: {
          leadScore: snapshot.leadScore,
          priority: snapshot.priority,
          status: snapshot.status,
          explanation: snapshot.explanation,
          painPoints: snapshot.painPoints,
          opportunities: snapshot.opportunities,
          risks: snapshot.risks,
          recommendedServices: snapshot.recommendedServices,
          recommendedNextAction: snapshot.recommendedNextAction,
        },
      });
    } else if (versionRecord.recordType === "Proposal") {
      await prisma.proposal.update({
        where: { id: versionRecord.recordId },
        data: {
          companyOverview: snapshot.companyOverview,
          projectScope: snapshot.projectScope,
          services: snapshot.services,
          timeline: snapshot.timeline,
          deliverables: snapshot.deliverables,
          totalPrice: snapshot.totalPrice,
          priceBreakdown: snapshot.priceBreakdown,
          termsAndConditions: snapshot.termsAndConditions,
        },
      });
    } else if (versionRecord.recordType === "CRMClient") {
      await prisma.cRMClient.update({
        where: { id: versionRecord.recordId },
        data: {
          health: snapshot.health,
          summary: snapshot.summary,
        },
      });
    } else {
      return NextResponse.json({ error: `Rollback unsupported for recordType: ${versionRecord.recordType}` }, { status: 400 });
    }

    // Create a new version representing the rollback action itself
    const newVersion = await createRecordVersion(
      versionRecord.recordId,
      versionRecord.recordType,
      payload.id,
      `Rolled back record to version ${versionRecord.version}.`,
      snapshot
    );

    return NextResponse.json({
      success: true,
      message: `Successfully rolled back to version ${versionRecord.version}.`,
      version: newVersion?.version,
    });
  } catch (error: any) {
    console.error("Rollback error:", error);
    return NextResponse.json({ error: "Rollback operation failed: " + error.message }, { status: 500 });
  }
}
