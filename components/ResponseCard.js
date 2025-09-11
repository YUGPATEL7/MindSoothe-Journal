import { Brain, Lightbulb, Heart, CheckCircle } from 'lucide-react';

export default function ResponseCard({ response }) {
  const { mood, reflection, suggestions } = response;

  const getMoodColor = (mood) => {
    const colors = {
      'Happy': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Calm': 'bg-green-100 text-green-800 border-green-200',
      'Anxious': 'bg-red-100 text-red-800 border-red-200',
      'Reflective': 'bg-purple-100 text-purple-800 border-purple-200',
      'Stressed': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[mood] || 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Brain className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Reflection</h2>
        <p className="text-gray-600">Here's what I noticed about your entry</p>
      </div>

      {/* Mood */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-gray-600" />
          <span className="text-lg font-medium text-gray-700">Detected Mood</span>
        </div>
        <span className={`inline-flex px-6 py-3 rounded-full text-lg font-semibold border-2 ${getMoodColor(mood)}`}>
          {mood}
        </span>
      </div>

      {/* Reflection */}
      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
            <Heart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Thoughtful Reflection</h3>
            <p className="text-gray-700 leading-relaxed">{reflection}</p>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-green-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-full">
            <Lightbulb className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Gentle Suggestions</h3>
        </div>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Remember, these are gentle suggestions. Trust yourself and do what feels right for you. 💚
        </p>
      </div>
    </div>
  );
}