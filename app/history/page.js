'use client';
import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function History() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/journal');
        if (!response.ok) {
          throw new Error('Failed to fetch journal entries');
        }
        const data = await response.json();
        
        // Add mood scores for chart visualization
        const entriesWithScores = data.map(entry => ({
          ...entry,
          moodScore: getMoodScore(entry.mood),
          date: entry.createdAt.split('T')[0] // Extract date part
        }));
        
        setEntries(entriesWithScores);
      } catch (err) {
        console.error('Error fetching entries:', err);
        setError('Failed to load journal history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const getMoodScore = (mood) => {
    const moodScores = {
      'Happy': 9,
      'Calm': 8,
      'Hopeful': 8,
      'Reflective': 7,
      'Neutral': 6,
      'Sad': 4,
      'Anxious': 4,
      'Stressed': 3,
      'Angry': 2
    };
    return moodScores[mood] || 5;
  };

  // Chart data
  const chartData = [...entries].reverse().map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: entry.moodScore,
    fullDate: entry.date
  }));

  const getMoodColor = (mood) => {
    const colors = {
      'Happy': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Calm': 'bg-green-100 text-green-800 border-green-200',
      'Anxious': 'bg-red-100 text-red-800 border-red-200',
      'Reflective': 'bg-purple-100 text-purple-800 border-purple-200',
      'Stressed': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[mood] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-green-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your journal history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
              <Calendar className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load History</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white rounded-full shadow-lg">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Your Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reflect on your emotional patterns and celebrate your progress over time.
          </p>
        </div>

        {/* Mood Trend Chart */}
        {entries.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Mood Trend</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    domain={[1, 10]}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value) => [`${value}/10`, 'Mood Score']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Journal Entries */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Entries</h2>
          </div>
          
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Journal Entries Yet</h3>
              <p className="text-gray-500">Start journaling to see your history and mood trends here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {[...entries].reverse().map((entry) => (
                <div key={entry.id} className="border-l-4 border-green-200 pl-6 py-4 hover:bg-gray-50 transition-colors duration-200 rounded-r-lg">
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getMoodColor(entry.mood)}`}>
                      {entry.mood}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{entry.reflection}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}