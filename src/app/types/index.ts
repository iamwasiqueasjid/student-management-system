export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  code: string;
  teacher?: string;
  teacherName?: string;
  students: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: string;
  courseName?: string;
  teacher: string;
  dueDate: Date;
  totalMarks: number;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: string;
  courseName?: string;
  teacher: string;
  questions: QuizQuestion[];
  duration: number;
  totalMarks: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

export interface Enrollment {
  _id: string;
  student: string;
  course: string;
  enrolledAt: Date;
}

export interface AssignmentSubmission {
  _id: string;
  assignment: string;
  student: string;
  content: string;
  attachments?: string[];
  grade?: number;
  feedback?: string;
  submittedAt: Date;
}

export interface QuizAttempt {
  _id: string;
  quiz: string;
  student: string;
  answers: number[];
  score: number;
  completedAt: Date;
}

export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalTeachers: number;
  pendingApprovals: number;
}