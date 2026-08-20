import { createClient } from 'npm:@supabase/supabase-js@2'

const FUNCTION_VERSION = 'homework-reports-v4-topic-friendly-copy'
const STUDENT_ID = 'zhenya'
const encoder = new TextEncoder()

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-notify-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: Record<string, unknown>, status = 200) {
  return Response.json({ ...body, functionVersion: FUNCTION_VERSION }, { status, headers: corsHeaders })
}

function secureEqual(left: string, right: string): boolean {
  const a = encoder.encode(left)
  const b = encoder.encode(right)
  if (a.length !== b.length) return false
  let difference = 0
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index]
  return difference === 0
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function safeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? 'Unknown error')
  return message
    .replace(/bot\d+:[A-Za-z0-9_-]+/g, 'bot[hidden]')
    .replace(/eyJ[A-Za-z0-9._-]+/g, '[hidden key]')
    .slice(0, 500)
}

function lessonTitle(lessonId: string): string {
  if (lessonId.startsWith('telegram-report-test-')) return 'ТЕСТ: проверка Telegram-отчёта'
  const match = lessonId.match(/^lesson-(\d+)$/)
  return match ? `Домашняя работа №${match[1]}` : lessonId
}

type Recipient = {
  chat_id: number
  message_thread_id: number | null
  enabled: boolean
}

async function getRecipient(admin: ReturnType<typeof createClient>, studentId: string): Promise<Recipient> {
  const { data, error } = await admin
    .from('telegram_recipients')
    .select('chat_id,message_thread_id,enabled')
    .eq('student_id', studentId)
    .maybeSingle()

  if (error) throw error
  if (!data || !data.enabled) throw new Error('Получатель Telegram не подключён или отключён')
  return data as Recipient
}

async function sendTelegram(
  token: string,
  recipient: Recipient,
  text: string,
  keyboard: Array<Array<{ text: string; url: string }>> = [],
) {
  const payload: Record<string, unknown> = {
    chat_id: recipient.chat_id,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  }
  if (recipient.message_thread_id) payload.message_thread_id = recipient.message_thread_id
  if (keyboard.length) payload.reply_markup = { inline_keyboard: keyboard }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || !result?.ok) throw new Error(result?.description || `Telegram HTTP ${response.status}`)
  return result.result
}

function homeworkMessage(row: Record<string, any>, displayTitle: string): string {
  const correct = Number(row.score_correct || 0)
  const total = Number(row.score_total || 0)
  const scorePercent = Number(row.score_percent ?? (total > 0 ? Math.round((correct / total) * 100) : 0))
  return [
    '✅ <b>Homework completed</b>',
    '',
    `📘 <b>${escapeHtml(displayTitle)}</b>`,
    `📊 Result: <b>${correct}/${total} (${scorePercent}%)</b>`,
    '',
    'Open it on the site to see the answers and mistakes.',
  ].join('\n')
}

async function homeworkDisplayTitle(
  admin: ReturnType<typeof createClient>,
  studentId: string,
  lessonId: string,
  requestedTitle = '',
  requestedSubtitle = '',
): Promise<string> {
  const cleanRequestedTitle = requestedTitle.trim()
  const cleanRequestedSubtitle = requestedSubtitle.trim()
  const fallback = cleanRequestedTitle
    ? (cleanRequestedSubtitle ? `${cleanRequestedTitle} · ${cleanRequestedSubtitle}` : cleanRequestedTitle)
    : lessonTitle(lessonId)
  const { data, error } = await admin
    .from('material_publications')
    .select('payload')
    .eq('student_id', studentId)
    .eq('material_type', 'lesson_bundle')
    .eq('material_id', lessonId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error || !data?.length) return fallback
  const stored = data[0]?.payload && typeof data[0].payload === 'object' ? data[0].payload as Record<string, any> : {}
  const homework = stored.homework && typeof stored.homework === 'object' ? stored.homework as Record<string, any> : stored
  const title = String(homework.title || '').trim()
  const subtitle = String(homework.subtitle || '').trim()
  if (!title) return fallback
  return subtitle ? `${title} · ${subtitle}` : title
}

