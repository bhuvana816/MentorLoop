import { create } from 'zustand';
import { QuizQuestion } from '../utils/generateQuiz';

interface QuizState {
  currentTopic: string;
  questions: QuizQuestion[];
  userAnswers: string[];
  currentQuestionIndex: number;
  showResults: boolean;
  isLoading: boolean;
  error: string | null;
  score: number;
  quizCompleted: boolean;
  
  // Actions
  setTopic: (topic: string) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  setUserAnswer: (questionIndex: number, answer: string) => void;
  setShowResults: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  calculateScore: () => void;
  resetQuiz: () => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentTopic: '',
  questions: [],
  userAnswers: [],
  currentQuestionIndex: 0,
  showResults: false,
  isLoading: false,
  error: null,
  score: 0,
  quizCompleted: false,

  setTopic: (topic: string) => set({ currentTopic: topic }),
  
  setQuestions: (questions: QuizQuestion[]) => set({
    questions,
    userAnswers: new Array(questions.length).fill(''),
    currentQuestionIndex: 0,
    showResults: false,
    quizCompleted: false,
    score: 0
  }),
  
  setUserAnswer: (questionIndex: number, answer: string) => {
    const { userAnswers } = get();
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    set({ userAnswers: newAnswers });
  },
  
  setShowResults: (show: boolean) => set({ showResults: show }),
  
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string | null) => set({ error }),
  
  calculateScore: () => {
    const { questions, userAnswers } = get();
    const score = questions.reduce((acc, question, index) => {
      return acc + (userAnswers[index] === question.answer ? 1 : 0);
    }, 0);
    set({ score, quizCompleted: true });
  },
  
  resetQuiz: () => set({
    currentTopic: '',
    questions: [],
    userAnswers: [],
    currentQuestionIndex: 0,
    showResults: false,
    isLoading: false,
    error: null,
    score: 0,
    quizCompleted: false
  }),
  
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },
  
  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },
}));