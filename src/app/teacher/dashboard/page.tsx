import { BookOpen, FileText, ClipboardList, Users } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import Assignment from '@/models/Assignment';
import Quiz from '@/models/Quiz';
import { redirect } from 'next/navigation';

export default async function TeacherDashboard() {
  const session = await getSession();

  if (!session || session.role !== 'teacher') {
    redirect('/login');
  }

  await connectDB();

  const user = await User.findById(session.userId);

  if (!user || !user.approved) {
    redirect('/login');
  }

  // Fetch teacher's courses
  const courses = await Course.find({ teacher: session.userId }).lean();
  const courseIds = courses.map((c) => c._id);

  // Count total enrolled students across all courses
  const totalStudents = courses.reduce((sum, course) => sum + course.students.length, 0);

  const [assignments, quizzes] = await Promise.all([
    Assignment.find({ teacher: session.userId }).countDocuments(),
    Quiz.find({ teacher: session.userId }).countDocuments(),
  ]);

  return (
    <DashboardLayout role="teacher" userName={user.name}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-blue text-white rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-blue-100">Manage your courses and track student progress.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="My Courses"
            value={courses.length}
            icon={BookOpen}
            color="blue"
          />
          <StatsCard
            title="Total Students"
            value={totalStudents}
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Assignments"
            value={assignments}
            icon={FileText}
            color="purple"
          />
          <StatsCard
            title="Quizzes"
            value={quizzes}
            icon={ClipboardList}
            color="orange"
          />
        </div>

        {/* My Courses */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">My Courses</h2>
            <button className="btn-primary">Create Assignment</button>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No courses assigned yet.</p>
              <p className="text-sm text-gray-500">Contact admin to get assigned to courses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div
                  key={course.id.toString()}
                  className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {course.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{course.students.length} students</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Recent Assignments</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Assignment {i}</p>
                    <p className="text-sm text-gray-500">5 submissions pending</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Upcoming Quizzes</h2>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Quiz {i}</p>
                    <p className="text-sm text-gray-500">Scheduled for next week</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}