import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// Helper to verify admin credentials
async function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  const payload = verifyToken(token) as { id: string; role?: string } | null;
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { role: true, email: true },
  });

  if (!user || user.role !== "Admin") return null;
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const adminUser = await verifyAdmin(req);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all configurations
    const companyInfo = await prisma.companyInfo.findFirst() || {
      phone: "+91-626-596-6705",
      email: "careers@epitometrc.com",
      address: "208, Swadesh Bhawan, Behind Press Complex, LIG Colony, Indore, Madhya Pradesh",
      mapQuery: "Epitome Training & Recruitment Consultants",
    };

    const aiFeatures = await prisma.aIFeatureConfig.findMany();
    const membershipPlans = await prisma.membershipPlan.findMany();
    const statsList = await prisma.companyStat.findMany({ orderBy: { order: "asc" } });
    const servicesList = await prisma.companyService.findMany();

    return NextResponse.json({
      success: true,
      settings: {
        siteName: "EpitomeTRC",
        adminEmail: adminUser.email,
        companyInfo,
        aiFeatures,
        membershipPlans,
        statsList,
        servicesList,
      },
    });
  } catch (error: any) {
    console.error("Admin settings GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminUser = await verifyAdmin(req);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, data } = body;

    if (!type) {
      return NextResponse.json({ error: "Missing action type" }, { status: 400 });
    }

    switch (type) {
      case "info": {
        // Update or create CompanyInfo
        const existing = await prisma.companyInfo.findFirst();
        if (existing) {
          await prisma.companyInfo.update({
            where: { id: existing.id },
            data: {
              phone: data.phone,
              email: data.email,
              address: data.address,
              mapQuery: data.mapQuery || "",
            },
          });
        } else {
          await prisma.companyInfo.create({
            data: {
              phone: data.phone,
              email: data.email,
              address: data.address,
              mapQuery: data.mapQuery || "",
            },
          });
        }
        break;
      }

      case "ai": {
        // Toggle specific AI config
        await prisma.aIFeatureConfig.update({
          where: { id: data.id },
          data: {
            isEnabled: data.isEnabled,
          },
        });
        break;
      }

      case "membership": {
        // Update pricing limits
        await prisma.membershipPlan.update({
          where: { id: data.id },
          data: {
            price: data.price,
            maxInterviews: parseInt(data.maxInterviews, 10) || 0,
            maxResumes: parseInt(data.maxResumes, 10) || 0,
            features: JSON.stringify(data.features),
          },
        });
        break;
      }

      case "stat": {
        // Create, update, or delete stats
        if (data.action === "delete") {
          await prisma.companyStat.delete({ where: { id: data.id } });
        } else if (data.action === "create") {
          await prisma.companyStat.create({
            data: {
              key: data.key,
              label: data.label,
              value: data.value,
              desc: data.desc || "",
              iconName: data.iconName || "Award",
              order: parseInt(data.order, 10) || 0,
              status: "Active",
            },
          });
        } else {
          await prisma.companyStat.update({
            where: { id: data.id },
            data: {
              label: data.label,
              value: data.value,
              desc: data.desc || "",
              order: parseInt(data.order, 10) || 0,
            },
          });
        }
        break;
      }

      case "service": {
        // Create, update, or delete services
        if (data.action === "delete") {
          await prisma.companyService.delete({ where: { id: data.id } });
        } else if (data.action === "create") {
          await prisma.companyService.create({
            data: {
              title: data.title,
              subtitle: data.subtitle || "",
              slug: data.slug,
              description: data.description,
              iconName: data.iconName || "Settings",
              category: data.category || "Consulting",
              features: JSON.stringify(data.features || []),
              status: "Active",
            },
          });
        } else {
          await prisma.companyService.update({
            where: { id: data.id },
            data: {
              title: data.title,
              subtitle: data.subtitle || "",
              description: data.description,
              features: JSON.stringify(data.features || []),
            },
          });
        }
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin settings PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
