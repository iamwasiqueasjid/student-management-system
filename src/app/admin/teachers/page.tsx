import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { Mail, CheckCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function AdminTeachers() {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  await connectDB();

  const teachers: any[] = await User.find({ role: 'teacher', approved: true })
    .select('-password')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-4 px-6 text-left">Name</th>
                  <th className="py-4 px-6 text-left">Email</th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher: any) => (
                  <tr key={teacher._id.toString()} className="border-b border-gray-200">
                    <td className="py-4 px-6">{teacher.name}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {teacher.email}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(teacher.createdAt).toLocaleDateString()}
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