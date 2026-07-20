-- Проверка структуры English Space — Zhenya

select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'homework_progress',
    'vocabulary_progress',
    'vocabulary_topic_progress',
    'grammar_progress',
    'telegram_recipients',
    'material_publications'
  )
order by table_name;

select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename in (
    'homework_progress',
    'vocabulary_progress',
    'vocabulary_topic_progress',
    'grammar_progress',
    'telegram_recipients',
    'material_publications'
  )
order by tablename, policyname;

select event_object_table as table_name, trigger_name
from information_schema.triggers
where trigger_schema = 'public'
  and event_object_table in (
    'homework_progress',
    'vocabulary_progress',
    'vocabulary_topic_progress',
    'grammar_progress',
    'telegram_recipients',
    'material_publications'
  )
order by event_object_table, trigger_name;

select
  (select count(*) from public.homework_progress where student_id = 'zhenya') as homework_rows,
  (select count(*) from public.vocabulary_progress where student_id = 'zhenya') as vocabulary_rows,
  (select count(*) from public.vocabulary_topic_progress where student_id = 'zhenya') as vocabulary_topic_rows,
  (select count(*) from public.grammar_progress where student_id = 'zhenya') as grammar_rows,
  (select count(*) from public.telegram_recipients where student_id = 'zhenya') as telegram_recipient_rows;
