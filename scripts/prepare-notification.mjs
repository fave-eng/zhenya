import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const root = process.cwd()
const studentId = 'zhenya'

function requiredEnv(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

function normaliseBaseUrl(value) {
  const raw = String(value || '').trim().replace(/\/+$/, '')
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`
  let parsed
  try {
    parsed = new URL(candidate)
  } catch {
    throw new Error('SITE_BASE_URL must be a valid public http(s) URL')
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) {
    throw new Error('SITE_BASE_URL must be a valid public http(s) URL')
  }
  return parsed.toString().replace(/\/+$/, '')
}

function loadWindowArray(relativePath, globalName) {
  const absolutePath = path.join(root, relativePath)
  if (!fs.existsSync(absolutePath)) return []

  const source = fs.readFileSync(absolutePath, 'utf8')
  const sandbox = { window: {} }
  vm.createContext(sandbox)
  vm.runInContext(source, sandbox, { filename: relativePath, timeout: 2000 })
  const data = sandbox.window[globalName]
  return Array.isArray(data) ? data : []
}

function loadLesson(lessonId) {
  const filePath = path.join(root, 'data', 'lessons', `${lessonId}.json`)
  if (!fs.existsSync(filePath)) throw new Error(`Lesson file was not found: data/lessons/${lessonId}.json`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function pageUrl(baseUrl, page, fallback) {
  const target = typeof page === 'string' && page.trim() ? page.trim() : fallback
  const url = new URL(target, `${baseUrl}/`)
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`Invalid page URL: ${target}`)
  return url.toString()
}

function isPublished(lesson) {
  const status = String(lesson.status || '').toLowerCase()
  if (!['available', 'published'].includes(status)) return false
  if (!lesson.publishedAt) return true
  const published = new Date(lesson.publishedAt)
  return Number.isFinite(published.getTime()) && published.getTime() <= Date.now()
}

const siteBaseUrl = normaliseBaseUrl(requiredEnv('SITE_BASE_URL'))
const projectId = requiredEnv('SUPABASE_PROJECT_ID')
const notifySecret = requiredEnv('NOTIFY_WEBHOOK_SECRET')
const selectedLessonId = requiredEnv('LESSON_ID')
const lesson = loadLesson(selectedLessonId)

if (lesson.id !== selectedLessonId || !isPublished(lesson)) {
  throw new Error(`Lesson ${selectedLessonId} was not found or is not published`)
}

const vocabularyData = loadWindowArray('data/vocabulary-data.js', 'VOCABULARY_DATA')
const grammarData = loadWindowArray('data/grammar-data.js', 'GRAMMAR_DATA')

const vocabularyTopic = vocabularyData.find((topic) => topic?.linkedLessonId === lesson.id)
const vocabulary = vocabularyTopic && Array.isArray(vocabularyTopic.words) && vocabularyTopic.words.length > 0
  ? {
      id: String(vocabularyTopic.id || ''),
      title: String(vocabularyTopic.title || 'Lesson vocabulary'),
      wordCount: vocabularyTopic.words.length,
      url: pageUrl(
        siteBaseUrl,
        vocabularyTopic.page,
        `vocabulary.html?id=${encodeURIComponent(vocabularyTopic.id)}`,
      ),
    }
  : null

const explicitGrammarIds = Array.isArray(lesson.grammarIds) ? lesson.grammarIds : []
const grammar = grammarData
  .filter((topic) => ['available', 'published'].includes(String(topic?.status || '').toLowerCase()))
  .filter((topic) => explicitGrammarIds.includes(topic.id) || topic.linkedLessonId === lesson.id)
  .map((topic) => ({
    id: String(topic.id || ''),
    title: String(topic.title || 'Grammar'),
    url: pageUrl(
      siteBaseUrl,
      topic.page,
      `grammar-topic.html?id=${encodeURIComponent(topic.id)}`,
    ),
  }))

const homework = {
  id: lesson.id,
  title: String(lesson.title || 'Homework'),
  subtitle: String(lesson.subtitle || ''),
  url: pageUrl(
    siteBaseUrl,
    lesson.page,
    `lesson.html?id=${encodeURIComponent(lesson.id)}`,
  ),
}

const payload = {
  action: 'material_published',
  studentId,
  materialType: 'lesson_bundle',
  materialId: lesson.id,
  notificationVersion: 1,
  homework,
  vocabulary,
  grammar,
  payload: {
    title: homework.title,
    subtitle: homework.subtitle,
    publishedAt: lesson.publishedAt || null,
    url: homework.url,
  },
}

const endpoint = `https://${projectId}.supabase.co/functions/v1/notify-telegram`
console.log(`Sending one lesson notification for ${lesson.id}...`)
console.log(`Homework: ${homework.url}`)
console.log(`Vocabulary: ${vocabulary ? vocabulary.url : 'not linked'}`)
console.log(`Grammar topics: ${grammar.length}`)

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-notify-secret': notifySecret,
  },
  body: JSON.stringify(payload),
})

const result = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
if (!response.ok || !result.ok) {
  console.error(`Failed ${lesson.id}:`, result)
  process.exitCode = 1
} else if (result.alreadySent || result.skipped) {
  console.log(`Skipped ${lesson.id}: ${result.reason || 'already sent'}`)
} else {
  console.log(`Sent ${lesson.id}${result.telegramMessageId ? `; Telegram message id: ${result.telegramMessageId}` : '.'}`)
}
