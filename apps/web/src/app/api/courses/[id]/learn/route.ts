import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Please log in to access course curriculum." }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized: Invalid session." }, { status: 401 });
    }

    const course = await prisma.course.findFirst({
      where: { OR: [{ id: courseId }, { slug: courseId }] },
      include: {
        enrollments: {
          where: { userId: payload.id },
        },
        courseModules: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
              include: {
                assignments: true,
                quizzes: {
                  include: {
                    questions: true,
                    attempts: {
                      where: { userId: payload.id },
                      orderBy: { attemptedAt: "desc" },
                      take: 1,
                    },
                  },
                },
                resources: true,
                progresses: {
                  where: { userId: payload.id },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const enrollment = course.enrollments?.[0];
    if (!enrollment && course.price !== "Free") {
      // Return 403 Forbidden for non-enrolled paid content
      return NextResponse.json({ error: "Access Denied: You must be enrolled in this course to access learning content." }, { status: 403 });
    }

    // Default mock curriculum fallback if schema data not seeded yet
    const modulesData = course.courseModules.length > 0
      ? course.courseModules.map((m) => ({
          id: m.id,
          courseId: m.courseId,
          title: m.title,
          description: m.description || "",
          orderIndex: m.orderIndex,
          lessons: m.lessons.map((l) => {
            const userProg = l.progresses?.[0];
            const quiz = l.quizzes?.[0];
            const quizAttempt = quiz?.attempts?.[0];

            return {
              id: l.id,
              moduleId: l.moduleId,
              title: l.title,
              description: l.description || "",
              duration: l.duration,
              orderIndex: l.orderIndex,
              type: l.type as any,
              videoUrl: l.videoUrl || "https://www.youtube.com/embed/NCwa_xi0Uuc",
              notesContent: l.notesContent || `### ${l.title}\n\nKey takeaways & architectural principles:\n- Clean separation of concerns\n- Immutable state management\n- Comprehensive automated testing & error handling`,
              isFreePreview: l.isFreePreview,
              isCompleted: userProg?.isCompleted || false,
              watchTimeSeconds: userProg?.watchTimeSeconds || 0,
              lastPositionSeconds: userProg?.lastPositionSeconds || 0,
              quiz: quiz
                ? {
                    id: quiz.id,
                    title: quiz.title,
                    passingScore: quiz.passingScore,
                    timeLimitMinutes: quiz.timeLimitMinutes,
                    questions: quiz.questions.map((q) => ({
                      id: q.id,
                      quizId: q.quizId,
                      questionText: q.questionText,
                      questionType: q.questionType,
                      options: q.options as string[],
                      correctAnswer: q.correctAnswer,
                      explanation: q.explanation || "",
                      points: q.points,
                    })),
                    lastAttempt: quizAttempt
                      ? {
                          score: quizAttempt.score,
                          passed: quizAttempt.passed,
                          attemptedAt: quizAttempt.attemptedAt.toISOString(),
                        }
                      : undefined,
                  }
                : undefined,
              assignments: l.assignments.map((a) => ({
                id: a.id,
                title: a.title,
                instructions: a.instructions,
                deadline: a.deadline || "End of Module",
                maxMarks: a.maxMarks,
              })),
              resources: l.resources.map((r) => ({
                id: r.id,
                title: r.title,
                fileType: r.fileType,
                fileUrl: r.fileUrl,
                fileSize: r.fileSize || "1.2 MB",
              })),
            };
          }),
        }))
      : [
          {
            id: "mod-1",
            courseId: course.id,
            title: "Module 1: Foundations & Architecture",
            description: "Core architectural concepts, environment configuration, and clean code fundamentals.",
            orderIndex: 1,
            lessons: [
              {
                id: "les-1",
                moduleId: "mod-1",
                title: "1.1 Overview & Learning Roadmap",
                description: "Welcome to the course! Overview of the tools, frameworks, and architecture we will build.",
                duration: "12 mins",
                orderIndex: 1,
                type: "video",
                videoUrl: "https://www.youtube.com/embed/pTB0EiLXUC8",
                isFreePreview: true,
                isCompleted: true,
              },
              {
                id: "les-2",
                moduleId: "mod-1",
                title: "1.2 Enterprise Design Patterns & SOLID Principles",
                description: "Deep dive into Single Responsibility, Open-Closed, and Dependency Inversion in modern web apps.",
                duration: "25 mins",
                orderIndex: 2,
                type: "video",
                videoUrl: "https://www.youtube.com/embed/NCwa_xi0Uuc",
                isFreePreview: true,
                isCompleted: true,
              },
              {
                id: "les-3",
                moduleId: "mod-1",
                title: "1.3 Environment Setup & Reference Notes",
                description: "Comprehensive notes and terminal scripts to initialize your development environment.",
                duration: "15 mins",
                orderIndex: 3,
                type: "notes",
                notesContent: "### Environment & Setup Notes\n\n1. Install Node.js v20+ and NPM 10+.\n2. Configure PostgreSQL database connection string.\n3. Run `npm install` to load all peer dependencies.\n4. Initialize Prisma client using `npx prisma generate`.",
                isFreePreview: false,
                isCompleted: false,
              },
              {
                id: "les-4",
                moduleId: "mod-1",
                title: "1.4 Module 1 Diagnostic Quiz",
                description: "Self-assessment quiz covering architecture principles and clean code.",
                duration: "15 mins",
                orderIndex: 4,
                type: "quiz",
                isFreePreview: false,
                isCompleted: false,
                quiz: {
                  id: "qz-1",
                  title: "Module 1 Assessment Quiz",
                  passingScore: 70,
                  timeLimitMinutes: 15,
                  questions: [
                    {
                      id: "q-1",
                      quizId: "qz-1",
                      questionText: "What does the 'S' in SOLID principles stand for?",
                      questionType: "mcq",
                      options: ["Single Responsibility Principle", "System Isolation Protocol", "Synchronous State Processing", "Security Scoping Rule"],
                      correctAnswer: "Single Responsibility Principle",
                      explanation: "Single Responsibility Principle dictates that a class or module should have one, and only one, reason to change.",
                      points: 10,
                    },
                    {
                      id: "q-2",
                      quizId: "qz-1",
                      questionText: "Which architecture pattern decouples core business logic from outer frameworks?",
                      questionType: "mcq",
                      options: ["Monolithic Spaghetti Pattern", "Clean Architecture / Hexagonal Pattern", "Global Variable Pattern", "Static Script Injection"],
                      correctAnswer: "Clean Architecture / Hexagonal Pattern",
                      explanation: "Clean / Hexagonal architecture keeps business domain entities at the center, independent of frameworks, UI, or databases.",
                      points: 10,
                    },
                  ],
                },
              },
            ],
          },
          {
            id: "mod-2",
            courseId: course.id,
            title: "Module 2: Advanced Implementation & REST APIs",
            description: "Building production RESTful endpoints, database schema design, and asynchronous workflows.",
            orderIndex: 2,
            lessons: [
              {
                id: "les-5",
                moduleId: "mod-2",
                title: "2.1 Database Schema Modeling & Relationships",
                description: "Learn how to construct normalized relational database schemas with Prisma ORM.",
                duration: "30 mins",
                orderIndex: 1,
                type: "video",
                videoUrl: "https://www.youtube.com/embed/SqsRGlrNP1w",
                isFreePreview: false,
                isCompleted: false,
              },
              {
                id: "les-6",
                moduleId: "mod-2",
                title: "2.2 Practical Assignment: API Design Proposal",
                description: "Design a RESTful API specification for an enterprise e-commerce backend.",
                duration: "45 mins",
                orderIndex: 2,
                type: "assignment",
                isFreePreview: false,
                isCompleted: false,
                assignments: [
                  {
                    id: "asg-1",
                    lessonId: "les-6",
                    title: "RESTful API Specification Submission",
                    instructions: "Draft an API specification in Markdown format or JSON detailing endpoint paths, HTTP verbs, payload parameters, and error status codes.",
                    deadline: "Next Sunday at 11:59 PM",
                    maxMarks: 100,
                  },
                ],
              },
            ],
          },
        ];

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        category: course.category,
        image: course.image,
        instructorName: course.instructorName || "Dr. Rajesh Verma",
        progress: enrollment ? enrollment.progress : 0,
      },
      modules: modulesData,
    });
  } catch (error: any) {
    console.error("LMS curriculum fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
