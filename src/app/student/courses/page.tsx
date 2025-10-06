'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { BookOpen, Users, UserCheck } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  description: string;
  code: string;
  teacher?: {
    name: string;
    email: string;
  };
  students: string[];
}

export default function StudentCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available'>('enrolled');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const [enrolledRes, availableRes] = await Promise.all([
        fetch('/api/student/courses?enrolled=true'),
        fetch('/api/student/courses?enrolled=false'),
      ]);

      const enrolledData = await enrolledRes.json();
      const availableData = await availableRes.json();

      setEnrolledCourses(enrolledData.courses || []);
      setAvailableCourses(availableData.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const response = await fetch('/api/student/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        // Refresh courses
        fetchCourses();
      }
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  const courses = activeTab === 'enrolled' ? enrolledCourses : availableCourses;

  return (
    <DashboardLayout role="student" userName="Student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'enrolled'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Courses ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'available'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Available Courses ({availableCourses.length})
          </button>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'enrolled' ? 'No Enrolled Courses' : 'No Available Courses'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'enrolled'
                ? 'You haven\'t enrolled in any courses yet. Browse available courses to get started.'
                : 'All courses are already enrolled or there are no courses available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="card hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-blue rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {course.code}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="space-y-2 mb-4">
                  {course.teacher && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserCheck className="w-4 h-4" />
                      <span>{course.teacher.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{course.students.length} students enrolled</span>
                  </div>
                </div>

                {activeTab === 'available' && (
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="w-full btn-primary"
                  >
                    Enroll Now
                  </button>
                )}

                {activeTab === 'enrolled' && (
                  <button className="w-full btn-secondary">
                    View Course
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}