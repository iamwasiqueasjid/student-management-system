import Link from 'next/link';
import { BookOpen, Users, GraduationCap, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                EduManage
              </span>
            </div>
            <div className="flex gap-4">
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Student Management
            <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mt-2">
              Made Simple
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            A comprehensive platform for educational institutions to manage courses, 
            students, teachers, and assessments all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4">
              Get Started
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-4">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-10 h-10" />}
              title="Course Management"
              description="Create, organize, and manage courses with ease. Assign teachers and track enrollments."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="Student Portal"
              description="Students can enroll in courses, submit assignments, and take quizzes seamlessly."
            />
            <FeatureCard
              icon={<GraduationCap className="w-10 h-10" />}
              title="Teacher Tools"
              description="Upload assignments, create quizzes, and monitor student progress effectively."
            />
            <FeatureCard
              icon={<Award className="w-10 h-10" />}
              title="Admin Control"
              description="Complete oversight with analytics, approvals, and system-wide management."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Institution?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of educators and students using our platform
          </p>
          <Link href="/signup" className="bg-white text-primary-700 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 inline-block">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-6 h-6" />
            <span className="text-lg font-semibold">EduManage</span>
          </div>
          <p className="text-gray-400">
            © 2025 Student Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card text-center hover:border-2 hover:border-primary-200">
      <div className="text-primary-600 mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}