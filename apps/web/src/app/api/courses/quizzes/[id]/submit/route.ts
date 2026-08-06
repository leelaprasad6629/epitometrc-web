import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answers } = await req.json(); // Record<string, string>

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    let score = 80;
    let passed = true;

    if (quiz && quiz.questions.length > 0) {
      let correct = 0;
      quiz.questions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) {
          correct++;
        }
      });
      score = Math.round((correct / quiz.questions.length) * 100);
      passed = score >= quiz.passingScore;

      await prisma.quizAttempt.create({
        data: {
          quizId,
          userId: payload.id,
          score,
          passed,
          answers: JSON.stringify(answers),
        },
      });
    }

    return NextResponse.json({
      success: true,
      score,
      passed,
      message: passed ? "Quiz Passed! 🎉" : "Quiz Needs Improvement",
    });
  } catch (error: any) {
    console.error("Quiz submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
