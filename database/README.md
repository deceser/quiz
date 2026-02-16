# База данных React Quiz App - Вариант 3 (Гибридный)

## Структура данных

### Таблица `quiz_sessions` - Основная информация

**Поля:**
- `id` - UUID сессии
- `first_name` - Имя ученика
- `last_name` - Фамилия ученика
- `correct_answers` - **Количество правильных ответов (из 10)**
- `total_questions` - Общее количество вопросов (10)
- `percentage` - Процент правильных ответов (0-100)
- `all_answers` - **JSONB с полными данными всех ответов**
- `completed_at` - Время завершения
- `created_at` - Время начала

**Пример записи:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Денис",
  "last_name": "Безверхий",
  "correct_answers": 7,
  "total_questions": 10,
  "percentage": 70,
  "all_answers": [
    {
      "question_id": "01",
      "question_text": "Какое из следующих названий является правильным для React.js?",
      "selected_answer": "React.js",
      "correct_answer": "Все вышеперечисленное",
      "is_correct": false
    },
    {
      "question_id": "02",
      "question_text": "Какие из следующих являются преимуществами React.js?",
      "selected_answer": "Все вышеперечисленное",
      "correct_answer": "Все вышеперечисленное",
      "is_correct": true
    }
    // ... еще 8 вопросов
  ],
  "completed_at": "2026-02-16T19:30:00Z",
  "created_at": "2026-02-16T19:20:00Z"
}
```

### Таблица `quiz_answers` - Детальная аналитика

**Поля:**
- `id` - UUID ответа
- `session_id` - Ссылка на quiz_sessions
- `question_id` - ID вопроса
- `question_text` - Текст вопроса
- `selected_answer` - Ответ ученика
- `correct_answer` - Правильный ответ
- `is_correct` - Флаг правильности (boolean)
- `created_at` - Время ответа

**Назначение:** Для статистики и аналитики по вопросам

---

## Установка

### Шаг 1: Откройте SQL Editor в Supabase

```
https://supabase.com/dashboard/project/nkmkbflbkdadhjwlydvz/sql
```

### Шаг 2: Выполните setup.sql

1. Нажмите "New query"
2. Скопируйте содержимое `setup.sql`
3. Нажмите "Run"
4. Проверьте результат

---

## Быстрый просмотр данных

### Все результаты (быстро)

```sql
SELECT 
  first_name || ' ' || last_name as ученик,
  correct_answers || ' из ' || total_questions as результат,
  percentage || '%' as процент
FROM quiz_sessions
WHERE completed_at IS NOT NULL
ORDER BY percentage DESC;
```

### Детальные ответы ученика (из JSONB)

```sql
SELECT 
  first_name || ' ' || last_name as ученик,
  jsonb_pretty(all_answers) as все_ответы
FROM quiz_sessions
WHERE first_name = 'Денис' AND last_name = 'Безверхий';
```

---

## Преимущества гибридной структуры

### ✅ Быстрый доступ
- Одним запросом получаете всю информацию из `quiz_sessions`
- Поле `all_answers` содержит полную копию всех ответов

### ✅ Легкая аналитика
- Таблица `quiz_answers` позволяет анализировать:
  - Какие вопросы самые сложные
  - Популярные неправильные ответы
  - Статистику по каждому вопросу

### ✅ Оценка из 10
- `correct_answers` показывает количество правильных (0-10)
- `percentage` показывает процент (0-100%)
- Интуитивно понятно для учителя и ученика

---

## Полезные запросы

Все запросы находятся в файле [`useful-queries.sql`](./useful-queries.sql):

1. **Просмотр всех результатов**
2. **Детальные ответы ученика**
3. **Статистика по вопросам**
4. **Рейтинг учеников**
5. **Поиск дублей**
6. **Экспорт для Excel**
7. **И многое другое...**

---

## Пример использования в коде

### Получить результат ученика

```javascript
const { data } = await supabase
  .from('quiz_sessions')
  .select('*')
  .eq('first_name', 'Денис')
  .eq('last_name', 'Безверхий')
  .single();

console.log(`Результат: ${data.correct_answers} из ${data.total_questions}`);
console.log(`Процент: ${data.percentage}%`);
console.log('Все ответы:', data.all_answers);
```

### Получить статистику по вопросам

```javascript
const { data } = await supabase
  .from('quiz_answers')
  .select('question_id, question_text, is_correct');

// Группируем и считаем
const stats = data.reduce((acc, answer) => {
  if (!acc[answer.question_id]) {
    acc[answer.question_id] = {
      text: answer.question_text,
      correct: 0,
      total: 0
    };
  }
  acc[answer.question_id].total++;
  if (answer.is_correct) acc[answer.question_id].correct++;
  return acc;
}, {});
```

---

## Миграция со старой структуры

Если у вас уже были таблицы со старой структурой (total_score, max_score):

### Вариант 1: Удалить и создать заново

```sql
DROP TABLE IF EXISTS quiz_answers CASCADE;
DROP TABLE IF EXISTS quiz_sessions CASCADE;
-- Затем выполните setup.sql
```

### Вариант 2: Экспортировать данные

```sql
-- Сохраните старые данные
CREATE TABLE quiz_sessions_backup AS SELECT * FROM quiz_sessions;
-- Затем удалите и создайте новые таблицы
```

---

## Размер данных

### Примерный расчет:

- 1 ученик = 1 запись в `quiz_sessions` (~2-5 KB с JSONB)
- 1 ученик = 10 записей в `quiz_answers` (~5-10 KB)
- **Итого:** ~7-15 KB на ученика

Для 100 учеников: ~0.7-1.5 MB
Для 1000 учеников: ~7-15 MB

Supabase бесплатный план: до 500 MB базы данных ✅

---

## Вопросы и ответы

### Зачем JSONB если есть quiz_answers?

**Ответ:** 
- JSONB для **быстрого** доступа к полной информации
- quiz_answers для **аналитики** и статистики
- Лучшее из обоих миров

### Можно ли изменить оценку на 5-балльную?

**Ответ:** Да, просто пересчитайте в приложении:
```javascript
const grade = Math.round((correct_answers / total_questions) * 5);
```

### Как экспортировать в Excel?

**Ответ:** В Supabase Table Editor:
1. Откройте `quiz_sessions`
2. Нажмите "..." → "Export to CSV"
3. Откройте в Excel

---

## Поддержка

Если возникли вопросы:
1. Проверьте `useful-queries.sql` - там 90% ответов
2. Проверьте RLS политики (должны быть включены)
3. Проверьте индексы для быстрых запросов
