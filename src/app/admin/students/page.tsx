import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import { Mail, BookOpen } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function AdminStudents() {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  await connectDB();

  const students: any[] = await User.find({ role: 'student' })
    .select('-password')
    .sort({ createdAt: -1 })
    .lean();

  // Get enrollment count for each student
  const studentsWithCourses = await Promise.all(
    students.map(async (student: any) => {
      const courseCount = await Course.countDocuments({
        students: student._id,
      });
      return {
        ...student,
        courseCount,
      };
    })
  );

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-4 px-6 text-left">Name</th>
                  <th className="py-4 px-6 text-left">Email</th>
                  <th className="py-4 px-6 text-left">Enrolled Courses</th>
                  <th className="py-4 px-6 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {studentsWithCourses.map((student: any) => (
                  <tr key={student._id.toString()} className="border-b border-gray-200">
                    <td className="py-4 px-6 font-semibold">{student.name}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        {student.email}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-600">
                          {student.courseCount} courses
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}