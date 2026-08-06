import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isCompleted, watchTimeSeconds } = await req.json();

    // Upsert lesson progress
    const existing = await prisma.lessonProgress.findFirst({
      where: {
        userId: payload.id,
        lessonId,
      },
    });

    let progressRecord;
    if (existing) {
      progressRecord = await prisma.lessonProgress.update({
        where: { id: existing.id },
        data: {
          isCompleted: isCompleted ?? existing.isCompleted,
          watchTimeSeconds: watchTimeSeconds ? watchTimeSeconds + existing.watchTimeSeconds : existing.watchTimeSeconds,
          completedAt: isCompleted ? new Date() : existing.completedAt,
        },
      });
    } else {
      progressRecord = await prisma.lessonProgress.create({
        data: {
          userId: payload.id,
          lessonId,
          isCompleted: !!isCompleted,
          watchTimeSeconds: watchTimeSeconds || 0,
          completedAt: isCompleted ? new Date() : null,
        },
      });
    }

    // Try to update course enrollment progress if lesson has module relation
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                courseModules: {
                  include: {
                    lessons: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (lesson?.module?.course) {
      const course = lesson.module.course;
      const allLessons = course.courseModules.flatMap((m) => m.lessons);
      const totalLessonsCount = allLessons.length || 1;

      const completedCount = await prisma.lessonProgress.count({
        where: {
          userId: payload.id,
          lessonId: { in: allLessons.map((l) => l.id) },
          isCompleted: true,
        },
      });

      const overallPercent = Math.min(100, Math.round((completedCount / totalLessonsCount) * 100));

      const enrollment = await prisma.enrollment.findFirst({
        where: { userId: payload.id, courseId: course.id },
      });

      if (enrollment) {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: {
            progress: overallPercent,
            completedAt: overallPercent === 100 ? new Date() : enrollment.completedAt,
          },
        });
      }
    }

    return NextResponse.json({ success: true, progress: progressRecord });
  } catch (error: any) {
    console.error("Lesson progress API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
