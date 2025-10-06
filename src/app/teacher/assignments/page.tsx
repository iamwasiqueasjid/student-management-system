'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FileText, Plus, Calendar, BookOpen, X } from 'lucide-react';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  course: {
    title: string;
    code: string;
  };
}

interface Course {
  _id: string;
  title: string;
  code: string;
}

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    totalMarks: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, coursesRes] = await Promise.all([
        fetch('/api/teacher/assignments'),
        fetch('/api/teacher/courses'),
      ]);

      const assignmentsData = await assignmentsRes.json();
      const coursesData = await coursesRes.json();

      setAssignments(assignmentsData.assignments || []);
      setCourses(coursesData.courses || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/teacher/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ title: '', description: '', course: '', dueDate: '', totalMarks: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  return (
    <DashboardLayout role="teacher" userName="Teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Assignment
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="card text-center py-12 border border-gray-200">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assignments Yet</h3>
            <p className="text-gray-600 mb-4">Create your first assignment to get started.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Create First Assignment
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="card hover:shadow-xl transition-shadow border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{assignment.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                          <BookOpen className="w-4 h-4" />
                          <span>{assignment.course.code}</span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600 font-medium">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                          {assignment.totalMarks} marks
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm">
                    View Submissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Assignment</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Week 1 Assignment"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course
                </label>
                <select
                  required
                  className="input-field"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  className="input-field"
                  placeholder="Assignment instructions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="input-field"
                    placeholder="100"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}