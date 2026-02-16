import { createContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const DataContext = createContext({});

export const DataProvider = ({children}) => {
      // All Quizs, Current Question, Index of Current Question, Answer, Selected Answer, Total Marks
  const [quizs, setQuizs] = useState([]);
  const [question, setQuesion] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [marks, setMarks] = useState(0);

  // Student Info & Supabase Session
  const [studentName, setStudentName] = useState('');
  const [studentSurname, setStudentSurname] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [allAnswers, setAllAnswers] = useState([]); // Массив всех ответов для сохранения

  // Display Controlling States
  const [showStart, setShowStart] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Load JSON Data
  useEffect(() => {
    fetch('quiz.json')
      .then(res => res.json())
      .then(data => setQuizs(data))
  }, []);

  // Проверка завершенной сессии при загрузке
  useEffect(() => {
    const completedSessionId = localStorage.getItem('quiz_completed_session');
    if (completedSessionId) {
      // Проверяем в Supabase, действительно ли сессия завершена
      checkSessionStatus(completedSessionId);
    }
  }, []);

  // Проверка статуса сессии
  const checkSessionStatus = async (sessionIdToCheck) => {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('id, first_name, last_name, correct_answers, total_questions, completed_at')
      .eq('id', sessionIdToCheck)
      .single();

    if (data && data.completed_at) {
      // Сессия завершена, показываем результат
      setSessionId(data.id);
      setStudentName(data.first_name);
      setStudentSurname(data.last_name);
      setMarks(data.correct_answers);
      setIsCompleted(true);
      setShowStart(false);
      setShowQuiz(false);
      setShowResult(true);
    } else {
      // Сессия не найдена или не завершена, очищаем localStorage
      localStorage.removeItem('quiz_completed_session');
    }
  };

  // Set a Single Question
  useEffect(() => {
    if (quizs.length > questionIndex) {
      setQuesion(quizs[questionIndex]);
    }
  }, [quizs, questionIndex])

  // Set Student Info and Create Supabase Session
  const setStudentInfo = async (firstName, lastName) => {
    // Проверяем, нет ли уже завершенной сессии
    const completedSessionId = localStorage.getItem('quiz_completed_session');
    if (completedSessionId) {
      await checkSessionStatus(completedSessionId);
      return false;
    }

    setStudentName(firstName);
    setStudentSurname(lastName);
    
    // Создаем сессию в Supabase
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          correct_answers: 0,
          total_questions: quizs.length,
          percentage: 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Ошибка создания сессии:', error);
      return false;
    }

    if (data) {
      setSessionId(data.id);
      setAllAnswers([]); // Сбрасываем массив ответов
      return true;
    }
    return false;
  };

  // Start Quiz
  const startQuiz = () => {
    // Проверяем, не завершен ли уже тест
    if (isCompleted) {
      console.warn('Тест уже завершен');
      return;
    }
    setShowStart(false);
    setShowQuiz(true);
  };

  // Check Answer
  const checkAnswer = (event, selected) => {
    // Разрешаем изменять ответ
    setCorrectAnswer(question.answer);
    setSelectedAnswer(selected);
  }

  // Next Quesion
  const nextQuestion = async () => {
    // Сохраняем ответ перед переходом
    if (sessionId && selectedAnswer) {
      const isCorrect = selectedAnswer === correctAnswer;
      const newMarks = isCorrect ? marks + 1 : marks; // Теперь +1 за правильный ответ (из 10)

      if (isCorrect) {
        setMarks(newMarks);
      }

      // Добавляем ответ в массив
      const answerData = {
        question_id: question.id,
        question_text: question.question,
        selected_answer: selectedAnswer,
        correct_answer: correctAnswer,
        is_correct: isCorrect
      };

      const updatedAnswers = [...allAnswers, answerData];
      setAllAnswers(updatedAnswers);

      // Сохраняем в таблицу quiz_answers для аналитики
      const { error } = await supabase
        .from('quiz_answers')
        .insert([
          {
            session_id: sessionId,
            question_id: question.id,
            question_text: question.question,
            selected_answer: selectedAnswer,
            correct_answer: correctAnswer,
            is_correct: isCorrect
          }
        ]);

      if (error) {
        console.error('Ошибка сохранения ответа:', error);
      }
    }

    setCorrectAnswer('');
    setSelectedAnswer('');
    setQuestionIndex(questionIndex + 1);
  }

  // Show Result
  const showTheResult = async () => {
    let finalAnswers = [...allAnswers];
    let finalMarks = marks;

    // Сохраняем последний ответ перед показом результата
    if (sessionId && selectedAnswer) {
      const isCorrect = selectedAnswer === correctAnswer;
      finalMarks = isCorrect ? marks + 1 : marks; // +1 за правильный (из 10)

      if (isCorrect) {
        setMarks(finalMarks);
      }

      // Добавляем последний ответ в массив
      const lastAnswerData = {
        question_id: question.id,
        question_text: question.question,
        selected_answer: selectedAnswer,
        correct_answer: correctAnswer,
        is_correct: isCorrect
      };

      finalAnswers = [...allAnswers, lastAnswerData];
      setAllAnswers(finalAnswers);

      // Сохраняем последний ответ в quiz_answers
      const { error: answerError } = await supabase
        .from('quiz_answers')
        .insert([
          {
            session_id: sessionId,
            question_id: question.id,
            question_text: question.question,
            selected_answer: selectedAnswer,
            correct_answer: correctAnswer,
            is_correct: isCorrect
          }
        ]);

      if (answerError) {
        console.error('Ошибка сохранения последнего ответа:', answerError);
      }
    }

    // Обновляем финальный результат в Supabase
    if (sessionId) {
      const totalQuestions = quizs.length;
      const percentage = Math.round((finalMarks / totalQuestions) * 100);
      
      const { error } = await supabase
        .from('quiz_sessions')
        .update({
          correct_answers: finalMarks,
          total_questions: totalQuestions,
          percentage: percentage,
          all_answers: finalAnswers, // Сохраняем все ответы в JSONB
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Ошибка обновления результата:', error);
      } else {
        // Сохраняем ID завершенной сессии в localStorage
        localStorage.setItem('quiz_completed_session', sessionId);
        setIsCompleted(true);
      }
    }

    setShowResult(true);
    setShowStart(false);
    setShowQuiz(false);
  };

  // Start Over - ЗАБЛОКИРОВАНО (не используется)
  const startOver = () => {
    // Функция заблокирована - повторное прохождение теста запрещено
    console.warn('Повторное прохождение теста запрещено');
  };
    return (
        <DataContext.Provider value={{
            startQuiz,showStart,showQuiz,question,quizs,checkAnswer,correctAnswer,
            selectedAnswer,questionIndex,nextQuestion,showTheResult,showResult,marks,
            startOver,setStudentInfo,studentName,studentSurname,sessionId,isCompleted
        }} >
            {children}
        </DataContext.Provider>
    );
}

export default DataContext;

