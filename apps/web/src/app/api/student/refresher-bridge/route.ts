import { NextResponse } from 'next/server';
import {
  INITIAL_MATERIALS,
  INITIAL_ASSESSMENTS,
  INITIAL_GUIDANCE_SESSIONS,
  INITIAL_LEARNING_PATH_STEPS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_PROGRESS,
} from '@/components/refresher-bridge/constants/sampleData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        progress: INITIAL_PROGRESS,
        materials: INITIAL_MATERIALS,
        assessments: INITIAL_ASSESSMENTS,
        guidanceSessions: INITIAL_GUIDANCE_SESSIONS,
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
