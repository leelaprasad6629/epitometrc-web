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
    let userId = "";

    if (token) {
      const payload = verifyToken(token) as { id: string } | null;
      if (payload) {
        userId = payload.id;
      }
    }

    let course = await prisma.course.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        courseModules: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
            },
          },
        },
        enrollments: userId
          ? {
              where: { userId },
            }
          : false,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const enrollment = course.enrollments?.[0];

    // Rich default mock fallback for curriculum if modules not seeded yet
    const modulesData = course.courseModules.length > 0
      ? course.courseModules.map((m) => ({
          id: m.id,
          courseId: m.courseId,
          title: m.title,
          description: m.description || "",
          orderIndex: m.orderIndex,
          lessons: m.lessons.map((l) => ({
            id: l.id,
            moduleId: l.moduleId,
            title: l.title,
            description: l.description || "",
            duration: l.duration,
            orderIndex: l.orderIndex,
            type: l.type as any,
            isFreePreview: l.isFreePreview,
          })),
        }))
      : [
          {
            id: "mod-1",
            courseId: course.id,
            title: "Module 1: Architecture Overview & Fundamentals",
            description: "Foundational breakdown of core principles, environment setup, and design patterns.",
            orderIndex: 1,
            lessons: [
              { id: "les-1", moduleId: "mod-1", title: "1.1 Course Introduction & Learning Objectives", duration: "12 mins", orderIndex: 1, type: "video", isFreePreview: true },
              { id: "les-2", moduleId: "mod-1", title: "1.2 Enterprise Architecture Blueprint & Clean Code", duration: "25 mins", orderIndex: 2, type: "video", isFreePreview: true },
              { id: "les-3", moduleId: "mod-1", title: "1.3 Environment Setup & Tooling Configuration", duration: "15 mins", orderIndex: 3, type: "notes", isFreePreview: false },
              { id: "les-4", moduleId: "mod-1", title: "1.4 Module Diagnostic Readiness Quiz", duration: "15 mins", orderIndex: 4, type: "quiz", isFreePreview: false },
            ],
          },
          {
            id: "mod-2",
            courseId: course.id,
            title: "Module 2: Advanced System Implementation & Patterns",
            description: "Deep dive into state management, microservices, and database optimization.",
            orderIndex: 2,
            lessons: [
              { id: "les-5", moduleId: "mod-2", title: "2.1 Micro-Frontends & Modular State Flow", duration: "35 mins", orderIndex: 1, type: "video", isFreePreview: false },
              { id: "les-6", moduleId: "mod-2", title: "2.2 High-Throughput REST & GraphQL API Design", duration: "30 mins", orderIndex: 2, type: "video", isFreePreview: false },
              { id: "les-7", moduleId: "mod-2", title: "2.3 Hands-On Assignment: System Architecture Proposal", duration: "60 mins", orderIndex: 3, type: "assignment", isFreePreview: false },
              { id: "les-8", moduleId: "mod-2", title: "2.4 Performance Profiling & Caching Strategies", duration: "20 mins", orderIndex: 4, type: "video", isFreePreview: false },
            ],
          },
          {
            id: "mod-3",
            courseId: course.id,
            title: "Module 3: Security, CI/CD & Production Deployment",
            description: "Securing APIs with JWT, automated testing pipelines, and Docker/K8s deployment.",
            orderIndex: 3,
            lessons: [
              { id: "les-9", moduleId: "mod-3", title: "3.1 OAuth2, JWT & RBAC Authorization Guards", duration: "40 mins", orderIndex: 1, type: "video", isFreePreview: false },
              { id: "les-10", moduleId: "mod-3", title: "3.2 Automated CI/CD Pipelines & Testing Strategies", duration: "30 mins", orderIndex: 2, type: "video", isFreePreview: false },
              { id: "les-11", moduleId: "mod-3", title: "3.3 Final Comprehensive Assessment & Capstone", duration: "45 mins", orderIndex: 3, type: "quiz", isFreePreview: false },
            ],
          },
        ];

    const courseDetails = {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle || "Master essential industry competencies through hands-on learning.",
      slug: course.slug || course.id,
      category: course.category,
      description: course.description,
      duration: course.duration,
      modules: course.modules || modulesData.length,
      image: course.image,
      level: course.level || "Intermediate",
      language: course.language || "English",
      price: course.price || "Free",
      rating: course.rating || 4.8,
      reviewsCount: course.reviewsCount || 128,
      enrolledCount: course.enrolledCount || 1450,
      learningObjectives: (course.learningObjectives as string[]) || [
        "Architect production-grade scalable web software",
        "Apply SOLID principles, design patterns, and clean code",
        "Build secure RESTful APIs with RBAC and JWT authentication",
        "Implement automated CI/CD deployment pipelines"
      ],
      skillsCovered: (course.skillsCovered as string[]) || [
        "System Design",
        "Clean Architecture",
        "TypeScript / Next.js",
        "Prisma ORM",
        "REST API Security"
      ],
      learningOutcomes: (course.learningOutcomes as string[]) || [
        "Gain real-world industry portfolio projects",
        "Receive verified Certificate of Completion with QR code",
        "Pass corporate technical interviews with confidence"
      ],
      prerequisites: (course.prerequisites as string[]) || [
        "Basic understanding of programming logic and web technologies",
        "Familiarity with HTML, CSS, and basic JavaScript concepts"
      ],
      faqs: (course.faqs as any[]) || [
        { question: "Is this course self-paced or live?", answer: "This course offers self-paced video modules alongside live scheduled mentor sessions." },
        { question: "Will I get a certificate upon completion?", answer: "Yes! Completing 100% of lessons, quizzes, and assignments unlocks an official EpitomeTRC Certificate." },
        { question: "Can I access course materials after completion?", answer: "Yes, you retain lifetime access to all notes, video lessons, and updates." }
      ],
      instructorName: course.instructorName || "Dr. Rajesh Verma",
      instructorRole: course.instructorRole || "Senior System Architect & Academic Director",
      instructorAvatar: course.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      instructorBio: course.instructorBio || "Former Tech Lead at Microsoft with 15+ years of software architecture and enterprise consulting experience.",
      instructorLinkedIn: course.instructorLinkedIn || "https://linkedin.com",
      enrolled: !!enrollment,
      progress: enrollment ? enrollment.progress : 0,
      completedAt: enrollment?.completedAt ? enrollment.completedAt.toISOString() : null,
      courseModules: modulesData,
      reviews: [
        { id: "rev-1", userName: "Aarav Sharma", userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", rating: 5, date: "2 days ago", comment: "Outstanding course structure! The system architecture modules cleared up concepts I struggled with for months." },
        { id: "rev-2", userName: "Sneha Patel", userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100", rating: 5, date: "1 week ago", comment: "The interactive quizzes and assignment feedback from instructors made this worth every minute." },
        { id: "rev-3", userName: "Vikram Nambiar", userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", rating: 4, date: "2 weeks ago", comment: "Very well paced content. Clear explanations, practical examples, and production-ready code patterns." }
      ]
    };

    return NextResponse.json({ success: true, course: courseDetails });
  } catch (error: any) {
    console.error("Course details error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
