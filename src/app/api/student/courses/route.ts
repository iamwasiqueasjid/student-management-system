import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import Course from '@/models/Course';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (!session || session.role !== 'student') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const enrolled = searchParams.get('enrolled');

    let query = {};

    if (enrolled === 'true') {
      // Get courses student is enrolled in
      query = { students: session.userId };
    } else if (enrolled === 'false') {
      // Get courses student is NOT enrolled in
      query = { students: { $ne: session.userId } };
    }

    const courses = await Course.find(query)
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}