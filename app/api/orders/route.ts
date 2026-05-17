import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function checkBasicAuth(req: NextRequest): boolean {
  const header = req.headers.get('authorization') ?? ''
  if (!header.startsWith('Basic ')) return false
  const encoded = header.slice(6)
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
  const colonIdx = decoded.indexOf(':')
  const login = decoded.slice(0, colonIdx)
  const password = decoded.slice(colonIdx + 1)
  return login === process.env.SYNC_LOGIN && password === process.env.SYNC_PASSWORD && !!login
}

function escapeCsv(v: string | number | null | undefined): string {
  const s = String(v ?? '')
  if (/^[=+\-@\t\r]/.test(s)) return `'${s}`
  return s.includes(';') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
}

export async function GET(req: NextRequest) {
  if (!checkBasicAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { status: 'PENDING' },
    include: { items: true },
    orderBy: { createdAt: 'asc' },
  })

  if (orders.length > 0) {
    await prisma.order.updateMany({
      where: { id: { in: orders.map((o) => o.id) } },
      data: { status: 'PROCESSING', syncedAt: new Date() },
    })
  }

  const lines: string[] = ['Номер_Заказа;Дата;Имя;Телефон;Артикул;Наименование;Количество;Цена;Комментарий']

  for (const order of orders) {
    for (const item of order.items) {
      lines.push(
        [
          escapeCsv(order.id),
          escapeCsv(order.createdAt.toISOString()),
          escapeCsv(order.name),
          escapeCsv(order.phone),
          escapeCsv(item.article),
          escapeCsv(item.itemName),
          escapeCsv(item.quantity),
          escapeCsv(Number(item.price)),
          escapeCsv(order.comment),
        ].join(';')
      )
    }
  }

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
