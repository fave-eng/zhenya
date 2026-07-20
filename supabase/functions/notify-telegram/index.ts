import { createClient } from 'npm:@supabase/supabase-js@2'

const FUNCTION_VERSION = 'homework-reports-v1'
const STUDENT_ID = 'zhenya'
const STUDENT_NAME = 'Женя'
const TIME_ZONE = 'Asia/Yekaterinburg'
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

function formatDate(value: string | null): string {
  if (!value) return 'не указано'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'не указано'
  return date.toLocaleString('ru-RU', { timeZone: TIME_ZONE })
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

function homeworkMessage(row: Record<string, any>): string {
  const correct = Number(row.score_correct || 0)
  const total = Number(row.score_total || 0)
  const scorePercent = Number(row.score_percent ?? (total > 0 ? Math.round((correct / total) * 100) : 0))
  const mistakes = Math.max(0, total - correct)
  return [
    '📩 <b>Получена домашняя работа</b>',
    '',
    `👩‍🎓 Ученица: <b>${escapeHtml(STUDENT_NAME)}</b>`,
    `📝 Работа: <b>${escapeHtml(lessonTitle(String(row.lesson_id)))}</b>`,
    `✅ Результат: <b>${correct} из ${total} (${scorePercent}%)</b>`,
    `❌ Ошибок: <b>${mistakes}</b>`,
    `🕒 Отправлено: ${escapeHtml(formatDate(row.submitted_at))}`,
    '',
    'Ответы зафиксированы в Supabase и больше не могут быть изменены.',
  ].join('\n')
}

async function handleHomeworkReport(
  payload: Record<string, unknown>,
  admin: ReturnType<typeof createClient>,
  botToken: string,
) {
  const studentId = typeof payload.studentId === 'string' ? payload.studentId.trim() : ''
  const lessonId = typeof payload.lessonId === 'string' ? payload.lessonId.trim() : ''
  const submissionId = typeof payload.submissionId === 'string' ? payload.submissionId.trim() : ''

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
    const keyboard = lessonUrl ? [[{ text: '📝 Открыть домашнюю работу', url: lessonUrl }]] : []
    const telegramMessage = await sendTelegram(botToken, recipient, homeworkMessage(row), keyboard)
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

function materialMessage(payload: Record<string, any>): string {
  const materialType = String(payload.materialType || 'material')
  const title = String(payload.payload?.title || payload.materialId || 'Новый материал')
  const typeLabel = materialType === 'homework' ? 'домашняя работа' : materialType === 'grammar' ? 'грамматическая тема' : materialType === 'vocabulary' ? 'словарная тема' : 'учебный материал'
  const lines = [
    '🚀 <b>Опубликован новый материал</b>',
    '',
    `Для Жени доступна ${typeLabel}:`,
    `<b>${escapeHtml(title)}</b>`,
  ]
  if (payload.payload?.hasVocabulary) lines.push('', '💥 Перед домашней работой повтори новые слова.')
  if (payload.payload?.hasGrammar) lines.push('', '📐 В урок добавлено объяснение грамматики.')
  lines.push('', 'Удачи! Непонятные вопросы отметь, чтобы обсудить на следующем занятии ✨')
  return lines.join('\n')
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
  const notificationVersion = Math.max(1, Number(payload.notificationVersion || 1))
  if (studentId !== STUDENT_ID || !materialType || !materialId) {
    return json({ ok: false, error: 'Некорректные параметры публикации' }, 400)
  }

  const { data: existing, error: existingError } = await admin
    .from('material_publications')
    .select('id,status,telegram_message_id,sent_at')
    .eq('student_id', studentId)
    .eq('material_type', materialType)
    .eq('material_id', materialId)
    .eq('notification_version', notificationVersion)
    .maybeSingle()

  if (existingError) return json({ ok: false, error: safeError(existingError) }, 500)
  if (existing?.status === 'sent') {
    return json({ ok: true, skipped: true, reason: 'already_sent', telegramMessageId: existing.telegram_message_id, sentAt: existing.sent_at })
  }

  const publication = {
    student_id: studentId,
    material_type: materialType,
    material_id: materialId,
    notification_version: notificationVersion,
    status: 'pending',
    payload: payload.payload && typeof payload.payload === 'object' ? payload.payload : {},
    error_message: null,
  }
  const { data: claimed, error: claimError } = await admin
    .from('material_publications')
    .upsert(publication, { onConflict: 'student_id,material_type,material_id,notification_version' })
    .select('id')
    .single()
  if (claimError) return json({ ok: false, error: safeError(claimError) }, 500)

  try {
    const recipient = await getRecipient(admin, studentId)
    const url = typeof payload.payload?.url === 'string' && /^https?:\/\//.test(payload.payload.url) ? payload.payload.url : ''
    const keyboard = url ? [[{ text: 'Открыть материал', url }]] : []
    const telegramMessage = await sendTelegram(botToken, recipient, materialMessage(payload), keyboard)
    const sentAt = new Date().toISOString()
    const { error: updateError } = await admin
      .from('material_publications')
      .update({ status: 'sent', telegram_message_id: telegramMessage.message_id, sent_at: sentAt, error_message: null })
      .eq('id', claimed.id)
    if (updateError) throw updateError
    return json({ ok: true, skipped: false, telegramMessageId: telegramMessage.message_id, sentAt })
  } catch (sendError) {
    const message = safeError(sendError)
    await admin.from('material_publications').update({ status: 'failed', error_message: message }).eq('id', claimed.id)
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
