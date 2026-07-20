/* English Space unified application engine. */
(() => {
  'use strict';

  const safeText = (value, fallback = '') => value === undefined || value === null ? fallback : String(value);
  const escapeHtml = (value) => safeText(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const normalizeAnswer = (value) => safeText(value)
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('en')
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/[.!?;,]+$/g, '');

  const asArray = (value) => Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  const taskId = (item, fallback) => safeText(item?.id, fallback).trim() || fallback;
  const cleanNumberedTitle = (value, fallback = '') => safeText(value, fallback)
    .replace(/^\s*(?:задание|упражнение)\s*№?\s*\d+\s*[.:—-]?\s*/i, '')
    .replace(/^\s*\d+\s*[.:—-]\s*/, '')
    .trim() || fallback;
  const toneClass = (number) => `exercise-tone-${((Math.max(1, Number(number) || 1) - 1) % 5) + 1}`;

  function questionType(item) {
    const type = safeText(item?.type, 'text').toLowerCase();
    return ['text', 'textarea', 'select', 'single', 'multiple', 'reorder', 'translate', 'manual'].includes(type) ? type : 'text';
  }

  function questionOptions(item) {
    return asArray(item?.options).map((option) => {
      if (option && typeof option === 'object') {
        return { value: safeText(option.value ?? option.id ?? option.label), label: safeText(option.label ?? option.text ?? option.value) };
      }
      return { value: safeText(option), label: safeText(option) };
    });
  }

  function renderQuestion(item, index, prefix = 'question') {
    const id = taskId(item, `${prefix}-${index + 1}`);
    const type = questionType(item);
    const prompt = escapeHtml(item.prompt || item.question || `Задание ${index + 1}`);
    const placeholder = escapeHtml(item.placeholder || 'Введите ответ');
    const options = questionOptions(item);
    let control = '';

    if (type === 'textarea' || type === 'manual') {
      control = `<textarea data-answer-control placeholder="${placeholder}"></textarea>`;
    } else if (type === 'select') {
      control = `<select data-answer-control><option value="">Выберите ответ</option>${options.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join('')}</select>`;
    } else if (type === 'single') {
      control = `<div class="option-list">${options.map((option, optionIndex) => `<label class="option"><input type="radio" name="${escapeHtml(id)}" value="${escapeHtml(option.value)}" data-answer-control><span>${escapeHtml(option.label)}</span></label>`).join('')}</div>`;
    } else if (type === 'multiple') {
      control = `<div class="option-list">${options.map((option) => `<label class="option"><input type="checkbox" value="${escapeHtml(option.value)}" data-answer-control><span>${escapeHtml(option.label)}</span></label>`).join('')}</div>`;
    } else {
      control = `<input type="text" data-answer-control placeholder="${placeholder}" autocomplete="off">`;
    }

    return `<div class="exercise-item" data-question-id="${escapeHtml(id)}" data-question-type="${escapeHtml(type)}">
      <span class="exercise-prompt">${index + 1}. ${prompt}</span>
      ${Array.isArray(item.wordBank) && item.wordBank.length ? `<div class="word-bank">${item.wordBank.map((word) => `<span>${escapeHtml(word)}</span>`).join('')}</div>` : ''}
      <div class="exercise-control">${control}</div>
      <div class="feedback" data-feedback></div>
    </div>`;
  }

  function flattenQuestions(blocks) {
    const questions = [];
    (Array.isArray(blocks) ? blocks : []).forEach((block, blockIndex) => {
      if (safeText(block?.type).toLowerCase() === 'exercise') {
        asArray(block.items).forEach((item, itemIndex) => questions.push({ item, id: taskId(item, `${taskId(block, `exercise-${blockIndex + 1}`)}-${itemIndex + 1}`) }));
      } else if (['text','textarea','select','single','multiple','reorder','translate','manual'].includes(safeText(block?.type).toLowerCase())) {
        questions.push({ item: block, id: taskId(block, `task-${blockIndex + 1}`) });
      }
    });
    return questions;
  }

  function renderBlock(block, index, sectionState) {
    const type = safeText(block?.type, 'content').toLowerCase();
    if (type === 'section') {
      sectionState.value += 1;
      return `<section class="lesson-section-heading" id="lesson-section-${index}"><span class="section-number">${sectionState.value}</span><div><span class="section-label">Раздел ${sectionState.value}</span><h2>${escapeHtml(block.title || `Часть ${sectionState.value}`)}</h2>${block.text ? `<p>${escapeHtml(block.text)}</p>` : ''}</div></section>`;
    }
    if (type === 'image') {
      return `<article class="card lesson-block"><img class="lesson-image" src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt || '')}">${block.caption ? `<p class="image-caption">${escapeHtml(block.caption)}</p>` : ''}</article>`;
    }
    if (type === 'audio') {
      return `<article class="card lesson-block content-block"><h3>${escapeHtml(block.title || 'Аудио')}</h3>${block.instruction ? `<p class="muted">${escapeHtml(block.instruction)}</p>` : ''}<audio controls preload="metadata" src="${escapeHtml(block.src)}">Ваш браузер не поддерживает аудио.</audio></article>`;
    }
    if (type === 'exercise') {
      sectionState.exercise = Number(sectionState.exercise || 0) + 1;
      const exerciseNumber = Number(block.number || sectionState.exercise);
      const items = asArray(block.items);
      const title = cleanNumberedTitle(block.title, `Упражнение ${exerciseNumber}`);
      return `<article class="card lesson-block exercise-card ${toneClass(exerciseNumber)}" id="lesson-exercise-${exerciseNumber}" data-exercise-id="${escapeHtml(taskId(block, `exercise-${index + 1}`))}"><header class="exercise-card-header"><span class="exercise-kicker">Задание ${exerciseNumber} из ${Number(sectionState.totalExercises || exerciseNumber)}</span><h3>${escapeHtml(title)}</h3>${block.instruction ? `<p class="exercise-instruction">${escapeHtml(block.instruction)}</p>` : ''}</header><div class="exercise-card-body">${items.map((item, itemIndex) => renderQuestion(item, itemIndex, taskId(block, `exercise-${index + 1}`))).join('')}</div></article>`;
    }
    if (['text','textarea','select','single','multiple','reorder','translate','manual'].includes(type)) {
      sectionState.exercise = Number(sectionState.exercise || 0) + 1;
      const exerciseNumber = sectionState.exercise;
      return `<article class="card lesson-block exercise-card ${toneClass(exerciseNumber)}" id="lesson-exercise-${exerciseNumber}"><header class="exercise-card-header"><span class="exercise-kicker">Задание ${exerciseNumber}</span></header><div class="exercise-card-body">${renderQuestion(block, 0, `task-${index + 1}`)}</div></article>`;
    }
    const paragraphs = asArray(block.paragraphs || block.text).filter(Boolean);
    return `<article class="card lesson-block content-block">${block.title ? `<h3>${escapeHtml(block.title)}</h3>` : ''}${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</article>`;
  }

  function readAnswer(node, type) {
    if (!node) return '';
    if (type === 'single') return node.querySelector('input[type="radio"]:checked')?.value || '';
    if (type === 'multiple') return [...node.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);
    return node.querySelector('[data-answer-control]')?.value || '';
  }

  function writeAnswer(node, type, value) {
    if (!node) return;
    if (type === 'single') {
      node.querySelectorAll('input[type="radio"]').forEach((input) => { input.checked = safeText(input.value) === safeText(value); });
    } else if (type === 'multiple') {
      const selected = new Set(asArray(value).map(safeText));
      node.querySelectorAll('input[type="checkbox"]').forEach((input) => { input.checked = selected.has(input.value); });
    } else {
      const control = node.querySelector('[data-answer-control]');
      if (control) control.value = safeText(value);
    }
  }

  function correctAnswers(item) {
    const value = item.answers !== undefined ? item.answers : item.answer;
    return asArray(value);
  }

  function isCorrect(item, actual) {
    if (item.scored === false || questionType(item) === 'manual') return null;
    const expected = correctAnswers(item);
    if (questionType(item) === 'multiple') {
      const actualSet = [...new Set(asArray(actual).map(normalizeAnswer))].sort();
      const expectedSet = [...new Set(expected.map(normalizeAnswer))].sort();
      return JSON.stringify(actualSet) === JSON.stringify(expectedSet);
    }
    const normalizedActual = normalizeAnswer(actual);
    return expected.some((answer) => normalizeAnswer(answer) === normalizedActual);
  }

  function clearReview(node) {
    node?.querySelectorAll('.input-correct,.input-wrong').forEach((control) => control.classList.remove('input-correct','input-wrong'));
    node?.querySelectorAll('.correct-option,.wrong-option').forEach((option) => option.classList.remove('correct-option','wrong-option'));
    const feedback = node?.querySelector('[data-feedback]');
    if (feedback) { feedback.className = 'feedback'; feedback.textContent = ''; }
  }

  function applyReview(node, item, correct) {
    clearReview(node);
    if (correct === null) {
      const feedback = node.querySelector('[data-feedback]');
      if (feedback) { feedback.className = 'feedback show good'; feedback.textContent = 'Ответ сохранён. Его проверит преподаватель.'; }
      return;
    }
    const type = questionType(item);
    if (type === 'single' || type === 'multiple') {
      const expected = new Set(correctAnswers(item).map(normalizeAnswer));
      node.querySelectorAll('.option').forEach((option) => {
        const input = option.querySelector('input');
        const selected = input?.checked;
        if (expected.has(normalizeAnswer(input?.value))) option.classList.add('correct-option');
        if (selected && !expected.has(normalizeAnswer(input?.value))) option.classList.add('wrong-option');
      });
    } else {
      const control = node.querySelector('[data-answer-control]');
      control?.classList.add(correct ? 'input-correct' : 'input-wrong');
    }
    const feedback = node.querySelector('[data-feedback]');
    if (feedback) {
      feedback.className = `feedback show ${correct ? 'good' : 'bad'}`;
      feedback.textContent = correct ? 'Верно!' : safeText(item.explanation, `Правильный ответ: ${correctAnswers(item).join(' / ')}`);
    }
  }

  function evaluate(root, questions, { apply = true } = {}) {
    const answers = {};
    let correct = 0;
    let total = 0;
    questions.forEach(({ item, id }) => {
      const node = root.querySelector(`[data-question-id="${CSS.escape(id)}"]`);
      const type = questionType(item);
      const actual = readAnswer(node, type);
      answers[id] = actual;
      const result = isCorrect(item, actual);
      if (result !== null) {
        total += 1;
        if (result) correct += 1;
      }
      if (apply) applyReview(node, item, result);
    });
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { answers, correct, total, percent };
  }

  function restoreAnswers(root, questions, answers) {
    questions.forEach(({ item, id }) => {
      const node = root.querySelector(`[data-question-id="${CSS.escape(id)}"]`);
      writeAnswer(node, questionType(item), answers?.[id]);
    });
  }

  function disableAnswers(root, disabled = true) {
    root.querySelectorAll('[data-answer-control]').forEach((control) => { control.disabled = disabled; control.readOnly = disabled; });
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('ru-RU');
  }

  function materialLinks(lesson, content) {
    const links = [];
    const vocabularyTopic = content.vocabulary.find((item) =>
      item.id === lesson?.vocabularyId || item.linkedLessonId === lesson?.id
    );
    if (vocabularyTopic) {
      links.push(`<a class="card interactive material-link material-vocab" href="vocabulary.html?id=${encodeURIComponent(vocabularyTopic.id)}"><div><strong>💥 Словарь урока</strong><p>${escapeHtml(vocabularyTopic.title || 'Новые слова')}</p></div><span class="arrow">→</span></a>`);
    }
    const grammarIds = asArray(lesson?.grammarIds || lesson?.grammarTopicIds || lesson?.grammarTopics);
    grammarIds.forEach((id) => {
      const topic = content.grammar.find((item) => item.id === id);
      if (topic) links.push(`<a class="card interactive material-link material-grammar" href="grammar-topic.html?id=${encodeURIComponent(topic.id)}"><div><strong>📐 Грамматика</strong><p>${escapeHtml(topic.title)}</p></div><span class="arrow">→</span></a>`);
    });
    return links.length ? `<div class="material-links">${links.join('')}</div>` : '';
  }

  async function renderLessonPage(ctx) {
    const root = document.getElementById('lesson-root');
    const id = new URLSearchParams(location.search).get('id') || '';
    const lesson = ctx.content.lessons.find((item) => item.id === id);
    if (!root) return;
    if (!lesson || lesson.status === 'draft') {
      root.innerHTML = ctx.emptyState('📝','Домашняя работа не найдена','Проверьте ссылку или вернитесь к списку заданий.');
      return;
    }
    document.getElementById('lesson-hero-title').textContent = `Домашняя работа №${Number(lesson.number || 0)}`;
    document.getElementById('lesson-hero-subtitle').textContent = `${lesson.title || 'Интерактивное задание'} · ${lesson.subtitle || ''}`;
    if (lesson.status === 'locked') {
      root.innerHTML = ctx.emptyState('🔒','Задание пока закрыто','Coming soon');
      return;
    }
    const blocks = asArray(lesson.blocks);
    if (!blocks.length) {
      root.innerHTML = ctx.emptyState('📝','Задание пока не опубликовано','Материал появится после урока.');
      return;
    }
    const questions = flattenQuestions(blocks);
    const roadmapExercises = blocks.map((block,index) => safeText(block.type).toLowerCase() === 'exercise' ? { block,index } : null).filter(Boolean);
    const sectionState = { value: 0, exercise: 0, totalExercises: roadmapExercises.length };
    const record = ctx.progress.getHomework(id) || {};
    const finalStatus = ['submitted_pending_report','submitted'].includes(record.status);
    const reviewed = Boolean(record.checked_at);

    root.innerHTML = `<article class="card lesson-intro"><div><span class="eyebrow">Домашняя работа №${Number(lesson.number || 0)}</span><h2>${escapeHtml(lesson.title)}</h2><p>${escapeHtml(lesson.subtitle || '')}</p></div><span class="lesson-points">${questions.filter(({item}) => item.scored !== false && questionType(item) !== 'manual').length} проверяемых ответов</span></article>
      ${materialLinks(lesson, ctx.content)}
      ${roadmapExercises.length ? `<nav class="card lesson-roadmap" aria-label="План домашней работы"><div class="roadmap-heading"><div><span class="eyebrow">Маршрут</span><strong>Задания по порядку</strong></div><span class="roadmap-count">${roadmapExercises.length}</span></div><ol>${roadmapExercises.map(({block},exerciseIndex) => `<li><a href="#lesson-exercise-${exerciseIndex + 1}"><span>${exerciseIndex + 1}</span><strong>${escapeHtml(cleanNumberedTitle(block.title, `Задание ${exerciseIndex + 1}`))}</strong></a></li>`).join('')}</ol></nav>` : ''}
      <div id="lesson-blocks">${blocks.map((block,index) => renderBlock(block,index,sectionState)).join('')}</div>
      ${finalStatus ? `<div class="locked-note">🔒 Ответы отправлены и доступны только для просмотра.</div>` : ''}
      <article class="card lesson-actions"><div class="lesson-result" id="lesson-result" aria-live="polite"></div><div class="button-row" id="lesson-buttons"></div><div id="submission-status"></div></article>`;

    restoreAnswers(root, questions, record.answers || {});
    if (reviewed) {
      const result = evaluate(root, questions, { apply: true });
      document.getElementById('lesson-result').innerHTML = `<h3>Сохранённый результат: ${Number(record.score_correct ?? result.correct)} из ${Number(record.score_total ?? result.total)}</h3><p class="muted">${Number(record.score_percent ?? result.percent)}% правильных ответов</p>`;
    }
    if (finalStatus) disableAnswers(root, true);

    const buttons = document.getElementById('lesson-buttons');
    const statusBox = document.getElementById('submission-status');

    const renderStatus = (current) => {
      if (!current || !['submitted_pending_report','submitted'].includes(current.status)) { statusBox.innerHTML = ''; return; }
      const sent = current.report_status === 'sent' || current.status === 'submitted';
      const failed = current.report_status === 'failed';
      statusBox.innerHTML = `<div class="submission-status ${sent ? 'good' : failed ? 'bad' : ''}">${sent ? '✅ Отправлено преподавателю' : failed ? '⚠️ Работа сохранена. Отчёт преподавателю пока не доставлен.' : '⏳ Ответы сохранены, отчёт отправляется'}${current.submitted_at ? `<br><small>${escapeHtml(formatDate(current.submitted_at))}</small>` : ''}</div>`;
    };

    const checkAndSave = async () => {
      const result = evaluate(root, questions, { apply: true });
      const now = new Date().toISOString();
      const next = {
        ...record,
        lesson_id: id,
        status: 'draft',
        answers: result.answers,
        score_correct: result.correct,
        score_total: result.total,
        score_percent: result.percent,
        checked_at: now,
        updated_at: now,
        report_status: 'not_sent'
      };
      const saved = await ctx.progress.saveHomework(next);
      Object.assign(record, saved);
      document.getElementById('lesson-result').innerHTML = `<h3>Результат: ${result.correct} из ${result.total}</h3><p class="muted">${result.percent}% правильных ответов</p>`;
      renderButtons();
      return result;
    };

    const submit = async () => {
      if (!record.checked_at) { ctx.toast('Сначала нажмите «Проверить ответы».'); return; }
      if (!window.confirm('После отправки изменить ответы будет невозможно. Отправить домашнее задание?')) return;
      const result = evaluate(root, questions, { apply: true });
      const now = new Date().toISOString();
      const submissionId = record.submission_id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
      const next = {
        ...record,
        lesson_id: id,
        submission_id: submissionId,
        status: 'submitted_pending_report',
        answers: result.answers,
        score_correct: result.correct,
        score_total: result.total,
        score_percent: result.percent,
        checked_at: now,
        submitted_at: now,
        locked_at: now,
        report_status: 'pending',
        report_sent_at: null,
        report_error: null,
        updated_at: now
      };
      Object.assign(record, next);
      disableAnswers(root, true);
      renderButtons();
      renderStatus(record);
      try {
        await ctx.progress.saveHomework(next, true);
        if (!ctx.cloudConfigured()) {
          record.report_status = 'failed';
          record.report_error = 'Облачное сохранение не настроено';
          await ctx.progress.saveHomework(record);
          renderStatus(record);
          ctx.toast('Работа сохранена на этом устройстве. Отчёт преподавателю пока не отправлен.');
          return;
        }
        const response = await ctx.sendHomeworkReport(id, submissionId);
        record.status = 'submitted';
        record.report_status = 'sent';
        record.report_sent_at = new Date().toISOString();
        record.report_error = null;
        await ctx.progress.saveHomeworkLocal(record);
        renderStatus(record);
        ctx.toast(response?.skipped ? 'Отчёт уже был отправлен.' : 'Домашняя работа отправлена преподавателю.');
      } catch (error) {
        record.report_status = 'failed';
        record.report_error = safeText(error?.message, 'Неизвестная ошибка');
        await ctx.progress.saveHomeworkLocal(record);
        renderStatus(record);
        renderButtons();
        ctx.toast('Работа сохранена, но отчёт преподавателю пока не отправлен.');
      }
    };

    const retryReport = async () => {
      try {
        renderStatus({ ...record, report_status: 'pending' });
        const response = await ctx.sendHomeworkReport(id, record.submission_id);
        record.status = 'submitted';
        record.report_status = 'sent';
        record.report_sent_at = new Date().toISOString();
        record.report_error = null;
        await ctx.progress.saveHomeworkLocal(record);
        renderStatus(record);
        renderButtons();
        ctx.toast(response?.skipped ? 'Отчёт уже был отправлен.' : 'Отчёт успешно отправлен.');
      } catch (error) {
        record.report_status = 'failed';
        record.report_error = safeText(error?.message, 'Неизвестная ошибка');
        await ctx.progress.saveHomeworkLocal(record);
        renderStatus(record);
        ctx.toast('Повторная отправка не удалась.');
      }
    };

    const renderButtons = () => {
      const isFinal = ['submitted_pending_report','submitted'].includes(record.status);
      if (isFinal) {
        buttons.innerHTML = record.report_status === 'failed' ? '<button class="btn btn-secondary" id="retry-report" type="button">Повторить отправку отчёта</button><a class="btn btn-ghost" href="homework.html">К списку работ</a>' : '<a class="btn btn-ghost" href="homework.html">К списку работ</a>';
        document.getElementById('retry-report')?.addEventListener('click', retryReport);
        return;
      }
      buttons.innerHTML = `<button class="btn btn-primary" id="check-lesson" type="button">Проверить ответы</button><button class="btn btn-secondary" id="submit-lesson" type="button" ${record.checked_at ? '' : 'disabled'}>Отправить учителю</button>`;
      document.getElementById('check-lesson')?.addEventListener('click', checkAndSave);
      document.getElementById('submit-lesson')?.addEventListener('click', submit);
    };

    renderButtons();
    renderStatus(record);

    if (!finalStatus) {
      let timer;
      root.querySelectorAll('[data-answer-control]').forEach((control) => {
        control.addEventListener('input', () => {
          window.clearTimeout(timer);
          timer = window.setTimeout(async () => {
            const result = evaluate(root, questions, { apply: Boolean(record.checked_at) });
            const now = new Date().toISOString();
            const next = { ...record, lesson_id: id, status: 'draft', answers: result.answers, updated_at: now };
            if (record.checked_at) Object.assign(next, { score_correct: result.correct, score_total: result.total, score_percent: result.percent, checked_at: now });
            const saved = await ctx.progress.saveHomework(next);
            Object.assign(record, saved);
            if (record.checked_at) document.getElementById('lesson-result').innerHTML = `<h3>Результат: ${result.correct} из ${result.total}</h3><p class="muted">${result.percent}% правильных ответов</p>`;
          }, 500);
        });
      });
    }
  }

  function grammarExplanation(topic) {
    const explanation = asArray(topic.explanation || topic.sections);
    const cards = explanation.map((section, index) => {
      const title = cleanNumberedTitle(section.title, `Шаг ${index + 1}`);
      return `<article class="card explanation-card explanation-tone-${(index % 4) + 1}"><header class="explanation-heading"><span class="explanation-number">${index + 1}</span><div><span class="explanation-label">Понятное правило</span><h3>${escapeHtml(title)}</h3></div></header>${asArray(section.text || section.paragraphs).map((text) => `<p>${escapeHtml(text)}</p>`).join('')}${asArray(section.examples).length ? `<div class="example-list">${asArray(section.examples).map((example) => `<div class="example-row"><strong>${escapeHtml(example.en || example.example || '')}</strong>${example.ru ? `<span>${escapeHtml(example.ru)}</span>` : ''}</div>`).join('')}</div>` : ''}${section.table ? `<div class="table-wrap"><table><thead><tr>${asArray(section.table.headers).map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${asArray(section.table.rows).map((row) => `<tr>${asArray(row).map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}</article>`;
    }).join('');
    const mistakes = asArray(topic.commonMistakes || topic.mistakes);
    return `<div class="grammar-intro-note"><span>💡</span><div><strong>Как работать с темой</strong><p>Сначала прочитайте правила сверху вниз, затем выполните пять заданий. Первое — самое простое, пятое — самостоятельное.</p></div></div><div class="grammar-explanation">${cards}${mistakes.length ? `<article class="card explanation-card mistakes-card"><header class="explanation-heading"><span class="explanation-number">!</span><div><span class="explanation-label">Обратите внимание</span><h3>Частые ошибки</h3></div></header><ul>${mistakes.map((mistake) => `<li>${escapeHtml(mistake)}</li>`).join('')}</ul></article>` : ''}</div>`;
  }

  async function renderGrammarTopicPage(ctx) {
    const root = document.getElementById('grammar-topic-root');
    const id = new URLSearchParams(location.search).get('id') || '';
    const topic = ctx.content.grammar.find((item) => item.id === id && item.status !== 'draft');
    if (!root) return;
    if (!topic) { root.innerHTML = ctx.emptyState('📐','Тема не найдена','Вернитесь к списку грамматических тем.'); return; }
    document.getElementById('grammar-hero-title').textContent = topic.title || 'Грамматика';
    document.getElementById('grammar-hero-subtitle').textContent = topic.subtitle || 'Объяснение и упражнения';
    const exercises = asArray(topic.exercises);
    const blocks = exercises.map((exercise,index) => ({ type:'exercise', id: exercise.id || `grammar-exercise-${index+1}`, title: exercise.title || `Задание ${index+1}`, instruction: exercise.instruction, items: asArray(exercise.items).map((item) => ({...item, id: item.id || `${exercise.id || `grammar-exercise-${index+1}`}-${taskId(item, index+1)}`})), difficulty: exercise.difficulty }));
    const questions = flattenQuestions(blocks);
    const local = ctx.progress.getGrammarLocal(id) || {};
    root.innerHTML = `${grammarExplanation(topic)}<section class="grammar-practice-heading"><span class="eyebrow">Практика</span><h2>Проверьте, как вы поняли тему</h2><p>Выполняйте задания по порядку: сложность постепенно увеличивается.</p></section><div class="grammar-exercises">${blocks.map((block,index) => `<article class="card lesson-block exercise-card ${toneClass(index + 1)}" id="grammar-exercise-${index + 1}"><header class="exercise-card-header"><div class="grammar-exercise-top"><span class="exercise-kicker">Задание ${index + 1} из ${blocks.length}</span><span class="difficulty">${escapeHtml(block.difficulty || `Уровень ${index+1}`)}</span></div><h3>${escapeHtml(cleanNumberedTitle(block.title, `Задание ${index + 1}`))}</h3>${block.instruction ? `<p class="exercise-instruction">${escapeHtml(block.instruction)}</p>` : ''}</header><div class="exercise-card-body">${block.items.map((item,itemIndex) => renderQuestion(item,itemIndex,block.id)).join('')}</div></article>`).join('')}</div><article class="card lesson-actions"><div class="lesson-result" id="grammar-result"></div><div class="button-row"><button class="btn btn-primary" id="check-grammar" type="button">Проверить знания</button><a class="btn btn-ghost" href="grammar.html">К списку тем</a></div></article>`;
    restoreAnswers(root, questions, local.lastAnswers || {});
    if (local.lastCheckedAt) {
      const result = evaluate(root, questions, { apply: true });
      document.getElementById('grammar-result').innerHTML = `<h3>Последний результат: ${Number(local.lastScore ?? result.percent)}%</h3><p class="muted">Лучший результат: ${Number(local.bestScore || 0)}%</p>`;
    }
    document.getElementById('check-grammar').addEventListener('click', async () => {
      const result = evaluate(root, questions, { apply: true });
      const previous = ctx.progress.getGrammar(id) || {};
      const attempts = Number(previous.attempts || 0) + 1;
      const bestScore = Math.max(Number(previous.best_score || 0), result.percent);
      const passed = Boolean(previous.passed || result.percent >= 80);
      const now = new Date().toISOString();
      await ctx.progress.saveGrammar({ topic_id: id, passed, attempts, best_score: bestScore, passed_at: passed ? (previous.passed_at || now) : null, updated_at: now }, { lastAnswers: result.answers, lastScore: result.percent, lastCheckedAt: now, bestScore });
      document.getElementById('grammar-result').innerHTML = `<h3>Результат: ${result.percent}%</h3><p class="muted">${passed ? 'Тема пройдена.' : 'Повторите правило и попробуйте ещё раз.'} Лучший результат: ${bestScore}%.</p>`;
    });
  }

  window.LessonEngine = { renderLessonPage, renderGrammarTopicPage, evaluate, flattenQuestions };
})();

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

(() => {
  'use strict';

  const config = window.APP_CONFIG || {};
  const student = config.student || {};
  const safeText = (value, fallback = '') => value === undefined || value === null ? fallback : String(value);
  const escapeHtml = (value) => safeText(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const byId = (id) => document.getElementById(id);
  const asArray = (value) => Array.isArray(value) ? value : [];
  const dateMs = (value) => {
    const parsed = Date.parse(value || '');
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const percent = (value, total) => Number(total) > 0 ? Math.max(0, Math.min(100, Math.round((Number(value) / Number(total)) * 100))) : 0;
  const studentId = safeText(student.id, 'student').toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'student';

  function toast(message) {
    const node = byId('app-toast');
    if (!node) return;
    node.textContent = safeText(message);
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('show'), 3200);
  }

  function emptyState(icon, title, text) {
    return `<article class="card empty-state"><div class="empty-state-icon">${escapeHtml(icon)}</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`;
  }

  function progressMarkup(label, value, total, tone = '') {
    const current = Number(value || 0);
    const maximum = Number(total || 0);
    const currentPercent = percent(current, maximum);
    return `<div class="progress-row"><div class="progress-row-head"><strong>${escapeHtml(label)}</strong><span>${current} из ${maximum}</span></div><div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${currentPercent}"><div class="progress-fill ${escapeHtml(tone)}" style="width:${currentPercent}%"></div></div></div>`;
  }

  function fillConfig() {
    const values = {
      nameRu: student.nameRu,
      nameEn: student.nameEn,
      level: student.level,
      textbook: student.textbook,
      textbookEdition: student.textbookEdition
    };
    document.querySelectorAll('[data-config]').forEach((node) => { node.textContent = safeText(values[node.dataset.config]); });
    if (student.nameEn) document.title = `${document.title} · ${student.nameEn}`;
  }

  function markNavigation() {
    const page = document.body.dataset.page;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      const active = link.dataset.nav === page;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
    });
  }

  const ContentService = {
    lessons: [],
    grammar: [],
    vocabulary: [],
    lessonCache: new Map(),
    grammarCache: new Map(),

    async fetchJson(path) {
      const response = await fetch(new URL(path, document.baseURI), { cache: 'no-store' });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('json')) {
        const text = await response.text();
        if (text.trim().startsWith('<')) return null;
        return JSON.parse(text);
      }
      return response.json();
    },

    async discover(directory, prefix, normalizer) {
      const items = [];
      let missing = 0;
      for (let number = 1; number <= 200; number += 1) {
        try {
          const raw = await this.fetchJson(`${directory}/${prefix}-${number}.json`);
          if (!raw) {
            missing += 1;
            if (missing >= 3) break;
            continue;
          }
          const item = normalizer(raw, number);
          if (item) items.push(item);
          missing = 0;
        } catch (error) {
          console.warn(`Не удалось загрузить ${prefix}-${number}.json`, error);
          missing += 1;
          if (missing >= 3) break;
        }
      }
      return items.sort((left, right) => Number(left.number || 0) - Number(right.number || 0));
    },

    normalizeLesson(raw, number) {
      if (!raw || typeof raw !== 'object') return null;
      const id = safeText(raw.id, `lesson-${number}`);
      if (!/^lesson-\d+$/.test(id)) return null;
      return {
        ...raw,
        id,
        number: Number(id.replace('lesson-', '')) || number,
        title: safeText(raw.title, `Домашняя работа №${number}`),
        subtitle: safeText(raw.subtitle, 'Интерактивное задание'),
        status: safeText(raw.status, 'available'),
        blocks: asArray(raw.blocks)
      };
    },

    normalizeGrammar(raw, number) {
      if (!raw || typeof raw !== 'object') return null;
      const id = safeText(raw.id, `grammar-${number}`).trim();
      if (!id) return null;
      return {
        ...raw,
        id,
        number: Number(raw.number || raw.order || number) || number,
        title: safeText(raw.title, `Грамматическая тема ${number}`),
        subtitle: safeText(raw.subtitle, 'Объяснение и упражнения'),
        status: safeText(raw.status, 'available'),
        exercises: asArray(raw.exercises)
      };
    },

    buildVocabulary() {
      const seen = new Set();
      const topics = [];
      const sourceTopics = Array.isArray(window.VOCABULARY_DATA) ? window.VOCABULARY_DATA : [];

      sourceTopics.forEach((source, topicIndex) => {
        if (!source || !source.id || !Array.isArray(source.words) || !source.words.length) return;
        const words = [];
        source.words.forEach((word, index) => {
          const normalized = safeText(word.uniqueKey || word.en)
            .normalize('NFKC').toLocaleLowerCase('en').replace(/[’‘`]/g, "'").trim().replace(/\s+/g, ' ')
            .replace(/^[\s.,!?;:()[\]{}"“”]+|[\s.,!?;:()[\]{}"“”]+$/g, '');
          if (!normalized || seen.has(normalized)) return;
          seen.add(normalized);
          words.push({
            ...word,
            id: safeText(word.id, `${source.id}-word-${index + 1}`),
            wordKey: normalized,
            uniqueKey: normalized,
            en: safeText(word.en),
            ru: safeText(word.ru)
          });
        });

        if (words.length) {
          topics.push({
            ...source,
            number: Number(source.number || source.order || topicIndex + 1),
            linkedLessonId: safeText(source.linkedLessonId),
            words,
            title: safeText(source.title, `Словарная тема ${topicIndex + 1}`),
            label: safeText(source.label, `Тема ${topicIndex + 1}`)
          });
        }
      });

      this.vocabulary = topics;
    },

    async init() {
      this.lessons = await this.discover('data/lessons', 'lesson', (raw, number) => this.normalizeLesson(raw, number));
      const grammarSource = Array.isArray(window.GRAMMAR_DATA) ? window.GRAMMAR_DATA : [];
      this.grammar = grammarSource
        .map((raw, index) => this.normalizeGrammar(raw, index + 1))
        .filter(Boolean)
        .sort((left, right) => Number(left.number || 0) - Number(right.number || 0));
      this.buildVocabulary();
      return this;
    }
  };

  const storageKeys = {
    homework: `english_space_${studentId}_homework`,
    vocabulary: `english_space_${studentId}_vocabulary`,
    grammar: `english_space_${studentId}_grammar`,
    syncQueue: `english_space_${studentId}_sync_queue`
  };

  const Storage = {
    read(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        console.warn('Не удалось прочитать localStorage', error);
        return fallback;
      }
    },
    write(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn('Не удалось сохранить localStorage', error);
        return false;
      }
    }
  };

  const CloudService = {
    client: null,
    syncing: false,
    timers: {},
    lastError: null,
    isConfigured() {
      return Boolean(config.features?.cloudSync && safeText(config.supabase?.url).trim() && safeText(config.supabase?.anonKey).trim() && window.supabase?.createClient);
    },
    async init() {
      if (!this.isConfigured()) return null;
      if (this.client) return this.client;
      const emptyStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
      this.client = window.supabase.createClient(config.supabase.url, config.supabase.anonKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storage: emptyStorage }
      });
      return this.client;
    },
    queue(section) {
      const queue = Storage.read(storageKeys.syncQueue, []);
      if (!queue.includes(section)) queue.push(section);
      Storage.write(storageKeys.syncQueue, queue);
      if (!this.isConfigured()) return;
      clearTimeout(this.timers[section]);
      this.timers[section] = setTimeout(() => ProgressService.syncToCloud(section).catch((error) => {
        this.lastError = error;
        updateSyncStatus();
      }), 650);
    }
  };

  const tables = {
    homework: config.supabase?.tables?.homework || 'homework_progress',
    vocabulary: config.supabase?.tables?.vocabulary || 'vocabulary_progress',
    vocabularyTopics: config.supabase?.tables?.vocabularyTopics || 'vocabulary_topic_progress',
    grammar: config.supabase?.tables?.grammar || 'grammar_progress'
  };

  const ProgressService = {
    homeworkState() {
      const state = Storage.read(storageKeys.homework, { lessons: {} });
      return { lessons: state?.lessons && typeof state.lessons === 'object' ? state.lessons : {} };
    },
    vocabularyState() {
      const state = Storage.read(storageKeys.vocabulary, { words: {}, topics: {} });
      return {
        words: state?.words && typeof state.words === 'object' ? state.words : {},
        topics: state?.topics && typeof state.topics === 'object' ? state.topics : {}
      };
    },
    grammarState() {
      const state = Storage.read(storageKeys.grammar, { topics: {}, local: {} });
      return {
        topics: state?.topics && typeof state.topics === 'object' ? state.topics : {},
        local: state?.local && typeof state.local === 'object' ? state.local : {}
      };
    },
    getHomework(lessonId) { return this.homeworkState().lessons[lessonId] || null; },
    getVocabularyWord(wordKey) { return this.vocabularyState().words[wordKey] || null; },
    getGrammar(topicId) { return this.grammarState().topics[topicId] || null; },
    getGrammarLocal(topicId) { return this.grammarState().local[topicId] || null; },

    async saveHomeworkLocal(record) {
      const state = this.homeworkState();
      const normalized = {
        ...record,
        lesson_id: safeText(record.lesson_id),
        submission_id: record.submission_id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
        status: safeText(record.status, 'draft'),
        answers: record.answers && typeof record.answers === 'object' ? record.answers : {},
        report_status: safeText(record.report_status, 'not_sent'),
        updated_at: record.updated_at || new Date().toISOString()
      };
      state.lessons[normalized.lesson_id] = normalized;
      Storage.write(storageKeys.homework, state);
      return normalized;
    },

    async saveHomework(record, immediate = false) {
      const normalized = await this.saveHomeworkLocal(record);
      if (!CloudService.isConfigured()) return normalized;
      if (immediate) {
        clearTimeout(CloudService.timers.homework);
        const queue = Storage.read(storageKeys.syncQueue, []).filter((item) => item !== 'homework');
        Storage.write(storageKeys.syncQueue, queue);
        await this.upsertHomework(normalized);
      } else {
        CloudService.queue('homework');
      }
      return normalized;
    },

    async saveVocabularyWord(record) {
      const state = this.vocabularyState();
      const normalized = {
        ...record,
        word_key: safeText(record.word_key),
        status: ['new','known','difficult'].includes(record.status) ? record.status : 'new',
        updated_at: record.updated_at || new Date().toISOString()
      };
      state.words[normalized.word_key] = normalized;
      Storage.write(storageKeys.vocabulary, state);
      CloudService.queue('vocabulary');
      return normalized;
    },

    async saveVocabularyTest(topicId, test) {
      const state = this.vocabularyState();
      const current = state.topics[topicId] || { tests: [] };
      current.tests = [...asArray(current.tests), test];
      current.updated_at = new Date().toISOString();
      state.topics[topicId] = current;
      Storage.write(storageKeys.vocabulary, state);
      CloudService.queue('vocabulary');
    },

    async saveGrammar(record, localExtra = {}) {
      const state = this.grammarState();
      const normalized = {
        topic_id: safeText(record.topic_id),
        passed: Boolean(record.passed),
        attempts: Math.max(0, Number(record.attempts || 0)),
        best_score: Math.max(0, Math.min(100, Number(record.best_score || 0))),
        passed_at: record.passed ? (record.passed_at || new Date().toISOString()) : null,
        updated_at: record.updated_at || new Date().toISOString()
      };
      state.topics[normalized.topic_id] = normalized;
      state.local[normalized.topic_id] = { ...(state.local[normalized.topic_id] || {}), ...localExtra };
      Storage.write(storageKeys.grammar, state);
      CloudService.queue('grammar');
      return normalized;
    },

    homeworkRow(record) {
      return {
        submission_id: record.submission_id,
        student_id: studentId,
        lesson_id: record.lesson_id,
        status: record.status || 'draft',
        answers: record.answers || {},
        score_correct: Number.isFinite(Number(record.score_correct)) ? Number(record.score_correct) : null,
        score_total: Number.isFinite(Number(record.score_total)) ? Number(record.score_total) : null,
        score_percent: Number.isFinite(Number(record.score_percent)) ? Number(record.score_percent) : null,
        checked_at: record.checked_at || null,
        submitted_at: record.submitted_at || null,
        locked_at: record.locked_at || null,
        report_status: record.report_status || 'not_sent',
        report_sent_at: record.report_sent_at || null,
        report_error: record.report_error || null
      };
    },

    async upsertHomework(record) {
      const client = await CloudService.init();
      if (!client) return false;
      const { data, error } = await client.from(tables.homework).upsert(this.homeworkRow(record), { onConflict: 'student_id,lesson_id' }).select('*').single();
      if (error) throw error;
      await this.saveHomeworkLocal({ ...record, ...data });
      return true;
    },

    async syncToCloud(section = 'all') {
      if (!CloudService.isConfigured() || CloudService.syncing) return false;
      const client = await CloudService.init();
      if (!client) return false;
      CloudService.syncing = true;
      try {
        const sections = section === 'all' ? ['homework','vocabulary','grammar'] : [section];
        if (sections.includes('homework')) {
          // Финальная отправка синхронизируется отдельным немедленным запросом.
          // Фоновая очередь обновляет только черновики, чтобы не перезаписать
          // серверный статус Telegram-отчёта после его отправки.
          const records = Object.values(this.homeworkState().lessons)
            .filter((record) => (record.status || 'draft') === 'draft');
          for (const record of records) await this.upsertHomework(record);
        }
        if (sections.includes('vocabulary')) {
          const state = this.vocabularyState();
          const wordRows = Object.values(state.words).map((record) => ({ student_id: studentId, word_key: record.word_key, status: record.status, learned_at: record.status === 'known' ? (record.learned_at || new Date().toISOString()) : null }));
          if (wordRows.length) {
            const { error } = await client.from(tables.vocabulary).upsert(wordRows, { onConflict: 'student_id,word_key' });
            if (error) throw error;
          }
          const topicRows = Object.entries(state.topics).map(([topicId, item]) => ({ student_id: studentId, topic_id: topicId, tests: asArray(item.tests) }));
          if (topicRows.length) {
            const { error } = await client.from(tables.vocabularyTopics).upsert(topicRows, { onConflict: 'student_id,topic_id' });
            if (error) throw error;
          }
        }
        if (sections.includes('grammar')) {
          const rows = Object.values(this.grammarState().topics).map((record) => ({ student_id: studentId, topic_id: record.topic_id, passed: Boolean(record.passed), attempts: Number(record.attempts || 0), best_score: Number(record.best_score || 0), passed_at: record.passed ? record.passed_at : null }));
          if (rows.length) {
            const { error } = await client.from(tables.grammar).upsert(rows, { onConflict: 'student_id,topic_id' });
            if (error) throw error;
          }
        }
        Storage.write(storageKeys.syncQueue, []);
        CloudService.lastError = null;
        updateSyncStatus();
        return true;
      } finally {
        CloudService.syncing = false;
      }
    },

    async syncFromCloud() {
      if (!CloudService.isConfigured()) return false;
      const client = await CloudService.init();
      const [homeworkResponse, vocabularyResponse, topicResponse, grammarResponse] = await Promise.all([
        client.from(tables.homework).select('*').eq('student_id', studentId),
        client.from(tables.vocabulary).select('*').eq('student_id', studentId),
        client.from(tables.vocabularyTopics).select('*').eq('student_id', studentId),
        client.from(tables.grammar).select('*').eq('student_id', studentId)
      ]);
      [homeworkResponse,vocabularyResponse,topicResponse,grammarResponse].forEach((response) => { if (response.error) throw response.error; });

      const homework = this.homeworkState();
      asArray(homeworkResponse.data).forEach((row) => {
        const local = homework.lessons[row.lesson_id];
        if (!local || dateMs(row.updated_at) >= dateMs(local.updated_at)) homework.lessons[row.lesson_id] = row;
      });
      Storage.write(storageKeys.homework, homework);

      const vocabulary = this.vocabularyState();
      asArray(vocabularyResponse.data).forEach((row) => {
        const local = vocabulary.words[row.word_key];
        if (!local || dateMs(row.updated_at) >= dateMs(local.updated_at)) vocabulary.words[row.word_key] = row;
      });
      asArray(topicResponse.data).forEach((row) => {
        const local = vocabulary.topics[row.topic_id];
        if (!local || dateMs(row.updated_at) >= dateMs(local.updated_at)) vocabulary.topics[row.topic_id] = row;
      });
      Storage.write(storageKeys.vocabulary, vocabulary);

      const grammar = this.grammarState();
      asArray(grammarResponse.data).forEach((row) => {
        const local = grammar.topics[row.topic_id];
        if (!local || dateMs(row.updated_at) >= dateMs(local.updated_at)) grammar.topics[row.topic_id] = row;
      });
      Storage.write(storageKeys.grammar, grammar);
      CloudService.lastError = null;
      updateSyncStatus();
      return true;
    }
  };

  function cloudConfigured() { return CloudService.isConfigured(); }

  async function sendHomeworkReport(lessonId, submissionId) {
    if (!CloudService.isConfigured()) throw new Error('Облачное сохранение не настроено');
    const endpoint = `${safeText(config.supabase.url).replace(/\/+$/,'')}/functions/v1/notify-telegram`;
    const anonKey = safeText(config.supabase.anonKey).trim();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: anonKey, authorization: `Bearer ${anonKey}` },
      body: JSON.stringify({ action: 'homework_report', studentId, lessonId, submissionId })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.ok) throw new Error(body.error || `HTTP ${response.status}`);
    return body;
  }

  function totals() {
    const homework = ProgressService.homeworkState();
    const vocabulary = ProgressService.vocabularyState();
    const grammar = ProgressService.grammarState();
    const publishedLessons = ContentService.lessons.filter((item) => item.status !== 'draft');
    const completed = publishedLessons.filter((lesson) => ['submitted_pending_report','submitted'].includes(homework.lessons[lesson.id]?.status)).length;
    const knownWords = ContentService.vocabulary.flatMap((topic) => topic.words).filter((word) => vocabulary.words[word.wordKey]?.status === 'known').length;
    const passedGrammar = ContentService.grammar.filter((topic) => grammar.topics[topic.id]?.passed).length;
    return {
      homeworkTotal: publishedLessons.length,
      homeworkCompleted: completed,
      vocabularyTotal: ContentService.vocabulary.reduce((sum,topic) => sum + topic.words.length,0),
      vocabularyKnown: knownWords,
      vocabularyTopics: ContentService.vocabulary.length,
      grammarTotal: ContentService.grammar.filter((topic) => topic.status !== 'draft').length,
      grammarPassed: passedGrammar
    };
  }

  function recordStatus(record) {
    if (!record) return { label: 'Не начато', tone: '' };
    if (record.status === 'submitted') return { label: 'Отправлено преподавателю', tone: 'good' };
    if (record.status === 'submitted_pending_report') {
      if (record.report_status === 'failed') return { label: 'Работа завершена, отчёт не доставлен', tone: 'bad' };
      return { label: 'Ответы зафиксированы, отчёт отправляется', tone: 'warn' };
    }
    if (Object.keys(record.answers || {}).length) return { label: 'Черновик сохранён', tone: 'info' };
    return { label: 'Не начато', tone: '' };
  }

  function renderHome() {
    const summary = totals();
    byId('home-stat-completed').textContent = summary.homeworkCompleted;
    byId('vocab-stat-known').textContent = summary.vocabularyKnown;
    byId('grammar-stat-passed').textContent = summary.grammarPassed;
    byId('home-progress-list').innerHTML = [
      progressMarkup('Домашние работы', summary.homeworkCompleted, summary.homeworkTotal),
      progressMarkup('Слова', summary.vocabularyKnown, summary.vocabularyTotal, 'rose'),
      progressMarkup('Грамматика', summary.grammarPassed, summary.grammarTotal, 'sky')
    ].join('');

    const current = ContentService.lessons.find((lesson) => lesson.status !== 'draft' && !['submitted_pending_report','submitted'].includes(ProgressService.getHomework(lesson.id)?.status));
    byId('current-material').innerHTML = current
      ? `<a class="card interactive list-card" href="lesson.html?id=${encodeURIComponent(current.id)}"><div class="list-card-main"><span class="eyebrow">Домашняя работа №${current.number}</span><h3>${escapeHtml(current.title)}</h3><p class="muted">${escapeHtml(current.subtitle)}</p></div><span class="arrow">→</span></a>`
      : emptyState('📚','Материалы по учебнику будут добавлены преподавателем','Первое домашнее задание скоро появится здесь.');
    updateSyncStatus();
  }

  function lessonCard(lesson, record, completed = false) {
    const status = recordStatus(record);
    const result = Number(record?.score_total || 0) > 0 ? `<span class="badge info">${Number(record.score_correct || 0)} из ${Number(record.score_total || 0)} · ${Number(record.score_percent || 0)}%</span>` : '';
    const date = record?.submitted_at ? `<span class="badge">${escapeHtml(new Date(record.submitted_at).toLocaleString('ru-RU'))}</span>` : '';
    const locked = lesson.status === 'locked';
    const vocabularyTopic = ContentService.vocabulary.find((item) => item.id === lesson.vocabularyId || item.linkedLessonId === lesson.id);
    const grammarTopic = asArray(lesson.grammarIds || lesson.grammarTopicIds || lesson.grammarTopics)
      .map((id) => ContentService.grammar.find((item) => item.id === id))
      .find(Boolean);
    const materials = [
      vocabularyTopic ? `<a class="lesson-mini-link vocab" href="vocabulary.html?id=${encodeURIComponent(vocabularyTopic.id)}"><span>🔢</span><strong>Словарь</strong></a>` : '',
      grammarTopic ? `<a class="lesson-mini-link grammar" href="grammar-topic.html?id=${encodeURIComponent(grammarTopic.id)}"><span>📘</span><strong>Грамматика</strong></a>` : ''
    ].filter(Boolean).join('');
    return `<article class="card homework-card"><div class="homework-number" aria-label="Домашняя работа номер ${Number(lesson.number || 0)}"><span>№</span><strong>${Number(lesson.number || 0)}</strong></div><div class="list-card-main homework-card-main"><span class="eyebrow">Домашняя работа №${Number(lesson.number || 0)}</span><h3>${escapeHtml(lesson.title)}</h3><p class="muted">${escapeHtml(lesson.subtitle)}</p><div class="list-card-meta"><span class="badge ${status.tone}">${escapeHtml(locked ? '🔒 Скоро' : status.label)}</span>${result}${date}</div>${materials ? `<div class="lesson-card-materials">${materials}</div>` : ''}</div><div class="list-card-actions homework-open-action">${locked ? '<button class="btn btn-ghost" disabled>Закрыто</button>' : `<a class="btn ${completed ? 'btn-ghost' : 'btn-primary'}" href="lesson.html?id=${encodeURIComponent(lesson.id)}">${completed ? 'Посмотреть работу' : 'Начать работу'}</a>`}</div></article>`;
  }

  function renderHomework() {
    const summary = totals();
    byId('hw-completed').textContent = summary.homeworkCompleted;
    byId('hw-total').textContent = summary.homeworkTotal;
    byId('hw-percent').textContent = `${percent(summary.homeworkCompleted,summary.homeworkTotal)}%`;
    byId('hw-overall-progress').innerHTML = progressMarkup('Общий прогресс', summary.homeworkCompleted, summary.homeworkTotal);
    const published = ContentService.lessons.filter((lesson) => lesson.status !== 'draft');
    if (!published.length) {
      byId('homework-list').innerHTML = emptyState('📝','Домашних заданий пока нет','После первого урока преподаватель добавит сюда интерактивное задание.');
      return;
    }
    const available = [];
    const completed = [];
    published.forEach((lesson) => {
      const record = ProgressService.getHomework(lesson.id);
      (['submitted_pending_report','submitted'].includes(record?.status) ? completed : available).push({lesson,record});
    });
    const section = (title, items) => `<section class="list-section"><div class="list-section-title"><h3>${escapeHtml(title)}</h3><span class="count-badge">${items.length}</span></div><div class="list">${items.length ? items.map(({lesson,record}) => lessonCard(lesson,record,title === 'Завершённые')).join('') : `<div class="card empty-state compact-empty"><p>${title === 'Доступные' ? 'Новых заданий сейчас нет.' : 'Завершённых работ пока нет.'}</p></div>`}</div></section>`;
    byId('homework-list').innerHTML = section('Доступные',available) + section('Завершённые',completed);
  }

  function renderVocabularyHub() {
    const summary = totals();
    byId('vocab-known').textContent = summary.vocabularyKnown;
    byId('vocab-total').textContent = summary.vocabularyTotal;
    byId('vocab-topics').textContent = summary.vocabularyTopics;
    byId('vocab-overall-progress').innerHTML = progressMarkup('Изучение слов',summary.vocabularyKnown,summary.vocabularyTotal,'rose');
    const root = byId('vocabulary-topics');
    if (!ContentService.vocabulary.length) {
      root.innerHTML = emptyState('💥','Словарных тренажёров пока нет','Новые темы появятся после уроков.');
      return;
    }
    root.innerHTML = ContentService.vocabulary.map((topic) => {
      const known = topic.words.filter((word) => ProgressService.getVocabularyWord(word.wordKey)?.status === 'known').length;
      return `<article class="card list-card"><div class="list-card-main"><span class="eyebrow">${escapeHtml(topic.label || 'Словарь')}</span><h3>${escapeHtml(topic.title)}</h3><p class="muted">${topic.words.length} слов</p><div class="list-card-meta"><span class="badge ${known === topic.words.length ? 'good' : 'info'}">${known} из ${topic.words.length} выучено</span></div></div><div class="list-card-actions"><a class="btn btn-primary" href="vocabulary.html?id=${encodeURIComponent(topic.id)}">Открыть</a></div></article>`;
    }).join('');
  }

  function renderGrammar() {
    const summary = totals();
    byId('grammar-passed').textContent = summary.grammarPassed;
    byId('grammar-total').textContent = summary.grammarTotal;
    byId('grammar-overall-progress').innerHTML = progressMarkup('Грамматические темы',summary.grammarPassed,summary.grammarTotal,'sky');
    const root = byId('grammar-list');
    const published = ContentService.grammar.filter((topic) => topic.status !== 'draft');
    if (!published.length) {
      root.innerHTML = emptyState('📐','Грамматические темы пока не опубликованы',`Материалы будут добавляться в соответствии с уроками и учебником «${safeText(student.textbook)}».`);
      return;
    }
    root.innerHTML = published.map((topic) => {
      const progress = ProgressService.getGrammar(topic.id) || {};
      return `<article class="card list-card"><div class="list-card-main"><span class="eyebrow">Тема ${Number(topic.number || 0)}</span><h3>${escapeHtml(topic.title)}</h3><p class="muted">${escapeHtml(topic.subtitle)}</p><div class="list-card-meta"><span class="badge ${progress.passed ? 'good' : 'info'}">${progress.passed ? 'Пройдено' : 'Доступно'}</span>${Number(progress.attempts || 0) ? `<span class="badge">Попыток: ${Number(progress.attempts)}</span><span class="badge">Лучший результат: ${Number(progress.best_score || 0)}%</span>` : ''}</div></div><div class="list-card-actions"><a class="btn btn-primary" href="grammar-topic.html?id=${encodeURIComponent(topic.id)}">Открыть</a></div></article>`;
    }).join('');
  }

  function updateSyncStatus() {
    const card = byId('sync-status-card');
    const title = byId('sync-status-title');
    const text = byId('sync-status-text');
    if (!card || !title || !text) return;
    card.classList.remove('is-online','is-error');
    if (!CloudService.isConfigured()) {
      title.textContent = 'Прогресс сохраняется';
      text.textContent = 'Изменения сохраняются на этом устройстве.';
      return;
    }
    if (CloudService.lastError) {
      card.classList.add('is-error');
      title.textContent = 'Не удалось обновить данные';
      text.textContent = 'Изменения сохранены на этом устройстве. Повторная попытка произойдёт автоматически.';
      return;
    }
    card.classList.add('is-online');
    title.textContent = 'Прогресс сохранён';
    text.textContent = 'Твои результаты сохранены.';
  }

  const context = {
    config,
    content: ContentService,
    progress: ProgressService,
    toast,
    emptyState,
    cloudConfigured,
    sendHomeworkReport
  };

  async function renderCurrentPage() {
    const view = document.body.dataset.view;
    if (view === 'home') renderHome();
    else if (view === 'homework') renderHomework();
    else if (view === 'vocabulary-hub') renderVocabularyHub();
    else if (view === 'grammar') renderGrammar();
    else if (view === 'lesson') await window.LessonEngine.renderLessonPage(context);
    else if (view === 'grammar-topic') await window.LessonEngine.renderGrammarTopicPage(context);
    else if (view === 'vocabulary') await window.VocabularyEngine.renderVocabularyPage(context);
  }

  async function init() {
    fillConfig();
    markNavigation();
    try {
      await ContentService.init();
      await renderCurrentPage();
      if (CloudService.isConfigured()) {
        try {
          await CloudService.init();
          await ProgressService.syncFromCloud();
          await renderCurrentPage();
          const queue = Storage.read(storageKeys.syncQueue, []);
          if (queue.length) await ProgressService.syncToCloud('all');
        } catch (error) {
          CloudService.lastError = error;
          console.error('Ошибка Supabase',error);
          updateSyncStatus();
          toast('Не удалось обновить данные в облаке. Изменения сохранены на этом устройстве.');
        }
      }
    } catch (error) {
      console.error('Ошибка запуска сайта',error);
      const main = document.querySelector('main');
      if (main) main.innerHTML = emptyState('⚠️','Не удалось открыть страницу','Проверьте файлы проекта и обновите страницу.');
    }
  }

  window.addEventListener('online', () => {
    if (CloudService.isConfigured()) ProgressService.syncToCloud('all').catch((error) => { CloudService.lastError = error; updateSyncStatus(); });
  });
  document.addEventListener('DOMContentLoaded', init);
})();
