import { BookOpen, FileText, ClipboardList, Award } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import Assignment from '@/models/Assignment';
import Quiz from '@/models/Quiz';
import { redirect } from 'next/navigation';

export default async function StudentDashboard() {
  const session = await getSession();

  if (!session || session.role !== 'student') {
    redirect('/login');
  }

  await connectDB();

  const user = await User.findById(session.userId);

  if (!user) {
    redirect('/login');
  }

  // Fetch student's enrolled courses
  const enrolledCourses = await Course.find({
    students: session.userId,
  });

  const courseIds = enrolledCourses.map((c) => c._id);

  // Fetch assignments and quizzes for enrolled courses
  const [assignments, quizzes] = await Promise.all([
    Assignment.find({ course: { $in: courseIds } }).countDocuments(),
    Quiz.find({ course: { $in: courseIds } }).countDocuments(),
  ]);

  return (
    <DashboardLayout role="student" userName={user.name}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-blue text-white rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-blue-100">Ready to continue your learning journey?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Enrolled Courses"
            value={enrolledCourses.length}
            icon={BookOpen}
            color="blue"
          />
          <StatsCard
            title="Assignments"
            value={assignments}
            icon={FileText}
            color="green"
          />
          <StatsCard
            title="Quizzes"
            value={quizzes}
            icon={ClipboardList}
            color="purple"
          />
          <StatsCard
            title="Average Grade"
            value="85%"
            icon={Award}
            color="orange"
          />
        </div>

        {/* My Courses */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">My Courses</h2>
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
              <button className="btn-primary">Browse Courses</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrolledCourses.map((course) => (
                <div
                  key={course._id.toString()}
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
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Assignment {i}</p>
                  <p className="text-sm text-gray-600">Course Title {i}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-orange-600">Due in 2 days</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}