import React, { useState } from 'react';

const QuizDisplay = ({ quizData, takeQuizMode = false }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (!quizData) {
    return <div className="text-center text-gray-500">No quiz data available</div>;
  }

  const { title, summary, key_entities, sections, quiz, related_topics } = quizData;

  const handleAnswerSelect = (questionIndex, answer) => {
    if (takeQuizMode && !showResults) {
      setUserAnswers(prev => ({
        ...prev,
        [questionIndex]: answer
      }));
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        correct++;
      }
    });
    return { correct, total: quiz.length, percentage: ((correct / quiz.length) * 100).toFixed(1) };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </div>

      {/* Key Entities */}
      {key_entities && (Object.keys(key_entities).some(key => key_entities[key]?.length > 0)) && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Entities</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {key_entities.people?.length > 0 && (
              <div>
                <h3 className="font-medium text-primary-600 mb-2">People</h3>
                <ul className="space-y-1">
                  {key_entities.people.map((person, idx) => (
                    <li key={idx} className="text-gray-700">• {person}</li>
                  ))}
                </ul>
              </div>
            )}
            {key_entities.organizations?.length > 0 && (
              <div>
                <h3 className="font-medium text-primary-600 mb-2">Organizations</h3>
                <ul className="space-y-1">
                  {key_entities.organizations.map((org, idx) => (
                    <li key={idx} className="text-gray-700">• {org}</li>
                  ))}
                </ul>
              </div>
            )}
            {key_entities.locations?.length > 0 && (
              <div>
                <h3 className="font-medium text-primary-600 mb-2">Locations</h3>
                <ul className="space-y-1">
                  {key_entities.locations.map((loc, idx) => (
                    <li key={idx} className="text-gray-700">• {loc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sections */}
      {sections?.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Article Sections</h2>
          <div className="flex flex-wrap gap-2">
            {sections.map((section, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {section}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Questions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Quiz Questions</h2>
          {takeQuizMode && !showResults && (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length !== quiz.length}
              className="btn-primary"
            >
              Submit Quiz
            </button>
          )}
          {showResults && (
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                Score: {calculateScore().correct}/{calculateScore().total}
              </div>
              <div className="text-sm text-gray-600">{calculateScore().percentage}%</div>
            </div>
          )}
        </div>

        {quiz.map((question, qIndex) => {
          const isAnswered = userAnswers[qIndex] !== undefined;
          const isCorrect = userAnswers[qIndex] === question.answer;
          
          return (
            <div key={qIndex} className="card">
              {/* Question Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {qIndex + 1}. {question.question}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </span>
              </div>

              {/* Options */}
              <div className="space-y-2 mb-4">
                {question.options.map((option, oIndex) => {
                  const isSelected = userAnswers[qIndex] === option;
                  const isCorrectAnswer = option === question.answer;
                  
                  let optionClass = "p-3 border-2 rounded-lg cursor-pointer transition ";
                  
                  if (takeQuizMode && !showResults) {
                    optionClass += isSelected
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-300 hover:bg-gray-50";
                  } else if (takeQuizMode && showResults) {
                    if (isCorrectAnswer) {
                      optionClass += "border-green-500 bg-green-50";
                    } else if (isSelected && !isCorrect) {
                      optionClass += "border-red-500 bg-red-50";
                    } else {
                      optionClass += "border-gray-200 bg-gray-50";
                    }
                  } else {
                    optionClass += isCorrectAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-gray-50";
                  }

                  return (
                    <div
                      key={oIndex}
                      onClick={() => handleAnswerSelect(qIndex, option)}
                      className={optionClass}
                    >
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{String.fromCharCode(65 + oIndex)}.</span>
                        <span>{option}</span>
                        {!takeQuizMode && option === question.answer && (
                          <span className="ml-auto text-green-600 font-semibold">✓ Correct</span>
                        )}
                        {takeQuizMode && showResults && isCorrectAnswer && (
                          <span className="ml-auto text-green-600 font-semibold">✓</span>
                        )}
                        {takeQuizMode && showResults && isSelected && !isCorrect && (
                          <span className="ml-auto text-red-600 font-semibold">✗</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation (show only if not in take quiz mode, or if results are shown) */}
              {(!takeQuizMode || showResults) && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-700">Explanation:</span> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Related Topics */}
      {related_topics?.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Related Topics for Further Reading</h2>
          <div className="flex flex-wrap gap-2">
            {related_topics.map((topic, idx) => (
              <a
                key={idx}
                href={`https://en.wikipedia.org/wiki/${topic.replace(/ /g, '_')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition text-sm font-medium"
              >
                {topic} →
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDisplay;

