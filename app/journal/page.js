'use client';
import { useState } from 'react';
import ResponseCard from '@/components/ResponseCard';
import { Send, PenTool } from 'lucide-react';

export default function Journal() {
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entry.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: entry }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Check for urgent/crisis content
      if (data.severity === 'urgent') {
        setError({
          type: 'urgent',
          message: data.message
        });
      } else if (data.severity === 'moderate') {
        setError({
          type: 'moderate',
          message: data.message
        });
      } else {
        setResponse(data);
      }
    } catch (err) {
      console.error('Error submitting journal entry:', err);
      setError({
        type: 'error',
        message: err.message || 'Failed to process your journal entry. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white rounded-full shadow-lg">
              <PenTool className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Your Journal Space
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share what's on your mind. Take your time, and write as much or as little as you'd like.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="journal-entry" className="block text-lg font-medium text-gray-900 mb-3">
                How are you feeling today?
              </label>
              <textarea
                id="journal-entry"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Start writing about your thoughts, feelings, or experiences today..."
                rows={12}
                className="w-full px-6 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200 text-lg leading-relaxed"
              />
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!entry.trim() || isLoading}
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:shadow-md"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Thinking… please wait
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Reflect & Analyze
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="animate-fade-in">
            <div className={`rounded-2xl shadow-xl p-8 mb-8 ${
              error.type === 'urgent' 
                ? 'bg-red-50 border-2 border-red-200' 
                : error.type === 'moderate'
                ? 'bg-yellow-50 border-2 border-yellow-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    error.type === 'urgent' 
                      ? 'bg-red-100' 
                      : error.type === 'moderate'
                      ? 'bg-yellow-100'
                      : 'bg-red-100'
                  }`}>
                    <PenTool className={`w-8 h-8 ${
                      error.type === 'urgent' 
                        ? 'text-red-600' 
                        : error.type === 'moderate'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`} />
                  </div>
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${
                  error.type === 'urgent' 
                    ? 'text-red-900' 
                    : error.type === 'moderate'
                    ? 'text-yellow-900'
                    : 'text-red-900'
                }`}>
                  {error.type === 'urgent' ? 'Important Notice' : 'Notice'}
                </h2>
                <p className={`text-lg leading-relaxed ${
                  error.type === 'urgent' 
                    ? 'text-red-800' 
                    : error.type === 'moderate'
                    ? 'text-yellow-800'
                    : 'text-red-800'
                }`}>
                  {error.message}
                </p>
                {error.type === 'urgent' && (
                  <div className="mt-6 p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Crisis Resources:</p>
                    <p className="text-sm text-gray-800">
                      <strong>US:</strong> 988 (Suicide & Crisis Lifeline)<br />
                      <strong>UK:</strong> 116 123 (Samaritans)<br />
                      <strong>Emergency:</strong> Call your local emergency number
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {response && (
          <div className="animate-fade-in">
            <ResponseCard response={response} />
          </div>
        )}
      </div>
    </div>
  );
}