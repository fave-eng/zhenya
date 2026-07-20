# Уроки и домашние работы

Новый урок добавляется отдельным файлом:

```text
data/lessons/lesson-1.json
data/lessons/lesson-2.json
```

Не меняйте `app.js`, HTML и CSS при обычном добавлении урока.

## Минимальная структура

```json
{
  "id": "lesson-1",
  "number": 1,
  "title": "Название урока",
  "subtitle": "Краткое описание",
  "status": "available",
  "publishedAt": "2026-07-20",
  "notification": {
    "enabled": true,
    "version": 1
  },
  "blocks": [],
  "vocabulary": {
    "id": "vocab-lesson-1",
    "title": "Новые слова",
    "label": "Урок 1",
    "icon": "💬",
    "type": "lesson",
    "words": []
  },
  "grammarTopicIds": ["grammar-1"]
}
```

Статусы: `available`, `completed`, `locked`, `draft`.

## Блоки урока

### Раздел

```json
{
  "type": "section",
  "title": "Vocabulary",
  "text": "Выполните задания по порядку."
}
```

### Текстовое объяснение

```json
{
  "type": "content",
  "title": "Подсказка",
  "paragraphs": ["Короткое объяснение на русском."]
}
```

### Изображение

```json
{
  "type": "image",
  "src": "assets/lesson-1-picture.jpg",
  "alt": "Описание изображения",
  "caption": "Подпись"
}
```

### Аудио

```json
{
  "type": "audio",
  "title": "Прослушайте запись",
  "instruction": "Прослушайте два раза.",
  "src": "audio/lessons/lesson-1-listening-1.mp3"
}
```

### Проверяемое упражнение

```json
{
  "type": "exercise",
  "id": "exercise-1",
  "title": "Выберите правильный ответ",
  "instruction": "Прочитайте предложения.",
  "items": [
    {
      "id": "exercise-1-1",
      "type": "single",
      "prompt": "She ___ from London.",
      "options": ["am", "is", "are"],
      "answer": "is",
      "explanation": "После she используем is."
    },
    {
      "id": "exercise-1-2",
      "type": "text",
      "prompt": "Введите правильную форму: I ___ a student.",
      "answers": ["am"],
      "explanation": "После I используем am."
    }
  ]
}
```

Поддерживаемые типы вопросов:

- `text`;
- `textarea`;
- `select`;
- `single`;
- `multiple`;
- `reorder`;
- `translate`;
- `manual` — ответ сохраняется, но не входит в автоматический балл.

Для `multiple` правильные ответы передаются массивом `answers`.

## Словарь урока

```json
{
  "id": "word-1",
  "uniqueKey": "a teacher",
  "en": "a teacher",
  "ru": "учитель",
  "transcription": "/ə ˈtiːtʃə/",
  "exampleEn": "She is a teacher.",
  "exampleRu": "Она учитель."
}
```

Отдельный MP3 для слов не нужен. Произношение работает через Web Speech API с языком `en-GB`.
