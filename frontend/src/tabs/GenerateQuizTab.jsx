import React, { useState } from 'react';
import QuizDisplay from '../components/QuizDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateQuiz } from '../services/api';

const GenerateQuizTab = () => {
  const [url, setUrl] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [takeQuizMode, setTakeQuizMode] = useState(false);

  const validateUrl = (url) => {
    const pattern = /^https?:\/\/(en|[a-z]{2,3})\.wikipedia\.org\/wiki\/.+/;
    return pattern.test(url);
  };

  const handleGenerate = async () => {
    setError('');
    setQuizData(null);

    if (!url.trim()) {
      setError('Please enter a Wikipedia URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid Wikipedia article URL (e.g., https://en.wikipedia.org/wiki/...)');
      return;
    }

    setLoading(true);

    try {
      const data = await generateQuiz(url);
      setQuizData(data);
      setTakeQuizMode(false);
    } catch (err) {
      setError(err.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Input Section */}
      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate Quiz from Wikipedia</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="wiki-url" className="block text-sm font-medium text-gray-700 mb-2">
              Wikipedia Article URL
            </label>
            <input
              id="wiki-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://en.wikipedia.org/wiki/Artificial_intelligence"
              className="input-field"
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter any Wikipedia article URL to generate an AI-powered quiz
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !url.trim()}
            className="btn-primary w-full md:w-auto"
          >
            {loading ? 'Generating Quiz...' : 'Generate Quiz'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card">
          <LoadingSpinner message="Scraping Wikipedia and generating quiz..." />
        </div>
      )}

      {/* Quiz Display */}
      {quizData && !loading && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setTakeQuizMode(!takeQuizMode)}
              className="btn-secondary"
            >
              {takeQuizMode ? '📖 View Answers' : '✏️ Take Quiz Mode'}
            </button>
          </div>
          <QuizDisplay quizData={quizData} takeQuizMode={takeQuizMode} />
        </div>
      )}

      {/* Example URLs */}
      {!quizData && !loading && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Try these examples:</h3>
          <div className="space-y-2">
            {[
              'https://en.wikipedia.org/wiki/Alan_Turing',
              'https://en.wikipedia.org/wiki/Machine_learning',
              'https://en.wikipedia.org/wiki/World_War_II',
              'https://en.wikipedia.org/wiki/Climate_change'
            ].map((exampleUrl, idx) => (
              <button
                key={idx}
                onClick={() => setUrl(exampleUrl)}
                className="block w-full text-left px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition"
              >
                {exampleUrl}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateQuizTab;

