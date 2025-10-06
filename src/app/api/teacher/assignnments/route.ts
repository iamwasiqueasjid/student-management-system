import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import Course from '@/models/Course';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (!session || session.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const assignments = await Assignment.find({ teacher: session.userId })
      .populate('course', 'title code')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (!session || session.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { title, description, course, dueDate, totalMarks } = await request.json();

    if (!title || !description || !course || !dueDate || !totalMarks) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Verify teacher is assigned to this course
    const courseDoc = await Course.findById(course);

    if (!courseDoc || courseDoc.teacher?.toString() !== session.userId) {
      return NextResponse.json(
        { message: 'You are not assigned to this course' },
        { status: 403 }
      );
    }

    const assignment = await Assignment.create({
      title,
      description,
      course,
      teacher: session.userId,
      dueDate: new Date(dueDate),
      totalMarks: parseInt(totalMarks),
    });

    return NextResponse.json(
      { message: 'Assignment created successfully', assignment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create assignment error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}