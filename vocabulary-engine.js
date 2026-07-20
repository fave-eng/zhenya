(() => {
  'use strict';

  const safeText = (value, fallback = '') => value === undefined || value === null ? fallback : String(value);
  const escapeHtml = (value) => safeText(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const shuffled = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  };

  const speech = window.speechSynthesis;
  function speak(text, ctx) {
    if (!speech || typeof SpeechSynthesisUtterance === 'undefined') {
      ctx.toast('Озвучивание недоступно на этом устройстве.');
      return;
    }
    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(safeText(text).replace(/\s*\/\s*/g, ' or '));
    utterance.lang = 'en-GB';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    speech.speak(utterance);
  }

  function statusClass(status) {
    if (status === 'known') return 'known';
    if (status === 'difficult') return 'difficult';
    return '';
  }

  function statusLabel(status) {
    if (status === 'known') return 'Выучено';
    if (status === 'difficult') return 'Трудное';
    return 'Новое';
  }

  function renderAllWords(root, topic, ctx) {
    root.innerHTML = `<div class="words-grid">${topic.words.map((word) => {
      const state = ctx.progress.getVocabularyWord(word.wordKey) || {};
      return `<article class="card word-card ${statusClass(state.status)}" data-word-key="${escapeHtml(word.wordKey)}"><button class="pronounce-btn" type="button" data-speak="${escapeHtml(word.en)}" aria-label="Прослушать произношение">🔊</button><strong>${escapeHtml(word.en)}</strong><span class="translation">${escapeHtml(word.ru)}</span>${word.transcription ? `<span class="transcription">${escapeHtml(word.transcription)}</span>` : ''}${word.exampleEn ? `<p class="muted">${escapeHtml(word.exampleEn)}${word.exampleRu ? ` — ${escapeHtml(word.exampleRu)}` : ''}</p>` : ''}<div class="word-actions"><button class="word-action ${state.status === 'known' ? 'active-known' : ''}" type="button" data-status="known">✓ Знаю</button><button class="word-action ${state.status === 'difficult' ? 'active-difficult' : ''}" type="button" data-status="difficult">★ Трудное</button></div></article>`;
    }).join('')}</div>`;

    root.querySelectorAll('[data-speak]').forEach((button) => button.addEventListener('click', () => speak(button.dataset.speak, ctx)));
    root.querySelectorAll('[data-word-key]').forEach((card) => {
      card.querySelectorAll('[data-status]').forEach((button) => {
        button.addEventListener('click', async () => {
          const wordKey = card.dataset.wordKey;
          const current = ctx.progress.getVocabularyWord(wordKey) || {};
          const requested = button.dataset.status;
          const status = current.status === requested ? 'new' : requested;
          await ctx.progress.saveVocabularyWord({ word_key: wordKey, status, learned_at: status === 'known' ? (current.learned_at || new Date().toISOString()) : null, updated_at: new Date().toISOString() });
          renderAllWords(root, topic, ctx);
        });
      });
    });
  }

  function renderFlashcards(root, topic, ctx, difficultOnly = false) {
    const source = difficultOnly ? topic.words.filter((word) => ctx.progress.getVocabularyWord(word.wordKey)?.status === 'difficult') : topic.words;
    if (!source.length) {
      root.innerHTML = ctx.emptyState('✨', difficultOnly ? 'Трудных слов пока нет' : 'В теме пока нет слов', difficultOnly ? 'Отмечайте сложные слова кнопкой «Трудное».' : 'Слова появятся после урока.');
      return;
    }
    const queue = shuffled(source);
    let index = 0;
    let showTranslation = false;
    const draw = () => {
      const word = queue[index];
      const state = ctx.progress.getVocabularyWord(word.wordKey) || {};
      root.innerHTML = `<div class="flash-counter">Слово ${index + 1} из ${queue.length}</div><article class="card flashcard"><div><button class="pronounce-btn" id="flash-speak" type="button" aria-label="Прослушать произношение">🔊</button><div class="flash-word">${escapeHtml(word.en)}</div>${word.transcription ? `<p class="muted">${escapeHtml(word.transcription)}</p>` : ''}${showTranslation ? `<div class="flash-translation">${escapeHtml(word.ru)}</div>${word.exampleEn ? `<p class="flash-example">${escapeHtml(word.exampleEn)}${word.exampleRu ? ` — ${escapeHtml(word.exampleRu)}` : ''}</p>` : ''}` : '<p class="muted">Нажмите «Показать перевод».</p>'}</div></article><div class="flash-controls"><button class="btn btn-ghost" id="previous-word" type="button" ${index === 0 ? 'disabled' : ''}>← Назад</button><button class="btn btn-secondary" id="show-translation" type="button">${showTranslation ? 'Скрыть перевод' : 'Показать перевод'}</button><button class="btn btn-ghost" id="next-word" type="button" ${index === queue.length - 1 ? 'disabled' : ''}>Дальше →</button></div><div class="flash-controls"><button class="word-action ${state.status === 'known' ? 'active-known' : ''}" id="mark-known" type="button">✓ Знаю</button><button class="word-action ${state.status === 'difficult' ? 'active-difficult' : ''}" id="mark-difficult" type="button">★ Трудное</button></div>`;
      document.getElementById('flash-speak').addEventListener('click', () => speak(word.en, ctx));
      document.getElementById('show-translation').addEventListener('click', () => { showTranslation = !showTranslation; draw(); });
      document.getElementById('previous-word').addEventListener('click', () => { index = Math.max(0,index-1); showTranslation = false; draw(); });
      document.getElementById('next-word').addEventListener('click', () => { index = Math.min(queue.length-1,index+1); showTranslation = false; draw(); });
      document.getElementById('mark-known').addEventListener('click', async () => {
        await ctx.progress.saveVocabularyWord({ word_key: word.wordKey, status: state.status === 'known' ? 'new' : 'known', learned_at: state.status === 'known' ? null : (state.learned_at || new Date().toISOString()), updated_at: new Date().toISOString() });
        draw();
      });
      document.getElementById('mark-difficult').addEventListener('click', async () => {
        await ctx.progress.saveVocabularyWord({ word_key: word.wordKey, status: state.status === 'difficult' ? 'new' : 'difficult', learned_at: null, updated_at: new Date().toISOString() });
        draw();
      });
    };
    draw();
  }

  function renderTest(root, topic, ctx) {
    if (topic.words.length < 2) {
      root.innerHTML = ctx.emptyState('🧩','Для теста пока мало слов','Добавьте в тему минимум два слова.');
      return;
    }
    const queue = shuffled(topic.words);
    let index = 0;
    let correct = 0;
    const answers = {};
    const draw = () => {
      if (index >= queue.length) {
        const percent = Math.round((correct / queue.length) * 100);
        const completedAt = new Date().toISOString();
        ctx.progress.saveVocabularyTest(topic.id, { score: correct, total: queue.length, percent, answers, completedAt });
        root.innerHTML = `<article class="card empty-state"><div class="empty-state-icon">🏁</div><h3>Тест завершён</h3><p>Правильно: ${correct} из ${queue.length} (${percent}%).</p><div class="button-row" style="justify-content:center;margin-top:16px"><button class="btn btn-primary" id="restart-vocab-test" type="button">Пройти ещё раз</button></div></article>`;
        document.getElementById('restart-vocab-test').addEventListener('click', () => renderTest(root,topic,ctx));
        return;
      }
      const word = queue[index];
      const distractors = shuffled(topic.words.filter((item) => item.wordKey !== word.wordKey)).slice(0,3);
      const options = shuffled([word,...distractors]);
      root.innerHTML = `<div class="flash-counter">Вопрос ${index + 1} из ${queue.length}</div><article class="card flashcard"><div><div class="flash-word">${escapeHtml(word.en)}</div>${word.transcription ? `<p class="muted">${escapeHtml(word.transcription)}</p>` : ''}<div class="option-list" style="margin-top:20px">${options.map((option) => `<button class="quiz-option" type="button" data-answer="${escapeHtml(option.wordKey)}">${escapeHtml(option.ru)}</button>`).join('')}</div><div class="feedback" id="vocab-test-feedback"></div><div class="button-row" style="justify-content:center;margin-top:14px"><button class="btn btn-primary" id="next-vocab-question" type="button" disabled>Следующее слово</button></div></div></article>`;
      let answered = false;
      root.querySelectorAll('[data-answer]').forEach((button) => {
        button.addEventListener('click', async () => {
          if (answered) return;
          answered = true;
          const isRight = button.dataset.answer === word.wordKey;
          answers[word.wordKey] = { selected: button.dataset.answer, correct: isRight };
          if (isRight) correct += 1;
          root.querySelectorAll('[data-answer]').forEach((option) => {
            option.disabled = true;
            if (option.dataset.answer === word.wordKey) option.classList.add('correct');
          });
          if (!isRight) button.classList.add('wrong');
          const feedback = document.getElementById('vocab-test-feedback');
          feedback.className = `feedback show ${isRight ? 'good' : 'bad'}`;
          feedback.textContent = isRight ? 'Верно!' : `Правильный ответ: ${word.ru}`;
          await ctx.progress.saveVocabularyWord({ word_key: word.wordKey, status: isRight ? 'known' : 'difficult', learned_at: isRight ? new Date().toISOString() : null, updated_at: new Date().toISOString() });
          document.getElementById('next-vocab-question').disabled = false;
        });
      });
      document.getElementById('next-vocab-question').addEventListener('click', () => { index += 1; draw(); });
    };
    draw();
  }

  async function renderVocabularyPage(ctx) {
    const root = document.getElementById('vocabulary-root');
    const id = new URLSearchParams(location.search).get('id') || '';
    const topic = ctx.content.vocabulary.find((item) => item.id === id);
    if (!root) return;
    if (!topic) {
      root.innerHTML = ctx.emptyState('💥','Словарная тема не найдена','Вернитесь к списку тем.');
      return;
    }
    document.getElementById('vocabulary-hero-title').textContent = topic.title || 'Словарь';
    document.getElementById('vocabulary-hero-subtitle').textContent = `${topic.words.length} слов · ${topic.label || 'Тема урока'}`;
    root.innerHTML = `<div class="vocab-modes" id="vocab-modes"><button class="vocab-mode active" type="button" data-mode="all">Все слова</button><button class="vocab-mode" type="button" data-mode="cards">Карточки</button><button class="vocab-mode" type="button" data-mode="difficult">Трудные</button><button class="vocab-mode" type="button" data-mode="test">Тест</button></div><div id="vocab-mode-root"></div>`;
    const modeRoot = document.getElementById('vocab-mode-root');
    const draw = (mode) => {
      if (mode === 'cards') renderFlashcards(modeRoot,topic,ctx,false);
      else if (mode === 'difficult') renderFlashcards(modeRoot,topic,ctx,true);
      else if (mode === 'test') renderTest(modeRoot,topic,ctx);
      else renderAllWords(modeRoot,topic,ctx);
    };
    document.getElementById('vocab-modes').addEventListener('click', (event) => {
      const button = event.target.closest('[data-mode]');
      if (!button) return;
      document.querySelectorAll('.vocab-mode').forEach((item) => item.classList.toggle('active', item === button));
      draw(button.dataset.mode);
    });
    draw('all');
  }

  window.VocabularyEngine = { renderVocabularyPage, speak, statusLabel };
})();
