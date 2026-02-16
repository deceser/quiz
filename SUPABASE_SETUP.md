# Инструкция по настройке Supabase для React Quiz App

## Шаг 1: Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Войдите или зарегистрируйтесь
3. Нажмите "New Project"
4. Заполните данные:
   - **Project name**: React Quiz App (или любое другое имя)
   - **Database Password**: создайте надежный пароль (сохраните его!)
   - **Region**: выберите ближайший регион
5. Нажмите "Create new project" и дождитесь создания проекта (1-2 минуты)

## Шаг 2: Создание таблиц в базе данных

1. В левом меню выберите **SQL Editor**
2. Нажмите **New query**
3. Скопируйте и вставьте следующий SQL код:

```sql
-- Таблица сессий квиза
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 0,
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

-- Включаем Row Level Security
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

-- Политики доступа (открытый доступ без авторизации)
CREATE POLICY "Все могут создавать сессии" ON quiz_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Все могут читать сессии" ON quiz_sessions FOR SELECT USING (true);
CREATE POLICY "Все могут обновлять сессии" ON quiz_sessions FOR UPDATE USING (true);

CREATE POLICY "Все могут создавать ответы" ON quiz_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Все могут читать ответы" ON quiz_answers FOR SELECT USING (true);
```

4. Нажмите **Run** (или Ctrl+Enter)
5. Убедитесь, что все выполнилось без ошибок

## Шаг 3: Получение API ключей

1. В левом меню выберите **Settings** (значок шестеренки внизу)
2. Выберите **API**
3. Найдите следующие данные:
   - **Project URL**: что-то вроде `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: длинный ключ (начинается с `eyJ...`)

## Шаг 4: Настройка приложения

1. Откройте файл `.env.local` в корне проекта
2. Замените плейсхолдеры на реальные значения:

```env
REACT_APP_SUPABASE_URL=https://ваш-проект-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=ваш-anon-key
```

3. Сохраните файл

## Шаг 5: Запуск приложения

```bash
npm start
```

Приложение запустится на `http://localhost:3000`

## Проверка работоспособности

1. Откройте приложение в браузере
2. Введите имя и фамилию
3. Нажмите "Начать квиз"
4. Пройдите квиз
5. После завершения проверьте данные в Supabase:
   - Откройте **Table Editor** в Supabase
   - Выберите таблицу `quiz_sessions` - вы должны увидеть свою сессию
   - Выберите таблицу `quiz_answers` - вы должны увидеть все ваши ответы

## Просмотр данных в Supabase

### Все сессии квизов:
```sql
SELECT 
  id,
  first_name,
  last_name,
  total_score,
  max_score,
  completed_at,
  created_at
FROM quiz_sessions
ORDER BY created_at DESC;
```

### Детальные ответы для конкретной сессии:
```sql
SELECT 
  qa.question_id,
  qa.question_text,
  qa.selected_answer,
  qa.correct_answer,
  qa.is_correct,
  qa.created_at
FROM quiz_answers qa
WHERE qa.session_id = 'ВСТАВЬТЕ_ID_СЕССИИ_СЮДА'
ORDER BY qa.created_at;
```

### Статистика по вопросам (самые сложные):
```sql
SELECT 
  question_text,
  COUNT(*) as total_answers,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
  ROUND(100.0 * SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM quiz_answers
GROUP BY question_text
ORDER BY success_rate ASC;
```

### Средний балл всех учеников:
```sql
SELECT 
  COUNT(*) as total_students,
  ROUND(AVG(total_score), 2) as average_score,
  MAX(total_score) as highest_score,
  MIN(total_score) as lowest_score
FROM quiz_sessions
WHERE completed_at IS NOT NULL;
```

## Структура базы данных

### Таблица `quiz_sessions`
Хранит информацию о каждой попытке прохождения квиза:
- `id` - уникальный идентификатор сессии
- `first_name` - имя ученика
- `last_name` - фамилия ученика
- `total_score` - итоговый балл
- `max_score` - максимально возможный балл
- `completed_at` - время завершения квиза
- `created_at` - время начала квиза

### Таблица `quiz_answers`
Хранит детальную информацию о каждом ответе:
- `id` - уникальный идентификатор ответа
- `session_id` - связь с сессией
- `question_id` - ID вопроса из quiz.json
- `question_text` - текст вопроса
- `selected_answer` - выбранный ответ ученика
- `correct_answer` - правильный ответ
- `is_correct` - флаг правильности ответа
- `created_at` - время ответа

## Безопасность

**ВАЖНО**: Текущая настройка RLS (Row Level Security) разрешает всем читать, создавать и обновлять данные без авторизации. Это сделано для простоты использования в образовательных целях.

Для production-окружения рекомендуется:
1. Добавить авторизацию через Supabase Auth
2. Ограничить политики доступа
3. Добавить валидацию на уровне базы данных

## Возможные ошибки

### Ошибка: "Failed to fetch"
- Проверьте, что `REACT_APP_SUPABASE_URL` указан правильно
- Убедитесь, что проект Supabase запущен (не на паузе)

### Ошибка: "Invalid API key"
- Проверьте, что `REACT_APP_SUPABASE_ANON_KEY` скопирован полностью
- Убедитесь, что в ключе нет пробелов в начале/конце

### Ошибка: "Permission denied"
- Проверьте, что RLS политики созданы корректно
- Убедитесь, что RLS включен для обеих таблиц

### Данные не сохраняются
- Проверьте консоль браузера (F12) на наличие ошибок
- Убедитесь, что файл `.env.local` сохранен
- Перезапустите приложение после изменения `.env.local`

## Дополнительные возможности

После базовой настройки вы можете:
- Создать дашборд для просмотра статистики
- Добавить экспорт результатов в CSV/Excel
- Настроить email-уведомления при прохождении квиза
- Добавить графики и аналитику
