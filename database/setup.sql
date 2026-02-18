-- Скрипт для создания таблиц React Quiz App
-- Выполните этот скрипт в SQL Editor: https://supabase.com/dashboard/project/nkmkbflbkdadhjwlydvz/sql

-- Удаляем существующие таблицы (если нужно переустановить)
DROP TABLE IF EXISTS quiz_answers CASCADE;
DROP TABLE IF EXISTS quiz_sessions CASCADE;

-- Таблица сессий квиза
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  correct_answers INTEGER NOT NULL DEFAULT 0,  -- Количество правильных ответов (из 10)
  total_questions INTEGER NOT NULL DEFAULT 0,  -- Общее количество вопросов (10)
  percentage INTEGER NOT NULL DEFAULT 0,       -- Процент правильных ответов
  all_answers JSONB,                           -- Полная копия всех ответов для быстрого доступа
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица ответов
CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  selected_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для оптимизации
CREATE INDEX idx_quiz_answers_session_id ON quiz_answers(session_id);
CREATE INDEX idx_quiz_sessions_created_at ON quiz_sessions(created_at DESC);
CREATE INDEX idx_quiz_sessions_percentage ON quiz_sessions(percentage DESC);

-- Включаем Row Level Securityl
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

-- Политики доступа (открытый доступ без авторизации)
CREATE POLICY "Все могут создавать сессии" 
  ON quiz_sessions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Все могут читать сессии" 
  ON quiz_sessions FOR SELECT 
  USING (true);

CREATE POLICY "Все могут обновлять сессии" 
  ON quiz_sessions FOR UPDATE 
  USING (true);

CREATE POLICY "Все могут создавать ответы" 
  ON quiz_answers FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Все могут читать ответы" 
  ON quiz_answers FOR SELECT 
  USING (true);

-- Проверка создания таблиц
SELECT 'quiz_sessions' as table_name, COUNT(*) as row_count FROM quiz_sessions
UNION ALL
SELECT 'quiz_answers' as table_name, COUNT(*) as row_count FROM quiz_answers;
