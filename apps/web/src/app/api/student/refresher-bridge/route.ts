import { NextResponse } from 'next/server';
import {
  INITIAL_MATERIALS,
  INITIAL_ASSESSMENTS,
  INITIAL_GUIDANCE_SESSIONS,
  INITIAL_LEARNING_PATH_STEPS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_PROGRESS,
} from '@/components/refresher-bridge/constants/sampleData';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const dbSessions = await prisma.refresherSession.findMany();
    const sessions = dbSessions.length > 0
      ? dbSessions.map(s => ({
          id: s.id,
          mentorName: "Dr. Rajesh Verma",
          mentorTitle: "Lead Architect",
          mentorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          title: s.title,
          subject: JSON.parse(s.skills)[0] || "General Prerequisite",
          date: "Scheduled (Check Dashboard)",
          time: s.duration,
          duration: s.duration,
          mode: "Online",
          locationOrLink: "https://meet.google.com/xyz-bridge-dsa",
          description: s.description,
          isRegistered: false,
          registeredCount: 5,
        }))
      : INITIAL_GUIDANCE_SESSIONS;

    return NextResponse.json({
      success: true,
      data: {
        progress: INITIAL_PROGRESS,
        materials: INITIAL_MATERIALS,
        assessments: INITIAL_ASSESSMENTS,
        guidanceSessions: sessions,
        learningPath: INITIAL_LEARNING_PATH_STEPS,
        recommendations: INITIAL_RECOMMENDATIONS,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch refresher module data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    return NextResponse.json({
      success: true,
      message: `Action '${action || 'update'}' processed successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process update' },
      { status: 500 }
    );
  }
}
