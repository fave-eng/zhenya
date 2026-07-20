# Настройка Supabase

1. Создайте новый проект Supabase для Жени.
2. Откройте **SQL Editor**.
3. Выполните `schema.sql` целиком.
4. Выполните `verify.sql` и убедитесь, что показаны шесть таблиц.
5. Вставьте Project URL и public anon/publishable key в `config.js`.

## Подключение Telegram-получателя

После получения реального `chat_id` выполните в SQL Editor, заменив значение:

```sql
insert into public.telegram_recipients (
  student_id,
  chat_id,
  message_thread_id,
  enabled
)
values (
  'zhenya',
  YOUR_REAL_CHAT_ID,
  null,
  true
)
on conflict (student_id) do update
set chat_id = excluded.chat_id,
    message_thread_id = excluded.message_thread_id,
    enabled = true,
    updated_at = now();
```

Не храните реальный `chat_id` в GitHub.

## Edge Function

В GitHub добавьте:

**Secrets**

- `SUPABASE_ACCESS_TOKEN`;
- `TELEGRAM_BOT_TOKEN`;
- `NOTIFY_WEBHOOK_SECRET`.

**Variables**

- `SUPABASE_PROJECT_ID`;
- `SITE_BASE_URL`.

После этого запустите workflow **1 - Настройка Telegram**.

Функция должна вернуть:

```json
{
  "ok": true,
  "functionVersion": "homework-reports-v2"
}
```

Режим `homework_report` не требует `x-notify-secret`. Секрет нужен только для уведомлений о новых опубликованных материалах.
