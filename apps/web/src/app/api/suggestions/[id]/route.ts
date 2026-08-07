import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, role: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const suggestion = await prisma.ideaSuggestion.findFirst({
      where: {
        OR: [
          { id },
          { submissionId: id }
        ]
      },
      include: {
        statusHistory: {
          orderBy: { timestamp: "desc" }
        }
      }
    });

    if (!suggestion) {
      return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
    }

    // Access control: Admin or original submitter
    if (dbUser.role !== "Admin" && suggestion.userId !== dbUser.id && suggestion.userEmail !== dbUser.email) {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, suggestion });
  } catch (error: any) {
    console.error("Suggestion GET by ID error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin Role Verification
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!dbUser || dbUser.role !== "Admin") {
      return NextResponse.json({ error: "Access Forbidden: Admin privileges required" }, { status: 403 });
    }

    const existing = await prisma.ideaSuggestion.findFirst({
      where: {
        OR: [
          { id },
          { submissionId: id }
        ]
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      status,
      priority,
      loaEligible,
      loaStatus,
      internalRemarks,
      isArchived
    } = body;

    const updateData: any = {};
    let statusChanged = false;
    let newStatus = existing.status;

    if (status && ["Pending", "Under Review", "Accepted", "Implemented", "Rejected"].includes(status)) {
      if (status !== existing.status) {
        updateData.status = status;
        statusChanged = true;
        newStatus = status;
      }
    }

    if (priority && ["Low", "Medium", "High", "Urgent"].includes(priority)) {
      updateData.priority = priority;
    }

    if (typeof loaEligible === "boolean") {
      updateData.loaEligible = loaEligible;
      updateData.loaStatus = loaEligible ? (loaStatus || "Eligible") : "Ineligible";
      updateData.loaMarkedBy = dbUser.name;
      updateData.loaMarkedAt = new Date();
    }

    if (typeof internalRemarks === "string") {
      updateData.internalRemarks = internalRemarks;
    }

    if (typeof isArchived === "boolean") {
      updateData.isArchived = isArchived;
    }

    // Update Record
    const updatedSuggestion = await prisma.ideaSuggestion.update({
      where: { id: existing.id },
      data: updateData,
      include: {
        statusHistory: {
          orderBy: { timestamp: "desc" }
        }
      }
    });

    // Record Status History if status changed
    if (statusChanged) {
      await prisma.suggestionStatusHistory.create({
        data: {
          suggestionId: existing.id,
          status: newStatus,
          changedBy: dbUser.name,
          changedByEmail: dbUser.email,
          remarks: internalRemarks || `Status updated from ${existing.status} to ${newStatus}`
        }
      });
    }

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: dbUser.id,
          userEmail: dbUser.email,
          action: "UPDATE_SUGGESTION_STATUS",
          details: JSON.stringify({
            submissionId: existing.submissionId,
            previousStatus: existing.status,
            newStatus,
            loaEligible: updateData.loaEligible
          })
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: "Suggestion record updated successfully",
      suggestion: updatedSuggestion
    });

  } catch (error: any) {
    console.error("Suggestion PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
