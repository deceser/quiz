-- ====================================================================
-- ПОЛЕЗНЫЕ SQL ЗАПРОСЫ ДЛЯ УЧИТЕЛЯ
-- ====================================================================

-- ====================================================================
-- 1. ПРОСМОТР ВСЕХ РЕЗУЛЬТАТОВ
-- ====================================================================
-- Показывает всех учеников с результатами (сортировка по дате)
SELECT 
  first_name || ' ' || last_name as student,
  correct_answers || ' из ' || total_questions as result,
  percentage || '%' as percentage,
  completed_at,
  created_at
FROM quiz_sessions
WHERE completed_at IS NOT NULL
ORDER BY completed_at DESC;


-- ====================================================================
-- 2. ДЕТАЛЬНЫЕ ОТВЕТЫ КОНКРЕТНОГО УЧЕНИКА
-- ====================================================================
-- Замените 'ВСТАВЬТЕ_ID_СЕССИИ' на реальный ID из quiz_sessions
SELECT 
  qa.question_id,
  qa.question_text,
  qa.selected_answer,
  qa.correct_answer,
  CASE 
    WHEN qa.is_correct THEN '✅ Правильно'
    ELSE '❌ Неправильно'
  END as result
FROM quiz_answers qa
WHERE qa.session_id = 'ВСТАВЬТЕ_ID_СЕССИИ'
ORDER BY qa.created_at;


-- ====================================================================
-- 3. ВСЕ ОТВЕТЫ УЧЕНИКА ИЗ JSONB (быстрый доступ)
-- ====================================================================
-- Показывает все ответы из поля all_answers
SELECT 
  first_name || ' ' || last_name as student,
  correct_answers || ' из ' || total_questions as result,
  jsonb_pretty(all_answers) as detailed_answers
FROM quiz_sessions
WHERE first_name = 'Денис' AND last_name = 'Безверхий'
  AND completed_at IS NOT NULL;


-- ====================================================================
-- 4. СТАТИСТИКА ПО КАЖДОМУ ВОПРОСУ
-- ====================================================================
-- Показывает какие вопросы самые сложные
SELECT 
  question_id,
  LEFT(question_text, 50) || '...' as question,
  COUNT(*) as total_answers,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct,
  SUM(CASE WHEN NOT is_correct THEN 1 ELSE 0 END) as incorrect,
  ROUND(100.0 * SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) / COUNT(*), 1) as success_rate
FROM quiz_answers
GROUP BY question_id, question_text
ORDER BY success_rate ASC;


-- ====================================================================
-- 5. ОБЩАЯ СТАТИСТИКА КЛАССА
-- ====================================================================
SELECT 
  COUNT(*) as total_students,
  ROUND(AVG(correct_answers), 1) as avg_correct,
  ROUND(AVG(percentage), 1) as avg_percentage,
  MAX(correct_answers) as best_score,
  MIN(correct_answers) as worst_score,
  COUNT(CASE WHEN percentage >= 70 THEN 1 END) as passed_70_percent,
  COUNT(CASE WHEN percentage < 70 THEN 1 END) as failed_70_percent
FROM quiz_sessions
WHERE completed_at IS NOT NULL;


-- ====================================================================
-- 6. РЕЙТИНГ УЧЕНИКОВ (ТОП-10)
-- ====================================================================
SELECT 
  ROW_NUMBER() OVER (ORDER BY correct_answers DESC, completed_at ASC) as rank,
  first_name || ' ' || last_name as student,
  correct_answers || ' из ' || total_questions as result,
  percentage || '%' as percentage,
  completed_at
FROM quiz_sessions
WHERE completed_at IS NOT NULL
ORDER BY correct_answers DESC, completed_at ASC
LIMIT 10;


-- ====================================================================
-- 7. ПОИСК ДУБЛЕЙ (один ученик прошел несколько раз)
-- ====================================================================
SELECT 
  first_name,
  last_name,
  COUNT(*) as attempts,
  ARRAY_AGG(correct_answers ORDER BY completed_at) as scores,
  ARRAY_AGG(completed_at ORDER BY completed_at) as dates