const HOMEWORK_GREETINGS = [
  'Hi! ✨',
  'Hello! 🌟',
  'Hey! 👋',
  'Hi there! ☀️',
  'Hello there! ✨',
]

function homeworkGreeting(materialId: string): string {
  let hash = 0
  for (const char of materialId) hash = ((hash * 31) + char.codePointAt(0)!) >>> 0
  return HOMEWORK_GREETINGS[hash % HOMEWORK_GREETINGS.length]
}

async function handleHomeworkReport(
  payload: Record<string, unknown>,
  admin: ReturnType<typeof createClient>,
  botToken: string,
) {
  const studentId = typeof payload.studentId === 'string' ? payload.studentId.trim() : ''
  const lessonId = typeof payload.lessonId === 'string' ? payload.lessonId.trim() : ''
  const submissionId = typeof payload.submissionId === 'string' ? payload.submissionId.trim() : ''
  const requestedTitle = typeof payload.homeworkTitle === 'string' ? payload.homeworkTitle.trim() : ''
  const requestedSubtitle = typeof payload.homeworkSubtitle === 'string' ? payload.homeworkSubtitle.trim() : ''

  if (studentId !== STUDENT_ID || !lessonId || !submissionId) {
    return json({ ok: false, error: 'Некорректные параметры отчёта' }, 400)
  }

  const { data: row, error } = await admin
    .from('homework_progress')
    .select('submission_id,student_id,lesson_id,status,score_correct,score_total,score_percent,submitted_at,locked_at,report_status,report_sent_at')
    .eq('student_id', studentId)
    .eq('lesson_id', lessonId)
    .eq('submission_id', submissionId)
    .maybeSingle()

  if (error) return json({ ok: false, error: safeError(error) }, 500)
  if (!row) return json({ ok: false, error: 'Зафиксированная домашняя работа не найдена' }, 404)
  if (!['submitted_pending_report', 'submitted'].includes(row.status) || !row.locked_at) {
    return json({ ok: false, error: 'Домашняя работа ещё не зафиксирована' }, 409)
  }
  if (row.status === 'submitted' && row.report_status === 'sent') {
    return json({ ok: true, skipped: true, reason: 'already_sent', reportSentAt: row.report_sent_at })
  }

  let recipient: Recipient
  try {
    recipient = await getRecipient(admin, studentId)
  } catch (recipientError) {
    const message = safeError(recipientError)
    await admin.from('homework_progress').update({ report_status: 'failed', report_error: message }).eq('submission_id', submissionId)
    return json({ ok: false, error: message }, 404)
  }

  try {
    const siteBaseUrl = (Deno.env.get('SITE_BASE_URL') || '').replace(/\/+$/, '')
    const lessonUrl = siteBaseUrl ? `${siteBaseUrl}/lesson.html?id=${encodeURIComponent(lessonId)}` : ''
    const keyboard = lessonUrl ? [[{ text: '📝 Open the homework', url: lessonUrl }]] : []
    const displayTitle = await homeworkDisplayTitle(admin, studentId, lessonId, requestedTitle, requestedSubtitle)
    const telegramMessage = await sendTelegram(botToken, recipient, homeworkMessage(row, displayTitle), keyboard)
    const sentAt = new Date().toISOString()
    const { error: updateError } = await admin
      .from('homework_progress')
      .update({
        status: 'submitted',
        report_status: 'sent',
        report_sent_at: sentAt,
        report_error: null,
      })
      .eq('submission_id', submissionId)

    if (updateError) throw new Error(`Telegram отправлен, но статус не обновлён: ${updateError.message}`)
    return json({ ok: true, skipped: false, telegramMessageId: telegramMessage.message_id, reportSentAt: sentAt })
  } catch (sendError) {
    const message = safeError(sendError)
    await admin.from('homework_progress').update({ report_status: 'failed', report_error: message }).eq('submission_id', submissionId)
    return json({ ok: false, error: message }, 502)
  }
}

