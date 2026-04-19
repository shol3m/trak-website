import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { HttpsProxyAgent } from 'https-proxy-agent'
import https from 'https'

const schema = z.object({
  name: z.string().regex(/^[а-яёА-ЯЁa-zA-Z\s\-']{2,50}$/, 'Некорректное имя'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Некорректный телефон'),
  carModel: z.string().max(100).optional(),
  honeypot: z.string().max(0).optional(),
})

function sendToChat(token: string, chatId: string, text: string, agent?: HttpsProxyAgent<string>): Promise<boolean> {
  const payload = JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
  return new Promise((resolve) => {
    const options: https.RequestOptions = {
      hostname: 'api.telegram.org',
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      agent,
    }
    const req = https.request(options, (res) => {
      resolve(res.statusCode !== undefined && res.statusCode < 300)
      res.resume()
    })
    req.on('error', () => resolve(false))
    req.write(payload)
    req.end()
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { name, phone, carModel, honeypot } = parsed.data
  if (honeypot) return NextResponse.json({ error: 'bot' }, { status: 400 })
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatIds = [process.env.TELEGRAM_CHAT_ID, process.env.TELEGRAM_CHAT_ID_2].filter(Boolean) as string[]

  if (!token || chatIds.length === 0) {
    return NextResponse.json({ error: 'Сервер не настроен' }, { status: 500 })
  }

  const text = [
    '📋 *Новая заявка с сайта ТРАК*',
    `👤 Имя: ${name}`,
    `📞 Телефон: ${phone}`,
    carModel ? `🚛 Авто: ${carModel}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY
  const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined

  const results = await Promise.all(chatIds.map((id) => sendToChat(token, id, text, agent)))

  if (results.some((ok) => !ok)) {
    return NextResponse.json({ error: 'Ошибка отправки' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
