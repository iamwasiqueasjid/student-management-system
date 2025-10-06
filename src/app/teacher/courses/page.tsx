import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import { BookOpen, Users, Plus } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function TeacherCourses() {
  const session = await getSession();

  if (!session || session.role !== 'teacher') {
    redirect('/login');
  }

  await connectDB();

  const user = await User.findById(session.userId);

  if (!user || !user.approved) {
    redirect('/login');
  }

  const courses: any[] = await Course.find({ teacher: session.userId }).lean();

  return (
    <DashboardLayout role="teacher" userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg border border-blue-200">
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold">{courses.length} Courses</span>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Assigned</h3>
            <p className="text-gray-600 mb-4">You haven't been assigned to any courses yet.</p>
            <p className="text-sm text-gray-500">Contact your admin to get assigned to courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <div key={course._id.toString()} className="card hover:shadow-xl transition-shadow border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {course.code}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{course.students.length} students enrolled</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="btn-secondary text-sm py-2">
                    View Students
                  </button>
                  <button className="btn-primary text-sm py-2">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}