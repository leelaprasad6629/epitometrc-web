import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export const ALLOWED_CATEGORIES = [
  "Product Improvement",
  "Website Enhancement",
  "Training",
  "Internship",
  "Recruitment",
  "Consulting",
  "AI",
  "UI/UX",
  "Process Improvement",
  "Other"
];

// Helper to generate unique submission code e.g. IDEA-2026-1048
function generateSubmissionId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `IDEA-${year}-${randomNum}`;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    let userId: string | undefined;
    let userName: string = "";
    let userEmail: string = "";

    if (token) {
      const payload = verifyToken(token) as { id: string } | null;
      if (payload?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: payload.id },
          select: { id: true, name: true, email: true }
        });
        if (dbUser) {
          userId = dbUser.id;
          userName = dbUser.name;
          userEmail = dbUser.email;
        }
      }
    }

    const body = await req.json();
    const {
      title,
      category,
      description,
      currentProblem,
      proposedSolution,
      expectedOutcome,
      benefits,
      whyImplement,
      additionalNotes,
      userName: inputName,
      userEmail: inputEmail
    } = body;

    // Use input name/email if user is guest or not logged in
    if (!userName) userName = (inputName || "").trim();
    if (!userEmail) userEmail = (inputEmail || "").trim().toLowerCase();

    // Required Field Validation
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Idea Title is required." }, { status: 400 });
    }
    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Valid Category selection is required." }, { status: 400 });
    }
    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json({ error: "Description of your idea is required." }, { status: 400 });
    }
    if (!currentProblem || typeof currentProblem !== "string" || !currentProblem.trim()) {
      return NextResponse.json({ error: "Current Problem description is required." }, { status: 400 });
    }
    if (!proposedSolution || typeof proposedSolution !== "string" || !proposedSolution.trim()) {
      return NextResponse.json({ error: "Proposed Solution is required." }, { status: 400 });
    }
    if (!expectedOutcome || typeof expectedOutcome !== "string" || !expectedOutcome.trim()) {
      return NextResponse.json({ error: "Expected Outcome is required." }, { status: 400 });
    }
    if (!benefits || typeof benefits !== "string" || !benefits.trim()) {
      return NextResponse.json({ error: "Benefits statement is required." }, { status: 400 });
    }
    if (!whyImplement || typeof whyImplement !== "string" || !whyImplement.trim()) {
      return NextResponse.json({ error: "Reason why this should be implemented is required." }, { status: 400 });
    }
    if (!userName || !userEmail) {
      return NextResponse.json({ error: "Name and Email are required to submit an idea." }, { status: 400 });
    }

    // Character Limit Validations
    if (title.trim().length > 150) {
      return NextResponse.json({ error: "Idea Title must not exceed 150 characters." }, { status: 400 });
    }
    if (description.trim().length > 3000) {
      return NextResponse.json({ error: "Idea Description must not exceed 3000 characters." }, { status: 400 });
    }

    // Unique Submission ID Generation with retry
    let submissionId = generateSubmissionId();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await prisma.ideaSuggestion.findUnique({
        where: { submissionId }
      });
      if (!existing) {
        isUnique = true;
      } else {
        submissionId = generateSubmissionId();
        attempts++;
      }
    }

    // Create Idea Suggestion Record with initial Status History
    const suggestion = await prisma.ideaSuggestion.create({
      data: {
        submissionId,
        userId: userId || null,
        userName,
        userEmail,
        title: title.trim(),
        category,
        description: description.trim(),
        currentProblem: currentProblem.trim(),
        proposedSolution: proposedSolution.trim(),
        expectedOutcome: expectedOutcome.trim(),
        benefits: benefits.trim(),
        whyImplement: whyImplement.trim(),
        additionalNotes: additionalNotes ? additionalNotes.trim() : null,
        status: "Pending",
        priority: "Medium",
        loaEligible: false,
        statusHistory: {
          create: {
            status: "Pending",
            changedBy: userName,
            changedByEmail: userEmail,
            remarks: "Initial submission by user"
          }
        }
      }
    });

    // Optional Audit Log if logged in
    if (userId) {
      try {
        await prisma.auditLog.create({
          data: {
            userId,
            userEmail,
            action: "SUBMIT_IDEA_SUGGESTION",
            details: JSON.stringify({ submissionId, title: suggestion.title, category })
          }
        });
      } catch (err) {
        // Audit log fallback non-blocking
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your suggestion. Your idea has been successfully submitted.",
      submissionId: suggestion.submissionId,
      status: suggestion.status,
      loaNotice: "If your idea creates significant value and is implemented, you may become eligible for a Letter of Appreciation (LOA)."
    }, { status: 201 });

  } catch (error: any) {
    console.error("Suggestions POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
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
      select: { id: true, name: true, email: true, role: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";
    const loaEligible = searchParams.get("loaEligible");
    const archived = searchParams.get("archived");

    if (dbUser.role === "Admin") {
      // ADMIN VIEW: Query all suggestions with filters
      const whereClause: any = {
        isArchived: archived === "true" ? true : false,
      };

      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { submissionId: { contains: search, mode: "insensitive" } },
          { userName: { contains: search, mode: "insensitive" } },
          { userEmail: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (category && category !== "all") {
        whereClause.category = category;
      }
      if (status && status !== "all") {
        whereClause.status = status;
      }
      if (priority && priority !== "all") {
        whereClause.priority = priority;
      }
      if (loaEligible === "true") {
        whereClause.loaEligible = true;
      } else if (loaEligible === "false") {
        whereClause.loaEligible = false;
      }

      const suggestions = await prisma.ideaSuggestion.findMany({
        where: whereClause,
        include: {
          statusHistory: {
            orderBy: { timestamp: "desc" }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      return NextResponse.json({
        success: true,
        suggestions,
        totalCount: suggestions.length
      });
    } else {
      // USER / STUDENT VIEW: Query only user's own submissions
      const suggestions = await prisma.ideaSuggestion.findMany({
        where: {
          OR: [
            { userId: dbUser.id },
            { userEmail: dbUser.email }
          ]
        },
        include: {
          statusHistory: {
            orderBy: { timestamp: "desc" }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      return NextResponse.json({
        success: true,
        suggestions: suggestions.map((s) => ({
          id: s.id,
          submissionId: s.submissionId,
          title: s.title,
          category: s.category,
          description: s.description,
          currentProblem: s.currentProblem,
          proposedSolution: s.proposedSolution,
          expectedOutcome: s.expectedOutcome,
          benefits: s.benefits,
          whyImplement: s.whyImplement,
          additionalNotes: s.additionalNotes,
          status: s.status,
          loaEligible: s.loaEligible,
          loaStatus: s.loaStatus,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          statusHistory: s.statusHistory
        }))
      });
    }

  } catch (error: any) {
    console.error("Suggestions GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
