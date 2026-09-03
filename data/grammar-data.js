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
  },
  {
    "id": "grammar-2",
    "number": 2,
    "title": "Verb be: he, she, it — statements and questions",
    "subtitle": "He’s, she’s, it’s, isn’t, Is…? and short answers",
    "status": "available",
    "linkedLessonId": "lesson-2",
    "notification": {
      "enabled": false,
      "version": 1
    },
    "overview": [
      {
        "label": "Утверждение",
        "value": "He is / She is / It is → He’s / She’s / It’s"
      },
      {
        "label": "Отрицание",
        "value": "He isn’t / She isn’t / It isn’t"
      },
      {
        "label": "Вопрос",
        "value": "Is + he / she / it + … ?"
      },
      {
        "label": "Короткий ответ",
        "value": "Yes, … is. / No, … isn’t."
      }
    ],
    "explanation": [
      {
        "label": "Главная идея",
        "title": "Глагол be связывает человека или место с информацией",
        "summary": "В этом уроке форма is помогает сказать, кто человек, откуда он или где находится место. В русском языке слово «есть» обычно не произносится, а в английском is обязательно.",
        "formula": "he / she / it + is + information",
        "points": [
          "He и she используем для людей: he — он, she — она.",
          "It используем для города, страны, предмета или животного, когда пол не важен.",
          "После имени человека или названия места также используем is: Paulo is…, Naples is…"
        ],
        "examples": [
          {
            "en": "He is from Brazil.",
            "ru": "Он из Бразилии."
          },
          {
            "en": "She is in the Monday class.",
            "ru": "Она в группе по понедельникам."
          },
          {
            "en": "It is in Switzerland.",
            "ru": "Это находится в Швейцарии."
          }
        ],
        "tip": "Сначала определите, о ком или о чём говорится: мужчина → he, женщина → she, место или предмет → it."
      },
      {
        "label": "Местоимения",
        "title": "Как выбрать he, she или it",
        "summary": "Правильное местоимение помогает выбрать форму ответа и не повторять имя или название несколько раз.",
        "table": {
          "headers": [
            "О ком / о чём",
            "Местоимение",
            "Пример"
          ],
          "rows": [
            [
              "мужчина или мальчик",
              "he",
              "Paulo → he"
            ],
            [
              "женщина или девочка",
              "she",
              "Yasmin → she"
            ],
            [
              "город, страна, место или предмет",
              "it",
              "Oaxaca → it"
            ]
          ]
        },
        "examples": [
          {
            "en": "Paulo is from Spain. He is from Spain.",
            "ru": "Пауло из Испании. Он из Испании."
          },
          {
            "en": "Yasmin is in the class. She is in the class.",
            "ru": "Ясмин в группе. Она в группе."
          },
          {
            "en": "Oaxaca is in Mexico. It is in Mexico.",
            "ru": "Оахака находится в Мексике. Она находится в Мексике."
          }
        ],
        "warning": "Для города по-английски используем it, а не he или she."
      },
      {
        "label": "Утверждение",
        "title": "Полная и короткая формы: is и ’s",
        "summary": "В разговоре и обычном тексте is часто сокращается до ’s. Смысл не меняется.",
        "formula": [
          "He is → He’s",
          "She is → She’s",
          "It is → It’s",
          "Paulo is → Paulo’s"
        ],
        "table": {
          "headers": [
            "Полная форма",
            "Сокращённая форма",
            "Пример"
          ],
          "rows": [
            [
              "He is",
              "He’s",
              "He’s from Germany."
            ],
            [
              "She is",
              "She’s",
              "She’s from Japan."
            ],
            [
              "It is",
              "It’s",
              "It’s in France."
            ],
            [
              "Anna is",
              "Anna’s",
              "Anna’s in the Tuesday class."
            ]
          ]
        },
        "points": [
          "’s в этих предложениях означает is.",
          "Апостроф ставится на месте пропущенной буквы i: is → ’s.",
          "Полная и сокращённая формы одинаково правильные."
        ],
        "tip": "Чтобы проверить ’s, раскройте сокращение: She’s from Italy → She is from Italy."
      },
      {
        "label": "Отрицание",
        "title": "Как сказать «не»: is not и isn’t",
        "summary": "Для отрицания добавьте not после is. Обычная короткая форма — isn’t.",
        "formula": "he / she / it + isn’t + information",
        "table": {
          "headers": [
            "Утверждение",
            "Отрицание"
          ],
          "rows": [
            [
              "She is from Mexico.",
              "She isn’t from Mexico."
            ],
            [
              "He is in the Monday class.",
              "He isn’t in the Monday class."
            ],
            [
              "It is in Turkey.",
              "It isn’t in Turkey."
            ]
          ]
        },
        "points": [
          "isn’t = is not.",
          "После isn’t не добавляйте ещё одно is.",
          "В отрицательных пропусках этого урока используйте isn’t. Форма She’s not тоже возможна в английском, но она не подходит к пропуску, где требуется isn’t."
        ],
        "warning": "Неправильно: It isn’t is in France. Правильно: It isn’t in France."
      },
      {
        "label": "Вопрос",
        "title": "В вопросе поставьте Is в начало",
        "summary": "Чтобы сделать общий вопрос, поменяйте местами is и подлежащее.",
        "formula": "Is + he / she / it / name / place + information?",
        "table": {
          "headers": [
            "Утверждение",
            "Вопрос"
          ],
          "rows": [
            [
              "She is from Mexico.",
              "Is she from Mexico?"
            ],
            [
              "He is from England.",
              "Is he from England?"
            ],
            [
              "Naples is in Turkey.",
              "Is Naples in Turkey?"
            ]
          ]
        },
        "steps": [
          {
            "title": "Найдите is",
            "text": "В утверждении is стоит после человека или места."
          },
          {
            "title": "Перенесите is в начало",
            "text": "Is she…? Is Naples…?"
          },
          {
            "title": "Оставьте остальную часть без изменений",
            "text": "from Mexico / in Turkey."
          },
          {
            "title": "Поставьте вопросительный знак",
            "text": "Is she from Mexico?"
          }
        ],
        "tip": "В вопросе не используйте do или does: Is he from Spain?"
      },
      {
        "label": "Короткий ответ",
        "title": "Yes, she is. / No, she isn’t.",
        "summary": "В коротком ответе повторите местоимение и форму be. Полное предложение повторять не нужно.",
        "table": {
          "headers": [
            "Вопрос",
            "Положительный ответ",
            "Отрицательный ответ"
          ],
          "rows": [
            [
              "Is he from Spain?",
              "Yes, he is.",
              "No, he isn’t."
            ],
            [
              "Is she from Mexico?",
              "Yes, she is.",
              "No, she isn’t."
            ],
            [
              "Is it in France?",
              "Yes, it is.",
              "No, it isn’t."
            ]
          ]
        },
        "points": [
          "В положительном коротком ответе is не сокращается.",
          "Правильно: Yes, she is. Неправильно: Yes, she’s.",
          "В отрицательном ответе удобно использовать isn’t."
        ],
        "warning": "Имя заменяйте местоимением: Is Paulo from Spain? — Yes, he is."
      },
      {
        "label": "Предлоги",
        "title": "From — откуда; in — где находится",
        "summary": "From обычно связывает человека с его страной или городом. In показывает местонахождение города, места или предмета.",
        "table": {
          "headers": [
            "Слово",
            "Вопрос",
            "Пример"
          ],
          "rows": [
            [
              "from",
              "Откуда?",
              "She is from Italy."
            ],
            [
              "in",
              "Где?",
              "Rome is in Italy."
            ]
          ]
        },
        "examples": [
          {
            "en": "Is Gary Oldman from England?",
            "ru": "Гэри Олдман из Англии?"
          },
          {
            "en": "Is Geneva in France?",
            "ru": "Женева находится во Франции?"
          }
        ],
        "tip": "Человек is from a place. Город или место is in a country."
      },
      {
        "label": "О себе",
        "title": "Are you from…? и Where are you from?",
        "summary": "В последней части упражнения нужно ответить о себе. С you используется are, а не is.",
        "formula": [
          "Are you from England?",
          "Where are you from?",
          "Where is it?"
        ],
        "table": {
          "headers": [
            "Вопрос",
            "Пример ответа"
          ],
          "rows": [
            [
              "Are you from England?",
              "No, I’m not."
            ],
            [
              "Where are you from?",
              "I’m from Russia."
            ],
            [
              "Where is it?",
              "It’s in Europe."
            ]
          ]
        },
        "points": [
          "Are you…? — вопрос к собеседнику.",
          "Where are you from? — вопрос о городе или стране происхождения.",
          "Where is it? — вопрос о местонахождении города или страны."
        ],
        "warning": "С you используйте are: Where are you from? Не Where is you from?"
      },
      {
        "label": "Алгоритм",
        "title": "Как выполнить задания 2a–2d",
        "summary": "Для каждого пропуска или вопроса проходите одну короткую проверку.",
        "steps": [
          {
            "title": "Определите, кто или что",
            "text": "Мужчина — he, женщина — she, место или предмет — it."
          },
          {
            "title": "Определите тип предложения",
            "text": "Это утверждение, отрицание или вопрос?"
          },
          {
            "title": "Выберите форму",
            "text": "is / ’s для утверждения, isn’t для отрицания, Is…? для вопроса."
          },
          {
            "title": "Проверьте from или in",
            "text": "Человек from a place; место in a country."
          },
          {
            "title": "Для короткого ответа замените имя",
            "text": "Paulo → he, Yasmin → she, Oaxaca → it."
          }
        ],
        "formula": "She’s from Spain. → Is she from Spain? → Yes, she is. / No, she isn’t."
      }
    ],
    "commonMistakes": [
      {
        "wrong": "She from Italy.",
        "right": "She is from Italy.",
        "reason": "В английском предложении нужна форма be."
      },
      {
        "wrong": "He’s is from Germany.",
        "right": "He’s from Germany.",
        "reason": "He’s уже означает He is."
      },
      {
        "wrong": "It don’t in France.",
        "right": "It isn’t in France.",
        "reason": "С глаголом be используем isn’t, а не don’t."
      },
      {
        "wrong": "Does she from Mexico?",
        "right": "Is she from Mexico?",
        "reason": "Вопрос с be начинается с Is."
      },
      {
        "wrong": "Yes, she’s.",
        "right": "Yes, she is.",
        "reason": "В положительном коротком ответе is не сокращается."
      },
      {
        "wrong": "Is Naples from Italy?",
        "right": "Is Naples in Italy?",
        "reason": "Город находится in a country; человек is from a place."
      },
      {
        "wrong": "Where is you from?",
        "right": "Where are you from?",
        "reason": "С you используется are."
      }
    ],
    "exercises": [
      {
        "id": "grammar-2-exercise-1",
        "difficulty": "1 · Очень легко",
        "title": "He, she или it",
        "instruction": "Выберите правильное местоимение.",
        "items": [
          {
            "id": "g2-1-1",
            "type": "single",
            "prompt": "Paulo → ___",
            "options": [
              "he",
              "she",
              "it"
            ],
            "answer": "he",
            "explanation": "Paulo — мужчина: he."
          },
          {
            "id": "g2-1-2",
            "type": "single",
            "prompt": "Yasmin → ___",
            "options": [
              "he",
              "she",
              "it"
            ],
            "answer": "she",
            "explanation": "Yasmin — женщина: she."
          },
          {
            "id": "g2-1-3",
            "type": "single",
            "prompt": "Oaxaca → ___",
            "options": [
              "he",
              "she",
              "it"
            ],
            "answer": "it",
            "explanation": "Oaxaca — город: it."
          },
          {
            "id": "g2-1-4",
            "type": "single",
            "prompt": "Robert Downey Jr → ___",
            "options": [
              "he",
              "she",
              "it"
            ],
            "answer": "he",
            "explanation": "Robert Downey Jr — мужчина: he."
          },
          {
            "id": "g2-1-5",
            "type": "single",
            "prompt": "Salma Hayek → ___",
            "options": [
              "he",
              "she",
              "it"
            ],
            "answer": "she",
            "explanation": "Salma Hayek — женщина: she."
          },
          {
            "id": "g2-1-6",
            "type": "single",
            "prompt": "the Louvre → ___",
            "options": [
              "he",
              "she",
              "it"
            ],
            "answer": "it",
            "explanation": "The Louvre — место: it."
          }
        ]
      },
      {
        "id": "grammar-2-exercise-2",
        "difficulty": "2 · Легко",
        "title": "Is, ’s или isn’t",
        "instruction": "Выберите форму, которая правильно завершает предложение.",
        "items": [
          {
            "id": "g2-2-1",
            "type": "single",
            "prompt": "She ___ from Japan.",
            "options": [
              "is",
              "isn’t",
              "are"
            ],
            "answer": "is",
            "explanation": "Утверждение с she: is."
          },
          {
            "id": "g2-2-2",
            "type": "single",
            "prompt": "He___ from Germany.",
            "options": [
              "'s",
              "'re",
              "n't"
            ],
            "answer": "'s",
            "explanation": "He’s = He is."
          },
          {
            "id": "g2-2-3",
            "type": "single",
            "prompt": "It ___ in France.",
            "options": [
              "is",
              "are",
              "am"
            ],
            "answer": "is",
            "explanation": "С it используется is."
          },
          {
            "id": "g2-2-4",
            "type": "single",
            "prompt": "No, she ___.",
            "options": [
              "is",
              "isn’t",
              "'s"
            ],
            "answer": "isn’t",
            "explanation": "Отрицательный короткий ответ: she isn’t."
          },
          {
            "id": "g2-2-5",
            "type": "single",
            "prompt": "Paulo___ from Spain.",
            "options": [
              "'s",
              "'m",
              "'re"
            ],
            "answer": "'s",
            "explanation": "Paulo’s = Paulo is."
          },
          {
            "id": "g2-2-6",
            "type": "single",
            "prompt": "No, it ___. It’s in Italy.",
            "options": [
              "is",
              "isn’t",
              "'s"
            ],
            "answer": "isn’t",
            "explanation": "Отрицание с it: isn’t."
          },
          {
            "id": "g2-2-7",
            "type": "single",
            "prompt": "She___ in the Tuesday class.",
            "options": [
              "'s",
              "'re",
              "'m"
            ],
            "answer": "'s",
            "explanation": "She’s = She is."
          },
          {
            "id": "g2-2-8",
            "type": "single",
            "prompt": "It___ Anna.",
            "options": [
              "'s",
              "'re",
              "'m"
            ],
            "answer": "'s",
            "explanation": "It’s = It is."
          }
        ]
      },
      {
        "id": "grammar-2-exercise-3",
        "difficulty": "3 · Средне",
        "title": "Составьте вопрос и короткий ответ",
        "instruction": "Выберите правильный вариант.",
        "items": [
          {
            "id": "g2-3-1",
            "type": "single",
            "prompt": "___ she from Mexico?",
            "options": [
              "Is",
              "Does",
              "Are"
            ],
            "answer": "Is",
            "explanation": "Вопрос с she и be начинается с Is."
          },
          {
            "id": "g2-3-2",
            "type": "single",
            "prompt": "Is Gary Oldman from England? — Yes, ___.",
            "options": [
              "he is",
              "he’s",
              "he does"
            ],
            "answer": "he is",
            "explanation": "Положительный короткий ответ: he is."
          },
          {
            "id": "g2-3-3",
            "type": "single",
            "prompt": "___ Naples in Turkey?",
            "options": [
              "Is",
              "Does",
              "Are"
            ],
            "answer": "Is",
            "explanation": "Naples = it; вопрос начинается с Is."
          },
          {
            "id": "g2-3-4",
            "type": "single",
            "prompt": "Is Geneva in France? — No, ___.",
            "options": [
              "it isn’t",
              "it’s",
              "it doesn’t"
            ],
            "answer": "it isn’t",
            "explanation": "Отрицательный короткий ответ: it isn’t."
          },
          {
            "id": "g2-3-5",
            "type": "single",
            "prompt": "Is Javier Bardem from Spain? — Yes, ___.",
            "options": [
              "he is",
              "she is",
              "it is"
            ],
            "answer": "he is",
            "explanation": "Javier Bardem = he."
          },
          {
            "id": "g2-3-6",
            "type": "single",
            "prompt": "Is Salma Hayek from Mexico? — Yes, ___.",
            "options": [
              "she is",
              "he is",
              "it is"
            ],
            "answer": "she is",
            "explanation": "Salma Hayek = she."
          },
          {
            "id": "g2-3-7",
            "type": "single",
            "prompt": "___ the Louvre in Italy?",
            "options": [
              "Is",
              "Are",
              "Does"
            ],
            "answer": "Is",
            "explanation": "The Louvre = it; используем Is."
          },
          {
            "id": "g2-3-8",
            "type": "single",
            "prompt": "Is Lublin in Russia? — No, ___.",
            "options": [
              "it isn’t",
              "he isn’t",
              "she isn’t"
            ],
            "answer": "it isn’t",
            "explanation": "Lublin — город: it isn’t."
          }
        ]
      },
      {
        "id": "grammar-2-exercise-4",
        "difficulty": "4 · Сложнее",
        "title": "From или in",
        "instruction": "Выберите правильный предлог.",
        "items": [
          {
            "id": "g2-4-1",
            "type": "single",
            "prompt": "She is ___ Brazil.",
            "options": [
              "from",
              "in"
            ],
            "answer": "from",
            "explanation": "Человек is from a country."
          },
          {
            "id": "g2-4-2",
            "type": "single",
            "prompt": "Rio is ___ Brazil.",
            "options": [
              "from",
              "in"
            ],
            "answer": "in",
            "explanation": "Город is in a country."
          },
          {
            "id": "g2-4-3",
            "type": "single",
            "prompt": "He is ___ England.",
            "options": [
              "from",
              "in"
            ],
            "answer": "from",
            "explanation": "Человек is from a place."
          },
          {
            "id": "g2-4-4",
            "type": "single",
            "prompt": "London is ___ England.",
            "options": [
              "from",
              "in"
            ],
            "answer": "in",
            "explanation": "Город is in a country."
          },
          {
            "id": "g2-4-5",
            "type": "single",
            "prompt": "Is she ___ Mexico?",
            "options": [
              "from",
              "in"
            ],
            "answer": "from",
            "explanation": "Вопрос о происхождении человека: from."
          },
          {
            "id": "g2-4-6",
            "type": "single",
            "prompt": "Is it ___ Switzerland?",
            "options": [
              "from",
              "in"
            ],
            "answer": "in",
            "explanation": "Вопрос о местонахождении: in."
          }
        ]
      },
      {
        "id": "grammar-2-exercise-5",
        "difficulty": "5 · Самостоятельно",
        "title": "Напишите полное предложение",
        "instruction": "Напишите вопрос, ответ или исправленное предложение.",
        "items": [
          {
            "id": "g2-5-1",
            "type": "text",
            "prompt": "Сделайте сокращение: She is from Italy.",
            "answers": [
              "She's from Italy"
            ],
            "explanation": "She’s from Italy."
          },
          {
            "id": "g2-5-2",
            "type": "text",
            "prompt": "Сделайте отрицание: It is in Turkey.",
            "answers": [
              "It isn't in Turkey",
              "It is not in Turkey"
            ],
            "explanation": "It isn’t in Turkey."
          },
          {
            "id": "g2-5-3",
            "type": "text",
            "prompt": "Составьте вопрос: He is from England.",
            "answers": [
              "Is he from England"
            ],
            "explanation": "Is he from England?"
          },
          {
            "id": "g2-5-4",
            "type": "text",
            "prompt": "Дайте короткий ответ: Is she from Mexico? (да)",
            "answers": [
              "Yes, she is"
            ],
            "explanation": "Yes, she is."
          },
          {
            "id": "g2-5-5",
            "type": "text",
            "prompt": "Дайте короткий ответ: Is it in France? (нет)",
            "answers": [
              "No, it isn't",
              "No, it is not"
            ],
            "explanation": "No, it isn’t."
          },
          {
            "id": "g2-5-6",
            "type": "text",
            "prompt": "Исправьте: Does he from Spain?",
            "answers": [
              "Is he from Spain"
            ],
            "explanation": "Is he from Spain?"
          },
          {
            "id": "g2-5-7",
            "type": "text",
            "prompt": "Исправьте: Yes, she’s.",
            "answers": [
              "Yes, she is"
            ],
            "explanation": "Yes, she is."
          },
          {
            "id": "g2-5-8",
            "type": "text",
            "prompt": "Напишите вопрос: Откуда ты?",
            "answers": [
              "Where are you from"
            ],
            "explanation": "Where are you from?"
          }
        ]
      }
    ],
    "page": "grammar-topic.html?id=grammar-2"
  }
  ,{
    "id": "grammar-3",
    "number": 3,
    "title": "Verb be (plural): we, you, they",
    "subtitle": "We’re, you’re, they’re, aren’t, Are…? and short answers",
    "status": "available",
    "linkedLessonId": "lesson-5",
    "passScore": 100,
    "lockOnPass": true,
    "checkButtonLabel": "Проверить",
    "notification": {"enabled": false, "version": 1},
    "overview": [
      {"label":"Утверждение","value":"We are / You are / They are → We’re / You’re / They’re"},
      {"label":"Отрицание","value":"We aren’t / You aren’t / They aren’t"},
      {"label":"Вопрос","value":"Are + we / you / they + … ?"},
      {"label":"Короткий ответ","value":"Yes, … are. / No, … aren’t."}
    ],
    "explanation": [
      {
        "label":"Главная идея",
        "title":"С we, you и they используется are",
        "summary":"Глагол be помогает сказать, кто мы или они, откуда люди, где они находятся и в каком состоянии. С местоимениями we, you и they нужна форма are.",
        "formula":"we / you / they + are + information",
        "points":[
          "we — мы; you — ты / вы; they — они.",
          "Are связывает подлежащее с национальностью, местом, классом, состоянием или другой информацией.",
          "В русском языке отдельное слово «есть» обычно не произносится, но в английском are нельзя пропускать."
        ],
        "examples":[
          {"en":"We are from Spain.","ru":"Мы из Испании."},
          {"en":"You are in class 3.","ru":"Вы в классе 3."},
          {"en":"They are Chinese.","ru":"Они китайцы / китайские."}
        ],
        "warning":"Неправильно: They from England. Правильно: They are from England."
      },
      {
        "label":"Утверждение",
        "title":"Сокращения: we’re, you’re, they’re",
        "summary":"В разговорной речи и обычном письме are часто сокращается до ’re.",
        "formula":["We are → We’re","You are → You’re","They are → They’re"],
        "table":{
          "headers":["Полная форма","Сокращённая форма","Пример"],
          "rows":[
            ["We are","We’re","We’re from Mexico."],
            ["You are","You’re","You’re teachers."],
            ["They are","They’re","They’re from Egypt."]
          ]
        },
        "points":[
          "Апостроф показывает, что часть слова are пропущена.",
          "После имени нескольких людей тоже можно заменить их на they: Sara and Mikel are… → They’re…",
          "Jake and I → we: Jake and I are here. → We’re here."
        ]
      },
      {
        "label":"Отрицание",
        "title":"Are not → aren’t",
        "summary":"Для отрицания добавьте not после are. Обычная сокращённая форма — aren’t.",
        "formula":"we / you / they + aren’t + information",
        "table":{
          "headers":["Утверждение","Отрицание"],
          "rows":[
            ["We’re from Spain.","We aren’t from Italy."],
            ["You’re in class 3.","You aren’t in class 2."],
            ["They’re Chinese.","They aren’t Japanese."]
          ]
        },
        "points":[
          "aren’t = are not.",
          "После aren’t не добавляйте ещё одно are.",
          "С I отрицание другое: I’m not. С he / she / it используется isn’t."
        ],
        "warning":"Неправильно: They aren’t are from Turkey. Правильно: They aren’t from Turkey."
      },
      {
        "label":"Вопрос",
        "title":"В вопросе Are ставится перед подлежащим",
        "summary":"Чтобы сделать общий вопрос с we, you или they, поставьте Are в начало предложения.",
        "formula":"Are + we / you / they + information?",
        "table":{
          "headers":["Утверждение","Вопрос"],
          "rows":[
            ["They are in class 1.","Are they in class 1?"],
            ["They are from England.","Are they from England?"],
            ["You are on holiday.","Are you on holiday?"]
          ]
        },
        "steps":[
          {"title":"Найдите are","text":"В утверждении are стоит после we, you или they."},
          {"title":"Перенесите are в начало","text":"They are… → Are they…?"},
          {"title":"Оставьте остальную часть","text":"from England / in class 1 / on holiday."},
          {"title":"Поставьте вопросительный знак","text":"Are they from England?"}
        ],
        "warning":"С глаголом be не используйте do: Are they from England? Не Do they are from England?"
      },
      {
        "label":"Короткие ответы",
        "title":"Yes, they are. / No, they aren’t.",
        "summary":"В коротком ответе повторите местоимение и форму be. После Yes используйте полную форму are; после No удобно использовать aren’t.",
        "table":{
          "headers":["Вопрос","Да","Нет"],
          "rows":[
            ["Are they in class 1?","Yes, they are.","No, they aren’t."],
            ["Are you on holiday?","Yes, we are.","No, we aren’t."],
            ["Are we in room 4?","Yes, we are.","No, we aren’t."]
          ]
        },
        "points":[
          "В положительном коротком ответе are не сокращается: Yes, they are.",
          "Если вопрос Are you…? задан группе людей, они могут отвечать We are / We aren’t.",
          "Не повторяйте всю информацию, если нужен короткий ответ."
        ],
        "warning":"Неправильно: Yes, they’re. Правильно: Yes, they are."
      },
      {
        "label":"Wh-вопрос",
        "title":"Where are you from?",
        "summary":"Если нужен не ответ yes/no, а информация о месте, вопросительное слово Where ставится перед are.",
        "formula":"Where + are + you / we / they + from?",
        "examples":[
          {"en":"Where are you from? — We’re from Spain.","ru":"Откуда вы? — Мы из Испании."},
          {"en":"Where are they from? — They’re from London.","ru":"Откуда они? — Они из Лондона."}
        ],
        "tip":"Порядок слов сохраняется: Where are they from? Не Where they are from?"
      },
      {
        "label":"Сравнение форм",
        "title":"Не путайте am, is и are",
        "summary":"Форма be зависит от подлежащего. Это особенно важно в упражнениях, где вместе встречаются I, she, it, we, you и they.",
        "table":{
          "headers":["Подлежащее","Утверждение","Отрицание","Вопрос"],
          "rows":[
            ["I","I’m","I’m not","Am I…?"],
            ["he / she / it","he’s / she’s / it’s","isn’t","Is…?"],
            ["we / you / they","we’re / you’re / they’re","aren’t","Are…?"]
          ]
        },
        "tip":"Сначала найдите подлежащее, затем выберите am, is или are."
      }
    ],
    "commonMistakes": [
      {"wrong":"They is from England.","right":"They are from England.","reason":"С they используется are."},
      {"wrong":"We not are on holiday.","right":"We aren’t on holiday.","reason":"Not ставится после are; сокращение — aren’t."},
      {"wrong":"They’re not students?","right":"Aren’t they students?","reason":"В общем вопросе Are ставится перед подлежащим."},
      {"wrong":"Yes, they’re.","right":"Yes, they are.","reason":"В положительном коротком ответе are не сокращается."},
      {"wrong":"Where they are from?","right":"Where are they from?","reason":"После Where ставится are, затем подлежащее."}
    ],
    "exercises": [
      {
        "id":"grammar-3-exercise-1",
        "difficulty":"1 · Лёгкое",
        "title":"Выберите правильную форму be",
        "instruction":"Выберите один вариант.",
        "items":[
          {"id":"g3-1-1","type":"single","prompt":"We ___ from Spain.","options":["are","is","am"],"answer":"are","revealCorrect":false,"explanation":"Попробуйте ещё раз."},
          {"id":"g3-1-2","type":"single","prompt":"They ___ Chinese.","options":["are","is","am"],"answer":"are","revealCorrect":false,"explanation":"Попробуйте ещё раз."},
          {"id":"g3-1-3","type":"single","prompt":"You ___ in class 3.","options":["are","is","am"],"answer":"are","revealCorrect":false,"explanation":"Попробуйте ещё раз."},
          {"id":"g3-1-4","type":"single","prompt":"We ___ from Italy. (negative)","options":["aren’t","isn’t","am not"],"answer":"aren’t","revealCorrect":false,"explanation":"Попробуйте ещё раз."}
        ]
      },
      {
        "id":"grammar-3-exercise-2",
        "difficulty":"2 · Среднее",
        "title":"Напишите сокращённую форму",
        "instruction":"Перепишите предложение, используя сокращение.",
        "items":[
          {"id":"g3-2-1","type":"text","prompt":"We are from Mexico.","answers":["We’re from Mexico"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."},
          {"id":"g3-2-2","type":"text","prompt":"You are teachers.","answers":["You’re teachers"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."},
          {"id":"g3-2-3","type":"text","prompt":"They are from Egypt.","answers":["They’re from Egypt"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."},
          {"id":"g3-2-4","type":"text","prompt":"They are not Japanese.","answers":["They aren’t Japanese"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."}
        ]
      },
      {
        "id":"grammar-3-exercise-3",
        "difficulty":"3 · Повышенная сложность",
        "title":"Выберите вопрос или короткий ответ",
        "instruction":"Выберите вариант, который подходит по смыслу и грамматике.",
        "items":[
          {"id":"g3-3-1","type":"select","prompt":"___ they from England?","options":["Are","Is","Do"],"answer":"Are","revealCorrect":false,"explanation":"Попробуйте ещё раз."},
          {"id":"g3-3-2","type":"select","prompt":"Are they in class 1? — No, ___.","options":["they aren’t","they’re","they isn’t"],"answer":"they aren’t","revealCorrect":false,"explanation":"Попробуйте ещё раз."},
          {"id":"g3-3-3","type":"select","prompt":"Are you on holiday? — Yes, ___.","options":["we are","we’re","we is"],"answer":"we are","revealCorrect":false,"explanation":"Попробуйте ещё раз."},
          {"id":"g3-3-4","type":"select","prompt":"___ are they from? — They’re from London.","options":["Where","Are","What"],"answer":"Where","revealCorrect":false,"explanation":"Попробуйте ещё раз."}
        ]
      },
      {
        "id":"grammar-3-exercise-4",
        "difficulty":"4 · Самое сложное",
        "title":"Постройте предложение самостоятельно",
        "instruction":"Напишите полное предложение или вопрос.",
        "items":[
          {"id":"g3-4-1","type":"textarea","prompt":"Сделайте отрицание: We’re from Spain.","answers":["We aren’t from Spain"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."},
          {"id":"g3-4-2","type":"textarea","prompt":"Составьте вопрос: They are in class 2.","answers":["Are they in class 2"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."},
          {"id":"g3-4-3","type":"textarea","prompt":"Дайте короткий отрицательный ответ: Are they from Turkey?","answers":["No, they aren’t"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."},
          {"id":"g3-4-4","type":"textarea","prompt":"Спросите: «Откуда вы?»","answers":["Where are you from"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."}
        ]
      }
    ],
    "page":"grammar-topic.html?id=grammar-3"
  }
,
{
  "id": "grammar-4",
  "number": 4,
  "title": "Wh- and How questions with be",
  "subtitle": "Who, What, Where, When, Whose, How и How old с am / is / are",
  "status": "available",
  "linkedLessonId": "lesson-6",
  "passScore": 100,
  "lockOnPass": true,
  "checkButtonLabel": "Проверить",
  "notification": {
    "enabled": false,
    "version": 1
  },
  "overview": [
    {
      "label": "Порядок",
      "value": "Question word + am / is / are + subject + … ?"
    },
    {
      "label": "is → ’s",
      "value": "Who’s · What’s · Where’s · When’s · How old’s"
    },
    {
      "label": "are",
      "value": "Where are you…? · How are you?"
    },
    {
      "label": "Без do",
      "value": "С be не используются do / does"
    }
  ],
  "explanation": [
    {
      "label": "Главная идея",
      "title": "Wh- и How-вопросы с be спрашивают конкретную информацию",
      "summary": "Когда в предложении используется глагол be (am / is / are), вопросительное слово ставится перед формой be. Do / does не нужны.",
      "formula": "Question word + am / is / are + subject + … ?",
      "points": [
        "Who — кто; What — что / какой; Where — где / откуда; When — когда; Whose — чей; How — как; How old — сколько лет.",
        "После вопросительного слова выберите форму be по подлежащему: am с I, is с he/she/it и одним человеком или предметом, are с you/we/they и несколькими людьми.",
        "В вопросах Where … from? предлог from остаётся в конце."
      ],
      "examples": [
        {
          "en": "Where are you from?",
          "ru": "Откуда вы?"
        },
        {
          "en": "How old is Pedro?",
          "ru": "Сколько лет Педро?"
        },
        {
          "en": "When is the concert?",
          "ru": "Когда концерт?"
        }
      ],
      "warning": "Не используйте do / does с be: Where are you from? — не Where do you are from?"
    },
    {
      "label": "Утверждение и отрицание",
      "title": "Сначала уверенно выбирайте am / is / are",
      "summary": "Те же формы be работают в утверждениях и отрицаниях. Это помогает правильно построить вопрос.",
      "formula": [
        "I am / I’m · I’m not",
        "he / she / it is · isn’t",
        "you / we / they are · aren’t"
      ],
      "table": {
        "headers": [
          "Подлежащее",
          "Утверждение",
          "Отрицание"
        ],
        "rows": [
          [
            "I",
            "I’m 23.",
            "I’m not married."
          ],
          [
            "he / she / it",
            "She’s from Spain.",
            "She isn’t from Brazil."
          ],
          [
            "you / we / they",
            "They’re in Boston.",
            "They aren’t at home."
          ]
        ]
      },
      "examples": [
        {
          "en": "She’s 21.",
          "ru": "Ей 21."
        },
        {
          "en": "I’m not married. I’m single.",
          "ru": "Я не женат / не замужем. Я свободен / свободна."
        }
      ]
    },
    {
      "label": "Порядок слов",
      "title": "В вопросе форма be идёт перед подлежащим",
      "summary": "Возьмите обычное предложение, перенесите am / is / are перед подлежащим и, если нужна конкретная информация, добавьте вопросительное слово в самое начало.",
      "formula": [
        "She is from Spain. → Where is she from?",
        "They are in Boston. → Where are they?",
        "The concert is on Monday. → When is the concert?"
      ],
      "steps": [
        {
          "title": "Выберите вопросительное слово",
          "text": "Что нужно узнать: человека, место, время, возраст, принадлежность или состояние?"
        },
        {
          "title": "Поставьте be",
          "text": "После вопросительного слова поставьте am, is или are."
        },
        {
          "title": "Поставьте подлежащее",
          "text": "Where + is + she …? / Where + are + you …?"
        },
        {
          "title": "Добавьте оставшуюся часть",
          "text": "Where is she from? / What is your address?"
        }
      ]
    },
    {
      "label": "Сокращение ’s",
      "title": "is часто сокращается до ’s",
      "summary": "После Who, What, Where, When и How old форма is часто сокращается до ’s. В учебном материале используются формы Who’s, What’s, Where’s, When’s и How old’s.",
      "formula": [
        "Who is → Who’s",
        "What is → What’s",
        "Where is → Where’s",
        "When is → When’s",
        "How old is → How old’s"
      ],
      "examples": [
        {
          "en": "Who’s Sarah Lawson?",
          "ru": "Кто такая Сара Лоусон?"
        },
        {
          "en": "What’s your address?",
          "ru": "Какой у вас адрес?"
        },
        {
          "en": "Where’s she from?",
          "ru": "Откуда она?"
        },
        {
          "en": "When’s the concert?",
          "ru": "Когда концерт?"
        },
        {
          "en": "How old’s Pedro?",
          "ru": "Сколько лет Педро?"
        }
      ],
      "tip": "С you / we / they нужна форма are, поэтому: Where are you from? и How are you?"
    },
    {
      "label": "Whose",
      "title": "Whose спрашивает о принадлежности",
      "summary": "Whose означает «чей / чья / чьё / чьи». После него обычно стоит существительное, а затем вопрос с be.",
      "formula": "Whose + noun + am / is / are + subject + … ?",
      "examples": [
        {
          "en": "Whose class is she in?",
          "ru": "В чьей она группе?"
        },
        {
          "en": "Whose bag is this?",
          "ru": "Чья это сумка?"
        }
      ],
      "warning": "Who’s = who is («кто?»), а whose = «чей?». Они звучат одинаково, но пишутся и используются по-разному."
    },
    {
      "label": "How",
      "title": "How и How old задают разные вопросы",
      "summary": "How спрашивает о состоянии или способе, а How old — о возрасте.",
      "table": {
        "headers": [
          "Форма",
          "Значение",
          "Пример"
        ],
        "rows": [
          [
            "How are you?",
            "Как вы? / Как дела?",
            "I’m fine, thanks."
          ],
          [
            "How old are you?",
            "Сколько вам лет?",
            "I’m 23."
          ],
          [
            "How old is Pedro?",
            "Сколько лет Педро?",
            "He’s 27."
          ]
        ]
      },
      "warning": "Не говорите How many years are you? В обычном английском возраст спрашивают How old are you?"
    },
    {
      "label": "Общие вопросы",
      "title": "Если вопросительного слова нет, начинайте с be",
      "summary": "Для вопроса с ответом yes / no поставьте am / is / are перед подлежащим.",
      "formula": "Am / Is / Are + subject + … ?",
      "examples": [
        {
          "en": "Are you married? — No, I’m not.",
          "ru": "Вы женаты / замужем? — Нет."
        },
        {
          "en": "Is she from Spain? — Yes, she is.",
          "ru": "Она из Испании? — Да."
        }
      ],
      "points": [
        "В положительном коротком ответе не сокращайте is/are: Yes, she is.",
        "В отрицательном ответе возможны isn’t / aren’t или полные формы is not / are not."
      ]
    },
    {
      "label": "Типичные ошибки",
      "title": "Проверьте три вещи перед отправкой",
      "summary": "Главные ошибки — лишний do, неверная форма be и порядок слов как в утверждении.",
      "table": {
        "headers": [
          "Неправильно",
          "Правильно"
        ],
        "rows": [
          [
            "Where you are from?",
            "Where are you from?"
          ],
          [
            "Where does she is from?",
            "Where is she from?"
          ],
          [
            "How old are Pedro?",
            "How old is Pedro?"
          ],
          [
            "What are your address?",
            "What is / What’s your address?"
          ]
        ]
      },
      "tip": "Алгоритм: вопросительное слово → am/is/are → подлежащее → остальная часть."
    }
  ],
  "exercises": [
    {
      "id": "grammar-4-exercise-1",
      "difficulty": "1 · Лёгкое",
      "title": "Выберите правильное начало вопроса",
      "instruction": "Выберите один вариант.",
      "items": [
        {
          "id": "g4-1-1",
          "type": "single",
          "prompt": "___ the concert? — It’s on Monday.",
          "options": [
            "When’s",
            "Where’s",
            "How are"
          ],
          "answer": "When’s",
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        },
        {
          "id": "g4-1-2",
          "type": "single",
          "prompt": "___ she from? — She’s from Spain.",
          "options": [
            "Where’s",
            "What’s",
            "Who’s"
          ],
          "answer": "Where’s",
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        },
        {
          "id": "g4-1-3",
          "type": "single",
          "prompt": "___ you from? — I’m from Brazil.",
          "options": [
            "Where are",
            "Where is",
            "What are"
          ],
          "answer": "Where are",
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        },
        {
          "id": "g4-1-4",
          "type": "single",
          "prompt": "___ you? — I’m fine, thanks.",
          "options": [
            "How are",
            "How old are",
            "Where are"
          ],
          "answer": "How are",
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        }
      ]
    },
    {
      "id": "grammar-4-exercise-2",
      "difficulty": "2 · Среднее",
      "title": "Напишите вопрос по ответу",
      "instruction": "Напишите полный вопрос.",
      "items": [
        {
          "id": "g4-2-1",
          "type": "text",
          "prompt": "It’s 47 Bank Street.",
          "answers": [
            "What’s your address"
          ],
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        },
        {
          "id": "g4-2-2",
          "type": "text",
          "prompt": "He’s 27.",
          "answers": [
            "How old’s Pedro"
          ],
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        },
        {
          "id": "g4-2-3",
          "type": "text",
          "prompt": "They’re on holiday in Boston.",
          "answers": [
            "Where are Mari and Laura"
          ],
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        },
        {
          "id": "g4-2-4",
          "type": "text",
          "prompt": "No, I’m not. I’m single.",
          "answers": [
            "Are you married"
          ],
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        }
      ]
    },
    {
      "id": "grammar-4-exercise-3",
      "difficulty": "3 · Повышенная сложность",
      "title": "Выберите правильную структуру",
      "instruction": "Выберите грамматически правильный вопрос.",
      "items": [
        {
          "id": "g4-3-1",
          "type": "select",
          "prompt": "Спросите, откуда она.",
          "options": [
            "Where is she from?",
            "Where she is from?",
            "Where does she is from?"
          ],
          "answer": "Where is she from?",
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        },
        {
          "id": "g4-3-2",
          "type": "select",
          "prompt": "Спросите возраст человека.",
          "options": [
            "How old is he?",
            "How is old he?",
            "How many years is he?"
          ],
          "answer": "How old is he?",
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        },
        {
          "id": "g4-3-3",
          "type": "select",
          "prompt": "Спросите, чей это класс.",
          "options": [
            "Whose class is this?",
            "Who’s class is this?",
            "Whose is class this?"
          ],
          "answer": "Whose class is this?",
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        },
        {
          "id": "g4-3-4",
          "type": "select",
          "prompt": "Спросите, как дела у собеседника.",
          "options": [
            "How are you?",
            "How you are?",
            "What are you?"
          ],
          "answer": "How are you?",
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        }
      ]
    },
    {
      "id": "grammar-4-exercise-4",
      "difficulty": "4 · Самое сложное",
      "title": "Постройте вопрос самостоятельно",
      "instruction": "Напишите полный вопрос.",
      "items": [
        {
          "id": "g4-4-1",
          "type": "textarea",
          "prompt": "Спросите: «Какой у вас номер телефона?»",
          "answers": [
            "What’s your phone number",
            "What is your phone number"
          ],
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        },
        {
          "id": "g4-4-2",
          "type": "textarea",
          "prompt": "Спросите: «Какой у вас адрес электронной почты?»",
          "answers": [
            "What’s your email address",
            "What is your email address"
          ],
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        },
        {
          "id": "g4-4-3",
          "type": "textarea",
          "prompt": "Составьте вопрос к ответу: She’s from Spain.",
          "answers": [
            "Where’s she from",
            "Where is she from"
          ],
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        },
        {
          "id": "g4-4-4",
          "type": "textarea",
          "prompt": "Составьте вопрос к ответу: The concert is on Monday.",
          "answers": [
            "When’s the concert",
            "When is the concert"
          ],
          "revealCorrect": false,
          "explanation": "Попробуйте ещё раз."
        }
      ]
    }
  ],
  "page": "grammar-topic.html?id=grammar-4"
}
,
{
  "id": "grammar-5",
  "number": 5,
  "title": "Singular and plural nouns, a / an",
  "subtitle": "Артикли a / an и формы множественного числа",
  "status": "available",
  "linkedLessonId": "lesson-7",
  "passScore": 100,
  "lockOnPass": true,
  "checkButtonLabel": "Проверить",
  "notification": {"enabled":false,"version":1},
  "overview": [
    {"label":"Один предмет","value":"a camera · an umbrella"},
    {"label":"Несколько","value":"books · watches · cities"},
    {"label":"Вопрос","value":"What is it? · What are they?"},
    {"label":"Для зачёта","value":"16 правильных ответов из 16"}
  ],
  "explanation": [
    {
      "label":"a / an","title":"Выбирайте артикль по первому звуку следующего слова",
      "summary":"Перед одним исчисляемым существительным используйте a или an. A ставится перед согласным звуком, an — перед гласным.",
      "formula":"a + consonant sound · an + vowel sound",
      "points":["a camera, a book, a key","an umbrella, an email, an address","Артикль не используется перед существительным во множественном числе."],
      "examples":[{"en":"It’s a camera.","ru":"Это фотоаппарат."},{"en":"It’s an ID card.","ru":"Это удостоверение личности."}]
    },
    {
      "label":"Множественное число","title":"Обычно добавляйте -s",
      "summary":"Большинство существительных образует множественное число с помощью окончания -s.",
      "formula":"noun + s",
      "points":["book → books","camera → cameras","key → keys"],
      "warning":"После согласной + y буква y меняется на ies: city → cities, country → countries."
    },
    {
      "label":"Окончание -es","title":"После шипящих звуков добавляйте -es",
      "summary":"Слова на -s, -ss, -sh, -ch, -x обычно получают окончание -es.",
      "formula":"watch → watches · address → addresses",
      "examples":[{"en":"two watches","ru":"двое наручных часов"},{"en":"three addresses","ru":"три адреса"}]
    },
    {
      "label":"Вопросы","title":"Согласуйте вопрос и ответ с количеством предметов",
      "summary":"Для одного предмета используйте it, для нескольких — they.",
      "table":{"headers":["Количество","Вопрос","Ответ"],"rows":[["один","What is it?","It’s a photo."],["несколько","What are they?","They’re keys."]]},
      "tip":"It’s = it is; they’re = they are."
    }
  ],
  "exercises": [
    {
      "id":"grammar-5-exercise-1","difficulty":"1 · Базовый уровень","title":"Выберите a или an","instruction":"Выберите правильный артикль.",
      "items":[
        {"id":"g5-1-1","type":"select","prompt":"___ umbrella","options":["a","an"],"answer":"an","revealCorrect":false,"explanation":"Попробуйте ещё раз."},
        {"id":"g5-1-2","type":"select","prompt":"___ camera","options":["a","an"],"answer":"a","revealCorrect":false,"explanation":"Попробуйте ещё раз."},
        {"id":"g5-1-3","type":"select","prompt":"___ email","options":["a","an"],"answer":"an","revealCorrect":false,"explanation":"Попробуйте ещё раз."},
        {"id":"g5-1-4","type":"select","prompt":"___ debit card","options":["a","an"],"answer":"a","revealCorrect":false,"explanation":"Попробуйте ещё раз."}
      ]
    },
    {
      "id":"grammar-5-exercise-2","difficulty":"2 · Средний уровень","title":"Образуйте множественное число","instruction":"Напишите форму множественного числа.",
      "items":[
        {"id":"g5-2-1","type":"text","prompt":"book","answers":["books"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."},
        {"id":"g5-2-2","type":"text","prompt":"watch","answers":["watches"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."},
        {"id":"g5-2-3","type":"text","prompt":"city","answers":["cities"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."},
        {"id":"g5-2-4","type":"text","prompt":"address","answers":["addresses"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."}
      ]
    },
    {
      "id":"grammar-5-exercise-3","difficulty":"3 · Повышенная сложность","title":"It или they?","instruction":"Выберите правильную форму вопроса или ответа.",
      "items":[
        {"id":"g5-3-1","type":"select","prompt":"___ is it? — It’s a photo.","options":["What","What are","Where"],"answer":"What","revealCorrect":false,"explanation":"Попробуйте ещё раз."},
        {"id":"g5-3-2","type":"select","prompt":"What are they? — ___ keys.","options":["They’re","It’s","They"],"answer":"They’re","revealCorrect":false,"explanation":"Попробуйте ещё раз."},
        {"id":"g5-3-3","type":"select","prompt":"What is it? — ___ ID card.","options":["It’s an","It’s a","They’re an"],"answer":"It’s an","revealCorrect":false,"explanation":"Попробуйте ещё раз."},
        {"id":"g5-3-4","type":"select","prompt":"___ are they? — They’re coats.","options":["What","What is","Where is"],"answer":"What","revealCorrect":false,"explanation":"Попробуйте ещё раз."}
      ]
    },
    {
      "id":"grammar-5-exercise-4","difficulty":"4 · Самое сложное","title":"Напишите полный ответ","instruction":"Напишите вопрос или ответ полностью.",
      "items":[
        {"id":"g5-4-1","type":"textarea","prompt":"Спросите об одном предмете.","answers":["What is it","What’s it"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."},
        {"id":"g5-4-2","type":"textarea","prompt":"Ответьте: What is it? (an umbrella)","answers":["It’s an umbrella","It is an umbrella"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."},
        {"id":"g5-4-3","type":"textarea","prompt":"Спросите о нескольких предметах.","answers":["What are they"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."},
        {"id":"g5-4-4","type":"textarea","prompt":"Ответьте: What are they? (credit cards)","answers":["They’re credit cards","They are credit cards"],"revealCorrect":false,"explanation":"Попробуйте ещё раз."}
      ]
    }
  ],
  "page":"grammar-topic.html?id=grammar-5"
}

];
