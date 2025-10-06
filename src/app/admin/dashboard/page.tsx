import { BookOpen, Users, GraduationCap, Clock } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  await connectDB();

  // Fetch stats
  const [totalCourses, totalStudents, totalTeachers, pendingApprovals] = await Promise.all([
    Course.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'teacher', approved: true }),
    User.countDocuments({ role: 'teacher', approved: false }),
  ]);

  const userName = typeof session.email === 'string' ? session.email.split('@')[0] : 'Admin';

  return (
    <DashboardLayout role="admin" userName={userName}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-blue text-white rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
          <p className="text-blue-100">Here's what's happening in your institution today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Courses"
            value={totalCourses}
            icon={BookOpen}
            color="blue"
            trend="+12%"
          />
          <StatsCard
            title="Total Students"
            value={totalStudents}
            icon={Users}
            color="green"
            trend="+8%"
          />
          <StatsCard
            title="Active Teachers"
            value={totalTeachers}
            icon={GraduationCap}
            color="purple"
            trend="+5%"
          />
          <StatsCard
            title="Pending Approvals"
            value={pendingApprovals}
            icon={Clock}
            color="orange"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Courses */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Recent Courses</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Course Title {i}</p>
                    <p className="text-sm text-gray-500">15 students enrolled</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full btn-primary text-left flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                <span>Create New Course</span>
              </button>
              <button className="w-full btn-secondary text-left flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span>View All Students</span>
              </button>
              <button className="w-full btn-secondary text-left flex items-center gap-3">
                <Clock className="w-5 h-5" />
                <span>Review Approvals</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}