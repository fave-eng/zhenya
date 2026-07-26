-- Run in the NEW Supabase project after migration.
select 'homework_progress' as table_name, count(*) as rows
from public.homework_progress where student_id = 'zhenya'
union all
select 'vocabulary_progress', count(*)
from public.vocabulary_progress where student_id = 'zhenya'
union all
select 'vocabulary_topic_progress', count(*)
from public.vocabulary_topic_progress where student_id = 'zhenya'
union all
select 'grammar_progress', count(*)
from public.grammar_progress where student_id = 'zhenya'
order by table_name;
