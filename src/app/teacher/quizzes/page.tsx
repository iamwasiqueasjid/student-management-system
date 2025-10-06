import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Quiz from '@/models/Quiz';
import { ClipboardList, Plus, Calendar, BookOpen, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function TeacherQuizzes() {
  const session = await getSession();

  if (!session || session.role !== 'teacher') {
    redirect('/login');
  }

  await connectDB();

  const user = await User.findById(session.userId);

  if (!user || !user.approved) {
    redirect('/login');
  }

  const quizzes = await Quiz.find({ teacher: session.userId })
    .populate('course', 'title code')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <DashboardLayout role="teacher" userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Quiz
          </button>
        </div>

        {quizzes.length === 0 ? (
          <div className="card text-center py-12 border border-gray-200">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quizzes Yet</h3>
            <p className="text-gray-600 mb-4">Create your first quiz to assess student knowledge.</p>
            <button className="btn-primary">
              Create First Quiz
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <div key={quiz.id.toString()} className="card hover:shadow-xl transition-shadow border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
                      <ClipboardList className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{quiz.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>
                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                          <BookOpen className="w-4 h-4" />
                          <span>{quiz.course?.code}</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-600 font-medium">
                          <Clock className="w-4 h-4" />
                          <span>{quiz.duration} minutes</span>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                          {quiz.questions.length} questions
                        </div>
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          {quiz.totalMarks} marks
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Available: {new Date(quiz.startDate).toLocaleDateString()} - {new Date(quiz.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm">
                    View Results
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