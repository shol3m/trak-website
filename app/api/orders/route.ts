import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function checkBasicAuth(req: NextRequest): boolean {
  const header = req.headers.get('authorization') ?? ''
  if (!header.startsWith('Basic ')) return false
  const encoded = header.slice(6)
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
  const [login, password] = decoded.split(':')
  return login === process.env.SYNC_LOGIN && password === process.env.SYNC_PASSWORD && !!login
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
          order.id,
          order.createdAt.toISOString(),
          order.name,
          order.phone,
          item.article,
          item.itemName,
          item.quantity,
          item.price,
          order.comment ?? '',
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
