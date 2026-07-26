# Готовый перенос прогресса Жени

Новый проект уже внесён в `config.js`:

```text
https://zqzgarvmpqqqaobeicpc.supabase.co
```

## Шаг 1. Создать таблицы в новом Supabase

В новом проекте откройте **SQL Editor → New query**.
Скопируйте туда весь файл:

```text
supabase/schema.sql
```

Нажмите **Run**. Затем таким же способом выполните:

```text
supabase/verify.sql
```

## Шаг 2. Перенести текущий прогресс

Нужен Node.js 18 или новее. В Terminal откройте корень сайта и выполните:

```bash
node migration/migrate-zhenya-now.mjs
```

Скрипт:

1. прочитает прогресс из старого проекта;
2. сохранит резервную JSON-копию в `migration/backups/`;
3. импортирует данные в новый проект;
4. повторно прочитает новый проект и проверит каждую запись.

Успешный результат заканчивается строкой:

```text
Migration completed and verified successfully.
```

Если появится ошибка `relation ... does not exist` или `PGRST205`, сначала ещё раз выполните `supabase/schema.sql` в новом проекте.

## Шаг 3. Опубликовать сайт

После успешного переноса загрузите обновлённые файлы сайта в GitHub. Благодаря новой версии подключения браузер не должен использовать старый `config.js` из кэша.

## Шаг 4. Telegram

Для нового проекта установите GitHub Variable:

```text
SUPABASE_PROJECT_ID = zqzgarvmpqqqaobeicpc
```

Затем заново добавьте Telegram-получателя в таблицу `telegram_recipients` и запустите workflow настройки Telegram.

Не удаляйте старый Supabase, пока не убедитесь, что на новом сайте видны все прежние результаты.
