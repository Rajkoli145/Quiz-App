import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  subtopic?: string;
}

export interface QuizState {
  currentCategory: string | null;
  currentSubtopic: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: { [questionId: string]: number };
  timeLeft: number;
  isQuizActive: boolean;
  isQuizCompleted: boolean;
  score: number;
  showResults: boolean;
  quizStartTime: number | null;
  sessionId: string | null;
  submissionStatus: 'idle' | 'submitting' | 'success' | 'error';
}

const initialState: QuizState = {
  currentCategory: null,
  currentSubtopic: null,
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswers: {},
  timeLeft: 0,
  isQuizActive: false,
  isQuizCompleted: false,
  score: 0,
  showResults: false,
  quizStartTime: null,
  sessionId: null,
  submissionStatus: 'idle',
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.currentCategory = action.payload;
      state.currentSubtopic = null;
    },
    setSubtopic: (state, action: PayloadAction<string>) => {
      state.currentSubtopic = action.payload;
    },
    startQuiz: (state, action: PayloadAction<{ questions: Question[]; duration: number; sessionId?: string }>) => {
      state.questions = action.payload.questions;
      state.currentQuestionIndex = 0;
      state.selectedAnswers = {};
      state.timeLeft = action.payload.duration;
      state.isQuizActive = true;
      state.isQuizCompleted = false;
      state.showResults = false;
      state.quizStartTime = Date.now();
      state.sessionId = action.payload.sessionId || null;
      state.submissionStatus = 'idle';
    },
    selectAnswer: (state, action: PayloadAction<{ questionId: string; answer: number }>) => {
      state.selectedAnswers[action.payload.questionId] = action.payload.answer;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    decrementTime: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    },
    submitQuiz: (state) => {
      state.isQuizActive = false;
      state.isQuizCompleted = true;
      
      // Calculate score
      let correctAnswers = 0;
      state.questions.forEach((question) => {
        if (state.selectedAnswers[question.id] === question.correctAnswer) {
          correctAnswers += 1;
        }
      });
      
      state.score = Math.round((correctAnswers / state.questions.length) * 100);
      state.showResults = true;
    },
    setSubmissionStatus: (state, action: PayloadAction<'idle' | 'submitting' | 'success' | 'error'>) => {
      state.submissionStatus = action.payload;
    },
    resetQuiz: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  setCategory,
  setSubtopic,
  startQuiz,
  selectAnswer,
  nextQuestion,
  previousQuestion,
  decrementTime,
  submitQuiz,
  setSubmissionStatus,
  resetQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;