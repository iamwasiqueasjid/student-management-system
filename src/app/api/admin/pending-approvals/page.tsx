'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

interface Teacher {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function PendingApprovals() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingTeachers();
  }, []);

  const fetchPendingTeachers = async () => {
    try {
      const response = await fetch('/api/admin/approve-teacher');
      const data = await response.json();
      setTeachers(data.teachers || []);
    } catch (error) {
      console.error('Error fetching pending teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (teacherId: string, approve: boolean) => {
    try {
      const response = await fetch('/api/admin/approve-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId, approve }),
      });

      if (response.ok) {
        setTeachers(teachers.filter((t) => t._id !== teacherId));
      }
    } catch (error) {
      console.error('Error handling approval:', error);
    }
  };

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Pending Teacher Approvals</h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">{teachers.length} Pending</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pending approvals...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="card text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending teacher approvals at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {teachers.map((teacher) => (
              <div key={teacher._id} className="card hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {teacher.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{teacher.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{teacher.email}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied {new Date(teacher.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproval(teacher._id, true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleApproval(teacher._id, false)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}