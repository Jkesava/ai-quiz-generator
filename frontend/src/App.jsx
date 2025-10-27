import React, { useState } from 'react';
import GenerateQuizTab from './tabs/GenerateQuizTab';
import HistoryTab from './tabs/HistoryTab';

function App() {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🧠 AI Wiki Quiz Generator
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Transform Wikipedia articles into interactive quizzes with AI
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Powered by Gemini AI
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4">
            <button
              onClick={() => setActiveTab('generate')}
              className={`tab-button ${
                activeTab === 'generate' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              ✨ Generate Quiz
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`tab-button ${
                activeTab === 'history' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              📜 Past Quizzes
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generate' && <GenerateQuizTab />}
        {activeTab === 'history' && <HistoryTab />}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          <p>AI Wiki Quiz Generator | DeepKlarity Technologies Assignment</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

