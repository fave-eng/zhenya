/**
 * Опубликованные грамматические темы Жени.
 * Новые темы добавляются отдельными объектами в массив window.GRAMMAR_DATA.
 */
window.GRAMMAR_DATA = [
  {
    "id": "grammar-1",
    "number": 1,
    "title": "Present Simple",
    "subtitle": "Регулярные действия, факты, расписание, вопросы и отрицания",
    "status": "available",
    "linkedLessonId": "lesson-1",
    "notification": {
      "enabled": false,
      "version": 1
    },
    "explanation": [
      {
        "label": "Смысл времени",
        "title": "Когда использовать Present Simple",
        "summary": "Используйте Present Simple, когда говорите не о моменте «прямо сейчас», а о том, что происходит обычно, регулярно, всегда или по расписанию.",
        "formula": "обычно / регулярно / факт / расписание → Present Simple",
        "points": [
          "Привычка или повторяющееся действие: каждый день, по понедельникам, часто.",
          "Постоянный факт или состояние: место работы, место жительства, предпочтение.",
          "Расписание или установленное время: начало работы, отправление поезда, часы работы."
        ],
        "examples": [
          {
            "en": "I work from home on Fridays.",
            "ru": "Я работаю из дома по пятницам."
          },
          {
            "en": "She lives in Riga.",
            "ru": "Она живёт в Риге."
          },
          {
            "en": "The train leaves at eight.",
            "ru": "Поезд отправляется в восемь."
          }
        ],
        "tip": "Если действие происходит именно сейчас, для обычного действия чаще нужен Present Continuous: I am working now."
      },
      {
        "label": "Утверждение",
        "title": "I / you / we / they: глагол без окончания",
        "summary": "После I, you, we и they используйте базовую форму смыслового глагола — такую, как в словаре.",
        "formula": "I / You / We / They + verb",
        "points": [
          "Перед смысловым глаголом не нужны am или are: I work, а не I am work.",
          "Форма глагола не меняется: work, live, start, speak."
        ],
        "table": {
          "headers": [
            "Подлежащее",
            "Глагол",
            "Готовое предложение"
          ],
          "rows": [
            [
              "I",
              "work",
              "I work from home."
            ],
            [
              "you",
              "live",
              "You live near the office."
            ],
            [
              "we",
              "start",
              "We start at eight."
            ],
            [
              "they",
              "speak",
              "They speak English."
            ]
          ]
        },
        "examples": [
          {
            "en": "I drink coffee in the morning.",
            "ru": "Я пью кофе утром."
          },
          {
            "en": "They work five days a week.",
            "ru": "Они работают пять дней в неделю."
          }
        ]
      },
      {
        "label": "Утверждение",
        "title": "He / she / it: добавляем окончание",
        "summary": "В утвердительном предложении после he, she, it или одного человека/предмета глагол получает окончание -s, -es или -ies.",
        "formula": "He / She / It + verb-s",
        "points": [
          "Имя одного человека работает так же, как he или she: Anna works.",
          "Один предмет, магазин или организация работают как it: The shop closes.",
          "Форма have — исключение: he/she/it has."
        ],
        "table": {
          "headers": [
            "Когда",
            "Базовая форма",
            "Форма с he / she / it"
          ],
          "rows": [
            [
              "Обычно добавляем -s",
              "work",
              "works"
            ],
            [
              "После -s, -sh, -ch, -x, -o добавляем -es",
              "go",
              "goes"
            ],
            [
              "Согласная + y: y → ies",
              "study",
              "studies"
            ],
            [
              "Исключение",
              "have",
              "has"
            ]
          ]
        },
        "examples": [
          {
            "en": "He works in a bank.",
            "ru": "Он работает в банке."
          },
          {
            "en": "Maria studies English.",
            "ru": "Мария изучает английский."
          },
          {
            "en": "The shop closes at ten.",
            "ru": "Магазин закрывается в десять."
          }
        ],
        "warning": "Окончание добавляется только в утвердительном предложении. После does или doesn’t основной глагол снова будет без -s."
      },
      {
        "label": "Отрицание",
        "title": "Как сказать «не делаю»",
        "summary": "Для отрицания используйте don’t или doesn’t. После них всегда ставьте базовую форму глагола без окончания.",
        "formula": [
          "I / You / We / They + don’t + verb",
          "He / She / It + doesn’t + verb"
        ],
        "points": [
          "don’t = do not; doesn’t = does not.",
          "Doesn’t уже показывает форму he/she/it, поэтому второй раз окончание -s не добавляется."
        ],
        "table": {
          "headers": [
            "Подлежащее",
            "Помощник",
            "Пример"
          ],
          "rows": [
            [
              "I / you / we / they",
              "don’t + verb",
              "We don’t work on Sundays."
            ],
            [
              "he / she / it",
              "doesn’t + verb",
              "She doesn’t work on Sundays."
            ]
          ]
        },
        "examples": [
          {
            "en": "I don’t drink tea.",
            "ru": "Я не пью чай."
          },
          {
            "en": "He doesn’t drive to work.",
            "ru": "Он не ездит на работу на машине."
          }
        ],
        "warning": "Правильно: He doesn’t work. Неправильно: He doesn’t works."
      },
      {
        "label": "Вопрос",
        "title": "Do или Does ставим в начало",
        "summary": "В общем вопросе сначала ставьте Do или Does, затем подлежащее и базовую форму смыслового глагола.",
        "formula": [
          "Do + I / you / we / they + verb?",
          "Does + he / she / it + verb?"
        ],
        "points": [
          "Do используйте с I, you, we, they.",
          "Does используйте с he, she, it и с одним человеком или предметом.",
          "После Does глагол используется без -s: Does she work?"
        ],
        "table": {
          "headers": [
            "Подлежащее",
            "Вопрос",
            "Короткий ответ"
          ],
          "rows": [
            [
              "I / you / we / they",
              "Do you work here?",
              "Yes, I do. / No, I don’t."
            ],
            [
              "he / she / it",
              "Does she work here?",
              "Yes, she does. / No, she doesn’t."
            ]
          ]
        },
        "examples": [
          {
            "en": "Do you work from home?",
            "ru": "Вы работаете из дома?"
          },
          {
            "en": "Does Anna speak English?",
            "ru": "Анна говорит по-английски?"
          }
        ],
        "tip": "В коротком ответе не повторяйте смысловой глагол: Yes, she does. Не Yes, she works."
      },
      {
        "label": "Алгоритм",
        "title": "Как быстро выбрать правильную форму",
        "summary": "Не пытайтесь запомнить все предложения. Каждый раз проходите одну и ту же короткую проверку.",
        "steps": [
          {
            "title": "Определите тип предложения",
            "text": "Это утверждение, отрицание или вопрос?"
          },
          {
            "title": "Найдите подлежащее",
            "text": "Кто выполняет действие: I/you/we/they или he/she/it?"
          },
          {
            "title": "Проверьте помощник",
            "text": "Есть do, does, don’t или doesn’t? Тогда основной глагол берите без -s."
          },
          {
            "title": "Добавьте окончание только при необходимости",
            "text": "В утверждении с he/she/it добавьте -s, -es или -ies."
          },
          {
            "title": "Отдельно проверьте be",
            "text": "Глагол be имеет формы am/is/are и не требует do или does."
          }
        ],
        "formula": "She works. → She doesn’t work. → Does she work?",
        "warning": "С am, is, are не используйте do/does: Is she at work? She isn’t at work."
      },
      {
        "label": "Маркеры времени",
        "title": "Слова, которые часто сопровождают Present Simple",
        "summary": "Эти слова помогают увидеть регулярность, но сначала всегда проверяйте смысл предложения.",
        "points": [
          "Usually, often, sometimes и never обычно стоят перед смысловым глаголом: She often works from home.",
          "После am/is/are эти слова стоят после формы be: She is often busy.",
          "Every day, on Mondays и похожие фразы часто стоят в конце предложения."
        ],
        "table": {
          "headers": [
            "Маркер",
            "Перевод",
            "Пример"
          ],
          "rows": [
            [
              "every day",
              "каждый день",
              "I study every day."
            ],
            [
              "usually",
              "обычно",
              "She usually starts at nine."
            ],
            [
              "often",
              "часто",
              "We often work from home."
            ],
            [
              "sometimes",
              "иногда",
              "They sometimes eat out."
            ],
            [
              "never",
              "никогда",
              "He never drinks coffee."
            ],
            [
              "on Mondays",
              "по понедельникам",
              "The shop closes early on Mondays."
            ]
          ]
        },
        "tip": "Never уже содержит отрицательный смысл. Не добавляйте don’t/doesn’t: He never drinks coffee."
      }
    ],
    "commonMistakes": [
      {
        "wrong": "He work in an office.",
        "right": "He works in an office.",
        "reason": "Утверждение с he: добавляем -s."
      },
      {
        "wrong": "She don’t drink coffee.",
        "right": "She doesn’t drink coffee.",
        "reason": "С she нужен doesn’t."
      },
      {
        "wrong": "He doesn’t works here.",
        "right": "He doesn’t work here.",
        "reason": "После doesn’t используется базовая форма."
      },
      {
        "wrong": "Does Anna lives in London?",
        "right": "Does Anna live in London?",
        "reason": "После Does используется базовая форма."
      },
      {
        "wrong": "I am work in a bank.",
        "right": "I work in a bank.",
        "reason": "Перед смысловым глаголом work форма am не нужна."
      }
    ],
    "exercises": [
      {
        "id": "grammar-exercise-1",
        "difficulty": "1 · Очень легко",
        "title": "Выберите правильную форму",
        "instruction": "Выберите один вариант.",
        "items": [
          {
            "id": "grammar-1-1",
            "type": "single",
            "prompt": "I ___ in a hospital.",
            "options": [
              "work",
              "works"
            ],
            "answer": "work",
            "explanation": "После I: work."
          },
          {
            "id": "grammar-1-2",
            "type": "single",
            "prompt": "She ___ in a hospital.",
            "options": [
              "work",
              "works"
            ],
            "answer": "works",
            "explanation": "После she добавляем -s: works."
          },
          {
            "id": "grammar-1-3",
            "type": "single",
            "prompt": "They ___ in London.",
            "options": [
              "live",
              "lives"
            ],
            "answer": "live",
            "explanation": "После they: live."
          },
          {
            "id": "grammar-1-4",
            "type": "single",
            "prompt": "Tom ___ in London.",
            "options": [
              "live",
              "lives"
            ],
            "answer": "lives",
            "explanation": "Tom = he: lives."
          },
          {
            "id": "grammar-1-5",
            "type": "single",
            "prompt": "We ___ English.",
            "options": [
              "study",
              "studies"
            ],
            "answer": "study",
            "explanation": "После we: study."
          },
          {
            "id": "grammar-1-6",
            "type": "single",
            "prompt": "Anna ___ English.",
            "options": [
              "study",
              "studies"
            ],
            "answer": "studies",
            "explanation": "Anna = she: studies."
          }
        ]
      },
      {
        "id": "grammar-exercise-2",
        "difficulty": "2 · Легко",
        "title": "Поставьте глагол в правильную форму",
        "instruction": "Напишите только глагол.",
        "items": [
          {
            "id": "grammar-2-1",
            "type": "text",
            "prompt": "He ___ (work) from home.",
            "answers": [
              "works"
            ],
            "explanation": "He works."
          },
          {
            "id": "grammar-2-2",
            "type": "text",
            "prompt": "I ___ (start) at eight.",
            "answers": [
              "start"
            ],
            "explanation": "I start."
          },
          {
            "id": "grammar-2-3",
            "type": "text",
            "prompt": "Maria ___ (go) to work by bus.",
            "answers": [
              "goes"
            ],
            "explanation": "Maria goes."
          },
          {
            "id": "grammar-2-4",
            "type": "text",
            "prompt": "My brother ___ (study) French.",
            "answers": [
              "studies"
            ],
            "explanation": "study → studies."
          },
          {
            "id": "grammar-2-5",
            "type": "text",
            "prompt": "We ___ (have) lunch at one.",
            "answers": [
              "have"
            ],
            "explanation": "После we: have."
          },
          {
            "id": "grammar-2-6",
            "type": "text",
            "prompt": "She ___ (have) two children.",
            "answers": [
              "has"
            ],
            "explanation": "После she: has."
          },
          {
            "id": "grammar-2-7",
            "type": "text",
            "prompt": "The shop ___ (close) at ten.",
            "answers": [
              "closes"
            ],
            "explanation": "close → closes."
          },
          {
            "id": "grammar-2-8",
            "type": "text",
            "prompt": "They ___ (watch) TV in the evening.",
            "answers": [
              "watch"
            ],
            "explanation": "После they: watch."
          }
        ]
      },
      {
        "id": "grammar-exercise-3",
        "difficulty": "3 · Средне",
        "title": "Утверждение, отрицание или вопрос",
        "instruction": "Выберите правильное полное предложение.",
        "items": [
          {
            "id": "grammar-3-1",
            "type": "single",
            "prompt": "Она не работает по пятницам.",
            "options": [
              "She doesn't work on Fridays.",
              "She doesn't works on Fridays.",
              "She don't work on Fridays."
            ],
            "answer": "She doesn't work on Fridays.",
            "explanation": "doesn't + work."
          },
          {
            "id": "grammar-3-2",
            "type": "single",
            "prompt": "Ты говоришь по-английски?",
            "options": [
              "Do you speak English?",
              "Does you speak English?",
              "You speak English?"
            ],
            "answer": "Do you speak English?",
            "explanation": "Вопрос с you начинается с Do."
          },
          {
            "id": "grammar-3-3",
            "type": "single",
            "prompt": "Он живёт рядом?",
            "options": [
              "Do he live near here?",
              "Does he lives near here?",
              "Does he live near here?"
            ],
            "answer": "Does he live near here?",
            "explanation": "Does he live...?"
          },
          {
            "id": "grammar-3-4",
            "type": "single",
            "prompt": "Мы не пьём кофе.",
            "options": [
              "We don't drink coffee.",
              "We doesn't drink coffee.",
              "We don't drinks coffee."
            ],
            "answer": "We don't drink coffee.",
            "explanation": "We don't drink."
          },
          {
            "id": "grammar-3-5",
            "type": "single",
            "prompt": "Компания открывается в восемь.",
            "options": [
              "The company open at eight.",
              "The company opens at eight.",
              "The company opening at eight."
            ],
            "answer": "The company opens at eight.",
            "explanation": "The company = it: opens."
          },
          {
            "id": "grammar-3-6",
            "type": "single",
            "prompt": "Анна работает дома?",
            "options": [
              "Does Anna work from home?",
              "Do Anna work from home?",
              "Does Anna works from home?"
            ],
            "answer": "Does Anna work from home?",
            "explanation": "Does Anna work...?"
          }
        ]
      },
      {
        "id": "grammar-exercise-4",
        "difficulty": "4 · Сложнее",
        "title": "Исправьте ошибку",
        "instruction": "Перепишите каждое предложение правильно.",
        "items": [
          {
            "id": "grammar-4-1",
            "type": "text",
            "prompt": "He work in an office.",
            "answers": [
              "He works in an office"
            ],
            "explanation": "He works in an office."
          },
          {
            "id": "grammar-4-2",
            "type": "text",
            "prompt": "She don't drink coffee.",
            "answers": [
              "She doesn't drink coffee",
              "She does not drink coffee"
            ],
            "explanation": "She doesn't drink coffee."
          },
          {
            "id": "grammar-4-3",
            "type": "text",
            "prompt": "Does Anna lives here?",
            "answers": [
              "Does Anna live here"
            ],
            "explanation": "После Does: live."
          },
          {
            "id": "grammar-4-4",
            "type": "text",
            "prompt": "My brother study English.",
            "answers": [
              "My brother studies English"
            ],
            "explanation": "My brother = he: studies."
          },
          {
            "id": "grammar-4-5",
            "type": "text",
            "prompt": "Tom doesn't goes to work by car.",
            "answers": [
              "Tom doesn't go to work by car",
              "Tom does not go to work by car"
            ],
            "explanation": "После doesn't: go."
          },
          {
            "id": "grammar-4-6",
            "type": "text",
            "prompt": "Do he work on Saturdays?",
            "answers": [
              "Does he work on Saturdays"
            ],
            "explanation": "С he используем Does."
          }
        ]
      },
      {
        "id": "grammar-exercise-5",
        "difficulty": "5 · Самостоятельно",
        "title": "Составьте предложения самостоятельно",
        "instruction": "Переведите или преобразуйте предложение. Пишите полную форму.",
        "items": [
          {
            "id": "grammar-5-1",
            "type": "translate",
            "prompt": "Я работаю дома по пятницам.",
            "answers": [
              "I work from home on Fridays",
              "I work at home on Fridays"
            ],
            "explanation": "I work from home on Fridays."
          },
          {
            "id": "grammar-5-2",
            "type": "translate",
            "prompt": "Она обычно начинает работу в девять.",
            "answers": [
              "She usually starts work at nine",
              "She usually starts work at nine o'clock"
            ],
            "explanation": "She usually starts work at nine."
          },
          {
            "id": "grammar-5-3",
            "type": "translate",
            "prompt": "Он не работает по выходным.",
            "answers": [
              "He doesn't work at weekends",
              "He does not work at weekends",
              "He doesn't work on weekends",
              "He does not work on weekends",
              "He doesn't work at the weekend",
              "He does not work at the weekend"
            ],
            "explanation": "He doesn't work at weekends."
          },
          {
            "id": "grammar-5-4",
            "type": "translate",
            "prompt": "Мы не смотрим телевизор утром.",
            "answers": [
              "We don't watch TV in the morning",
              "We do not watch TV in the morning",
              "We don't watch television in the morning",
              "We do not watch television in the morning"
            ],
            "explanation": "We don't watch TV in the morning."
          },
          {
            "id": "grammar-5-5",
            "type": "translate",
            "prompt": "Ты живёшь рядом с офисом?",
            "answers": [
              "Do you live near the office"
            ],
            "explanation": "Do you live near the office?"
          },
          {
            "id": "grammar-5-6",
            "type": "translate",
            "prompt": "Она говорит по-английски?",
            "answers": [
              "Does she speak English"
            ],
            "explanation": "Does she speak English?"
          },
          {
            "id": "grammar-5-7",
            "type": "text",
            "prompt": "Составьте вопрос к ответу: Yes, he does. — He works in a bank.",
            "answers": [
              "Does he work in a bank"
            ],
            "explanation": "Does he work in a bank?"
          },
          {
            "id": "grammar-5-8",
            "type": "text",
            "prompt": "Сделайте отрицание: Maria studies French.",
            "answers": [
              "Maria doesn't study French",
              "Maria does not study French"
            ],
            "explanation": "Maria doesn't study French. После doesn't: study."
          }
        ]
      }
    ],
    "page": "grammar-topic.html?id=grammar-1",
    "overview": [
      {
        "label": "Когда",
        "value": "Привычки, регулярные действия, факты и расписание"
      },
      {
        "label": "Утверждение",
        "value": "I/you/we/they work · he/she/it works"
      },
      {
        "label": "Отрицание",
        "value": "don’t / doesn’t + глагол без -s"
      },
      {
        "label": "Вопрос",
        "value": "Do / Does + подлежащее + глагол?"
      }
    ]
  }
];