function grammarButtonTitle(item: Record<string, unknown>, index: number): string {
  const fullTitle = String(item.title || `Grammar ${index + 1}`).trim()
  const shortTitle = fullTitle.split(':')[0].trim()
  return shortTitle.length > 0 && shortTitle.length <= 34 ? shortTitle : `Grammar ${index + 1}`
}

function publicHttpUrl(value: unknown): string | null {
  const raw = String(value || '').trim()
  if (!raw) return null
  try {
    const url = new URL(raw)
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname) ? url.toString() : null
  } catch {
    return null
  }
}

async function claimLessonPublication(
  admin: ReturnType<typeof createClient>,
  record: {
    student_id: string
    material_type: string
    material_id: string
    payload: Record<string, unknown>
  },
) {
  // Homework, vocabulary and grammar can be uploaded in separate commits.
  // Only one final notification is allowed for each lesson.
  const { data: sentRows, error: sentLookupError } = await admin
    .from('material_publications')
    .select('*')
    .eq('student_id', record.student_id)
    .eq('material_type', record.material_type)
    .eq('material_id', record.material_id)
    .eq('status', 'sent')
    .order('created_at', { ascending: true })
    .limit(1)

  if (sentLookupError) throw sentLookupError
  const sent = sentRows?.[0]
  if (sent) return { row: sent, alreadySent: true }

  const { data: existingRows, error: lookupError } = await admin
    .from('material_publications')
    .select('*')
    .eq('student_id', record.student_id)
    .eq('material_type', record.material_type)
    .eq('material_id', record.material_id)
    .order('created_at', { ascending: true })
    .limit(1)

  if (lookupError) throw lookupError
  const existing = existingRows?.[0]

  if (existing) {
    const { data, error } = await admin
      .from('material_publications')
      .update({ status: 'pending', payload: record.payload, error_message: null })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) throw error
    return { row: data, alreadySent: false }
  }

  const { data, error } = await admin
    .from('material_publications')
    .insert({ ...record, notification_version: 1, status: 'pending' })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      const { data: racedRows, error: racedError } = await admin
        .from('material_publications')
        .select('*')
        .eq('student_id', record.student_id)
        .eq('material_type', record.material_type)
        .eq('material_id', record.material_id)
        .order('created_at', { ascending: true })
        .limit(1)
      if (racedError) throw racedError
      const raced = racedRows?.[0]
      if (!raced) throw error
      return { row: raced, alreadySent: raced.status === 'sent' }
    }
    throw error
  }

  return { row: data, alreadySent: false }
}

