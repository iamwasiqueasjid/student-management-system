import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (!session || session.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { teacherId, approve } = await request.json();

    if (!teacherId) {
      return NextResponse.json(
        { message: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json(
        { message: 'Teacher not found' },
        { status: 404 }
      );
    }

    if (approve) {
      teacher.approved = true;
      await teacher.save();

      return NextResponse.json({
        message: 'Teacher approved successfully',
        teacher,
      });
    } else {
      // Reject teacher - delete account
      await User.findByIdAndDelete(teacherId);

      return NextResponse.json({
        message: 'Teacher application rejected',
      });
    }
  } catch (error) {
    console.error('Approve teacher error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (!session || session.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const pendingTeachers = await User.find({
      role: 'teacher',
      approved: false,
    }).select('-password').sort({ createdAt: -1 });

    return NextResponse.json({ teachers: pendingTeachers });
  } catch (error) {
    console.error('Get pending teachers error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}