FROM quiz_sessions
WHERE completed_at IS NOT NULL
GROUP BY first_name, last_name
HAVING COUNT(*) > 1
ORDER BY attempts DESC;


-- ====================================================================
-- 8. ЭКСПОРТ ДЛЯ EXCEL (простой формат)
-- ====================================================================
SELECT 
  first_name as "Имя",
  last_name as "Фамилия",
  correct_answers as "Правильных ответов",
  total_questions as "Всего вопросов",
  percentage as "Процент",
  TO_CHAR(completed_at, 'DD.MM.YYYY HH24:MI') as "Дата завершения"
FROM quiz_sessions
WHERE completed_at IS NOT NULL
ORDER BY completed_at DESC;


-- ====================================================================
-- 9. ДЕТАЛЬНЫЙ ЭКСПОРТ С ОТВЕТАМИ
-- ====================================================================
-- Развернутый список всех ответов всех учеников
SELECT 
  qs.first_name || ' ' || qs.last_name as student,
  qa.question_id,
  LEFT(qa.question_text, 100) as question,
  qa.selected_answer,
  qa.correct_answer,
  qa.is_correct,
  qa.created_at
FROM quiz_sessions qs
JOIN quiz_answers qa ON qs.id = qa.session_id
WHERE qs.completed_at IS NOT NULL
ORDER BY qs.completed_at DESC, qa.created_at;


-- ====================================================================
-- 10. САМЫЕ ПОПУЛЯРНЫЕ НЕПРАВИЛЬНЫЕ ОТВЕТЫ
-- ====================================================================
SELECT 
  question_id,
  LEFT(question_text, 60) || '...' as question,
  selected_answer as wrong_answer,
  COUNT(*) as times_selected
FROM quiz_answers
WHERE is_correct = false
GROUP BY question_id, question_text, selected_answer
ORDER BY times_selected DESC
LIMIT 10;


-- ====================================================================
-- 11. АНАЛИЗ ВРЕМЕНИ ПРОХОЖДЕНИЯ
-- ====================================================================
SELECT 
  first_name || ' ' || last_name as student,
  correct_answers,
  EXTRACT(EPOCH FROM (completed_at - created_at)) / 60 as minutes_taken,
  completed_at
FROM quiz_sessions
WHERE completed_at IS NOT NULL
ORDER BY minutes_taken;


-- ====================================================================
-- 12. УДАЛИТЬ СЕССИЮ (если нужно разрешить повторное прохождение)
-- ====================================================================
-- ВНИМАНИЕ: Это удалит сессию и все связанные ответы!
-- DELETE FROM quiz_sessions WHERE id = 'ВСТАВЬТЕ_ID_СЕССИИ';


-- ====================================================================
-- 13. ОЧИСТИТЬ ВСЕ ДАННЫЕ (для тестирования)
-- ====================================================================
-- ВНИМАНИЕ: Это удалит ВСЕ результаты!
-- TRUNCATE TABLE quiz_answers CASCADE;
-- TRUNCATE TABLE quiz_sessions CASCADE;


-- ====================================================================
-- 14. ПРОСМОТР ВСЕХ ОТВЕТОВ УЧЕНИКА (красиво)
-- ====================================================================
-- Замените имя и фамилию
SELECT 
  jsonb_array_elements(all_answers)->>'question_id' as "#",
  LEFT(jsonb_array_elements(all_answers)->>'question_text', 50) || '...' as question,
  jsonb_array_elements(all_answers)->>'selected_answer' as selected,
  CASE 
    WHEN (jsonb_array_elements(all_answers)->>'is_correct')::boolean 
    THEN '✅'
    ELSE '❌'
  END as result
FROM quiz_sessions
WHERE first_name = 'Денис' 
  AND last_name = 'Безверхий'
  AND completed_at IS NOT NULL
LIMIT 10;
