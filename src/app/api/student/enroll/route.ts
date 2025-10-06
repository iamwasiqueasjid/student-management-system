import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Course from '@/models/Course';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (!session || session.role !== 'student') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID is required' },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if already enrolled
    if (course.students.includes(session.userId)) {
      return NextResponse.json(
        { message: 'Already enrolled in this course' },
        { status: 409 }
      );
    }

    // Add student to course
    course.students.push(session.userId);
    await course.save();

    return NextResponse.json({
      message: 'Successfully enrolled in course',
      course,
    });
  } catch (error) {
    console.error('Enroll error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}