import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

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

    // Verify role is Admin
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || user.role !== "Admin") {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    // Calculations
    const totalUsers = await prisma.user.count();
    const activePlacements = await prisma.application.count({
      where: { status: "Approved" },
    });
    const courseCompletions = await prisma.enrollment.count({
      where: { progress: 100 },
    });
    const totalEnrollments = await prisma.enrollment.count();

    // Mock revenue based on enrollments (say, $1,500 average per enrollment)
    const totalRevenue = totalEnrollments * 1500;

    // Fetch recent enquiries
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { receivedAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      stats: [
        { label: "Total Users", value: totalUsers.toLocaleString(), change: "+12%", status: "up", color: "text-blue-600 bg-blue-50" },
        { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+8.4%", status: "up", color: "text-indigo-600 bg-indigo-50" },
        { label: "Active Placements", value: activePlacements.toLocaleString(), change: "+3%", status: "up", color: "text-rose-600 bg-rose-50" },
        { label: "Course Completions", value: courseCompletions.toLocaleString(), change: "+24%", status: "up", color: "text-emerald-600 bg-emerald-50" },
      ],
      recentEnquiries: enquiries.map((e) => ({
        type: e.subject,
        entity: e.name,
        date: new Date(e.receivedAt).toLocaleDateString(),
        status: e.status,
        color: e.status === "Completed" ? "emerald" : e.status === "In Progress" ? "amber" : "blue",
      })),
    });
  } catch (error: any) {
    console.error("Admin dashboard API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
