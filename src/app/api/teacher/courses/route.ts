import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import Course from '@/models/Course';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (!session || session.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const courses = await Course.find({ teacher: session.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Get teacher courses error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}