import React from 'react';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw, Trophy, Target } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';

export const QuizDisplay: React.FC = () => {
  const {
    questions,
    userAnswers,
    currentQuestionIndex,
    showResults,
    score,
    quizCompleted,
    currentTopic,
    questions: { length: totalQuestions },
    setUserAnswer,
    setShowResults,
    calculateScore,
    resetQuiz,
    nextQuestion,
    prevQuestion
  } = useQuizStore();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerSelect = (answer: string) => {
    setUserAnswer(currentQuestionIndex, answer);
  };

  const handleShowResults = () => {
    calculateScore();
    setShowResults(true);
  };

  const getScoreColor = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return 'Perfect! Outstanding work! 🎉';
    if (percentage >= 80) return 'Excellent! Great job! 👏';
    if (percentage >= 60) return 'Good effort! Keep learning! 📚';
    return 'Keep trying! Practice makes perfect! 💪';
  };

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Quiz: {currentTopic}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
            {quizCompleted && (
              <div className={`text-sm font-semibold px-3 py-1 rounded-full ${getScoreColor()} bg-opacity-10`}>
                Score: {score}/{totalQuestions}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = userAnswers[currentQuestionIndex] === option;
            const isCorrect = option === currentQuestion.answer;
            const isIncorrect = showResults && isSelected && !isCorrect;
            
            return (
              <button
                key={index}
                onClick={() => !showResults && handleAnswerSelect(option)}
                disabled={showResults}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  showResults
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : isIncorrect
                      ? 'border-red-500 bg-red-50 text-red-800'
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                    : isSelected
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      showResults
                        ? isCorrect
                          ? 'bg-green-500 text-white'
                          : isIncorrect
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                        : isSelected
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {optionLabel}
                    </span>
                    <span className="font-medium">{option}</span>
                  </div>
                  {showResults && (
                    <div>
                      {isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {isIncorrect && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {showResults && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
            <p className="text-blue-700">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevQuestion}
          disabled={isFirstQuestion}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>
        
        <div className="flex space-x-3">
          {!showResults && userAnswers[currentQuestionIndex] && (
            <button
              onClick={handleShowResults}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Show Answers
            </button>
          )}
          
          <button
            onClick={resetQuiz}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Start Over</span>
          </button>
        </div>
        
        <button
          onClick={nextQuestion}
          disabled={isLastQuestion}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span>Next</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Results Summary */}
      {showResults && quizCompleted && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
          <div className="text-center space-y-4">
            <Trophy className={`h-16 w-16 mx-auto ${getScoreColor()}`} />
            <h3 className="text-2xl font-bold text-gray-800">Quiz Complete!</h3>
            <p className="text-lg text-gray-600">{getScoreMessage()}</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Correct: {score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span>Incorrect: {totalQuestions - score}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};