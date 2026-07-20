import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const studentId = 'zhenya'
const baseUrl = String(process.env.SITE_BASE_URL || '').replace(/\/+$/, '')
const manualPath = String(process.env.INPUT_MATERIAL_PATH || '').trim()

function changedPaths() {
  if (manualPath) return [manualPath]
  try {
    return execFileSync('git', ['diff', '--name-only', 'HEAD^', 'HEAD'], { encoding: 'utf8' })
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
  } catch {
    try {
      return execFileSync('git', ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'], { encoding: 'utf8' })
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    } catch {
      return []
    }
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    console.error(`Не удалось прочитать ${filePath}: ${error.message}`)
    return null
  }
}

const notifications = []
for (const filePath of [...new Set(changedPaths())]) {
  if (!fs.existsSync(filePath)) continue
  const normalized = filePath.split(path.sep).join('/')
  const isLesson = /^data\/lessons\/lesson-\d+\.json$/.test(normalized)
  const isGrammar = /^data\/grammar\/grammar-\d+\.json$/.test(normalized)
  if (!isLesson && !isGrammar) continue

  const data = readJson(filePath)
  if (!data || data.status === 'draft' || data.status === 'locked' || data.notification?.enabled === false) continue

  const materialType = isLesson ? 'homework' : 'grammar'
  const materialId = String(data.id || path.basename(filePath, '.json'))
  const notificationVersion = Math.max(1, Number(data.notification?.version || 1))
  const page = isLesson ? `lesson.html?id=${encodeURIComponent(materialId)}` : `grammar-topic.html?id=${encodeURIComponent(materialId)}`
  notifications.push({
    action: 'material_published',
    studentId,
    materialType,
    materialId,
    notificationVersion,
    payload: {
      title: String(data.title || materialId),
      url: baseUrl ? `${baseUrl}/${page}` : '',
      hasVocabulary: Boolean(isLesson && data.vocabulary?.words?.length),
      hasGrammar: Boolean(isLesson && (data.grammarTopicIds?.length || data.grammarTopics?.length)),
    },
  })
}

process.stdout.write(`${JSON.stringify(notifications, null, 2)}\n`)
