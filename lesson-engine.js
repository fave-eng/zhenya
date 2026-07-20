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
      return `<section class="lesson-section-heading" id="lesson-section-${index}"><span class="section-number">${sectionState.value}</span><h2>${escapeHtml(block.title || `Часть ${sectionState.value}`)}</h2>${block.text ? `<p>${escapeHtml(block.text)}</p>` : ''}</section>`;
    }
    if (type === 'image') {
      return `<article class="card lesson-block"><img class="lesson-image" src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt || '')}">${block.caption ? `<p class="image-caption">${escapeHtml(block.caption)}</p>` : ''}</article>`;
    }
    if (type === 'audio') {
      return `<article class="card lesson-block content-block"><h3>${escapeHtml(block.title || 'Аудио')}</h3>${block.instruction ? `<p class="muted">${escapeHtml(block.instruction)}</p>` : ''}<audio controls preload="metadata" src="${escapeHtml(block.src)}">Ваш браузер не поддерживает аудио.</audio></article>`;
    }
    if (type === 'exercise') {
      const items = asArray(block.items);
      return `<article class="card lesson-block exercise-card" data-exercise-id="${escapeHtml(taskId(block, `exercise-${index + 1}`))}"><h3>${escapeHtml(block.title || `Задание ${index + 1}`)}</h3>${block.instruction ? `<p class="exercise-instruction">${escapeHtml(block.instruction)}</p>` : ''}${items.map((item, itemIndex) => renderQuestion(item, itemIndex, taskId(block, `exercise-${index + 1}`))).join('')}</article>`;
    }
    if (['text','textarea','select','single','multiple','reorder','translate','manual'].includes(type)) {
      return `<article class="card lesson-block exercise-card">${renderQuestion(block, 0, `task-${index + 1}`)}</article>`;
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
    if (lesson?.vocabulary?.id && asArray(lesson.vocabulary.words).length) {
      links.push(`<a class="card interactive material-link" href="vocabulary.html?id=${encodeURIComponent(lesson.vocabulary.id)}"><div><strong>💥 Словарь урока</strong><p>${escapeHtml(lesson.vocabulary.title || 'Новые слова')}</p></div><span class="arrow">→</span></a>`);
    }
    const grammarIds = asArray(lesson?.grammarTopicIds || lesson?.grammarTopics);
    grammarIds.forEach((id) => {
      const topic = content.grammar.find((item) => item.id === id);
      if (topic) links.push(`<a class="card interactive material-link" href="grammar-topic.html?id=${encodeURIComponent(topic.id)}"><div><strong>📐 Грамматика</strong><p>${escapeHtml(topic.title)}</p></div><span class="arrow">→</span></a>`);
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
    document.getElementById('lesson-hero-title').textContent = lesson.title || `Домашняя работа №${lesson.number || ''}`;
    document.getElementById('lesson-hero-subtitle').textContent = lesson.subtitle || 'Интерактивное задание';
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
    const sectionState = { value: 0 };
    const roadmapSections = blocks.map((block,index) => safeText(block.type).toLowerCase() === 'section' ? { block,index } : null).filter(Boolean);
    const record = ctx.progress.getHomework(id) || {};
    const finalStatus = ['submitted_pending_report','submitted'].includes(record.status);
    const reviewed = Boolean(record.checked_at);

    root.innerHTML = `<article class="card lesson-intro"><div><span class="eyebrow">Домашняя работа №${Number(lesson.number || 0)}</span><h2>${escapeHtml(lesson.title)}</h2><p>${escapeHtml(lesson.subtitle || '')}</p></div><span class="lesson-points">${questions.filter(({item}) => item.scored !== false && questionType(item) !== 'manual').length} проверяемых ответов</span></article>
      ${materialLinks(lesson, ctx.content)}
      ${roadmapSections.length ? `<nav class="card lesson-roadmap" aria-label="План домашней работы"><strong>План задания</strong><ol>${roadmapSections.map(({block,index},sectionIndex) => `<li><a href="#lesson-section-${index}"><span>${sectionIndex + 1}</span><strong>${escapeHtml(block.title || `Часть ${sectionIndex + 1}`)}</strong></a></li>`).join('')}</ol></nav>` : ''}
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
    const cards = explanation.map((section) => `<article class="card explanation-card"><h3>${escapeHtml(section.title || '')}</h3>${asArray(section.text || section.paragraphs).map((text) => `<p>${escapeHtml(text)}</p>`).join('')}${asArray(section.examples).length ? `<div class="example-list">${asArray(section.examples).map((example) => `<div class="example-row"><strong>${escapeHtml(example.en || example.example || '')}</strong>${example.ru ? `<span>${escapeHtml(example.ru)}</span>` : ''}</div>`).join('')}</div>` : ''}${section.table ? `<div class="table-wrap"><table><thead><tr>${asArray(section.table.headers).map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${asArray(section.table.rows).map((row) => `<tr>${asArray(row).map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}</article>`).join('');
    const mistakes = asArray(topic.commonMistakes || topic.mistakes);
    return `<div class="grammar-explanation">${cards}${mistakes.length ? `<article class="card explanation-card mistakes-card"><h3>Частые ошибки</h3><ul>${mistakes.map((mistake) => `<li>${escapeHtml(mistake)}</li>`).join('')}</ul></article>` : ''}</div>`;
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
    root.innerHTML = `${grammarExplanation(topic)}<div class="grammar-exercises">${blocks.map((block,index) => `<article class="card lesson-block exercise-card"><span class="difficulty">${escapeHtml(block.difficulty || `Уровень ${index+1}`)}</span><h3>${escapeHtml(block.title)}</h3>${block.instruction ? `<p class="exercise-instruction">${escapeHtml(block.instruction)}</p>` : ''}${block.items.map((item,itemIndex) => renderQuestion(item,itemIndex,block.id)).join('')}</article>`).join('')}</div><article class="card lesson-actions"><div class="lesson-result" id="grammar-result"></div><div class="button-row"><button class="btn btn-primary" id="check-grammar" type="button">Проверить знания</button><a class="btn btn-ghost" href="grammar.html">К списку тем</a></div></article>`;
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
