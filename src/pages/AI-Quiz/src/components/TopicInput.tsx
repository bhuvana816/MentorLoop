import React, { useState } from 'react';
import { Brain, Sparkles, Search } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';
import { generateQuiz } from '../utils/generateQuiz';

const POPULAR_TOPICS = [
  'Networking','Technolgy','programming languages(python , java)','DBMS','OOPS'
];

export const TopicInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { setTopic, setQuestions, setIsLoading, setError } = useQuizStore();

  const handleSubmit = async (topic: string) => {
    if (!topic.trim()) return;
    
    setTopic(topic);
    setIsLoading(true);
    setError(null);
    
    const result = await generateQuiz(topic);
    
    if (result.error) {
      setError(result.error);
    } else {
      setQuestions(result.questions);
    }
    
    setIsLoading(false);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(inputValue);
  };

  const handleTopicClick = (topic: string) => {
    setInputValue(topic);
    setShowSuggestions(false);
    handleSubmit(topic);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Brain className="h-12 w-12 text-indigo-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Quiz Builder
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Practice, test your knowledge, and learn new tech concepts through AI-generated quizzes tailored to your interests.
        </p>
      </div>

      <form onSubmit={handleInputSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="What tech trend are you curious about today? "
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all duration-200 bg-white shadow-lg"
          />
        </div>
        
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-60 overflow-y-auto">
            <div className="p-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
                Popular Topics
              </p>
            </div>
            <div className="p-2">
              {POPULAR_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicClick(topic)}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-150"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
        >
          Generate Quiz ✨
        </button>
      </form>
    </div>
  );
};
