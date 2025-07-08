import React from 'react';
import { TopicInput } from './components/TopicInput';
import  {QuizDisplay} from './components/QuizDisplay';

import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useQuizStore } from './store/quizStore';

function QuizPage() {
  const { questions, isLoading, error, resetQuiz } = useQuizStore();

  const handleRetry = () => {
    resetQuiz();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {error ? (
          <ErrorMessage error={error} onRetry={handleRetry} />
        ) : isLoading ? (
          <LoadingSpinner />
        ) : questions.length > 0 ? (
          <QuizDisplay />
        ) : (
          <TopicInput />
        )}
      </div>
    </div>
  );
}

export default QuizPage;