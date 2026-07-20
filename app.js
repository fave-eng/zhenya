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
      const id = safeText(raw.id, `grammar-${number}`);
      if (!/^grammar-\d+$/.test(id)) return null;
      return {
        ...raw,
        id,
        number: Number(id.replace('grammar-', '')) || number,
        title: safeText(raw.title, `Грамматическая тема ${number}`),
        subtitle: safeText(raw.subtitle, 'Объяснение и упражнения'),
        status: safeText(raw.status, 'available'),
        exercises: asArray(raw.exercises)
      };
    },

    buildVocabulary() {
      const seen = new Set();
      const topics = [];
      this.lessons.forEach((lesson) => {
        const source = lesson.vocabulary;
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
        if (words.length) topics.push({ ...source, linkedLessonId: lesson.id, words, title: safeText(source.title, lesson.title), label: safeText(source.label, `Урок ${lesson.number}`) });
      });
      this.vocabulary = topics;
    },

    async init() {
      this.lessons = await this.discover('data/lessons', 'lesson', (raw, number) => this.normalizeLesson(raw, number));
      this.grammar = await this.discover('data/grammar', 'grammar', (raw, number) => this.normalizeGrammar(raw, number));
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
    return `<article class="card list-card"><div class="list-card-main"><span class="eyebrow">Домашняя работа №${Number(lesson.number || 0)}</span><h3>${escapeHtml(lesson.title)}</h3><p class="muted">${escapeHtml(lesson.subtitle)}</p><div class="list-card-meta"><span class="badge ${status.tone}">${escapeHtml(locked ? '🔒 Coming soon' : status.label)}</span>${result}${date}</div></div><div class="list-card-actions">${locked ? '<button class="btn btn-ghost" disabled>Закрыто</button>' : `<a class="btn ${completed ? 'btn-ghost' : 'btn-primary'}" href="lesson.html?id=${encodeURIComponent(lesson.id)}">${completed ? 'Посмотреть' : 'Открыть'}</a>`}</div></article>`;
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
