const API_BASE_URL = 'http://localhost:8000';

export const generateQuiz = async (url) => {
  const response = await fetch(`${API_BASE_URL}/generate_quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to generate quiz');
  }

  return response.json();
};

export const getQuizHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/history`);

  if (!response.ok) {
    throw new Error('Failed to fetch quiz history');
  }

  return response.json();
};

export const getQuizDetail = async (quizId) => {
  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch quiz details');
  }

  return response.json();
};
