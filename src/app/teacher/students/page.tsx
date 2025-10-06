import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import { Users as UsersIcon, Mail, BookOpen } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function TeacherStudents() {
  const session = await getSession();

  if (!session || session.role !== 'teacher') {
    redirect('/login');
  }

  await connectDB();

  const user = await User.findById(session.userId);

  if (!user || !user.approved) {
    redirect('/login');
  }

  // Get all courses taught by this teacher
  const courses = await Course.find({ teacher: session.userId })
    .populate('students', 'name email')
    .lean();

  // Get unique students across all courses
  const studentMap = new Map();
  courses.forEach((course) => {
    course.students.forEach((student: any) => {
      if (!studentMap.has(student._id.toString())) {
        studentMap.set(student._id.toString(), {
          ...student,
          courses: [],
        });
      }
      studentMap.get(student._id.toString()).courses.push({
        title: course.title,
        code: course.code,
      });
    });
  });

  const students = Array.from(studentMap.values());

  return (
    <DashboardLayout role="teacher" userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg border border-green-200">
            <UsersIcon className="w-5 h-5" />
            <span className="font-semibold">{students.length} Students</span>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="card text-center py-12 border border-gray-200">
            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Yet</h3>
            <p className="text-gray-600">Students will appear here once they enroll in your courses.</p>
          </div>
        ) : (
          <div className="card border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold">Name</th>
                    <th className="py-4 px-6 text-left font-semibold">Email</th>
                    <th className="py-4 px-6 text-left font-semibold">Enrolled Courses</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student: any, index: number) => (
                    <tr key={student._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-semibold">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{student.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          {student.courses.map((course: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>{course.code}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}