async function handleMaterialPublished(
  payload: Record<string, any>,
  request: Request,
  admin: ReturnType<typeof createClient>,
  botToken: string,
) {
  const expectedSecret = Deno.env.get('NOTIFY_WEBHOOK_SECRET') || ''
  const actualSecret = request.headers.get('x-notify-secret') || ''
  if (!expectedSecret || !secureEqual(actualSecret, expectedSecret)) {
    return json({ ok: false, error: 'Unauthorized' }, 401)
  }

  const studentId = String(payload.studentId || '').trim()
  const materialType = String(payload.materialType || '').trim()
  const materialId = String(payload.materialId || '').trim()
  if (studentId !== STUDENT_ID || materialType !== 'lesson_bundle' || !materialId) {
    return json({ ok: false, error: 'Некорректные параметры публикации урока' }, 400)
  }

  const legacyPayload = payload.payload && typeof payload.payload === 'object' && !Array.isArray(payload.payload)
    ? payload.payload as Record<string, unknown>
    : {}
  const rawHomework = payload.homework && typeof payload.homework === 'object' && !Array.isArray(payload.homework)
    ? payload.homework as Record<string, unknown>
    : {
        id: materialId,
        title: legacyPayload.title || materialId,
        subtitle: legacyPayload.subtitle || '',
        url: legacyPayload.url || '',
      }

  const homeworkUrl = publicHttpUrl(rawHomework.url)
  if (!homeworkUrl) return json({ ok: false, error: 'A valid homework URL is required' }, 400)

  const rawVocabulary = payload.vocabulary && typeof payload.vocabulary === 'object' && !Array.isArray(payload.vocabulary)
    ? payload.vocabulary as Record<string, unknown>
    : null
  const vocabularyUrl = rawVocabulary ? publicHttpUrl(rawVocabulary.url) : null
  if (rawVocabulary && !vocabularyUrl) return json({ ok: false, error: 'Invalid vocabulary URL' }, 400)

  const rawGrammar = Array.isArray(payload.grammar) ? payload.grammar : []
  const grammar: Record<string, unknown>[] = []
  for (const item of rawGrammar) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return json({ ok: false, error: 'Invalid grammar URL' }, 400)
    }
    const topic = item as Record<string, unknown>
    const url = publicHttpUrl(topic.url)
    if (!url) return json({ ok: false, error: 'Invalid grammar URL' }, 400)
    grammar.push({ ...topic, url })
  }

  const storedPayload = {
    homework: { ...rawHomework, url: homeworkUrl },
    vocabulary: rawVocabulary ? { ...rawVocabulary, url: vocabularyUrl } : null,
    grammar,
  }

  let claim
  try {
    claim = await claimLessonPublication(admin, {
      student_id: studentId,
      material_type: materialType,
      material_id: materialId,
      payload: storedPayload,
    })
  } catch (claimError) {
    return json({ ok: false, error: safeError(claimError) }, 500)
  }

  if (claim.alreadySent) {
    return json({ ok: true, skipped: true, alreadySent: true, reason: 'already_sent' })
  }

  try {
    const recipient = await getRecipient(admin, studentId)
    const title = String(rawHomework.title || legacyPayload.title || materialId)
    const steps: string[] = []
    if (rawVocabulary) steps.push('First, learn the new words.')
    if (grammar.length) steps.push(rawVocabulary ? 'Review the grammar.' : 'First, review the grammar.')
    steps.push(steps.length ? 'Then, do the homework.' : 'Do the homework.')

    const text = [
      homeworkGreeting(materialId),
      'Your new English homework is ready.',
      `📘 <b>${escapeHtml(title)}</b>`,
      steps.join('\n'),
      'Good luck! ⭐',
    ].join('\n\n')

    const keyboard: Array<Array<{ text: string; url: string }>> = []
    if (rawVocabulary && vocabularyUrl) {
      keyboard.push([{ text: '📚 Learn new words', url: vocabularyUrl }])
    }
    grammar.forEach((item, index) => {
      keyboard.push([{
        text: grammar.length === 1 ? '📘 Grammar' : `📘 ${grammarButtonTitle(item, index)}`,
        url: String(item.url),
      }])
    })
    keyboard.push([{ text: '📝 Do the homework', url: homeworkUrl }])

    const telegramMessage = await sendTelegram(botToken, recipient, text, keyboard)
    const sentAt = new Date().toISOString()
    const { error: updateError } = await admin
      .from('material_publications')
      .update({
        status: 'sent',
        telegram_message_id: telegramMessage.message_id || null,
        sent_at: sentAt,
        error_message: null,
      })
      .eq('id', claim.row.id)

    if (updateError) throw updateError
    return json({ ok: true, skipped: false, telegramMessageId: telegramMessage.message_id || null, sentAt })
  } catch (sendError) {
    const message = safeError(sendError)
    await admin
      .from('material_publications')
      .update({ status: 'failed', error_message: message })
      .eq('id', claim.row.id)
    return json({ ok: false, error: message }, 502)
  }
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') || ''
  if (!supabaseUrl || !serviceKey || !botToken) {
    return json({ ok: false, error: 'Серверные секреты Edge Function не настроены' }, 500)
  }

  let payload: Record<string, any>
  try {
    payload = await request.json()
  } catch {
    return json({ ok: false, error: 'Некорректный JSON' }, 400)
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const action = String(payload.action || '')
  if (action === 'homework_report') return handleHomeworkReport(payload, admin, botToken)
  if (action === 'material_published') return handleMaterialPublished(payload, request, admin, botToken)
  return json({ ok: false, error: 'Неизвестное действие' }, 400)
})
