import Link from 'next/link';
import { Heart, Brain, BookOpen, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-100 via-blue-50 to-purple-100 py-20 lg:py-32">
        <div className="absolute inset-0 bg-white/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white/80 rounded-full shadow-lg backdrop-blur-sm">
                <Brain className="w-12 h-12 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              MindSoothe
              <span className="block text-green-600">Journal</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed">
              An AI-powered journaling companion that reflects on your mood and provides supportive suggestions.
            </p>
            
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Not a replacement for therapy.
            </p>
            
            <Link href="/journal">
              <button className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <BookOpen className="w-5 h-5" />
                Start Journaling
                <Sparkles className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Your Personal Wellness Companion
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience thoughtful reflection and gentle guidance on your mental wellness journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Mood Analysis</h3>
              <p className="text-gray-600">
                Get insights into your emotional patterns with gentle, empathetic AI analysis.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Supportive Suggestions</h3>
              <p className="text-gray-600">
                Receive personalized, caring suggestions to support your mental wellness.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your emotional journey and celebrate your growth over time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}